const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/gctoken', function (req, res) {
   if(!req.isAuthenticated()){
       return res.status(404).send({
           status: 404,
           message: "Not Authorized."
       });
   }

   res.status(200).send({
       private_key: req.session.privateKey,
       token: req.user.accessToken
   });
});

router.post('/gckeys', function (req, res) {
    if(req.body){
        req.session.privateKey = req.body.private_key;
        res.sendStatus(200);
        return;
    }
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

router.get('/gclogin', function(req, res, next) {
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
