const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("../../model/User");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

// main api getter

router.get("/setting", (req, res) => {
  User.find({}, (err, hasil) => {
    var userMap = {};
    hasil.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(hasil);
  });
});
router.put("/setting/:id/update&:username&:email", (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.params }, function() {
    res.send("Product udpated.");
  });
});

router.get("/setting/:id", (req, res) => {
  let _id = req.params.id;
  User.find({ _id }, (err, hasil) => {
    var userMap = {};
    hasil.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(hasil);
  });
});
module.exports = router;
