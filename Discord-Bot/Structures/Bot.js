const { Client, Collection } = require('discord.js')

const path = require('path')
const fs = require('fs')

const glob = require('glob')
const mongoose = require('mongoose')

const Command = require('./Command')
const Event = require('./Event')



class Bot extends Client { 
    constructor(options = {}) {
        super({
             ...options,
            intents: ['GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILDS','DIRECT_MESSAGES'],
            partials: ["CHANNEL"]
        });
        this.aliases = new Collection()
        this.commands = new Collection()
        this.languages = new Collection()
        this.config = require("../config.js");
        this.utils = new(require('./Utils'))(this)
        this.membersDataCache = {}
        this.guildsDataCache = {}
        console.clear()
    }
    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`
    }
    async loadDatabase(){
        try {
            await mongoose.connect(this.config.mongodb,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                //useCreateIndex: true
            })
            glob.sync(`${this.directory}/Models/*.js`).forEach(file => {
                require(path.resolve(file))(this)
            })
            this.Database = mongoose.connection.models
        } catch (error) {
            throw new Error(error)
        }
    }
    loadEvents() {
        for(const event of glob.sync(`${this.directory}/Events/**/*.js`)){
            delete require.cache[event]
            const file = new (require(path.resolve(event)))(this)

            if(!(file instanceof Event))
                return
          
            super[file.listener](file.Name,(...args) => file.run(...args)) // client.on or client.once
        }   
    }    
    loadCommands(){
        for(const command of glob.sync(`${this.directory}/Commands/**/*.js`)) {
            delete require.cache[command]
            const file = new(require(path.resolve(command)))(this)

            if(!(file instanceof Command))
                return

            const fileName = (file.name).toLowerCase()
            this.commands.set(fileName,file)
            if(file.aliases && Array.isArray(file.aliases)){
                file.aliases.forEach(alias => {
                    this.aliases.set(alias.toLowerCase(), fileName)
                });
            }
        }
    }
    loadLanguages(){
        for(const languageFilePath of glob.sync(`${this.directory}/Languages/**/*.js`)){
            const match = languageFilePath.match(/.*\/([A-Z]{2})\//); // get language folder name from the path. Example: /en/

            if(!match[1])
                return
            const lng = match[1]    
            if(!this.languages[lng])
                this.languages[lng] = {}
            delete require.cache[languageFilePath]
            
            const file = require(path.resolve(languageFilePath))
            // example input: .../rouletteLNG.js
            // output: roulette
            const name = languageFilePath.slice(languageFilePath.lastIndexOf("/") + 1, languageFilePath.lastIndexOf(".")).replace("LNG","")
            this.languages[lng][name] = file
        }
    }
    login(){
        if(!this.config.Token)
            throw new Error("You must pass the token!")
        super.login(this.config.Token)
    }

     async start(){
        await this.loadDatabase()
        this.login()
        this.loadEvents()
        this.loadCommands()
        this.loadLanguages()
    }
}

module.exports = Bot