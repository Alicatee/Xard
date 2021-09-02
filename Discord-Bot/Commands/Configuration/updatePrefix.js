const Command = require('../../Structures/Command')

class updatePrefix extends Command {
    constructor(client) {
        super(client, {
            name: "updatePrefix",
            description: "Change your server's prefix.",
            usage: "UpdatePrefix prefix",
            example: ["#"],
            args: true,
            category: "Configuration",
            cooldown: 5000,
            aliases: ["changePrefix"],
            userPerms: ["SEND_MESSAGES", "MANAGE_GUILD"],
            guildOnly: false,
        });
    }
    async run(message, args) {
        const newPrefix = args[0]
        const language = this.client.languageObj.updatePrefix

        const data = await this.client.utils.updateData(message, "Guild", {
            _id: message.guildId
        }, {
            prefix: newPrefix
        }, {
            new: true
        })

        if (!data)
            return

        message.reply(language.updatedData)

    }
}

module.exports = updatePrefix