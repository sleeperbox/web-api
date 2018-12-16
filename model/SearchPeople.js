const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SearchPeopleSchema = new Schema({
  email: {
    type: String
  },
  email_friend: {
    type: String
  }
})

const SearchPeople = mongoose.model('SearchPeople', SearchPeopleSchema)
module.exports = SearchPeople
