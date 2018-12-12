const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  password:{
    type: String,
    min: 6
  },
  token:{
    type: String
  },
  auth:{
    type: Boolean
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User
