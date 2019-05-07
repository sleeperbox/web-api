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

//api total score user
router.post("/rank", (req, res) => {
    let email = req.body.email
    User.findOne({ email: email}, (err,user) => {
      if(err){
        console.log(err)
      }else{
        let score_friends = user.total_friends * 5
        let score_thanks = user.total_thanks * 2
        let score = score_friends + score_thanks
        Ranking.findOneAndUpdate({ email: email}, { $set: { total_score : score}}, { new: true }, (err,rank) => {
          if(err){
            console.log(err)
          }else{
            Ranking.find().sort({total_score: -1})
            res.send(rank)
          }
        })
      }
    })
  });

//api Lihat Point
router.post("/user/point", (req,res) => {
  let email = req.body.email
  Ranking.findOne({ email: email}, (err, point) => {
    if(err){
      console.log(err)
    }else{
      let points = point.total_score
      res.send("" +points)
    }
  })
})

//api Rank User
router.post("/user/rank", (req,res) => {
  let date = new Date();
  let tgl = date.toDateString();
  let email = req.body.email
  Ranking.find().sort({ total_score: -1}).exec( (err,score) => {
    if(err){
      console.log(err)
    }else{
      Ranking.count({}, (err,count) => {
        for(var i = 0; i < count; i++){
          var ranking_user = {
            email : score[i].email,
            rank : i + 1,
            tgl : tgl
          }
            if(ranking_user.email == email){
              res.send(ranking_user)
            }
        }
      })
    }
  })
})

//api list rank user
router.post("/list/rank", (req,res) => {
  Ranking.find().sort({ total_score: -1}).exec( (err,score) => {
    if(err){
      console.log(err)
    }else{
      res.send(score)
    }
  })
})

//api Rank User
// router.post("/user/rank", function(req, res) {
//   let date = new Date();
//   let tgl = date.toDateString();
//   let email = req.body.email
//   Ranking.find().sort({total_score: -1}).exec(function(err,a){
//     if(err){
//       console.log(err)
//     }
//     Rank.findOne({email : email}, (err, tg) => {
//       if(!tg){
//         Rank.deleteMany({}, () => {
//             Ranking.count({}, (err, count) => {
//             if(err){
//               console.log(err)
//             }else{
//               for(var i = 0; i < count; i++){
//                 var ranking_user = {
//                   email : a[i].email,
//                   rank : i,
//                   tgl : tgl
//                 }
//                 var b = new Rank(ranking_user)
//                 b.save()
//               }
//             }
//             Rank.find({ email : email}, (aww,rank_user) =>{
//             if(aww){
//               console.log(aww)
//             }else{
//               res.send(rank_user)
//             }
//             })
//           })
//         })
//       }else if(tg.tgl == tgl){
//         Rank.find({ email : email}, (aww,rank_user) =>{
//           res.send(rank_user)
//         })
//       }else{
//         Rank.deleteMany({}, () => {
//           Ranking.count({}, (err, count) => {
//           if(err){
//             console.log(err)
//           }else{
//             for(var i = 0; i < count; i++){
//             var ranking_user = {
//               email : a[i].email,
//               rank : i,
//               tgl : tgl
//             }
//             var b = new Rank(ranking_user)
//             b.save()
//           }
//           Rank.find({ email : email}, (aww,rank_user) =>{
//           res.send(rank_user)
//           })
//         }
//       })
//       })
//       }
//     })
//   });
// });

module.exports = router;