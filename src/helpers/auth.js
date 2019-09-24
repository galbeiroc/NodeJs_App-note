const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {  //Method Passport
        return next(); 
    }
    req.flash('errors_msg', 'Not Authorized');
    res.redirect('/users/signin');
}

module.exports = helpers;