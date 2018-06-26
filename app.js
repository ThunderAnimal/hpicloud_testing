const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require("config");

const dictManager = require('./app/modules/dict-manager');
const treeTager = require("./app/modules/tree-tagger");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup Dict Manager
const timeLoadDicts = Date.now();
dictManager.init()
    .then(() =>{
        console.log("Finished loading all Dicts: " + (Date.now() - timeLoadDicts) + " ms");
    });



// Passport Setup
passport.use(new OAuth2Strategy({
        authorizationURL: config.oauth.gesundheitscloud.authorizationURL,
        tokenURL: config.oauth.gesundheitscloud.tokenURL,
        clientID: config.oauth.gesundheitscloud.client_id,
        clientSecret: config.oauth.gesundheitscloud.client_secret,
        callbackURL: config.oauth.gesundheitscloud.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return cb(null, profile);
       /* User.findOrCreate({ exampleId: profile.id }, function (err, user) {
            return cb(err, user);
        });*/
    }
));

OAuth2Strategy.prototype.authorizationParams = function(options) {
    return { public_key: options.public_key }
};

app.get('/auth/gc', function(req, res, next) {
    passport.authenticate('oauth2', {
        scope: ["exc", "perm:r","rec:r","rec:w", "attachment:r","attachment:w", "user:r", "user:q"],
        public_key: req.query.public_key
    })(req, res);
});


app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/tag', function (req, res, next) {
    const text = req.query.text;
    treeTager.tagText(text, (result) =>{
        res.send(result);

        //TODO check in Dicta
    })
});

app.get('/auth/gc', passport.authenticate('oauth2'));

app.get('/auth/gc/callback',  passport.authenticate('oauth2', { failureRedirect: '/' }),
    function(req, res){
        console.log(req.user);
        res.redirect("/");
    });

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
