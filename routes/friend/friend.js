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
    res.send(user);
  });
});

router.post("/people/profile/get", (req, res) => {
  let request1 = req.body.username;
  User.find({ username: request1 }, (err, user) => {
    res.send(user);
  });
});

router.post("/follow/user/data", (req, res) => {
  let username = req.body.username;
  User.find({ username }, (err, result) => {
    res.send(result);
  });
});

//api add friend
router.post("/follow", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  User.findOne({ email: email_friend}, (err, user) => {
    let teman = {
      email: email,
      email_friend: email_friend,
      username: user.username,
      name: user.first_name + user.last_name,
      status: "followed",
      seen: 0
    };
    var friend = new Friend(teman);
  friend.save().then(teman => {
    User.findOne({ email: email_friend }, (err, hasil) => {
      let total_friends = hasil.total_friends;
      let countfriend = total_friends + 1;
      User.findOneAndUpdate(
        { email: email_friend },
        { $set: { total_friends: countfriend } },
        { new: true },
        (err, result) => {
          console.log("suskes friend" + result);
        }
      );
    });
    res.send(teman);
  });
  });
});

router.post("/following/count", (req, res) => {
  let email = req.body.email;
  Friend.findOne({ email }, (err, result) => {
    Friend.countDocuments({ status: "followed" }, (a, counting) => {
      res.send("" + counting);
    });
  });
});

router.post("/follower/count", (req, res) => {
  let email_friend = req.body.email;
  Friend.findOne({ email_friend }, (err, result) => {
    Friend.countDocuments({ status: "followed" }, (a, counting) => {
      res.send("" + counting);
    });
  });
});

router.post("/following/list", (req, res) => {
  let email = req.body.email;
  Friend.find({ email, status: "followed" }, (err, result) => {
    res.send(result);
  });
});

router.post("/follower/list", (req, res) => {
  let email_friend = req.body.email;
  Friend.find({ email_friend, status: "followed" }, (err, result) => {
    res.send(result);
  });
});

//api notif add
router.post("/follow/notif", (req, res) => {
  let email = req.body.email;
  Friend.find({ email_friend: email, status: "followed" }, (err, friend) => {
    res.send(friend);
  });
});

router.post("/follow/notif/count", (req, res) => {
  let email = req.body.email;
  Friend.countDocuments({ email_friend: email, status: "followed", seen: 0 }, (a, counting) => {
    res.send("" + counting);
  });
});

//
router.post("/follow/notif", (req, res) => {
  let email = req.body.email;
  User.findOne({ email: email }, (err, user) => {
    res.send(user);
  });
});

router.put("/follow/notif/seen", (req, res) => {
  let email = req.body.email;
  Friend.update({ email_friend: email }, { $set: { seen: 1 } }, { multi: true }, (err, sukses) => {
    res.send(sukses);
  });
});

//api get status friend
router.post("/follow/status", (req, res) => {
  let email = req.body.email;
  let email_friend = req.body.email_friend;
  Friend.findOne({ email: email, email_friend: email_friend }, (err, hasil) => {
    if (hasil) {
      res.send(hasil.status);
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
      if (status != "follow") {
        Friend.findOneAndUpdate(
          { email, email_friend },
          { $set: { status: "follow" } },
          { new: true },
          (err, hasil) => {
            console.log(hasil);
            let status = hasil.status;
            Friend.findOneAndRemove({ email, email_friend }, (err, removed) => {
              console.log("removed");
            });
            User.findOne({ email: email_friend }, (err, hasil) => {
              let total_friends = hasil.total_friends;
              let countfriend = total_friends - 1;
              User.findOneAndUpdate(
                { email: email_friend },
                { $set: { total_friends: countfriend } },
                { new: true },
                (err, result) => {
                  console.log("suskes friend" + result);
                }
              );
            });
            res.send(status);
          }
        );
      } else {
        console.log("status nya berarti follow");
      }
    }
  });
});

//bypass
router.delete("/clearf", (req, res) => {
  Friend.remove({}, (err, sukses) => {
    res.send(sukses);
  });
});

router.put("/reset", (req, res) => {
  let email = req.body.email;
  User.findOneAndUpdate({ email }, { $set: { total_friends: 0 } }, { new: true }, (err, sukses) => {
    res.send(sukses);
  });
});

router.get("/friendcheck", (req, res) => {
  Friend.find({}, (err, hasil) => {
    res.send(hasil);
  });
});

router.delete("/clearu", (req, res) => {
  User.remove({}, (err, sukses) => {
    res.send(sukses);
  });
});

module.exports = router;
