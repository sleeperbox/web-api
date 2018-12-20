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
      Image: "http://192.168.100.200/assets/icons/tags/pilihkategori.png"
    },
    {
      text: "Komputer & Gadget",
      value: "computer-gadget",
      Image: "http://192.168.100.200/assets/icons/tags/komputergadget.png"
    },
    {
      text: "Keluarga & Asmara",
      value: "family-love",
      Image: "http://192.168.100.200/assets/icons/tags/keluargaasmara.png"
    },
    {
      text: "Fakta & Rumor",
      value: "fact-rumour",
      Image: "http://192.168.100.200/assets/icons/tags/faktarumor.png"
    },
    {
      text: "Bisnis & Pekerjaan",
      value: "business-work",
      Image: "http://192.168.100.200/assets/icons/tags/bisnispekerjaan.png"
    },
    {
      text: "Fashion & Gaya Hidup",
      value: "fashion-lifestyle",
      Image: "http://192.168.100.200/assets/icons/tags/fashion.png"
    },
    {
      text: "Quotes",
      value: "quotes",
      Image: "http://192.168.100.200/assets/icons/tags/quotes.png"
    },
    {
      text: "Riddles",
      value: "riddles",
      Image: "http://192.168.100.200/assets/icons/tags/riddle.png"
    },
    {
      text: "Lainya",
      value: "other",
      Image: "http://192.168.100.200/assets/icons/tags/lainnya.png"
    }
  ];
  res.send(tags);
});

module.exports = router;
