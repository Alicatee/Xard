const Discord = require('discord.js')

class Utils {
    constructor(client) {
        this.client = client
    }
    getUserKey(message) {
        return `${message.guild ? message.guild.id : "dm"}-${message.author.id}`
    }
    getRouletteAmount(message, betValue) {

        const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language].roulette
        const betValueInt = parseInt(betValue)
        const isPercentage = betValue.slice(-1) == "%"

        if ((isNaN(betValue) || betValueInt <= 0) && betValue != "all" && !isPercentage) {
            return message.reply(language.invalidRouletteAmount)
        }

        const percentage = parseInt(betValue.substr(0, betValue.length - 1))

        const playerData = this.client.membersDataCache[message.author.id]
        const playerBalance = playerData.roulettePoints
        let finalBetAmount = betValueInt

        if (isPercentage && percentage <= 100) {
            finalBetAmount = Math.round(playerBalance * (percentage / 100))
        }
        if (betValueInt > playerBalance) {
            return message.reply(language.notEnoughPoints)
        }
        if (betValue == "all") {
            finalBetAmount = playerBalance
        }

        return { playerBalance, finalBetAmount }
    }
    async giveRoulettePoints(id, points, message) {
        try {
            await this.client.Database.Member.findOneAndUpdate({
                _id: id
            },
                {
                    roulettePoints: points
                }, { new: true })
        } catch (error) {
            console.log(error)
            const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language].messageCreate
            message.reply(language.failedToLoadData)
            return
        }
    }
}

module.exports = Utils