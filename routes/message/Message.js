const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const randtoken = require("rand-token");
const User = require("../../model/User");
const Message = require("../../model/Message");
const ListMessage = require("../../model/ListMessage");

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

router.get("/list",(req, res) => {
    ListMessage.find({}, (q,a) => {
        res.send(a)
    })
})
//Api Message
router.post("/list/message",(req, res) => {
    let email = req.body.email
    User.findOne({email : email}, (err, user) => {
        let username_user2 = user.username
        ListMessage.find({$or: [{username_user1: username_user2},{ username_user2: username_user2}]}).sort({ _id: -1}).exec(function(err,list){
            res.send(list)
        })
    })
})

//Api Send Message
router.post("/send/message",(req, res) => {
    let email = req.body.email
    let username_user2 = req.body.username_user2
    let message = req.body.message
    let date = new Date();
    let tgl = date.toDateString();
    let jam = date.getHours();
    let menit = date.getMinutes();
    let token = randtoken.generate(10);
    User.findOne({email : email}, (err, user) => {
        let username_user1 = user.username
        let name_user1 = user.first_name + " " + user.last_name
        Message.findOne(
            { $or: [{username_user1: username_user1,username_user2: username_user2},{username_user1: username_user2,username_user2: username_user1}]}, (err, results) => {
            if(results == null){
                User.findOne({username : username_user2}, (err, user_received) => {
                let name_user2 = user_received.first_name + " " + user_received.last_name
                let pesan = {
                    kode_chat : token,
                    username_user1 : username_user1,
                    name_user1 : name_user1,
                    username_user2 : username_user2,
                    name_user2 : name_user2,
                    message : message,
                    date : jam + ":" + menit + "," + tgl,
                    status: "Send"
                }
                    var send = new Message(pesan)
                    var send2 = new ListMessage(pesan)
                    send.save()
                    send2.save()
                    res.send(pesan)
                })
            }else{
                let _id = results
                User.findOne({username : username_user2}, (err, user_received) => {
                    let name_user2 = user_received.first_name + " " + user_received.last_name
                    Message.findOne({ _id : _id}, (err,result) => {
                        let kode_chat = result.kode_chat
                        ListMessage.deleteMany({ kode_chat: kode_chat}).then( () => {
                            let pesan = {
                                kode_chat : kode_chat,
                                username_user1 : username_user1,
                                name_user1 : name_user1,
                                username_user2 : username_user2,
                                name_user2 : name_user2,
                                message : message,
                                date : jam + ":" + menit + "," + tgl,
                                status: "Send"
                            }
                                var send = new Message(pesan)
                                send.save()
                                var send2 = new ListMessage(pesan)
                                send2.save()
                                res.send(pesan)
                            })
                        })
                          
                    })
            }
        })
    })    
})

//Api Detail Message
router.post("/detail/message",(req, res) => {
    let email = req.body.email
    let username_user1 = req.body.username_user1
    User.findOne({email : email}, (err, user) => {
        let username_user2 = user.username
        Message.findOne(
            { $or: [{username_user1: username_user1,username_user2: username_user2},{username_user1: username_user2,username_user2: username_user1}] }, (err, pesan) =>{
            if(!pesan){
                null
            }else{
            let kode = pesan.kode_chat
                Message.find({kode_chat : kode}, (err,message) => {
                    res.send(message)
                })
            }
        })
    })
})

//Api Notif Message
router.post("/notif/message",(req, res) => {
    let email = req.body.email
    User.findOne({email : email}, (err,user) => {
        let username = user.username
        Message.count({ username_user2: username,status: "Send"}, (err,message) => {
            res.send(""+message)
        })
    })
})

//Api Read Message
router.post("/read/message",(req, res) => {
    let username_user1 = req.body.username_user1
    let email = req.body.email
    User.findOne({email: email}, (err,user) => {
        let username_user2 = user.username
        Message.updateMany({username_user1: username_user1,username_user2: username_user2}, {$set: {status: "Read"}}, function() {
            console.log(username_user2 + "Sedang Membaca Pesan dari" + username_user2)
        })
    })
})

//Api Read Message
router.post("/message/head",(req, res) => {
    let username = req.body.username
    User.findOne({username: username}, (err,user) => {
        res.send(user)
    })
})

module.exports = router;
