const Command = require('../../Structures/Command')

class GivePoints extends Command {
  constructor(client) {
    super(client, {
      name: "GivePoints",
      description: "Give your points.",
      usage: "givepoints amount",
      example: ["100"],
      args: true,
      category: "Roulette",
      cooldown: 0,
      userPerms: ["SEND_MESSAGES"],
      guildOnly: false,
      _globalDisabled: true
    });
  }
  async run(message, args) {

    const amount = args[0]
    const values = await this.client.utils.getRouletteAmount(message, amount)

    const playerBalance = values.playerBalance
    const finalAmount = values.finalAmount

    if (isNaN(playerBalance) || isNaN(finalAmount))
      return

    const language = this.client.languages[this.client.guildsDataCache[message.guild.id].language].roulette

  }
}

module.exports = GivePoints