const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const Posting = require('../../model/Posting')
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

//api clear tabel posting
router.delete('/clearposting', function(req, res){
    Posting.remove(function(err){
      if(err) res.json(err);
        res.send('removed');
    });
 });

// api user posting
router.post('/posting', (req, res) => {
    let email = req.body.email
    let content = req.body.content
    let like = 0
    let tags = req.body.tags
    let tanggal = new Date()
    let date = tanggal.toDateString()
    let jam = tanggal.getHours()
    let menit = tanggal.getMinutes()
    User.findOne( { email : email}, (err,user) => {
        Posting.count({}, (err,postingan) => {
            let id = postingan
            let username = user.username
            let posts = user.total_posts
            let total_post
            posts === 0 ? total_post = 1 : total_post = posts + 1
            let id_post = id + 1
            let post = {
                id_posts : id_post,
                email : email,
                username : username,
                content : content,
                date : date,
                jam : jam,
                menit : menit,
                thanks : like,
                tags : tags,
                status : 'publish'
            }
            let posting = new Posting(post)
            posting.save()
            console.log(email, 'Membuat Postingan baru')
            res.send(posting)

            User.findOneAndUpdate( {email : email}, { $set : { total_posts : total_post } }, (err, posts) => {
                console.log(posts)
            })
        })
    }) 
})

//api view posting di profile
router.post('/posting/profile', (req, res) =>{
    let email = req.body.email
    Posting.find({ email : email}, (err, posting) => {
        res.send(posting)
        console.log(email, 'melihat posting di profile')
    })
})

//api posting menurut tag
router.post('/posting/tag', (req, res) =>{
    let tag = req.body.tag
    Posting.find({ tags : tag}, (err, posting) => {
        res.send(posting)
        console.log(tag, 'melihat posting di profile')
    })
})

module.exports = router