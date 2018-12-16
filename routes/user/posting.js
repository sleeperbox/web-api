const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const Posting = require('../../model/Posting')

router.use(bodyParser.urlencoded({
    extended: false
  }))
router.use(bodyParser.json())
router.use(cors())

// main api getter
router.get('/', (req, res) =>{
    res.send('Success Opening Main API...')
})

// api user posting
router.post('/posting', (req, res) => {
    let email = req.body.email
    let username = req.body.username
    let content = req.body.content
    let like = 0
    let status = 'publish'
    let tanggal = new Date()
    let date = tanggal.toString
    let posting = {
        email : email,
        username : username,
        content : content,
        date : date,
        like : like,
        status : status
    }
    posting = new Posting(posting)
    posting.save()
    .then( (posting) => {
        console.log(email, 'Membuat Postingan baru')
        res.send(posting)
    })
})

module.exports = router