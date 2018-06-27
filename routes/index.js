const express = require('express');
const router = express.Router();

const path = require('path');
const appRoot = require('app-root-path');

//INDEX
router.get('/', function (req, res, next) {
    res.sendFile(path.join(appRoot.path, '/views/index.html'));
});

//TEST
router.get('/test', function (req, res, next) {
    console.log(req.isAuthenticated());
    console.log(req.sessionID);
    req.session.private_key = "test";
    res.sendFile(path.join(appRoot.path, '/views/index.html'));
});

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.session.regenerate((err) =>{
        res.redirect('/');
    });
});

module.exports = router;