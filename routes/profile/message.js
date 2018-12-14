const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Message = require("../../model/Message");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

// main api getter

router.get("/message", (req, res) => {
  Message.find({}, (err, hasil) => {
    var messageMap = {};
    hasil.forEach(function(messages) {
      messageMap[messages._id] = messages;
    });
    res.send(hasil);
  });
});
router.get("/message/:username", (req, res) => {
  let username = req.params.username;
  Message.find({ username }, (err, hasil) => {
    var messageMap = {};
    hasil.forEach(function(messages) {
      messageMap[messages._id] = messages;
    });
    res.send(hasil);
  });
});
router.post("/message/send", (req, res) => {
  let pesan = {
    username: req.body.username,
    content: req.body.content,
    time: req.body.time,
    status: req.body.status
  };
  var message = new Message(pesan);
  message.save().then(() => {
    console.log("Pesan terkirim");
    res.send("terkirim");
  });
});
module.exports = router;
