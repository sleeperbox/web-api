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
      text: "Pilih Kategori",
      value: "null",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/kategori.png" }
    },
    { 
      text: "Komputer & Gadget",
      value: "computer-gadget",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/komp.png" }
    },
    {
      text: "Keluarga & Asmara",
      value: "family-love",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/family.png" }
    },
    {
      text: "Fakta & Rumor",
      value: "fact-rumour",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/fr.png" }
    },
    {
      text: "Bisnis & Pekerjaan",
      value: "business-work",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/bisnis.png" }
    },
    {
      text: "Fashion & Gaya Hidup",
      value: "fashion-lifestyle",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/fashion.png" }
    },
    {
      text: "Quotes",
      value: "quotes",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/quotes.png" }
    },
    {
      text: "Riddles",
      value: "riddles",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/riddle.png" }
    },
    {
      text: "Lainya",
      value: "other",
      image: { avatar: true, src: "http://192.168.100.18/src/web-api/public/icon/other.png" }
    }
  ];
  res.send(tags);
});

module.exports = router;
