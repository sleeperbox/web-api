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
router.get("/button-menu", function(req, res) {
  res.send({
    icon: ["clock outline", "comment alternate outline", "plus square outline", "bell outline", "user circle outline"],
    menu: ["home", "chat", "post", "notification", "profile"]
  });
});

module.exports = router;
