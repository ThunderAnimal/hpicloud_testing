const express = require('express');
const router = express.Router();

const path = require('path');
const appRoot = require('app-root-path');

//TEST
router.get('/', function (req, res, next) {
    res.sendFile(path.join(appRoot.path, '/views/index.html'));
});

module.exports = router;