const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Client = require('pg').Pool;
const client = new Client({
  user: 'aprizalc_sleeperbox',
  host: 'localhost',
  database: 'aprizalc_way',
  password: 'moalmakepassword',
  port: 5432,
})
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
    client.connect()
    .then( () => client.query(' SELECT * FROM "way"."User" WHERE email=$1',[email], (err,result) => {
      if(err){
        console.log(err)
      }else{
        let score = result.rows[0].total_friends + result.rows[0].total_thanks
        client.query(' UPDATE "way"."Ranking" SET total_score= $1 WHERE email=$2',[score,email], (err) => {
          if(err){
            console.log(err)
          }else{
            console.log("hore")
          }
        })
      }
    }))
    .catch( e => console.log(e))
  });

module.exports = router;