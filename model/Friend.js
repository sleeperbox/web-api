const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  email: {
    type: String
  },
  email_friend: {
    type: String
  },
  username: {
    type: String
  },
  name: {
    type: String
  },
  status: {
    type: String
  },
  seen: {
    type: Number
  }
});

const Friend = mongoose.model("Friend", FriendSchema);
module.exports = Friend;
