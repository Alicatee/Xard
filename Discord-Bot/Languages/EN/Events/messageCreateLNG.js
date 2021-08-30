module.exports = {
    onCooldownText    : ( command, cooldownEndDate ) => `Please wait ${(( cooldownEndDate - Date.now() ) / 1000 ).toFixed( 1 ) } seconds to use the ${command.name} command.`,
    "botLacksPermission"  : "I do not have permissions to use this command.",
    "userLacksPermission"   : "You do not have permissions to use this command.",
    "failedToLoadData": "Failed to Load Data!",
    "noArgumentsPassed": "This command requires arguments!"
}