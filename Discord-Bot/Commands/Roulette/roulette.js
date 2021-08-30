const Command = require('../../Structures/Command')

const options = {
    ["Won"]: (playerBalance,finalAmount) => {
        return playerBalance += finalAmount
    },
    ["Lost"]: (playerBalance, finalAmount) => {
        return playerBalance -= finalAmount
    },
}

class Roulette extends Command{
    constructor(client){
        super( client, {
            name        : "roulette",
            description : "Roulette your points.",
            usage       : "roulette amount",
            example     : ["100"],
            args        : true,
            category    : "Gamble",
            cooldown    : 0,
            aliases     : ["gamble"],
            userPerms   : ["SEND_MESSAGES"],
            guildOnly   : false,
        } );
    }
    async run(message,args){
        
        const amount = args[0]
        const values = await this.client.utils.getRouletteAmount(message,amount)
     
        
        const playerBalance = values.playerBalance
        const finalAmount = values.finalAmount

        if (isNaN(playerBalance) || isNaN(finalAmount))
            return
            
        const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language].roulette
        const chance = Math.random()
        let win = "Won"
        if (chance >= 0.5)
            win = "Lost"
       
            try {
                await this.client.Database.Member.findOneAndUpdate({
                    _id: message.author.id
                },
                {
                    roulettePoints: options[win](playerBalance,finalAmount)
                })
                this.client.membersDataCache[message.author.id].roulettePoints = options[win](playerBalance, finalAmount)
            } catch (error) {
                console.log(error)
                return
            }
        message.channel.send(language[win](message.author.id, playerBalance, finalAmount))
    }
}

module.exports = Roulette