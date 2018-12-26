const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({dest: '/public'});
const fs = require("fs");
const path = require("path");
const Foto = require("../../model/Foto");

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
    let avatar = req.file.originalname
    var file = __dirname + "/../../public/avatar/" + req.file.originalname;
    fs.readFile( req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
            res.send(err)
         }else{
            Foto.count({email: email}, (err,user) => {
                if(user == 1){
                    Foto.findOne({email: email}, (err,foto) => {
                        let avatar_lama = foto.avatar
                        fs.unlink(__dirname + '/../../public/avatar/' + avatar_lama)
                    })
                    .then( () => {
                        Foto.findOneAndUpdate({ email: email }, { $set: { avatar: avatar } }, function() {
                            res.send('Mengganti foto avatar')
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
                        res.send('Mengganti foto avatar')
                    })
                }
            })
          }
       });
   });
});

//api menampilkan avatar user di profile
router.get("/avatar", (req, res) => {
    let email = req.body.email
    Foto.findOne({email: email},(err,user) => {
        let avatar = user.avatar
        res.sendFile(path.join(__dirname + "/../../public/avatar/" + avatar));
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