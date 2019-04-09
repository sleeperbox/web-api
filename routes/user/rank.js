const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Ranking = require("../../model/Ranking");
const User = require("../../model/User");

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

//api lihat rank
router.post("/rank", (req, res) => {
    let email = req.body.email
    User.findOne({ email: email}, (err,user) => {
      if(err){
        console.log(err)
      }else{
        let score = user.total_friends + user.total_thanks
        Ranking.findOneAndUpdate({ email: email}, { $set: { total_score : score}}, { new: true }, (err,rank) => {
          if(err){
            console.log(err)
          }else{
            Ranking.find().sort({total_score: -1})
            console.log(rank)
          }
        })
      }
    })
  });

module.exports = router;