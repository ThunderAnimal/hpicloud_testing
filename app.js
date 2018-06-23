const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

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
// passport.use(new OAuth2Strategy({
//         authorizationURL: 'https://staging.hpihc.de/ouath/authorize',
//         tokenURL: 'https://staging.hpihc.de/ouath/token',
//         clientID: "tmcc-aid-local",
//         // clientSecret: EXAMPLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/gc/callback"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//         console.log(profile);
//         return cb(err, profile);
//        /* User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });*/
//     }
// ));

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

// app.get('/auth/gc', passport.authenticate('oauth2'));
//
// app.get('/auth/gc/callback',  passport.authenticate('oauth2', { failureRedirect: '/login' }),
//     function(req, res){
//         console.log(req.user)
//     });

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
