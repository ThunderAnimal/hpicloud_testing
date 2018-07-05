const express = require('express');
const tagHelper = require('../app/modules/tag-helper');
const analyzerEmotion = require('../app/modules/emotion-analyzer');

module.exports = function(dictManager){
    const router = express.Router();

    const treeTager = require("../app/modules/tree-tagger");
    const emotionTagger = require("../app/modules/emotion-tagger")(dictManager);

    router.get('/tag', function (req, res, next) {
        const text = req.query.text;

        const timeStartTag = Date.now();
        treeTager.tagText(text, (treeTaggerResult) =>{
            const timeEndTag = Date.now() - timeStartTag;

            const filterListForEmotion = tagHelper.filterListForEmotionalAnalyse(treeTaggerResult);
            const timeStartTagEmotion = Date.now();
            emotionTagger.tagAll(filterListForEmotion)
                .then((emotionTaggerResult) => {
                    const timeEndTagEmotion = Date.now() - timeStartTagEmotion;
                    const analyzeResult = analyzerEmotion.analyseTaggedText(emotionTaggerResult, tagHelper.countWords(treeTaggerResult));
                    res.send({
                        tagged: treeTaggerResult,
                        result: analyzeResult
                    });
                });

            //TODO check in Dicta

        });
    });

    return router;
};