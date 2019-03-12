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
  fotocontent: {
    type: String
  },
  date : {
    type: String
  },
  jam : {
    type: String
  },
  menit : {
    type: String
  },
  thanks : {
    type: Number
  },
  comment : {
    type: Number
  },
  tags : {
    type : String
  },
  status : {
    type : String
  },
  foto: {
    type: String
  }
})

const Posting = mongoose.model('Posting', PostingSchema)
module.exports = Posting
