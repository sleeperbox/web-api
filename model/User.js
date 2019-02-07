const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  tgl_lahir: {
    type: Date
  },
  jenis_kelamin: {
    type: String
  },
  password: {
    type: String,
    min: 6
  },
  phone_number: {
    type: Number
  },
  token: {
    type: String
  },
  auth: {
    type: Boolean
  },
  total_thanks: {
    type: Number
  },
  total_posts: {
    type: Number
  },
  total_friends: {
    type: Number
  },
  awards: {
    type: Number
  },
  join_date: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  foto: {
    type: String
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;