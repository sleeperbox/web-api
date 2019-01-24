const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ThankSchema = new Schema({
  idpost: {
    type: String
  },
  email: {
    type: String
  },
  status: {
    type: String
  }
})

const Thank = mongoose.model('Thank', ThankSchema)
module.exports = Thank
