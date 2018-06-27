const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const config = require("config");

const SQLiteStore = require('connect-sqlite3')(session);

const dictManager = require('./app/modules/dict-manager');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Session Database Setup
const sessionStore = new SQLiteStore({
    table: "sessions",
    db: "sessionsDB",
    dir: './data'
});

// Middelware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    privateKey: "",
    secret: config.server.secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// oAuth Setup
require('./app/modules/passport-strategy')(passport);

// Setup Dict Manager
const timeLoadDicts = Date.now();
dictManager.init()
    .then(() =>{
        console.log("Finished loading all Dicts: " + (Date.now() - timeLoadDicts) + " ms");
    });


//Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/redirects_gc_auth'));
app.use('/auth', require('./routes/auth'));
app.use('/api/v1', require('./routes/api_v1'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
