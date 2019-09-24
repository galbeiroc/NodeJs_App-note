const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',  //Correct pass and user redicrec
    failureRedirect: '/users/signin',  //Incorrect pass or user
    failureFlash: true  //Sending msg flash
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/users/signup', async (req, res) =>{
    //console.log(req.body);
    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if(name.length <= 0) {
        errors.push({text: 'Please Insert a Name'});
    }

    if (password != confirm_password) {
        errors.push({text: 'Passwords do not match'});
    }

    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if(errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else {
        //console.log(req.body);
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('errors_msg', 'The Email is already in use');
            res.redirect('/users/signup');
        }

        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password); //Save password encrypt
        await newUser.save();
        req.flash('success_msg', 'You are registered')
        res.redirect('/users/signin');
    }
    
})

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;