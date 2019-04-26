const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Client = require('pg').Pool;
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Way',
  password: 'way',
  port: 5432,
})
const Friend = require("../../model/Friend");
const User = require("../../model/User");
const Foto = require("../../model/Foto");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

//api search people
router.post("/friend", (req, res) => {
  let emails = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email != $1',[emails], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      client.query(' SELECT * FROM "way"."Foto" WHERE email != $1',[emails], (err,foto) =>{
        if(err){
          console.log(err)
        }else{
          res.send({user: user.rows, foto: foto.rows});
        }
      })
    }
    }))
    .catch(e => console.log(e))
});

//api search people
router.post("/search", (req, res) => {
  var username = req.body.username;
  var way = "Way"
  var official = "Official"
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE username LIKE $1 AND username != $2 AND username != $1 OR first_name LIKE $1 AND first_name != $2 OR last_name LIKE $1 AND last_name != $3',[username + '%',way,official], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
    }))
    .catch(e => console.log(e))
});


router.post("/people/profile", (req, res) => {
  let email = req.body;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email = $1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/people/profile/get", (req, res) => {
  let request1 = req.body.username;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE username = $1',[request1], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/follow/user/data", (req, res) => {
  let username = req.body.username;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE username = $1',[username], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user)
    }
  }))
  .catch(e => console.log(e))
});

//api add friend
router.post("/follow", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email = $1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      let username = user.rows[0].username
      let name = user.rows[0].first_name + " " + user.rows[0].last_name
      client.query('INSERT INTO "way"."Friend" (email,email_friend,username,name,status,seen) VALUES ($1,$2,$3,$4,$5,$6)',[email,email_friend,username,name,"followed",0], (err) => {
        if(err){
          console.log(err)
        }else{
          client.query('SELECT * FROM "way"."User" WHERE email=$1',[email_friend], (err,users) => {
            let total_friends = users.rows[0].total_friends
            let countfriend = total_friends + 1
            client.query('UPDATE "way"."User" SET total_friend = $1 WHERE email=$2',[countfriend,email_friend],(err) => {
              if(err){
                console.log(err)
              }
            }) 
          })
        }
      })
    }
  }))
  .catch(e => console.log(e))
});

router.post("/following/count", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND status=$2',[email,"followed"], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rowCount)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/follower/count", (req, res) => {
  let email_friend = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND status=$2',[email_friend,"followed"], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rowCount)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/following/list", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND status=$2',[email,"followed"], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/follower/list", (req, res) => {
  let email_friend = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email_friend = $1 AND status=$2',[email_friend,"followed"], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api notif add
router.post("/follow/notif", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email_friend = $1 AND status=$2',[email,"followed"], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/follow/notif/count", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND status=$2 AND seen=$3',[email,"followed",0], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rowCount)
    }
  }))
  .catch(e => console.log(e))
});

//
router.post("/follow/notif", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email = $1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
  }))
  .catch(e => console.log(e))
});

router.put("/follow/notif/seen", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('UPDATE "way"."Friend" SET seen=$2 WHERE email_friend = $1',[email,1], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api get status friend
router.post("/follow/status", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND email_friend=$2',[email,email_friend], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user.rows[0].status)
    }
  }))
  .catch(e => console.log(e))
});

//api unfriend
router.put("/unfollow", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend" WHERE email = $1 AND email_friend=$2',[email,email_friend], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      let status = user.rows[0].status
      if( status != "follow"){
        client.query(' UPDATE "way"."Friend" SET seen=$1 WHERE email=$2 AND email_friend=$3'["follow",email,email_friend], (err) =>{
          if(err){
            console.log(err)
          }else{
            client.query('DELETE FROM "way"."Friend" WHERE email=$1 AND email_friend=$2',[email,email_friend],(err)=>{
              if(err){
                console.log(err)
              }else{
                client.query(' Select * FROM "way"."User" WHERE email=$1',[email_friend],(err,users) => {
                  if(err){
                    console.log(err)
                  }else{
                    let total_friends = users.rows[0].total_friend
                    let countfriend = total_friends - 1;
                    client.query('UPDATE "way"."User" SET total_friend=$1 WHERE email=$2',[countfriend,email_friend], (err,result) => {
                      if(err){
                        console.log(err)
                      }else{
                        console.log("suskes friend" + result.rows);      
                      }
                    })
                  }
                })
              }
            })
          }
          res.send(status)
        })
      }else{
        console.log("status nya berarti follow");
      }
    }
  }))
  .catch(e => console.log(e))
});

router.put("/reset", (req, res) => {
  let email = req.body.email;
  client.connect()
    .then( () => client.query('UPDATE "way"."User" SET total_friends=$1 WHERE email = $2',[0,email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user)
    }
  }))
  .catch(e => console.log(e))
});

router.get("/friendcheck", (req, res) => {
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Friend"', (err,user) =>{
    if(err){
      console.log(err)
    }else{
      res.send(user)
    }
  }))
  .catch(e => console.log(e))
});

module.exports = router;