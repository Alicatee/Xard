const Event = require('../Structures/Event')

class ready extends Event{
    constructor(client){
        super(client,{
            listener: true
        })
    }
    async run(){
        if(this.client.config.Presence){
            const { status, games, interval } = this.client.config.Presence;
            if ( games instanceof Array ) {
                this.client.user.setPresence({
                    status,
                    activity: {
                        name: games[0].name ? games[0].name : null,
                        type: games[0].type ? games[0].type : null,
                        url : games[0].url  ? games[0].url  : "https://www.twitch.tv/xqcow",
                    },
                })
                setInterval(() => {
                    const thisGame = games[~~( Math.random() * games.length)];
                    this.client.user.setActivity( thisGame.name, {
                        type: thisGame.type,
                        url : thisGame.url || "https://www.twitch.tv/xqcow",
                    } )
                }, ( ( typeof interval === "number" && interval ) || 30 ) * 1000 )

            }
        }
    }
}

module.exports = ready