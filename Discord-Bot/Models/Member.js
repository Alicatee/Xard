const { model, Schema } = require('mongoose')



module.exports = (client) => {
  const memberSchema = new Schema({
    _id: String,
    roulettePoints: {
      type: Number,
      default: 10000
    },
  })

  memberSchema.post('save', function (doc) {
    client.membersDataCache[doc._id] = doc
  })
  memberSchema.post('init', function (doc) {
    client.membersDataCache[doc._id] = doc
  })

  return model("Member", memberSchema)
}

