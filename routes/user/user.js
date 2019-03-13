const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");
const User = require("../../model/User");
const Ranking = require("../../model/Ranking");
const Rank = require("../../model/Rank");
const Foto = require("../../model/Foto");
const ListMessage = require("../../model/ListMessage");
const Message = require("../../model/Message");
const SeacrhPeople = require("../../model/SearchPeople");

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
  User.findOne({ email }, function(err, user) {
    if (user) {
      let token = user.token;
      let emailuser = user.email;
      let dbpassword = user.password;
      var cekpassword = bcrypt.compareSync(password, dbpassword);
      if (cekpassword === true && token != "") {
        console.log(emailuser, "Telah Login");
        res.send(user);
      } else {
        var statuspassword = 1;
        res.send("" + statuspassword);
      }
    } else {
      var statuslogin = 1;
      res.send("" + statuslogin);
    }
  });
});

//api register
router.post("/register", (req, res) => {
  let email = req.body.email;
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

  let akun = {
    email: email,
    username: username,
    first_name: first_name,
    last_name: last_name,
    password: password,
    token: token,
    auth: auth,
    total_posts: 0,
    total_thaks: 0,
    total_friends: 0,
    awards: 0,
    join_date: join_date,
    total_thanks: 0,
    tags: ["other"],
    foto: PP,
  };
  User.findOne({ email: email }, (er, user) => {
    if (!user) {
      var users = new User(akun);
      users.save();
      let foto_avatar = {
        email: email,
        avatar: PP
    }
    var foto = new Foto(foto_avatar)
    foto.save()
      console.log("User Baru Telah di Daftarkan");
      res.send(akun);
    } else {
      let mail = user.email;
      let name = user.username;
      if (mail == email || name == username) {
        var statuskode = 1;
        res.send("" + statuskode);
      }
    }
  });
  let new_akun = {
    email: email,
    email_friend: email
  };
  var people = new SeacrhPeople(new_akun);
  people.save();
  
  let rank = {
    email: email,
    total_score: 0
  };
  var ranking = new Ranking(rank);
  ranking.save();

  let name = first_name + " " + last_name
  User.count({}, (err,user) => {
    let kode = user + 1
    let pesan = {
      kode_chat: kode,
      username_user1: "Way",
      name_user1: "Way Official",
      username_user2: username,
      name_user2: name,
      message: "Welcome! Enjoy Your Experience on WAY! Application",
      date: join_date,
      status: "Send"
    };
    var message = new ListMessage(pesan);
    message.save();
    var message_bot = new Message(pesan);
    message_bot.save();
    console.log(rank)
  })
});

//api Upadate User
router.put("/user/tags", (req, res) => {
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let phone_number = req.body.phone_number;
  let gender = req.body.gender;
  let tags = [req.body.tags];
  User.findOneAndUpdate(
    { email: email },
    {
      $set: { tags: [tags] },
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      jenis_kelamin: gender
    },
    function() {
      res.send("Tags telah ditambah");
    }
  );
});

//api profile user
router.post("/profile", (req, res) => {
  let email = req.body.email;
  User.findOne({ email: email }, (err, profile) => {
    console.log(email, "Sedang melihat profile sendiri");
    res.send(profile);
  });
});

//api get user
router.post("/user", (req, res) => {
  let email = req.body.email;
  User.findOne({ email: email }, (err, obj_user) => {
    res.send(obj_user);
  });
});

//api get all user
router.get("/user", (req, res) => {
  User.find({}, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(obj_user);
  });
});

//api Hapus Akun User
router.delete("/user/delete", function(req, res) {
  let email = req.body.email;
  User.deleteOne({ email: email }, () => {
    console.log("Akun ", email, " ", " Telah DiHapus");
    res.send("User Berhasil Dihapus");
  });
});

//api Ubah Password User
router.put("/user/ubahpassword", function(req, res) {
  let email = req.body.email;
  let password_lama = req.body.password_lama;
  const salt = bcrypt.genSaltSync(10);
  let password_baru = bcrypt.hashSync(req.body.password_baru, salt);
  User.findOne({ email: email }, (err, user) => {
    var cekpassword = bcrypt.compareSync(password_lama, user.password);
    if (cekpassword === true) {
      User.findOneAndUpdate({ email: email }, { $set: { password: password_baru } }, () => {
        console.log(email, " Telah Mengubah Password");
        res.send("Password Berhasil Di Ubah");
      });
    } else {
      console.log(email, "Password Lama Salah");
      res.send("Password Lama Salah");
    }
  });
});

//api Rank User
router.post("/user/rank", function(req, res) {
  let date = new Date();
  let tgl = date.toDateString();
  let email = req.body.email
  Ranking.find().sort({total_score: -1}).exec(function(err,a){
    Rank.findOne({email : email}, (err, tg) => {
      if(!tg){
        Rank.deleteMany({}, () => {
            Ranking.count({}, (err, count) => {
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
          })
        })
      }else if(tg.tgl == tgl){
        Rank.find({ email : email}, (aww,rank_user) =>{
          res.send(rank_user)
        })
      }else{
        Rank.deleteMany({}, () => {
          Ranking.count({}, (err, count) => {
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
        })
      })
      }
    })
  });
});

router.post("/o", function(req, res) {
  Rank.find({}, (a,s) => {
    res.send(s)
  })
});

//api hapus semua user
router.delete("/clearmongo", function(req, res) {
  User.remove(function(err) {
    if (err) res.json(err);
    res.send("removed");
  });
});

//api hapus semua rank
router.delete("/rank", function(req, res) {
  Rank.remove(function(err) {
    if (err) res.json(err);
    res.send("removed");
  });
});

router.post("/user/add", function(req, res) {
  console.log(req.body);
  var user = new User(req.body);
  user.save().then(() => {
    res.status(200).json({ user: "added successfully" });
  });
});

module.exports = router