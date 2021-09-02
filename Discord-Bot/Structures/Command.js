const { Permissions } = require("discord.js")

class Command {
    constructor(client, options = {}) {
        this.client = client;

        this.name = options.name || null;
        this.aliases = options.aliases || [];
        this.description = options.description || "No information specified.";
        this.category = options.category || "General";
        this.args = options.args || false;
        this.usage = options.usage || null;
        this.example = options.example || [];
        if (options.cooldown == 0) {
            this.cooldown = 0
        } else {
            this.cooldown = options.cooldown || 1000;
        }
        this.userPerms = new Permissions(options.userPerms || "SEND_MESSAGES").freeze();
        this.botPerms = new Permissions(options.botPerms || "SEND_MESSAGES").freeze();
        this.guildOnly = options.guildOnly || false;
        this.cmdCooldown = new Map();
        this._globalDisabled = options._globalDisabled || false
    }
    async run() {
        throw new Error(`Command ${this.name} doesn't provide a run method!`);
    }
    startCooldown(user) {
        this.cmdCooldown.set(
            this.client.utils.getUserKey(this.message), new Date(Date.now() + this.cooldown)
        );
        setTimeout(() => {
            this.cmdCooldown.delete(`${this.message.guild ? this.message.guildId : "dm"}-${user}`)
        }, this.cooldown);
    }

    setMessage(message) {
        this.message = message;
    }

    respond(message) {
        return this.message.channel.send(message);
    }
}

module.exports = Command