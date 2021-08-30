class Event{
    constructor(client, options = {}){
        this.client = client
        this.Name = options.name || this.constructor.name;
        this.listener = options.once ? "once" : "on";
    }
}

module.exports = Event