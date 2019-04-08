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
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect("/#/login?token=" + token);
        res.send(token)
    }
);

module.exports = router;