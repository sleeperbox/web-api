const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Friend = require("../../model/Friend");
const User = require("../../model/User");

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
  User.find({ email: { $ne: emails } }, (err, user) => {
    res.send(user);
  });
});

router.post("/people/profile", (req, res) => {
  let email = req.body;
  User.find({ email: email }, (err, user) => {
    res.send(user)
  })
})

router.post("/people/profile/get", (req, res) => {
  let request1 = req.body.username;
  User.find({ username: request1 }, (err, user) => {
    res.send(user)
  })
})

//api add friend
router.post("/follow", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  let teman = {
    email: email,
    email_friend: email_friend,
    status: "followed"
  };
  var friend = new Friend(teman);
  friend.save().then(teman => {
    res.send(teman);
  });
});

//api notif add
router.post("/follow/notif", (req, res) => {
  let email_friend = req.body.email;
  let status = "followed";
  Friend.find({ email_friend: email_friend, status: status }, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(obj_user);
  });
});

//api get status friend
router.post("/follow/status", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  Friend.findOne({ email: email, email_friend: email_friend }, (err, hasil) => {
    if(hasil){
    res.send(hasil.status)
    }
  });
});

//api unfriend
router.put("/unfollow", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  Friend.findOne({ email: email, email_friend: email_friend }, (err, hasil) => {
    if (hasil) {
      let status = hasil.status;
      if(status != "follow"){
        Friend.findOneAndUpdate({email, email_friend},{ $set: { status: "follow" }}, { new: true }, (err, hasil) => {
         console.log(hasil)
         let status = hasil.status;
         Friend.findOneAndRemove({email, email_friend}, (err, removed) =>{
           console.log('removed')
         })
         res.send(status);
        });
      }else{
        console.log('status nya berarti follow')
      }
    }
  });  
});

//bypass
router.delete("/clearf", (req, res) => {
  Friend.remove({}, (err, sukses) => {
    res.send(sukses)
  })
});

router.get("/friendcheck", (req, res) => {
  Friend.find({}, (err, hasil)=> {res.send(hasil)})
}) 

router.delete("/clearu", (req, res) => {
  User.remove({}, (err, sukses) => {
    res.send(sukses)
  })
});

module.exports = router;