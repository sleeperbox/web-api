const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

// main api getter
router.get("/friends/:username/:username_friend/:content/:time/:status", function(req, res) {
  res.send({
    username: req.params.username,
    tag: req.params.username_friend,
    content: req.params.content,
    time: req.params.time,
    date: req.params.status
  });
});

module.exports = router;
