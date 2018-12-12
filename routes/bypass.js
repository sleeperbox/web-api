const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(bodyParser.urlencoded({
    extended: false
  }))
router.use(bodyParser.json())
router.use(cors())

// main api getter
router.get('/status', function(req, res){
    res.send({
       auth: true,
       token: "abc" 
    })
})

module.exports = router