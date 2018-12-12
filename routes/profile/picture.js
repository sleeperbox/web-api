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
router.get("/picture/avatar/:username/:avatar", function(req, res) {
  res.send({
    images: "www.abc.com/src/client/assets/picture/" + req.params.username + "/" + req.params.avatar,
    username: req.params.username
  });
});
router.get("/picture/background/:username/:background", function(req, res) {
  res.send({
    images: "www.abc.com/src/client/assets/picture/" + req.params.username + "/" + req.params.background,
    username: req.params.username
  });
});
module.exports = router;
