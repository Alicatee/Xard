const Command = require('../../Structures/Command')

class GivePoints extends Command {
  constructor(client) {
    super(client, {
      name: "GivePoints",
      description: "Give your points.",
      usage: "givepoints [user] [amount]",
      example: ["100"],
      args: true,
      category: "Roulette",
      cooldown: 0,
      userPerms: ["SEND_MESSAGES"],
      guildOnly: false,
      _globalDisabled: false
    });
  }
  run(message, args) {
    const amount = args[1]
    const playerData = this.client.utils.getRouletteAmount(message, amount)

    const playerBalance = playerData.playerBalance
    const finalBetAmount = playerData.finalBetAmount

    const mentionedUser = message.mentions.users ? message.mentions.users.first() : null
    const mentionedUserData = this.client.membersDataCache[mentionedUser.id]

    if (isNaN(playerBalance) || isNaN(finalBetAmount) || !mentionedUserData)
      return

    const language = this.client.languageObj.givePoints
    
    Promise.all([
      this.client.utils.giveRoulettePoints(message.author.id, -finalBetAmount, message),
      this.client.utils.giveRoulettePoints(mentionedUser.id, finalBetAmount, message)
    ]).then(() => {
      message.channel.send(language.gavePoints(finalBetAmount, playerBalance, message.author.id, mentionedUser.id))
    })
  }
}

module.exports = GivePoints