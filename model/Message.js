const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  username: {
    type: String
  },
  content: {
    type: String
  },
  time: {
    type: String
  },
  status: {
    type: String
  }
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
