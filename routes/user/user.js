const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt');
const randtoken = require('rand-token')
const User = require('../../model/User')
const Friend = require('../../model/Friend')

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

//api get all friend
router.post('/friend', (req, res) => {
    let email = req.body.email
    Friend.find({ email }, (err, obj_user) => {
        var userMap = {}
        obj_user.forEach(function(users) {
        userMap[users._id] = users
        })
        if(obj_user){
        res.send(obj_user)
        }else{
            res.send(err)
        }
      })
})

//api add friend
router.post('/addfriend', (req, res) => {
    let email = req.body.email
    let email_add = req.body.email_add
    let teman = {
        email : email,
        email_friend : email_add,
        status : "pending"
    }
    var friend = new Friend(teman)
    friend.save()
    .then( teman  => {
        console.log(email_add, 'Di Tambahkan teman oleh' ,email)
        res.send(teman)
    })
})

//api notif add
router.post('/add/friend', (req, res) => {
    let email_friend = req.body.email
    let status = 'pending'
    Friend.find({ email_friend } && { status }, (err, obj_user) => {
        var userMap = {}
        obj_user.forEach(function(users) {
        userMap[users._id] = users
        })
        res.send(obj_user)
      })
})

//api get status friend
router.post('/addfriend/status', (req, res) => {
    let email = req.body.email
    Friend.findOne({ email }, (err, obj_user) => {
        if(obj_user){
            let email_friend = obj_user.email_friend
            let status = obj_user.status
            let friend = {
                email_friend : email_friend,
                status : status
            }
            console.log(email_friend, 'Status', status)                
            res.send(friend)
        }else{
            res.send(err)
        }
    })
})

//api confirm friend
router.post('/confirm/friend', (req, res) => {
    let email = req.body.email
    let email_friend = req.body.email_add
    let status = 'confirm'
    let teman = {
        email : email,
        email_friend : email_friend,
        status : "confirm"
    }
    var friend = new Friend(teman)
    friend.save()
    Friend.findOneAndUpdate(email, email_friend, {status}, () => {
        let teman = {
            email : email_friend,
            email_friend : email,
            status : "confirm"
        }
        var friend = new Friend(teman)
        friend.save()
        .then( user => {
            console.log(email, 'Telah Berteman Dengan', email_friend)
            res.send(user)
        })
    })
})

//api search people
router.post('/search/people', (req, res) =>{
    let email = req.body.email
    User.find({ email : { "$ne" : email}}, (err, obj_user) => {
        console.log(email, 'Searching People') 
        if(obj_user){
            res.send(obj_user)
        }else{
            res.send(err)
        }
    })
})

router.post('/user/add', function(req, res){
    console.log(req.body)
    var user = new User(req.body)
    user.save()
    .then( () => {
        res.status(200).json({'user': 'added successfully'})
    })
})

module.exports = router