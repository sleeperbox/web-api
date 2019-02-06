const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  router.use(bodyParser.json());
  router.use(cors());
  
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser(function(user, done) {
 done(null, user);
});

passport.deserializeUser(function(user, done) {
 done(null, user);
});

passport.use(
 new GoogleStrategy(
  {
   clientID: "340227293512-d0leco3q042kobdvpb3ssdutthf0qbk5.apps.googleusercontent.com",
   clientSecret: "hTWVkTdVpwVaUcpgljcRQDjX",
   callbackURL: "http://localhost:8080/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   var userData = {
    email: profile.emails[0].value,
    name: profile.displayName,
    token: accessToken
   };
   done(null, userData);
  }
 )
);