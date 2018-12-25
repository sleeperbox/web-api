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

router.delete("/friend", (req, res) => {
  Friend.remove({}, (err, result) => {
    console.log("removed");
  });
  User.remove({}, (err, result) => {
    console.log("removed");
  });
  res.send("hapus");
});

//api search people
router.post("/friend", (req, res) => {
  let emails = req.body.email;
  User.find({ email: { $ne: emails } }, (err, user) => {
    res.send(user);
  });
});

router.post("/friend/status", (req, res) => {
  let emails = req.body.email;
  User.find({ email: { $ne: emails } }, (err, user) => {
    user.forEach(function(users) {
      var user_email = users.email;
      Friend.find({ email: emails, email_friend: user_email }, (err, friend) => {
        var pending = friend.length;
        pending--;
        if (pending >= 0) {
          console.log("friends: ", friend);
          res.send(friend);
        }
      });
    });
  });
});

//api get all friend
router.post("/myfriend", (req, res) => {
  let email = req.body.email;
  let status_teman = "confirm";
  Friend.find({ email: email, status: status_teman }, (err, teman) => {
    res.send(teman);
  });
});

//api add friend
router.post("/addfriend", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  let teman = {
    email: email,
    email_friend: email_friend,
    status: "pending"
  };
  var friend = new Friend(teman);
  friend.save().then(teman => {
    console.log(email_friend, "Di Tambahkan teman oleh", email);
    res.send(teman);
  });
});

//bypass frind request to null
router.get("/clearfriendstatus", (req, res) => {
  Friend.updateMany({ status: "" }).then(res.send("updated."));
});

//api notif add
router.post("/friend/notif", (req, res) => {
  let email_friend = req.body.email;
  let status = "pending";
  Friend.find({ email_friend: email_friend, status: status }, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(obj_user);
  });
});

//api get status friend
router.post("/addfriend/status", (req, res) => {
  let email = req.body.email;
  Friend.findOne({ email }, (err, obj_user) => {
    if (obj_user) {
      let email_friend = obj_user.email_friend;
      let status = obj_user.status;
      let friend = {
        email_friend: email_friend,
        status: status
      };
      console.log(email_friend, "Status", status);
      res.send(friend);
    } else {
      res.send(err);
    }
  });
});

//friend status pending
router.post("/friend/status/pending", (req, res) => {
  let email = req.body.email;
  Friend.find({ email: email, status: "pending" }, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    if (obj_user) {
      res.send(obj_user);
    } else {
      res.send(err);
    }
  });
});

//status == friend
router.post("/friend/status/confirm", (req, res) => {
  let email = req.body.email;
  let status = "confirm";
  Friend.find({ email: email, status: status }, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    if (obj_user) {
      res.send(obj_user);
    } else {
      res.send(err);
    }
  });
});

//api confirm friend
router.put("/friend/confirm", (req, res) => {
  var email = req.body.email;
  var email_friend = req.body.email_friend;
  let status = "confirm";
  let teman = {
    email: email,
    email_friend: email_friend,
    status: "confirm"
  };
  var friend = new Friend(teman);
  friend.save().then(() => {
    Friend.findOneAndUpdate({ email, email_friend }, { status: status }, () => {
      let new_teman = {
        email: email_friend,
        email_friend: email,
        status: "confirm"
      };
      var friend = new Friend(new_teman);
      friend.save();
    }).then(user => {
      console.log(email, "Telah Berteman Dengan", email_friend);
      res.send(user);
    });
  });
});

//api cancel req
router.delete("/friend/cancel", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  Friend.findOneAndRemove({ email: email, email_friend: email_friend }, () => {
    console.log(email, "Membatalkan Permintaan Pertemanan kepada", email_friend);
    res.send("Membatalkan Permintaan Pertemanan kepada");
  });
});

//api unfriend
router.delete("/unfriend", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  let status = "confirm";
  Friend.findOneAndRemove({ email: email, email_friend: email_friend, status: status }, () => {
    console.log(email, "Membatalkan Pertemanan kepada", email_friend);
  }).then(() => {
    Friend.findOneAndRemove({ email: email_friend, email_friend: email, status: status }, () => {
      res.send("Membatalkan Pertemanan");
    });
  });
});

module.exports = router;
