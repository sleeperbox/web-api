const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(cors());

/* GET Google Authentication API. */
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect("http://localhost:3000/#/login?token=" + token);
        res.send(token)
    }
);

module.exports = router;