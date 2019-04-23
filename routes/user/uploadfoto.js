const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
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

//api upload foto avatar
router.post('/upload/avatar', upload.single('avatar'), (req, res) => {
    let email = req.body.email
    if(!req.file){
        console.log("Tidak Jadi Ganti Foto Profil")
    }else{
        let avatar = req.file.filename+'.jpg'
        var file = __dirname + "/../../public/avatar/" + avatar;
        fs.readFile( req.file.path, function (err, data) {
            if(err){
                console.log(err)
            }
            fs.writeFile(file, data, function (err) {
             if( err ){
                res.send(err)
             }else{
                client.connect()
                .then( () => client.query(' UPDATE "way"."User" SET foto = $1 WHERE email = $2', [avatar,email],(err) =>{
                    if(err){
                        console.log(err)
                    }
                }))
                .then( () => client.query(' SELECT * FROM "way"."Foto" WHERE email=$1',[email], (err,result) => {
                    if(err){
                        console.log(err)
                    }else{
                        let count = result.rowCount
                        if( count === 1){
                            let avatar_lama = result.rows[0].avatar
                            if( avatar_lama == "default profil 1.png" || avatar_lama == "default profil 2.png" ||avatar_lama == "default profil 3.png" || avatar_lama == "default profil 4.png" || avatar_lama == "default profil 5.png" || avatar_lama == "default profil 6.png" || avatar_lama == "default profil 7.png" || avatar_lama == "default profil 8.png"){
                                client.query(' UPDATE "way"."Foto" SET avatar = $1 WHERE email = $2',[avatar,email], (err) => {
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log(email, "Mengganti Foto Profile")
                                        client.query(' SELECT * FROM "way"."User" WHERE email = $1', [email], (err, result) => {
                                            if(err){
                                                console.log(err)
                                            }else{
                                                let username = result.rows[0].username
                                                client.query(' UPDATE "way"."Comment" SET foto=$1 WHERE username=$2',[avatar,username], (err) => {
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        client.query(' UPDATE "way"."Posting" SET foto=$1 WHERE username=$2',[avatar,username],(err) => {
                                                            if(err){
                                                                console.log(err)
                                                            }else{
                                                                client.query('SELECT * FROM "way"."User" WHERE email=$1',[email],(err,result) => {
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        res.send(result.rows)
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
                                fs.unlink(__dirname + "/../../public/avatar/" + avatar_lama)
                                client.query(' UPDATE "way"."Foto" SET avatar = $1 WHERE email = $2',[avatar,email], (err) => {
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log(email, "Mengganti Foto Profile")
                                        client.query(' SELECT * FROM "way"."User" WHERE email = $1', [email], (err, result) => {
                                            if(err){
                                                console.log(err)
                                            }else{
                                                let username = result.rows[0].username
                                                client.query(' UPDATE "way"."Comment" SET foto=$1 WHERE username=$2',[avatar,username], (err) => {
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        client.query(' UPDATE "way"."Posting" SET foto=$1 WHERE username=$2',[avatar,username],(err) => {
                                                            if(err){
                                                                console.log(err)
                                                            }else{
                                                                client.query('SELECT * FROM "way"."User" WHERE email=$1',[email],(err,result) => {
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        res.send(result.rows)
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
                    }
                }))
                .catch(e => console.log(e))
              }
            });
        });
    }
});

//api menampilkan avatar user di profile
router.post("/user/avatar", (req, res) => {
    let email = req.body.email
    client.connect()
    .then( () => client.query(' SELECT * FROM "way"."Foto" WHERE email = $1', [email], (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result.rows)
        }
    }))
    .catch(e => console.log(e))
});

//api menampilkan schema foto
router.get("/foto", (req, res) => {
    client.connect()
    .then( () => client.query(' SELECT * FROM "way"."Foto"'), (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result.rows)
        }
    })
    .catch(e => console.log(e))
});

module.exports = router;