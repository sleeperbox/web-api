const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Posting = require("../../model/Posting");
const User = require("../../model/User");
const Thank = require("../../model/Thanks");
const Comments = require("../../model/Comment");
const multer = require("multer");
const upload = multer({dest: '/public'});
const fs = require("fs");
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

router.post("/posting/tag/limit", (req, res) => {
  let tag = req.body.tag;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC limit 3',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//get posting data
router.get("/posts/:id_posts", (req, res) => {
  var id_post = req.params.id_posts
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE id_posts=$1',[id_post], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//get trending posting data
router.post("/posting/trending", (req, res) => {
  let tanggal = new Date()
  let date = tanggal.toDateString();
  let tgl = date
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE date=$1 ORDER BY thanks=-1 DESC limit 6',[date], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//get all comment listed
router.get("/comments", (req, res) => {
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Comment"', (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//get all comment by id post 
router.post("/comments", (req, res) => {
  var id_post = req.body.id_posts
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Comment" WHERE id_posts=$1',[id_post], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//posting comment
router.post("/posts/comments", (req, res) => {
  let username = req.body.username;
  let id = req.body.id_posts;
  let tanggal = new Date();
  let date = tanggal.toDateString();
  let jam = tanggal.getHours();
  let menit = tanggal.getMinutes();
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."User" WHERE username=$1',[username],(err,user) => {
    if(err){
      console.log(err)
    }else{
      client.query('SELECT * FROM "way"."Posting" WHERE id_posts=$1',[id],(err,result) =>{
        if(err){
          console.log(err)
        }else{
          let email_post = result.rows[0].email
          let email = req.body.email;
          let comment = req.body.comment;
          let foto = user.rows[0].foto;
          let total_posts = user.rows[0].total_posts;
          let total_friends = user.rows[0].total_friends;
          let total_thanks = user.rows[0].total_thanks;
          let komen = result.rows[0].comment;
          client.query('INSERT INTO "way"."Comments" (id_posts,email_post,email,username,comment,status,foto,total_posts,total_friends,total_thanks,seen,date,jam,menit) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[id,email_post,email,username,comment,"publish",foto,total_posts,total_friends,total_thanks,1,date,jam,menit], (err,commenting) => {
            if(err){
              console.log(err)
            }else{
              let total_comment = komen + 1
              client.query('UPDATE "way"."Posting" SET comment=$1 WHERE id_posts=$2',[total_comment,id],(err)=>{
                if(err){
                  console.log(err)
                }else{
                  res.send(commenting)
                }
              })
            }
          })
        }
      })
    }
  }))
  .catch(e => console.log(e))
});

//api Delete Comment
router.delete("/comment/delete", (req, res) => {
  let email = req.body.email;
  let id = req.body._id;
  let postid = req.body.id_posts;
  client.connect()
    .then( () => client.query('DELETE FROM "way"."Comment" WHERE email = $1 AND id_posts=$2',[email,postid], (err) => {
      if(err){
        console.log(err)
      }else{
        client.query('SELECT * FROM "way"."Comment" WHERE id_posts=$1',[postid],(err,result) =>{
          if(err){
            console.log(err)
          }else{
            let komen = result.rows[0].comment
            let total_comment = komen - 1
            client.query('UPDATE "way"."Posting" SET comment=$2 WHERE id_posts=$1',[postid,total_comment],(err)=>{
              if(err){
                console.log(err)
              }
            })
          }
        })
      }
    }))
    .catch(e => console.log(e))
});


//api notif Comment
router.post("/notif/comment",(req, res) => {
  let email = req.body.email
  let seen = 1
  client.connect()
    .then( () => client.query('SELECT * FROM "way"."Comment" WHERE email_post=$1 AND seen = $2 AND email !=$1',[email,seen], (err,result) => {
      if(err){
        console.log(err)
      }else{
        res.send(result.rowCount)
      }
    }))
    .catch(e => console.log(e))
})

//api notif seen comment
router.put("/notif/comment/seen", (req, res) => {
  let email = req.body.email;
  let seen = 0
  client.connect()
    .then( () => client.query('UPDATE "way"."Comment" SET seen=$2 WHERE email_post=$1',[email,seen], (err,result) => {
      if(err){
        console.log(err)
      }else{
        res.send(result.rows)
      }
    }))
    .catch(e => console.log(e))
});

//api notif Comment Notice
router.post("/notif/comment/notice",(req, res) => {
  let email = req.body.email
    client.connect()
    .then( () => client.query('SELECT * FROM "way"."Comment" WHERE email_post=$1 AND email != $1',[email], (err,result) => {
      if(err){
        console.log(err)
      }else{
        res.send(result.rows)
      }
    }))
    .catch(e => console.log(e))
})

// api user posting
router.post("/posting", upload.single('fotocontent'), (req, res) => {
  let email = req.body.email;
  let content = req.body.content;
  let thanks = 0;
  let tags = req.body.tags;
  let kode_post = req.body.kode_post
  let tanggal = new Date();
  let date = tanggal.toDateString();
  let jam = tanggal.getHours();
  let menit = tanggal.getMinutes();
  client.connect()
    .then( () => client.query(' SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) => {
        if(err){
            console.log(err)
        }else{
            client.query('SELECT * FROM "way"."Posting"', (err,result) => {
              let id = result.rowCount
              let foto = user.rows[0].foto
              let username = user.rows[0].username;
              let posts = user.rows[0].total_posts;
              let total_post = posts + 1;
              if(kode_post == 1){
                let fotocontent = req.file.filename+'.jpg'
                var file = __dirname + "/../../public/posting/foto/" + fotocontent;
                fs.readFile(req.file.path, function (err,data) {
                  fs.writeFile(file, data, function(err) {
                    if(err){
                      console.log(err)
                    }else{
                      let id_post = id + 1
                      client.query('INSERT INTO "way"."Posting" (id_posts,email,username,content,fotocontent,date,jam,menit,thanks,comment,tags,status,foto) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[id_post,email,username,content,fotocontent,date,jam,menit,thanks,0,tags,"publish",foto], (err) => {
                        if(err){
                          console.log(err)
                        }else{
                          client.query('UPDATE "way"."User" SET total_posts =$1 WHERE email=$2',[total_post, email], (err,result) => {
                            if(err){
                              console.log(err)
                            }else{
                              console.log(email, "Membuat Postingan Baru")
                              res.send(result.rows)
                            }
                          })
                        }
                      })
                    }
                  })
                })
              }else{
                let id_post = id + 1
                client.query('INSERT INTO "way"."Posting" (id_posts,email,username,content,fotocontent,date,jam,menit,thanks,comment,tags,status,foto) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[id_post,email,username,content,null,date,jam,menit,thanks,0,tags,"publish",foto], (err) => {
                  if(err){
                    console.log(err)
                  }else{
                    client.query('UPDATE "way"."User" SET total_posts =$1 WHERE email=$2',[total_post, email], (err,result) => {
                      if(err){
                        console.log(err)
                      }else{
                        console.log(email, "Membuat Postingan Baru")
                        res.send(result.rows)
                      }
                    })
                  }
                })
              }
            })
        }
    }))
    .catch(e => console.log(e))
});

//api thank post sendiri
router.put("/posting/thanks/up", (req, res) => {
  let email = req.body.email;
  let id = req.body._id;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Thank" WHERE email=$1 AND idpost=$2',[email,id],(err,result) =>{
    if(err){
      console.log(err)
    }else{
      let thank = result.rowCount
      if(thank == 1){
        client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) => {
          if(err){
            let email_user = result.rows[0].email
            let thanks = result.rows[0].total_thanks
            let count_thanks = thanks - 1
            client.query('UPDATE "way"."User" SET total_thanks=$1 WHERE email=$2',[count_thanks,email_user],(err)=>{
              if(err){
                console.log(err)
              }else{
                client.query('SELECT * FROM "way"."Posting" WHERE email=$1 AND id_posts=$2', [email_user,id],(err,posting)=>{
                  if(err){
                    console.log(err)
                  }else{
                    let myPost = posting.rows[0].thanks - 1
                    client.query('UPDATE "way"."Posting" SET total_thanks=$1 WHERE email=$2 AND id_posts=$3',[myPost,email_user,id], (err,thanked)=>{
                      if(err){
                        console.log(err)
                      }else{
                        let kode = {
                          kode: 0
                        }
                        client.query('DELETE FROM "way"."Thank" WHERE email=$1 AND idpost=$2',[email_user,id], (err)=>{
                          if(err){
                            console.log(err)
                          }else{
                            res.send({thank:thanked, kode:kode});
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }else{
        client.query('SELECT * FROM "way"."User" WHERE email=$1',[email], (err,user) => {
          if(err){
            let email_user = result.rows[0].email
            let thanks = result.rows[0].total_thanks
            let count_thanks = thanks + 1
            client.query('UPDATE "way"."User" SET total_thanks=$1 WHERE email=$2',[count_thanks,email_user],(err)=>{
              if(err){
                console.log(err)
              }else{
                client.query('SELECT * FROM "way"."Posting" WHERE email=$1 AND id_posts=$2', [email_user,id],(err,posting)=>{
                  if(err){
                    console.log(err)
                  }else{
                    let myPost = posting.rows[0].thanks + 1
                    client.query('UPDATE "way"."Posting" SET total_thanks=$1 WHERE email=$2 AND id_posts=$3',[myPost,email_user,id], (err,thanked)=>{
                      if(err){
                        console.log(err)
                      }else{
                        let kode = {
                          kode: 1
                        }
                        client.query('INSERT INTO "way"."Thank" (idpost,email) VALUES ($2,$1)',[email_user,id], (err)=>{
                          if(err){
                            console.log(err)
                          }else{
                            res.send({thank:thanked, kode:kode});
                          }
                        })
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
  }))
  .catch(e => console.log(e))
});

//api thanks post teman
router.put("/posting/thanks/post/user", (req, res) => {
  let email = req.body.email;
  let username = req.body.username
  let id = req.body._id;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Thank" WHERE email=$1 AND idpost=$2',[email,id], (err,result) => {
    if(err){
      console.log(err)
    }else{
      let thank = result.rowCount
      if(thank == 1){
        client.query('SELECT * FROM "way"."User" WHERE username=$1',[username], (err,user) => {
          if(err){
            let email_user = result.rows[0].email
            let thanks = result.rows[0].total_thanks
            let count_thanks = thanks - 1
            client.query('UPDATE "way"."User" SET total_thanks=$1 WHERE email=$2',[count_thanks,email_user],(err)=>{
              if(err){
                console.log(err)
              }else{
                client.query('SELECT * FROM "way"."Posting" WHERE email=$1 AND id_posts=$2', [email_user,id],(err,posting)=>{
                  if(err){
                    console.log(err)
                  }else{
                    let myPost = posting.rows[0].thanks - 1
                    client.query('UPDATE "way"."Posting" SET total_thanks=$1 WHERE email=$2 AND id_posts=$3',[myPost,email_user,id], (err,thanked)=>{
                      if(err){
                        console.log(err)
                      }else{
                        let kode = {
                          kode: 0
                        }
                        client.query('DELETE FROM "way"."Thank" WHERE email=$1 AND idpost=$2',[email_user,id], (err)=>{
                          if(err){
                            console.log(err)
                          }else{
                            res.send({thank:thanked, kode:kode});
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }else{
        client.query('SELECT * FROM "way"."User" WHERE username=$1',[username], (err,user) => {
          if(err){
            let email_user = result.rows[0].email
            let thanks = result.rows[0].total_thanks
            let count_thanks = thanks + 1
            client.query('UPDATE "way"."User" SET total_thanks=$1 WHERE email=$2',[count_thanks,email_user],(err)=>{
              if(err){
                console.log(err)
              }else{
                client.query('SELECT * FROM "way"."Posting" WHERE email=$1 AND id_posts=$2', [email_user,id],(err,posting)=>{
                  if(err){
                    console.log(err)
                  }else{
                    let myPost = posting.rows[0].thanks + 1
                    client.query('UPDATE "way"."Posting" SET total_thanks=$1 WHERE email=$2 AND id_posts=$3',[myPost,email_user,id], (err,thanked)=>{
                      if(err){
                        console.log(err)
                      }else{
                        let kode = {
                          kode: 1
                        }
                        client.query('INSERT INTO "way"."Thank" (idpost,email) VALUES ($2,$1)',[email_user,id], (err)=>{
                          if(err){
                            console.log(err)
                          }else{
                            res.send({thank:thanked, kode:kode});
                          }
                        })
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
  }))
  .catch(e => console.log(e))
});

//api Delete Posting
router.delete("/posting/delete", (req, res) => {
  let email = req.body.email;
  let postid = req.body.id_posts
  client.connect()
  .then( () => client.query('DELETE FROM "way"."Posting" WHERE email=$1 AND id_posts=$2',[email,postid], (err) =>{
    if(err){
      console.log(err)
    }else{
      client.query('DELETE FROM "way"."Comment" WHERE email=$1 AND id_posts=$2', [email,postid],(err)=>{
        if(err){
          console.log(err)
        }
      })
    }
  }))
  .catch(e => console.log(e))
});


//api thank sudah/belum
router.get("/posting/thank", (req, res) => {
  let email = req.body.email;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE email=$1',[email], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
});

//api view posting di profile
router.post("/posting/profile", (req, res) => {
  let email = req.body.email;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE email=$1 ORDER BY id_posts DESC',[email], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
  
});

//api update posting
router.post("/posting/update", (req, res) => {
  let id = req.body.id;
  let content = req.body.content;
  let tags = req.body.tags;
  let kode_post = req.body.kode_post
      if(kode_post == 0){
        client.connect()
        .then( () => client.query('UPDATE "way"."Posting" SET content=$1,tags=$2,fotocontent=$4 WHERE id_posts=$3',[content,tags,id,null], (err,result) =>{
          if(err){
            console.log(err)
          }else{
            res.send(result.rows)
          }
        }))
        .catch(e => console.log(e))
      }else{
        client.connect()
        .then( () => client.query('UPDATE "way"."Posting" SET content=$1,tags=$2 WHERE id_posts=$3',[content,tags,id], (err,result) =>{
          if(err){
            console.log(err)
          }else{
            res.send(result.rows)
          }
        }))
        .catch(e => console.log(e))
      }
});

//api detail posting for update
router.post("/posting/detail", (req, res) => {
  let id = req.body._id;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE id_posts=$1',[id], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting menurut tag
router.post("/posting/tag", (req, res) => {
  let tag = req.body.tag;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC limit 3',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/posting/limit", (req, res) => {
  let tag = req.body.tag;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC limit 3',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Other
router.post("/posting/home/other", (req, res) => {
  let tag = "other"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Qoutes
router.post("/posting/home/quotes", (req, res) => {
  let tag = "quotes"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Computer-gadget
router.post("/posting/home/computer-gadget", (req, res) => {
  let tag = "computer-gadget"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Family-love
router.post("/posting/home/family-love", (req, res) => {
  let tag = "family-love"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Fakta-rumor
router.post("/posting/home/fact-rumour", (req, res) => {
  let tag = "fact-rumour"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Bussiness-work
router.post("/posting/home/bussiness-work", (req, res) => {
  let tag = "business-work"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Fashion-lifestyle
router.post("/posting/home/fashion-lifestyle", (req, res) => {
  let tag = "fashion-lifestyle"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

//api posting Home Riddles
router.post("/posting/home/riddles", (req, res) => {
  let tag = "riddles"
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE tags=$1 ORDER BY id_posts DESC',[tag], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

router.post("/posting/people", (req, res) => {
  let username = req.body.username;
  client.connect()
  .then( () => client.query('SELECT * FROM "way"."Posting" WHERE username=$1 ORDER BY id_posts DESC',[username], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      res.send(result.rows)
    }
  }))
  .catch(e => console.log(e))
});

module.exports = router;