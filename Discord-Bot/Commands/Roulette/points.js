const Command = require('../../Structures/Command')

class Points extends Command {
  constructor(client) {
    super(client, {
      name: "points",
      description: "View your points.",
      usage: "points",
      category: "Roulette",
      cooldown: 2000,
      aliases: ["balance"],
      userPerms: ["SEND_MESSAGES"],
      guildOnly: false,
    });
  }
  run(message, args) {
    const mentionedUser = message.mentions.users ? message.mentions.users.first() : null

    let playerData
    if(!mentionedUser){
      playerData = this.client.membersDataCache[message.author.id]
    }else{
      playerData = this.client.membersDataCache[mentionedUser.id]
    }
     
    const language = this.client.languageObj
    
    if(!playerData)
      return message.reply(language.messageCreate.failedToLoadData)
    
    message.channel.send(language.points.pointsAmount(playerData.id,playerData.roulettePoints))
  }
}

module.exports = Points