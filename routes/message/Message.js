const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const randtoken = require("rand-token");
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

router.get("/list",(req, res) => {
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."ListMessage"', (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
})
//Api Message
router.post("/list/message",(req, res) => {
    let email = req.body.email
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      let username_user2 = result.rows[0].username
      client.query('SELECT * FROM "way"."ListMessage" WHERE username_user1=$1 OR username_user2=$1 ORDER BY email DESC'[username_user2], (err,result) => {
          res.send(result.rows)
      })
    }
  }))
  .catch(e => console.log(e))
})

//Api Send Message
router.post("/send/message",(req, res) => {
    let email = req.body.email
    let username_user2 = req.body.username_user2
    let message = req.body.message
    let date = new Date();
    let tgl = date.toDateString();
    let jam = date.getHours();
    let menit = date.getMinutes();
    let token = randtoken.generate(10);
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
        let username_user1 = user.rows[0].username
        let name_user1 = user.rows[0].first_name + " " + user.rows[0].last_name
        client.query('SELECT * FROM "way"."Message" WHERE username_user1=$1 AND username_user2=$2 OR username_user1=$2 AND username_user2=$1',[username_user2,username_user1], (err,result) =>{
            if(err){
                console.log(err)
            }else{
                if(result.rowCount === 0){
                    client.query('SELECT * FROM "way"."User" WHERE username=$1',[username_user2],(err,users) =>{
                        if(err){
                            console.log(err)
                        }else{
                            let name_user2 = users.rows[0].first_name + " " + users.rows[0].last_name
                            let tanggal = jam + ":" + menit + "," + tgl
                            client.query('INSERT INTO "way"."Message" (kode_chat,username_user1,name_user1,username_user2,name_user2,message,date,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[token,username_user1,name_user1,username_user2,name_user2,message,tanggal,"Send"], (err,pesan) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    client.query('INSERT INTO "way"."ListMessage" (kode_chat,username_user1,name_user1,username_user2,name_user2,message,date,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[token,username_user1,name_user1,username_user2,name_user2,message,tanggal,"Send"], (err) =>{
                                        if(err){
                                            console.log(err)
                                        }else{
                                            res.send(pesan)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else{
                    client.query('SELECT * FROM "way"."User" WHERE username=$1',[username_user2],(err,users) =>{
                        if(err){
                            console.log(err)
                        }else{
                            let kode_chat = users.rows[0].kode_chat
                            let name_user2 = users.rows[0].first_name + " " + users.rows[0].last_name
                            let tanggal = jam + ":" + menit + "," + tgl
                            client.query('INSERT INTO "way"."Message" (kode_chat,username_user1,name_user1,username_user2,name_user2,message,date,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[kode_chat,username_user1,name_user1,username_user2,name_user2,message,tanggal,"Send"], (err,pesan) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    client.query('DELETE FROM "way"."ListMessage" WHERE kode_chat=$1',[kode_chat], (err) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            client.query('INSERT INTO "way"."ListMessage" (kode_chat,username_user1,name_user1,username_user2,name_user2,message,date,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[kode_chat,username_user1,name_user1,username_user2,name_user2,message,tanggal,"Send"], (err) =>{
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    res.send(pesan)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }
    }))
    .catch(e => console.log(e))
})

//Api Detail Message
router.post("/detail/message",(req, res) => {
    let email = req.body.email
    let username_user1 = req.body.username_user1
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      let username_user2 = user.rows[0].username
      client.query('SELECT * FROM "way"."Message" WHERE username_user1=$1 AND username_user2=$2 OR username_user1=$2 AND username_user2=$1',[username_user1,username_user2],(err,users) =>{
          if(err){
              console.log(err)
          }else{
              if(users.rowCount === 0){
                  null
              }else{
                    let kode = users.rows[0].kode_chat
                    client.query('SELECT * FROM "way"."Message" WHERE kode_chat=$1',[kode],(err,result) =>{
                        if(err){
                            console.log(err)
                        }else{
                            res.send(result.rows)
                        }
                  })
              }
          }
      })
    }
    }))
    .catch(e => console.log(e))
})

//Api Notif Message
router.post("/notif/message",(req, res) => {
    let email = req.body.email
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) =>{
    if(err){
      console.log(err)
    }else{
      let username = user.rows[0].username
      client.query('SELECT * FROM "way"."Message" WHERE username=$1 AND status=$2',[username,"Send"],(err,notif)=>{
            if(err){
                console.log(err)
            }else{
                res.send(notif.rowCount)
            }
      })
    }
    }))
    .catch(e => console.log(e))
})

//Api Read Message
router.post("/read/message",(req, res) => {
    let username_user1 = req.body.username_user1
    let email = req.body.email
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,result) =>{
    if(err){
        console.log(err)
    }else{
        let username_user2 = result.rows[0].username
        client.query('UPDATE "way"."Message" SET status=$1 WHERE username_user1=$2 AND username_user2=$3',["Read",username_user1,username_user2],(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log(username_user2 + "Sedang Membaca Pesan dari" + username_user1)    
            }
        })
    }
    }))
    .catch(e => console.log(e))
})

//Api Read Message
router.post("/message/head",(req, res) => {
    let username = req.body.username
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."User" WHERE username=$1',[username], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
    }))
    .catch(e => console.log(e))
})

module.exports = router;
