const router = require("express").Router();
const controller = require("../controllers/googleController");

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://www.example.com/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//         console.log(accessToken, 'accesToken')
//         console.log(refreshToken, 'refreshToken')
//         console.log(profile, 'profile')

//     }
// ));

router.get('/oauth2callback', controller.getOauthCallback);


module.exports = router;