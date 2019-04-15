const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({dest: '/public'});
const fs = require("fs");
const path = require("path");
const Foto = require("../../model/Foto");
const User = require("../../model/User");
const Comment = require("../../model/Comment"); 
const Posting = require("../../model/Posting")
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

//api upload foto avatar
router.post('/upload/avatar', upload.single('avatar'), (req, res) => {
    let email = req.body.email
    if(!req.file){
        console.log("Tidak Jadi Ganti Foto Profil")
    }else{
        let avatar = req.file.filename
        var file = __dirname + "/../../public/avatar/" + avatar +'.jpg';
        fs.readFile( req.file.path, function (err, data) {
            if(err){
                console.log(err)
            }
            fs.writeFile(file, data, function (err) {
             if( err ){
                res.send(err)
             }else{
                      
                
                User.findOneAndUpdate({ email: email }, { $set: { foto: avatar } }, function() {  })
    
                Foto.count({email: email}, (err,user) => {
                    if(user == 1){
                        Foto.findOne({ email: email}, (err,user) => {
                            if(err){
                                console.log("foto Error")
                            }
                            let avatar_lama = user.avatar
                            if( avatar_lama == "default profil 1.png" || avatar_lama == "default profil 2.png" ||avatar_lama == "default profil 3.png" || avatar_lama == "default profil 4.png" || avatar_lama == "default profil 5.png" || avatar_lama == "default profil 6.png" || avatar_lama == "default profil 7.png" || avatar_lama == "default profil 8.png" ){
                            let email_user = user.email
                            Foto.findOneAndUpdate({ email: email_user }, { $set: { avatar: avatar } }, function() {
                               res.send('ok')
                            }).then(() => {
                                User.findOne({email: email}, (err, mine) => {
                                let username = mine.username
                                let fotos = mine.foto
                                Comment.updateMany({username: username}, {$set: {foto: fotos}}, function(err, comments) {
                                    Posting.updateMany({username: username}, {$set: {foto: fotos}}, function(err, hasil) {
                                        console.log('foto koment & posting ganti: ', hasil)
                                        })
                                    })
                                })
                            })
                            }else{
                            fs.unlink( __dirname + "/../../public/avatar/" + avatar_lama +'.jpg')}
                        }).then( (user) => {
                            let email_user = user.email
                            Foto.findOneAndUpdate({ email: email_user }, { $set: { avatar: avatar } }, function() {
                               console.log(email_user , 'Mengganti Foto Avatar')
                            })
                        }).then(() => {
                            User.findOne({email: email}, (err, mine) => {
                            if(err){
                                console.log(err)
                            }else{
                                let username = mine.username
                            let fotos = mine.foto
                            Comment.updateMany({username: username}, {$set: {foto: fotos}}, function(err, comments) {
                                Posting.updateMany({username: username}, {$set: {foto: fotos}}, function(err, hasil) {
                                    console.log('foto koment & posting ganti: ', hasil)
                                    })
                                })
                            }
                            })
                        })
                    }else{
                        let foto_avatar = {
                            email: email,
                            avatar: avatar
                        }
                        var foto = new Foto(foto_avatar)
                        foto.save()
                        .then(() => {
                            console.log(foto_avatar)
                        })
                    }
                })
              }
            });
        });
    }
});


//api menampilkan avatar user di profile
router.post("/user/avatar", (req, res) => {
    let email = req.body.email
    Foto.count({email: email}, (err,user) => {
        if(user == 1){
            Foto.findOne({email: email},(err,user) => {
                let avatar = user.avatar
                res.send(avatar)
            })
        }else{
            let avatar = 'koala.jpg'
            res.send(avatar)
        }
    })
});

//api menampilkan schema foto
router.get("/foto", (req, res) => {
    Foto.find({}, (err, obj_user) => {
      res.send(obj_user);
    });
});

//api hapus schema foto
router.delete("/clearfoto", function(req, res) {
    Foto.remove(function(err) {
      if (err) res.json(err);
      res.send("removed");
    });
  });

module.exports = router;