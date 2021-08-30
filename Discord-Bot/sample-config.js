module.exports = {
    // your discord bot token
    Token: "",
    // mongodb url
    mongodb: "",

    // presence optionss
    Presence: {
        status: "Online",
        games: [{
            type: "WATCHING",
            name: "YOU",
            url: ""
        }, {
            type: "PLAYING",
            name: "NOTHING",
            url: ""
        }],
        interval: 15
    },
};
