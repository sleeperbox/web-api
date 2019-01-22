const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RankSchema = new Schema({
  email: {
    type: String
  },
  rank: {
    type: Number
  },
  tgl: {
    type: String
  }
});

const Rank = mongoose.model("Rank", RankSchema);
module.exports = Rank;
