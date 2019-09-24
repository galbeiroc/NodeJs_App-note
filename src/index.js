const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash'); //for sending msg between views
const passport = require('passport');

//Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3200);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), 
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
})); //Config templates
app.set('view engine', '.hbs'); //use engine of the views


//Middleware
app.use(express.urlencoded({extended: false})); //Sirve para cuando un formulario pueda enterder los datos. extended acepta img 
app.use(methodOverride('_method'));
app.use(session({
    secret: 'myseceretapp',
    resave: true,
    saveUninitialized: true
})); //Permite autenticar al usuario
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req, res, next) => { //storage msg
    res.locals.success_msg = req.flash('success_msg'); //storage msg success
    res.locals.errors_msg = req.flash('errors_msg'); //storage msg errors
    res.locals.error = req.flash('error'); //flash error passport
    res.locals.user = req.user || null; //req save a variable user

    next(); //continue next code
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})
