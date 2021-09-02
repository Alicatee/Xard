const Discord = require('discord.js')

class Utils {
    constructor(client) {
        this.client = client
    }
    getUserKey(message) {
        return `${message.guild ? message.guildId : "dm"}-${message.author.id}`
    }
    getRouletteAmount(message, betValue) {

        const language = this.client.languageObj.roulette

        const isPercentage = betValue.slice(-1) == "%"
        const isK = betValue.slice(-1) == "k"

        const betValueInt = parseInt(betValue)

        if ((betValueInt <= 0 || isNaN(betValueInt)) && betValue != 'all') {
            return message.reply(language.invalidRouletteAmount)
        }

        const percentage = parseInt(betValue.substr(0, betValue.length - 1))

        const playerData = this.client.membersDataCache[message.author.id]
        const playerBalance = playerData.roulettePoints

        let finalBetAmount = betValueInt
    
        if (isPercentage && percentage <= 100) {
            finalBetAmount = Math.round(playerBalance * (percentage / 100))
        } else if (isK) {
            finalBetAmount = Math.round(betValueInt * 1000)
        } else if (betValue == "all") {
            finalBetAmount = playerBalance
        }
        
        if (finalBetAmount > playerBalance)
            return message.reply(language.notEnoughPoints)

        return { playerBalance, finalBetAmount }
    }
    async giveRoulettePoints(id, points, message) {
        const playerData = this.client.membersDataCache[id]

        if (!playerData)
            return

        try {
            await this.client.Database.Member.findOneAndUpdate({
                _id: id
            },
                {
                    roulettePoints: playerData.roulettePoints + points
                }, { new: true })
        } catch (error) {
            console.log(error)
            const language = this.client.languageObj.messageCreate
            message.reply(language.failedToLoadData)
            return
        }
    }
    async getData(message, action, model, info) {
        try {
            const Data = await this.client.Database[model][action](info)

            return Data

        } catch (error) {
            console.log(error)

            const language = this.client.languageObj ? this.client.languageObj.messageCreate : this.client.languages["EN"].messageCreate
            message.reply(language.failedToLoadData)
        }
    }
    async updateData(message, model, findInfo, updateInfo, New) {
        try {
            const Data = await this.client.Database[model].findOneAndUpdate(findInfo, updateInfo, { new: New || false })

            return Data
        } catch (error) {
            console.log(error)

            const language = this.client.languageObj ? this.client.languageObj.messageCreate : this.client.languages["EN"].messageCreate
            message.reply(language.failedToLoadData)
        }
    }
}

module.exports = Utils