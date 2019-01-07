const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RankingSchema = new Schema({
  email: {
    type: String
  },
  total_score: {
    type: Number
  }
})

const Ranking = mongoose.model('Ranking', RankingSchema)
module.exports = Ranking
