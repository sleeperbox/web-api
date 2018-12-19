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
router.get('/', (req, res) =>{
    res.send('Success Opening Main API...')
})

//api tags
router.get('/tags', (req, res) =>{
    var tags = [
        {
            text : 'Pilih Kategori',
            value  : 'null'
        },
        {
            text : 'Komputer & Gadget',
            value  : 'computer-gadget'
        },
        {
            text : 'Keluarga & Asmara',
            value  : 'family-love'
        },
        {
            text : 'Fakta & Rumor',
            value  : 'fact-rumour'
        },
        {
            text : 'Bisnis & Pekerjaan',
            value  : 'business-work'
        },
        {
            text : 'Fashion & Gaya Hidup',
            value  : 'fashion-lifestyle'
        },
        {
            text : 'Quotes',
            value  : 'quotes'
        },
        {
            text : 'Riddles',
            value  : 'riddles'
        },
        {
            text : 'Lainya',
            value  : 'other'
        }
    ]
    res.send(tags)
})

module.exports = router