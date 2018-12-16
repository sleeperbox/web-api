const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostingSchema = new Schema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  content: {
    type: Text
  },
  date : {
    type: Date
  },
  like : {
    type: Number
  },
  status : {
    type : String
  }
})

const Posting = mongoose.model('Posting', PostingSchema)
module.exports = Posting
