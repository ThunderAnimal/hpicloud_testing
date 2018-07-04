const express = require('express');
const router = express.Router();
const passport = require('passport');

const path = require('path');
const appRoot = require('app-root-path');


const socketManager = require('../app/modules/socket-manager');

router.get('/gctoken', function (req, res) {
    if (!req.isAuthenticated()) {
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
    if (req.body) {
        req.session.privateKey = req.body.private_key;
        res.sendStatus(200);
        return;
    }
    let body = [];
    req.on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        if (body) {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);

            req.session.privateKey = body.private_key;
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });
});

router.get('/gclogin', function (req, res, next) {
    const session = req.session;

    if (req.query.websocket_id) {
        session.websocket = req.query.websocket_id;
    }
    passport.authenticate('oauth2', {
        scope: ["exc", "perm:r", "rec:r", "rec:w", "attachment:r", "attachment:w", "user:r", "user:q"],
        public_key: req.query.public_key
    })(req, res);
});

router.get('/gc/callback', passport.authenticate('oauth2', {failureRedirect: '/'}),
    function (req, res) {
        const socket = socketManager.getClient(req.session.websocket);
        req.session.websocket = "";

        const success = function (socket, user) {
            if (socket) {
                socket.emit('login', {login: true, token: user.accessToken});
            }
            res.redirect('/auth/success');
        };
        const error = function (socket) {
            if (socket) {
                socket.emit('login', {login: false, token: null});
            }
            res.redirect('/auth/error');
        };

        if (socket) {
            if (req.user) {
                success(socket, req.user)
            } else {
                error(socket);
            }
        } else {
            res.redirect("/");
        }

    });

//Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.session.regenerate((err) => {
        res.sendStatus(200);
    });
});

router.get("/success", function (req, res) {
    res.sendFile(path.join(appRoot.path, 'views/login_success.html'));
});
router.get("/error", function (req, res) {
    res.sendFile(path.join(appRoot.path, 'views/login_error.html'));
});

module.exports = router;
