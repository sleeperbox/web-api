const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
//const User = require('./model/User')

router.use(bodyParser.urlencoded({
    extended: false
  }))
router.use(bodyParser.json())
router.use(cors())

// main api getter
router.get('/', function(req, res){
    res.send('Success Opening Main API...')
})

// api login
/*router.post('/login', function(req, res){
    User.find({}, (err, obj_user) => {
        var userMap = {}
        userMap[username] = users
        res.send(users)
      })
})*/

module.exports = router