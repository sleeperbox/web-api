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
router.get("/friends/:username/:first_name/:last_name/:status", function(req, res) {
  res.send({
    username: req.params.username,
    tag: req.params.first_name,
    content: req.params.last_name,
    date: req.params.status
  });
});

module.exports = router;
