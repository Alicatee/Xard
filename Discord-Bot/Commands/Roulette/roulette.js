const Command = require('../../Structures/Command')

const options = {
    ["Won"]: (finalAmount) => {
        return finalAmount
    },
    ["Lost"]: (finalAmount) => {
        return -finalAmount
    },
}

class Roulette extends Command {
    constructor(client) {
        super(client, {
            name: "roulette",
            description: "Roulette your points.",
            usage: "roulette amount",
            example: ["100"],
            args: true,
            category: "Roulette",
            cooldown: 0,
            aliases: ["Gamble"],
            userPerms: ["SEND_MESSAGES"],
            guildOnly: false,
        });
    }
    run(message, args) {

        const amount = args[0]
        const utils = this.client.utils
        const values = utils.getRouletteAmount(message, amount)


        const playerBalance = values.playerBalance
        const finalBetAmount = values.finalBetAmount

        if (isNaN(playerBalance) || isNaN(finalBetAmount))
            return

        const language = this.client.languageObj.roulette
        const chance = Math.random()
        let win = "Won"
        if (chance >= 0.5)
            win = "Lost"

        utils.giveRoulettePoints(message.author.id, options[win](finalBetAmount), message).then(() => {
            message.channel.send(language[win](message.author.id, playerBalance, finalBetAmount))
        })
    }
}

module.exports = Roulette