const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");
const Ranking = require("../../model/Ranking");
const Rank = require("../../model/Rank");
const Client = require('pg').Pool;
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Way',
  password: 'way',
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

// api login
router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User" WHERE email =$1',[email], (err, result) => {
    if(err){
      var statuslogin = 1;
      res.send("" + statuslogin);
      console.log(email, "tidak ada")
    }else{
      let dbpassword = result.rows[0].password
      var cekpassword = bcrypt.compareSync(password, dbpassword);
      if (cekpassword === true) {
        console.log(email, "Telah Login");
        res.send(result.rows);
      }else {
        var statuspassword = 1;
        res.send("" + statuspassword);
        console.log("password salah")
      }
    }
  }))
  .catch( e => console.log(e))
});

//api register
router.post("/register", (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let name = first_name + " " + last_name
  const salt = bcrypt.genSaltSync(10);
  let password = bcrypt.hashSync(req.body.password, salt);
  let token = randtoken.generate(10);
  let noPP = Math.floor(Math.random() * Math.floor(8));
  let PP = null;
  let auth = true;
  let date = new Date();
  let join_date = date.toDateString();

  if( noPP == 1){
    PP = "default profil 1.png"
  }else if( noPP == 2){
    PP = "default profil 2.png"
  }else if( noPP == 3){
    PP = "default profil 3 .png"
  }else if( noPP == 4){
    PP = "default profil 4.png"
  }else if( noPP == 5){
    PP = "default profil 5.png"
  }else if( noPP == 6){
    PP = "default profil 6.png"
  }else if( noPP == 7){
    PP = "default profil 7.png"
  }else {
    PP = "default profil 8.png"
  }

    client.connect()
    .then(() => client.query('SELECT * FROM "way"."User" WHERE email='+email, (err,result) => {
      if(err){
        client.query('SELECT * FROM "way"."User" WHERE username='+username, (err,result) =>{
          if(err){
            client.query('INSERT INTO "way"."User" (email, username, first_name, last_name, password, token, auth, total_posts, total_thanks, total_friends, awards, join_date, tags, foto) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[email,username,first_name,last_name,password, token,auth,0,0,0,0,join_date,["other"],PP], (err, result) => {
              if(err){
                console.log(err)
              }else{
                res.status(200).json(result.rows)
                console.log("User Baru", email)
              }
            })
            client.query('INSERT INTO "way"."Foto" (email,avatar) VALUES ($1,$2)',[email,PP],(err,result) => {
              if(err){
                console.log(err)
              }else{
                console.log(result.rows)
              }
            })
            client.query('INSERT INTO "way"."SearchPeople" (email, email_friend) VALUES ($1,$2)',[email,email], (err) => {
              if(err){
                console.log(err)
              }
            })
            client.query('INSERT INTO "way"."Ranking" (email,total_score) VALUES ($1,$2)', [email,0] , (err) => {
              if(err){
                console.log(err)
              }
            })
             client.query('INSERT INTO "way"."Message" (kode_chat, username_user1, name_user1, username_user2, name_user2, message, date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [token, "Way", "Way Official", username, name,"Welcome! Enjoy Your Experience on WAY! Application", join_date, "Send"], (err) => {
              if(err){
                console.log(err)
              }
            })
          }else{
            var statuskode = 1;
            console.log(result, "sudah digunakan")
            res.send("" + statuskode);    
          }
        })
      }else{
        var statuskode = 1;
        console.log(result, "sudah digunakan")
        res.send("" + statuskode);
      }
    }))
    .catch( e => console.log(e))
});

//api register no telepon web
router.post("/register/phone", (req, res) => {
  let phone_number = req.body.phone_number;
  let username = req.body.username;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  const salt = bcrypt.genSaltSync(10);
  let password = bcrypt.hashSync(req.body.password, salt);
  let token = randtoken.generate(10);
  let noPP = Math.floor(Math.random() * Math.floor(8));
  let PP = null;
  let auth = true;
  let date = new Date();
  let join_date = date.toDateString();

  if( noPP == 1){
    PP = "default profil 1.png"
  }else if( noPP == 2){
    PP = "default profil 2.png"
  }else if( noPP == 3){
    PP = "default profil 3 .png"
  }else if( noPP == 4){
    PP = "default profil 4.png"
  }else if( noPP == 5){
    PP = "default profil 5.png"
  }else if( noPP == 6){
    PP = "default profil 6.png"
  }else if( noPP == 7){
    PP = "default profil 7.png"
  }else {
    PP = "default profil 8.png"
  }

  client.connect()
    .then(() => client.query('SELECT * FROM "way"."User" WHERE email='+phone_number, (err,result) => {
      if(err){
        client.query('SELECT * FROM "way"."User" WHERE username='+username, (err,result) =>{
          if(err){
            client.query('INSERT INTO "way"."User" (email, username, first_name, last_name, password, token, auth, total_posts, total_thanks, total_friends, awards, join_date, tags, foto) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[phone_number,username,first_name,last_name,password, token,auth,0,0,0,0,join_date,["other"],PP], (err, result) => {
              if(err){
                console.log(err)
              }else{
                res.status(200).json(result.rows)
                console.log("User Baru", phone_number)
              }
            })
            client.query('INSERT INTO "way"."Foto" (email,avatar) VALUES ($1,$2)',[phone_number,PP],(err,result) => {
              if(err){
                console.log(err)
              }else{
                console.log(result.rows)
              }
            })
            client.query('INSERT INTO "way"."SearchPeople" (email, email_friend) VALUES ($1,$2)',[phone_number,phone_number], (err) => {
              if(err){
                console.log(err)
              }
            })
            client.query('INSERT INTO "way"."Ranking" (email,total_score) VALUES ($1,$2)', [phone_number,0] , (err) => {
              if(err){
                console.log(err)
              }
            })
             client.query('INSERT INTO "way"."Message" (kode_chat, username_user1, name_user1, username_user2, name_user2, message, date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [token, "Way", "Way Official", username, name,"Welcome! Enjoy Your Experience on WAY! Application", join_date, "Send"], (err) => {
              if(err){
                console.log(err)
              }
            })
          }else{
            var statuskode = 1;
            console.log(result, "sudah digunakan")
            res.send("" + statuskode);    
          }
        })
      }else{
        var statuskode = 1;
        console.log(result, "sudah digunakan")
        res.send("" + statuskode);
      }
    }))
    .catch( e => console.log(e))
});

//api Upadate User
router.put("/user/tags", (req, res) => {
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let phone_number = req.body.phone_number;
  let gender = req.body.gender;
  let tags = [req.body.tags];
  client.connect()
  .then( () => client.query('UPDATE "way"."User" SET first_name = $1, last_name = $2, phone_number = $3, jenis_kelamin = $4, tags = $5 WHERE email=$6',[first_name,last_name,phone_number,gender, tags, email], (err, result) => {
    if(err){
      console.log(err)
    }else{
      console.log( email, "Update Profile")
      res.send(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api User Tranding
router.post("/user/trending", (req, res) => {
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User" ORDER BY total_thanks DESC limit 5', (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api profile user
router.post("/profile", (req, res) => {
  let email = req.body.email;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api get user
router.post("/user", (req, res) => {
  let email = req.body.email;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api get all user
router.get("/user", (req, res) => {
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User"', (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.status(200).json(result.rows)
      console.log(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api Hapus Akun User
router.delete("/user/delete", function(req, res) {
  let email = req.body.email;
  client.connect()
  .then( () => client.query('DELETE FROM "way"."User" WHERE email ='+email, (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.status(200).json(result.rows)
      console.log(result.rows)
    }
  }))
  .catch( e => console.log(e))
});

//api Ubah Password User
router.put("/user/ubahpassword", function(req, res) {
  let email = req.body.email;
  let password_lama = req.body.password_lama;
  const salt = bcrypt.genSaltSync(10);
  let password_baru = bcrypt.hashSync(req.body.password_baru, salt);
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User"', (err, result) => {
    if(err){
      console.log(err)
    }else{
      let password = result.rows[0].password
      var cekpassword = bcrypt.compareSync(password_lama, password);
      if(cekpassword === true){
        client.query('UPDATE "way"."User" SET password = $1 WHERE email = $2',[password_baru,email], (err) => {
          if(err){
            console.log(err)
          }else{
            console.log(email, "Mengganti Password")
          }
        })
      }
    }
  }))
  .catch( e => console.log(e))
});

//api Rank User
router.post("/user/rank", function(req, res) {
  let date = new Date();
  let tgl = date.toDateString();
  let email = req.body.email
  Ranking.find().sort({total_score: -1}).exec(function(err,a){
    if(err){
      console.log(err)
    }
    Rank.findOne({email : email}, (err, tg) => {
      if(!tg){
        Rank.deleteMany({}, () => {
            Ranking.count({}, (err, count) => {
            if(err){
              console.log(err)
            }else{
              for(var i = 0; i < count; i++){
                var ranking_user = {
                  email : a[i].email,
                  rank : i,
                  tgl : tgl
                }
                var b = new Rank(ranking_user)
                b.save()
              }
            }
            Rank.find({ email : email}, (aww,rank_user) =>{
            if(aww){
              console.log(aww)
            }else{
              res.send(rank_user)
            }
            })
          })
        })
      }else if(tg.tgl == tgl){
        Rank.find({ email : email}, (aww,rank_user) =>{
          res.send(rank_user)
        })
      }else{
        Rank.deleteMany({}, () => {
          Ranking.count({}, (err, count) => {
          if(err){
            console.log(err)
          }else{
            for(var i = 0; i < count; i++){
            var ranking_user = {
              email : a[i].email,
              rank : i,
              tgl : tgl
            }
            var b = new Rank(ranking_user)
            b.save()
          }
          Rank.find({ email : email}, (aww,rank_user) =>{
          res.send(rank_user)
          })
        }
      })
      })
      }
    })
  });
});

//api hapus semua rank
router.delete("/rank", function(req, res) {
  Rank.remove(function(err) {
    if (err) res.json(err);
    res.send("removed");
  });
});

module.exports = router