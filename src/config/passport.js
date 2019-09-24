const passport = require('passport'); //Module passport
const LocalStrategy = require('passport-local').Strategy; //Authenticación local

const User = require('../models/User');

//Sending data backend. Authenticar el usuario.
passport.use(new LocalStrategy({
    usernameField: 'email' //Atravez de que se va autenticar
}, async (email, password, done) => {
   const user = await User.findOne({email: email});
   if (!user) {
      return done(null, false, {message: 'Not User Found'});
   } else {
        const match = await user.matchPasswords(password);
        if(match){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect Pasword'});
        }
   }
}));

//Storage user in a Session
//Prevents the user from being requested to login
passport.serializeUser((user, done) => {
    done(null, user.id);
})

//Take an id and generate a user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
});


/**
 * done(null, false, {message: 'Not User Found'});
 * null=> return an error or has not had an error 
 * false => there isn't any user
 * return done(null, user);
 * null=> return an error
 * user=> return an usuario
 */