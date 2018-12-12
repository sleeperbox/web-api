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
router.get("/more-category", function(req, res) {
  res.send({
    images: [
      "www.abc.com/src/client/assets/images/icon/Statistic.png",
      "www.abc.com/src/client/assets/images/icon/gallery.png",
      "www.abc.com/src/client/assets/images/icon/group.png",
      "www.abc.com/src/client/assets/images/icon/setting.png"
    ],
    menu: ["Statistic", "Gallery", "Group", "Setting"]
  });
});

module.exports = router;
