const express = require('express');
const router = express.Router();
const passport = require('passport');
const url = require("event-stream");


router.get('/token', function (req, res) {
   if(!req.isAuthenticated()){
       return res.status(401).send({
           status: 401,
           message: "Not Authorized."
       });
   }

   res.status(200).send({
       PrivateKey: req.session.privateKey,
       Token: req.user.accessToken
   });
});

router.post('/keys', function (req, res) {
    let body = [];
    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        if (body){
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);

            req.session.privateKey = body.private_key;
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });
});

router.get('/gc', function(req, res, next) {
    passport.authenticate('oauth2', {
        scope: ["exc", "perm:r","rec:r","rec:w", "attachment:r","attachment:w", "user:r", "user:q"],
        public_key: req.query.public_key
    })(req, res);
});

router.get('/gc/callback', passport.authenticate('oauth2', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect("/");
    });

module.exports = router;
