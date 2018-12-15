const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const Friend = require('../../model/Friend')
const User = require('../../model/User')

router.use(bodyParser.urlencoded({
    extended: false
  }))
router.use(bodyParser.json())
router.use(cors())

//api get all friend
router.post('/myfriend', (req, res) => {
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
    let email_friend = req.body.email_friend
    let teman = {
        email : email,
        email_friend : email_friend,
        status : "pending"
    }
    var friend = new Friend(teman)
    friend.save()
    .then( teman  => {
        console.log(email_friend, 'Di Tambahkan teman oleh' ,email)
        res.send(teman)
    })
})

//bypass frind request to null
router.get('/clearfriendstatus', (req, res) => {
    Friend.updateMany(
        { status: "" }
     ).then(res.send('updated.'));
})

//api notif add
router.post('/friend/notif', (req, res) => {
    let email_friend = req.body.email
    let status = 'pending'
    Friend.find({ email_friend : email_friend, status : status }, (err, obj_user) => {
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

//friend status pending
router.post('/friend/status/pending', (req, res) => {
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

//status == friend
router.post('/friend/status/confirm', (req, res) => {
    let email = req.body.email
    let status = 'confirm'
    Friend.find({ email } && {status}, (err, obj_user) => {
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

//api confirm friend
router.put('/friend/confirm', (req, res) => {
    var email = req.body.email
    var email_friend = req.body.email_friend
    let status = 'confirm'
    let teman = {
        email : email,
        email_friend : email_friend,
        status : "confirm"
    }
    var friend = new Friend(teman)
    friend.save()
    Friend.findOneAndUpdate({ email, email_friend }, { status : status }, () => {
        let new_teman = {
            email : email_friend,
            email_friend : email,
            status : "confirm"
        }
        var friend = new Friend(new_teman)
        friend.save()
        .then( user => {
            console.log(email, 'Telah Berteman Dengan', email_friend)
            res.send(user)
        })
    })
})

//api cancel req
router.delete('/friend/cancel', (req, res) => {
    let email = req.body.email
    let email_friend = req.body.email_friend
    Friend.findOneAndRemove({ email : email, email_friend : email_friend}, () => {
        console.log(email, 'Membatalkan Permintaan Pertemanan kepada', email_friend)
        res.send('Membatalkan Permintaan Pertemanan kepada')
    })
})

//api unfriend
router.delete('/unfriend', (req, res) => {
    let email = req.body.email
    let email_friend = req.body.email_friend
    let status = 'confirm'
    Friend.findOneAndRemove({ email : email, email_friend : email_friend, status : status}, () => {
        console.log(email, 'Membatalkan Pertemanan kepada', email_friend)
    })
    .then( () => {
        Friend.findOneAndRemove({ email : email_friend, email_friend : email, status : status}, () =>{
            res.send('Membatalkan Pertemanan')
            })
    })
})

//api search people
router.post('/friend', (req, res) =>{
    let email = req.body.email
    let status_pending = 'pending'
    let status_teman = 'confirm'
    let a
    Friend.find({ email : email, status : status_pending || status_teman }, (err,teman) => {
        if(teman){ 
            for(let i=0; i < teman.length; i++ ){
                a = teman[i].email_friend
                console.log(a)
            }
                
                User.find({ email : { "$nin" : [ email, a ] } }, (err, obj_user) => {
                if(obj_user){
                    console.log(a)
                    res.send(obj_user)
                }else{
                    console.log(email, 'Mencari Teman Error')
                    res.send(err)
                }
            })
        }else{
            User.find({ email : { "$ne" : email} }, (err, obj_user) => { 
                if(obj_user){
                    console.log(email, 'Mencari Teman baru')
                    res.send(obj_user)
                }else{
                    console.log(email, 'Mencari Teman Error')
                    res.send(err)
                }
            })
        }
    })
})

module.exports = router