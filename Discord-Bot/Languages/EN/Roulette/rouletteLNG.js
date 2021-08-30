module.exports = {
    Won: (userID, playerBalance, finalAmount) => `<@${userID}> won ${finalAmount} points in roullet and now has ${finalAmount + playerBalance} points`,
    Lost: (userID, playerBalance, finalAmount) => `<@${userID}> lost ${finalAmount} points in roullet and now has ${playerBalance - finalAmount} points`,
    "notEnoughPoints": "You don't have enough points.",
    "invalidRouletteAmount": "The amount you provided is not valid."
}