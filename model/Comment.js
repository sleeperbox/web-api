const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  id_posts: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String
  },
  comment: {
    type: String
  },
  status : {
    type : String
  },
  foto: {
    type: String
  },
  total_posts: {
    type: Number
  },
  total_friends: {
    type: Number
  },
  total_thanks: {
    type: Number
  }
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
