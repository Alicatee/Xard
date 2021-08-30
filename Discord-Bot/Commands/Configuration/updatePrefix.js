const Command = require('../../Structures/Command')

class updatePrefix extends Command{
    constructor(client){
        super( client, {
            name        : "updatePrefix",
            description : "Change your server's prefix.",
            usage       : "UpdatePrefix prefix",
            example     : ["#"],
            args        : true,
            category    : "Configuration",
            cooldown    : 5000,
            aliases     : ["changePrefix"],
            userPerms   : ["SEND_MESSAGES","MANAGE_GUILD"],
            guildOnly   : true,
        } );
    }
    async run(message,args){
        const newPrefix = args[0]
        const language = this.client.languages[message.guild.language].updatePrefix
       
        try {
            await this.client.Database.Guild.findOneAndUpdate({
                _id: message.guild.id
            },{
                prefix: newPrefix
            })
          message.reply(language.updatedData)
        } catch (error) {
            console.log(error)
            message.reply(language.failedToUpdateData)
            return
        }
    }
}

module.exports = updatePrefix