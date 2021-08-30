const Event = require('../Structures/Event')

class messageCreate extends Event {
    constructor(client) {
        super(client);
    }
    async run(message) {
        if (message.author.bot)
            return
        const client = this.client
        
        const guildsDataCache = client.guildsDataCache[message.guild.id]
        let language = guildsDataCache ? client.languages[guildsDataCache.language].messageCreate  : null  // todo: add command to change bot's language
        let prefix = guildsDataCache ? guildsDataCache.prefix : null
        let member = client.membersDataCache[message.author.id]
        if(!member){
            let memberData = await client.Database.Member.findById(message.author.id)
            if (!memberData){
                memberData = await client.Database.Member.create({
                    _id: message.author.id
                })
            }
            member = memberData
        }
       
        if (!prefix || !language) {
            try {
                let data = await client.Database.Guild.findById(message.guild.id)
                if (!data) {
                    data = await client.Database.Guild.create({
                        _id: message.guild.id
                    })
                }
                prefix = data.prefix
                language = client.languages[data.language].messageCreate
            } catch (error) {
                console.log(error)
                message.channel.send(language.failedToLoadData)
                return
            }
        }
        if (!message.content.startsWith(prefix))
            return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()))
        if (!command || command._globalDisabled) {
            return
        }
        if (command.args && !args.length) {
            return message.reply(language.noArgumentsPassed)
        }   
        const userKey = client.utils.getUserKey(message)
        if (command.cmdCooldown.has(userKey)) {
            message.reply(language.onCooldownText(command, command.cmdCooldown.get(userKey))).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            })
            return
        }

        if (message.guild) {
            const userPerms = message.channel.permissionsFor(message.member).missing(command.userPerms);
            if (userPerms.length)
                return message.reply(language.userLacksPermission);

            const botPerms = message.channel.permissionsFor(client.user).missing(command.botPerms);

            if (botPerms.length) {
                return message.reply(language.botLacksPermission);
            }
        }
       
        command.setMessage(message)
        command.run(message, args)
        if (command.cooldown > 0) command.startCooldown(message.author.id);
    }
}

module.exports = messageCreate