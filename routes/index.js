const express = require('express');
const router = express.Router();

const path = require('path');
const appRoot = require('app-root-path');

//ANGULAR CLIENT
router.get('/client', function (req, res, next) {
    res.sendFile(path.join(appRoot.path, '/views/index.html'));
});

//TEST
router.get('/test', function (req, res, next) {
    res.sendFile(path.join(appRoot.path, '/views/test.html'));
});

module.exports = router;