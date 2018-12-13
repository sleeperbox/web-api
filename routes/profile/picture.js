const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Picture = require("../../model/Picture");
router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

// main api getter
router.get("/picture", (req, res) => {
  Picture.find({}, (err, hasil) => {
    var pictureMap = {};
    hasil.forEach(function(picture) {
      pictureMap[picture._id] = picture;
    });
    res.send(hasil);
  });
});

router.get("/picture/:username/:type", (req, res) => {
  let username = req.params.username;
  let type = req.params.type;
  Picture.find({ username } && { type }, (err, hasil) => {
    var pictureMap = {};
    hasil.forEach(function(pictures) {
      pictureMap[pictures._id] = pictures;
    });
    res.send(hasil);
  });
});

router.get("/picture/:username", (req, res) => {
  let username = req.params.username;
  Picture.find({ username }, (err, hasil) => {
    var pictureMap = {};
    hasil.forEach(function(pictures) {
      pictureMap[pictures._id] = pictures;
    });
    res.send(hasil);
  });
});

router.post("/picture/send", (req, res) => {
  let username = req.body.username;
  let images = req.body.images;
  let type = req.body.type;
  let time = req.body.time;
  let gambar = {
    username: username,
    images: images,
    type: type,
    time: time
  };
  var picture = new Picture(gambar);
  picture.save().then(() => {
    console.log("Gambar tersimpan");
    res.send(picture.images);
  });
});
module.exports = router;
