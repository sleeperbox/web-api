const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  kode_chat: {
    type: String
  },
  username_user1: {
    type: String
  },
  name_user1: {
    type: String
  },
  username_user2: {
    type: String
  },
  name_user2: {
    type: String
  },
  message: {
    type: String
  },
  date: {
    type: String
  },
  status: {
    type: String
  }
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
