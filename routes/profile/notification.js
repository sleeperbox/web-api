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
router.get("/notification/:username/:type/:content/:time/:status", function(req, res) {
  res.send({
    username: req.params.username,
    tag: req.params.type,
    content: req.params.content,
    date: req.params.time,
    picture: req.params.status
  });
});

module.exports = router;
