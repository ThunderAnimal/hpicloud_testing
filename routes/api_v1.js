const express = require('express');
const router = express.Router();

const dictManager = require('../app/modules/dict-manager');
const treeTager = require("../app/modules/tree-tagger");


router.get('/tag', function (req, res, next) {
    const text = req.query.text;
    treeTager.tagText(text, (result) =>{
        res.send(result);

        //TODO check in Dicta
    })
});

module.exports = router;