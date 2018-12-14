const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  username: {
    type: String
  },
  images: {
    type: String
  },
  type: {
    type: String
  },
  time: {
    type: String
  }
});

const Picture = mongoose.model("Picture", PictureSchema);
module.exports = Picture;
