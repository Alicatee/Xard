const Event = require('../Structures/Event')

class messageCreate extends Event {
    constructor(client) {
        super(client);
    }
    async run(message) {
        if (message.author.bot)
            return
        const client = this.client
        if (!message.guildId) {
            message.guildId = 'dm' + message.author.id
        }
        const guildsDataCache = client.guildsDataCache[message.guildId]
        client.languageObj = guildsDataCache ? client.languages[guildsDataCache.language] : null  // todo: add command to change bot's language

        let prefix = guildsDataCache ? guildsDataCache.prefix : null
        let member = client.membersDataCache[message.author.id]
        if (!member) {
            let memberData = await client.utils.getData(message, "findOne", "Member", { _id: message.author.id })

            if (!memberData) {
                memberData = await client.utils.getData(message, "create", "Member", { _id: message.author.id })
            }

            if (!memberData) return

            member = memberData
        }

        if (!prefix || !client.languageObj) {
            let data = await client.utils.getData(message, "findOne", "Guild", { _id: message.guildId })

            if (!data) {
                data = await client.utils.getData(message, "create", "Guild", { _id: message.guildId })
            }
            if (!data) return

            prefix = data.prefix
            client.languageObj = client.languages[data.language]
        }
        let language = client.languageObj.messageCreate

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

        const Mentions = message.mentions.users
        if (Mentions && Mentions.first()) {
            const firstMention = Mentions.first()
            if (!client.membersDataCache[firstMention.id]) {
                let memberData = await client.utils.getData(message, "findOne", "Member", { _id: firstMention.id })

                if (!memberData) {
                    memberData = await client.utils.getData(message, "create", "Member", { _id: firstMention.id })
                }

                if (!memberData) return
            }
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