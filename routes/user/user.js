const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt');
const randtoken = require('rand-token')
const User = require('../../model/User')

router.use(bodyParser.urlencoded({
    extended: false
  }))
router.use(bodyParser.json())
router.use(cors())

// main api getter
router.get('/', (req, res) =>{
    res.send('Success Opening Main API...')
})

// api login
router.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    User.findOne({ email }, function (err, user) {
        if(user){
            let token = user.token
            let emailuser = user.email
            let dbpassword = user.password
            var cekpassword = bcrypt.compareSync(password, dbpassword)
                if(cekpassword === true && token != ''){ 
                    console.log(emailuser, 'Telah Login')
                    res.send(user)
                }else{
                    console.log(emailuser, 'Salah Password')
                    res.send('Password Salah')
                }
        }else{
            console.log(email, 'Tidak Ada')
            res.send('Email Tidak Di Temukan')
        }
    });
})

//api register
router.post('/register', (req, res) => {
    let email = req.body.email
    let username = req.body.username
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    const salt = bcrypt.genSaltSync(10);
    let password = bcrypt.hashSync(req.body.password, salt)
    let token = randtoken.generate(10);
    let auth = true
    let akun = {
        email : email,
        username : username,
        first_name : first_name,
        last_name : last_name,
        password : password,
        token : token,
        auth : auth
    }
    var user = new User(akun)
    user.save()
    .then( () => {
        console.log('User Baru Telah Terdaftar',akun)
        res.send(akun);
    })
})

//api get all user
router.get('/user', (req, res) => {
    User.find({}, (err, obj_user) => {
        var userMap = {}
        obj_user.forEach(function(users) {
        userMap[users._id] = users
        })
        res.send(obj_user)
      })
})

router.delete('/clearmongo', function(req, res){
    User.remove(function(err){
      if(err) res.json(err);
        res.send('removed');
    });
 });

router.post('/user/add', function(req, res){
    console.log(req.body)
    var user = new User(req.body)
    user.save()
    .then( () => {
        res.status(200).json({'user': 'added successfully'})
    })
})

module.exports = router