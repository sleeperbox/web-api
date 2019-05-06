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
router.get("/", (req, res) => {
  res.send("Success Opening Main API...");
});

//api tags
router.get("/tags", (req, res) => {
  var tags = [
    { 
      text: "Computer & Gadget",
      value: "computer-gadget",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/komp.png" }
    },
    {
      text: "Family & Love",
      value: "family-love",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/family.png" }
    },
    {
      text: "Fact & Rumour",
      value: "fact-rumour",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/f&r.png" }
    },
    {
      text: "Business & Work",
      value: "business-work",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/bisnis.png" }
    },
    {
      text: "Fashion & Lifestyle",
      value: "fashion-lifestyle",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/fashion.png" }
    },
    {
      text: "Quotes",
      value: "quotes",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/quotes.png" }
    },
    {
      text: "Riddles",
      value: "riddles",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/riddle.png" }
    },
    {
      text: "Other",
      value: "other",
      image: { avatar: true, src: "http://aprizal.com/public/icon/icon/other.png" }
    }
  ];
  res.send(tags);
});

module.exports = router;
