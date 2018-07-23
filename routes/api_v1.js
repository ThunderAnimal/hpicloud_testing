const express = require('express');
const tagHelper = require('../app/modules/tag-helper');
const analyzerEmotion = require('../app/modules/emotion-analyzer');

module.exports = function(dictManager, cryptoManager){
    const router = express.Router();

    const treeTager = require("../app/modules/tree-tagger");
    const emotionTagger = require("../app/modules/emotion-tagger")(dictManager);
    const SAAnalyzer = require("../app/modules/sa-analyzer")(dictManager);

    router.get('/tag', function (req, res, next) {
        const text = req.query.text;

        treeTager.tagText(text, (treeTaggerResult) =>{
            const filterListForEmotion = tagHelper.filterListForEmotionalAnalyse(treeTaggerResult);
            emotionTagger.tagAll(filterListForEmotion)
                .then((emotionTaggerResult) => {
                    const analyzeResult = analyzerEmotion.analyseTaggedText(emotionTaggerResult, tagHelper.countWords(treeTaggerResult));
                    res.send({
                        tagged: treeTaggerResult,
                        result: analyzeResult
                    });
                });
        });
    });

    router.get('/key', function (req, res) {
        res.status(200).send({
            publicKey: cryptoManager.getPublicKey()
        });
    });

    router.post('/check_secure_connection', function (req, res) {
        const data_encrypted = req.body.data;
        const key_encrypted = req.body.key;

        const key = cryptoManager.decryptRSA(key_encrypted);
        const data = JSON.parse(cryptoManager.decryptAES(data_encrypted, key));

        data.response = "Added from Server";
        const data_back = cryptoManager.encrypAES(JSON.stringify(data), key).toString();

        res.status(200).send({data: data_back});
    });

    router.post('/sa_analyze', function (req, res) {
        const sa_encrypted = req.body.sa;
        const key_encrypted = req.body.key;

        const key = cryptoManager.decryptRSA(key_encrypted);
        const sa = JSON.parse(cryptoManager.decryptAES(sa_encrypted, key));

        SAAnalyzer.invoke(sa)
            .then((data) => {
                const sa_back = cryptoManager.encrypAES(JSON.stringify(data), key).toString();
                res.status(200).send({data: sa_back});
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    });

    router.post('/sa_analyze_plain', function (req, res) {
        const sa = req.body.sa;

        SAAnalyzer.invoke(sa)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });

    return router;
};