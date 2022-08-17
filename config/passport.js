const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = passport => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        }, 
        async ( accessToken, refreshToken, profile, cb) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }
            try{
                // console.log(profile)
                let user = await User.findOne({ googleId: profile.id})
                if (user) {
                    cb(null, user)
                } else {
                    user = await User.create(newUser)
                    cb(null, user)
                }
            } catch (err) {
                console.error(err)
            }
    }))

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
          cb(null, {
            id: user.id,
            name: user.firstName,
            picture: user.image
          });
        });
        // console.log(user)
    });
      
    passport.deserializeUser((user, cb) => {
        process.nextTick(() => cb(null, user));
    });
}