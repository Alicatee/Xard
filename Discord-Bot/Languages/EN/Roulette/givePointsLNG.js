module.exports = {
  gavePoints: (amount, playerBalance, userId, targetId) => `<@${userId}> gave ${amount} points to <@${targetId}> and now has ${playerBalance - amount} points`,
}