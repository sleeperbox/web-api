const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("../../model/User");
const Ranking = require("../../model/Ranking");
const Foto = require("../../model/Foto");
const Friend = require("../../model/Friend");
const Message = require("../../model/Message");
const Picture = require("../../model/Picture");
const Posting = require("../../model/Posting");
const Thanks = require("../../model/Thanks");
const Rank = require("../../model/Rank");
const SeacrhPeople = require("../../model/SearchPeople");
const Comments = require("../../model/Comment")

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

//api Hapus Kabeh
router.delete("/clear/data", function(req, res) {
    User.deleteMany({}, () => {
        Foto.deleteMany({}, () => {
            Friend.deleteMany({}, () => {
                Message.deleteMany({}, () => {
                    Picture.deleteMany({}, () => {
                        Posting.deleteMany({}, () => {
                            Rank.deleteMany({}, () => {
                                Ranking.deleteMany({}, () => {
                                    SeacrhPeople.deleteMany({}, () => {
                                        Thanks.deleteMany({}, () => {
                                            Message.deleteMany({}, () => {
                                              Comments.deleteMany({}, () => {
                                                res.send("Remove")
                                              })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
  });
  

module.exports = router