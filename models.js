const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

// let Schema = mongoose.Schema;

const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
})

UrlSchema.plugin(findOrCreate)

module.exports = { UrlSchema }
// module.exports = mongoose.model("Person", PersonSchema);
