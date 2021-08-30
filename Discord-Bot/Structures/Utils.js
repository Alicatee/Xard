const Discord = require('discord.js')

class Utils{
    constructor(client){
        this.client = client
    }
    getUserKey(message){
        return `${message.guild ? message.guild.id : "dm"}-${message.author.id}`
    }
    async getRouletteAmount(message,betValue){

        const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language].roulette
        const betValueInt = parseInt(betValue)
        const isPercentage = betValue.slice(-1) == "%"

        if ((isNaN(betValue) || betValueInt <= 0) && betValue != "all" && !isPercentage) {
            return message.reply(language.invalidRouletteAmount)
        }
      
        const percentage = parseInt(betValue.substr(0, betValue.length - 1))

        const playerData = this.client.membersDataCache[message.author.id]
        const playerBalance = playerData.roulettePoints
        let finalAmount = betValueInt

        if (isPercentage && percentage <= 100) {
            finalAmount = Math.round(playerBalance * (percentage / 100))
        }
        if (betValueInt > playerBalance){
            return message.reply(language.notEnoughPoints)
        }
        if(betValue == "all"){
            finalAmount = playerBalance
        }
       
        return {playerBalance,finalAmount}
    }
}

module.exports = Utils