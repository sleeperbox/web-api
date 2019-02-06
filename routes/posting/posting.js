const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Posting = require("../../model/Posting");
const User = require("../../model/User");
const Thank = require("../../model/Thanks");
const Comment = require("../../model/Comment");

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

//api clear tabel posting
router.delete("/clearposting", function(req, res) {
  Posting.remove(function(err) {
    if (err) res.json(err);
    res.send("removed");
  });
});

//api get all user
router.get("/posts", (req, res) => {
  Posting.find({}, (err, obj_user) => {
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(obj_user);
  });
});

//get comment data
//api get all user
router.get("/posts/:id_posts", (req, res) => {
  var id_post = req.params.id_posts
  Posting.findOne({ id_posts: id_post }, (err, posting) => {
    res.send(posting);
  });
});

router.get("/posts/comment", (req, res) => {
  Comment.find({}, (err, obj_user) => {
    if(err){
      res.send(err)
    }else{
    var userMap = {};
    obj_user.forEach(function(users) {
      userMap[users._id] = users;
    });
    res.send(obj_user);
  }
  });
  });

router.post("/posts/comment", (req, res) => {
  let email = req.body.email;
  let comment = req.body.comment;
  let id = req.body.id_posts;
  let username = req.body.username;
      let postcomment = {
        id_posts: id,
        email: email,
        username: username,
        comment: comment,
        status: "publish"
      };
      let commenting = new Comment(postcomment);
      commenting.save();
      console.log(email, "Membuat komentar");
      res.send(commenting);
    });

// api user posting
router.post("/posting", (req, res) => {
  let email = req.body.email;
  let content = req.body.content;
  let thanks = 0;
  let tags = req.body.tags;
  let tanggal = new Date();
  let date = tanggal.toDateString();
  let jam = tanggal.getHours();
  let menit = tanggal.getMinutes();
  User.findOne({ email: email }, (err, user) => {
    Posting.count({}, (err, postingan) => {
      let id = postingan;
      let username = user.username;
      let posts = user.total_posts;
      let total_post;
      posts === 0 ? (total_post = 1) : (total_post = posts + 1);
      let id_post = id + 1;
      let post = {
        id_posts: id_post,
        email: email,
        username: username,
        content: content,
        date: date,
        jam: jam,
        menit: menit,
        thanks: thanks,
        tags: tags,
        status: "publish"
      };
      let posting = new Posting(post);
      posting.save();
      console.log(email, "Membuat Postingan baru");
      res.send(posting);

      User.findOneAndUpdate({ email: email }, { $set: { total_posts: total_post } }, (err, posts) => {
        console.log(posts);
      });
    });
  });
});

//api thank post sendiri
router.put("/posting/thanks/up", (req, res) => {
  let email = req.body.email;
  let id = req.body._id;
  Thank.count( { email: email, idpost: id }, (err, thank) => {
    if(thank == 1){
      User.findOne({ email : email }, (err, hasil) => {
        let thanks = hasil.total_thanks;
        let count_thanks = thanks - 1;
        User.findOneAndUpdate({ email: email }, { $set: { total_thanks: count_thanks } }, { new: true }, (err, result) =>
          console.log("added", result)
        );
        Thank.deleteOne({email : email, idpost : id})
        .then( () => {
          Posting.findOne({ email, _id: id }, (err, post) => {
            let myPost = post.thanks;
            Posting.findOneAndUpdate(
              { email: email, _id: id },
              { $set: { thanks: myPost - 1 } },
              { new: true },
              (err, thanked) => {
                let kode = {
                  kode: 0
                }
                res.send({thank:thanked, kode:kode});
              }
            );
          });
        });
        });
    }else {
      User.findOne({ email : email }, (err, hasil) => {
        let thanks = hasil.total_thanks;
        let count_thanks = thanks + 1;
        User.findOneAndUpdate({ email: email }, { $set: { total_thanks: count_thanks } }, { new: true }, (err, result) =>
          console.log("added", result)
        );
        let thanks_user = {
          idpost : id,
          email : email
        }
        var ty = new Thank(thanks_user)
        ty.save()
          Posting.findOne({ email, _id: id }, (err, post) => {
            let myPost = post.thanks;
            Posting.findOneAndUpdate(
              { email: email, _id: id },
              { $set: { thanks: myPost + 1 } },
              { new: true },
              (err, thanked) => {
                let kode = {
                  kode: 1
                }
                res.send({thank:thanked, kode:kode});
              }
            );
          });
        });
    }
  });
});

//api thanks post teman
router.put("/posting/thanks/post/user", (req, res) => {
  let email = req.body.email;
  let username = req.body.username
  let id = req.body._id;
  Thank.count( { email: email, idpost: id }, (err, thank) => {
    if(thank == 1){
      User.findOne({username : username}, (err, user) => {
        let email_user = user.email
      User.findOne({ email : email_user }, (err, hasil) => {
        let thanks = hasil.total_thanks;
        let count_thanks = thanks - 1;
        User.findOneAndUpdate({ email: email_user }, { $set: { total_thanks: count_thanks } }, { new: true }, (err, result) =>
          console.log("added", result)
        );
        Thank.deleteOne({ email: email, idpost: id})
        .then(() => {
          Posting.findOne({ email : email_user, _id: id }, (err, post) => {
            let myPost = post.thanks;
            Posting.findOneAndUpdate(
              { email: email_user, _id: id },
              { $set: { thanks: myPost - 1 } },
              { new: true },
              (err, thanked) => {
                let kode = {
                  kode: 0
                }
                res.send({thank:thanked, kode:kode});
              }
            );
          });
        })
        })
      });
    }else {
      User.findOne({username : username}, (err, user) => {
        let email_user = user.email
      User.findOne({ email : email_user }, (err, hasil) => {
        let thanks = hasil.total_thanks;
        let count_thanks = thanks + 1;
        User.findOneAndUpdate({ email: email_user }, { $set: { total_thanks: count_thanks } }, { new: true }, (err, result) =>
          console.log("added", result)
        );
        let thanks_user = {
          idpost : id,
          email : email
        }
        var ty = new Thank(thanks_user)
        ty.save()
          Posting.findOne({ email : email_user, _id: id }, (err, post) => {
            let myPost = post.thanks;
            Posting.findOneAndUpdate(
              { email: email_user, _id: id },
              { $set: { thanks: myPost + 1 } },
              { new: true },
              (err, thanked) => {
                let kode = {
                  kode: 1
                }
                res.send({thank:thanked, kode:kode});
              }
            );
          });
        })
      });
    }
  });
});

//api Delete Posting
router.delete("/posting/delete", (req, res) => {
  let email = req.body.email;
  let id = req.body._id;
  Posting.deleteOne({ email: email, _id: id }, () => {
    User.findOne({ email : email }, (err, hasil) => {
      let thanks = hasil.total_posts;
      let count_thanks = thanks - 1;
      User.findOneAndUpdate({ email: email }, { $set: { total_posts: count_thanks } }, { new: true }, (err, result) => {
        console.log("added", result)
      });
    });
  });
});


//api thank sudah/belum
router.get("/posting/thank", (req, res) => {
  let email = req.body.email;
  Posting.find({ email: email }, (err, thank) => {
    res.send(thank);
    console.log(email, "melihat posting di profile");
  });
});

//api view posting di profile
router.post("/posting/profile", (req, res) => {
  let email = req.body.email;
  Posting.find({ email: email }, (err, posting) => {
    res.send(posting);
    console.log(email, "melihat posting di profile");
  });
});

//api posting menurut tag
router.post("/posting/tag", (req, res) => {
  let tag = req.body.tag;
  Posting.find({ tags: tag }, (err, posting) => {
    res.send(posting);
    console.log(tag, "melihat posting di profile");
  });
});

//api posting menurut tag
router.post("/posting/tag", (req, res) => {
  let tag = req.body.tag;
  Posting.find({ tags: tag }, (err, posting) => {
    res.send(posting);
    console.log(tag, "melihat posting di profile");
  });
});

//api posting Home Other
router.post("/posting/home/other", (req, res) => {
  let tag = "other"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Qoutes
router.post("/posting/home/quotes", (req, res) => {
  let tag = "quotes"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Computer-gadget
router.post("/posting/home/computer-gadget", (req, res) => {
  let tag = "computer-gadget"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Family-love
router.post("/posting/home/family-love", (req, res) => {
  let tag = "family-love"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Fakta-rumor
router.post("/posting/home/fact-rumour", (req, res) => {
  let tag = "fact-rumour"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Bussiness-work
router.post("/posting/home/bussiness-work", (req, res) => {
  let tag = "business-work"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Fashion-lifestyle
router.post("/posting/home/fashion-lifestyle", (req, res) => {
  let tag = "fashion-lifestyle"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

//api posting Home Riddles
router.post("/posting/home/riddles", (req, res) => {
  let tag = "riddles"
  Posting.find({tags: tag}).sort({_id: -1}).exec(function(err,posting){
    res.send(posting)
  })
});

router.post("/posting/people", (req, res) => {
  let username = req.body.username;
  Posting.find({ username: username }, (err, posting) => {
    res.send(posting);
  });
});

module.exports = router;
