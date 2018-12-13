const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FriendSchema = new Schema({
  email: {
    type: String
  },
  email_friend: {
    type: String
  },
  status:{
    type: String
  }
})

const Friend = mongoose.model('Friend', FriendSchema)
module.exports = Friend
