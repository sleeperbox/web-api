const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  password:{
    type: String
  },
  token:{
    type: String
  },
  auth:{
    type: String
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User
