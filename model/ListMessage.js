const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListMessageSchema = new Schema({
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

const ListMessage = mongoose.model("ListMessage", ListMessageSchema);
module.exports = ListMessage;
