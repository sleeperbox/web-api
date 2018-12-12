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
router.get("/setting/:username/:privacy/:bio/:password", function(req, res) {
  res.send({
    username: req.params.username,
    tag: req.params.privacy,
    content: req.params.bio,
    date: req.params.password
  });
});

module.exports = router;
