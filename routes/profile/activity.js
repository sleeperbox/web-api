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
router.get("/activity/:username/:tag/:content/:time/:picture/:link/:video/:component/:postpoint", function(req, res) {
  res.send({
    username: req.params.username,
    tag: req.params.tag,
    content: req.params.content,
    date: req.params.time,
    picture: req.params.picture,
    link: req.params.link,
    video: req.params.video,
    component: req.params.component,
    postpoint: req.params.postpoint
  });
});

module.exports = router;
