const {model, Schema} = require('mongoose')

module.exports = (client) => {
  const guildSchema =  new Schema({
    _id: String,

    language: {
      type: String,
      default: "EN"
    },
    prefix: {
      type: String,
      default: "!"
    }
  })
  guildSchema.post('save', function (doc) {
    client.guildsDataCache[doc._id] = doc
  })
  guildSchema.post('init', function (doc) {
    client.guildsDataCache[doc._id] = doc
  })
  
  return model("Guild",guildSchema)
}