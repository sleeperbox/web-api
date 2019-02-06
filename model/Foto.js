const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FotoSchema = new Schema({
  email: {
    type: String
  },
  avatar: {
    type: String
  }
})

const Foto = mongoose.model('Foto', FotoSchema)
module.exports = Foto
