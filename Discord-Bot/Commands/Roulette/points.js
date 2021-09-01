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
    const playerData = this.client.membersDataCache[message.author.id]
    const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language]
    
    if(!playerData)
      return message.reply(language.messageCreate.failedToLoadData)
    
    message.channel.send(language.points.pointsAmount(message.author.id,playerData.roulettePoints))
  }
}

module.exports = Points