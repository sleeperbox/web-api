const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostingSchema = new Schema({
  id_posts: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String
  },
  content: {
    type: String
  },
  date : {
    type: String
  },
  thanks : {
    type: Number
  },
  tags : {
    type : String
  },
  status : {
    type : String
  }
})

const Posting = mongoose.model('Posting', PostingSchema)
module.exports = Posting