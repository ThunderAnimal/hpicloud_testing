const SAAnalyzerOutput = require("../model/sa-analyzer-output");
const KorrekturModel = require("../model/korrektur-model");
const tagHelper = require("./tag-helper");
const analyzerEmotion = require('./emotion-analyzer');

class SAAnalyzer {

    constructor(dictManager) {
        this.treeTager = require("./tree-tagger");
        this.emotionTagger = require("./emotion-tagger")(dictManager);

        this.thresholdWeight = 0.15;
        this.thresholdSenseRateAll = 0.3;
        this.thresholdSenseRateInspectedList = 0.4;

        this.thresholdWordsNormal = 15;
        this.thresholdWordsShort = 8;
    }

    /**
     *
     * @param sa
     * @returns {Promise<SAAnalyzerOutput>}
     */
    invoke(sa) {
        const that = this;


        /**
         *
         * @param sa
         * @param out
         * @returns {Promise<any[]>}
         */
        const func_tagEmotion = function (sa, out) {
            return Promise.all([
                func_tagText(sa.erhebungsphase.beschreibung).then(value => out.sa.erhebungsphase.beschreibung_tagged = value),
                func_tagTextArray(sa.erhebungsphase.interpretation).then(value => out.sa.erhebungsphase.interpretation_tagged = value),
                out.sa.erhebungsphase.kiesler_kreis = sa.erhebungsphase.kiesler_kreis,
                func_tagText(sa.erhebungsphase.verhalten).then(value => out.sa.erhebungsphase.verhalten_tagged = value),
                func_tagText(sa.erhebungsphase.ergebnis_real).then(value => out.sa.erhebungsphase.ergebnis_real_tagged = value),
                func_tagText(sa.erhebungsphase.ergebnis_wunsch).then(value => out.sa.erhebungsphase.ergebnis_wunsch_tagged = value),
                out.sa.erhebungsphase.ziel_erreicht = sa.erhebungsphase.ziel_erreicht,
                func_tagText(sa.erhebungsphase.ziel_nicht_erreicht_grund).then(value => out.sa.erhebungsphase.ziel_nicht_erreicht_grund_tagged = value),
                func_tagTextArray(sa.loesungsphase.revision).then(value => out.sa.loesungsphase.revision_tagged = value),
                func_tagTextArray(sa.loesungsphase.schlachtrufe).then(value => out.sa.loesungsphase.schlachtrufe_tagged = value),
                func_tagText(sa.loesungsphase.zielfuehrendes_verhalten).then(value => out.sa.loesungsphase.zielfuehrendes_verhalten_tagged = value),
                func_tagText(sa.loesungsphase.take_home_message).then(value => out.sa.loesungsphase.take_home_message_tagged = value),
                func_tagTextArray(sa.loesungsphase.transfer).then(value => out.sa.loesungsphase.transfer = value)
            ]);
        };

        /**
         *
         * @param text
         * @returns {Promise<any>}
         */
        const func_tagText = function (text) {
            return new Promise((resolve, reject) => {
                if (!text) {
                    resolve(undefined);
                }
                that.treeTager.tagText(text, (treeTaggerResult) => {
                    const filterListForEmotion = tagHelper.filterListForEmotionalAnalyse(treeTaggerResult);
                    that.emotionTagger.tagAll(filterListForEmotion)
                        .then((emotionTaggerResult) => {
                            resolve(treeTaggerResult);
                        });
                });
            });

        };

        /**
         *
         * @param arrayText
         * @returns {Promise<any[]>}
         */
        const func_tagTextArray = function (arrayText) {
            const promises = [];

            if(arrayText){
                for (let i = 0; i < arrayText.length; i++) {
                    promises.push(func_tagText(arrayText[i]));
                }
            }

            return Promise.all(promises);
        };


        const func_analyzeEmotion = function (out) {

            function flattenDeep(arr1) {
                return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
            }

            const arrays = [
                out.sa.erhebungsphase.beschreibung_tagged,
                out.sa.erhebungsphase.interpretation_tagged,
                out.sa.erhebungsphase.verhalten_tagged,
                out.sa.erhebungsphase.ergebnis_real_tagged,
                out.sa.erhebungsphase.ziel_nicht_erreicht_grund_tagged
            ];
            const outAnalyze = flattenDeep(arrays);
            const outAnalyzeClear = outAnalyze.filter((x) => !!x);
            const filterListForEmotion = tagHelper.filterListForEmotionalAnalyse(outAnalyzeClear);

            const analyzeResult = analyzerEmotion.analyseTaggedText(filterListForEmotion, tagHelper.countWords(outAnalyzeClear));

            return analyzeResult;
        };

        const func_analyzeQuality = function (out) {
            const korrektur_list = [];

            const emotionResult = analyzerEmotion.analyseTaggedText(tagHelper.filterListForEmotionalAnalyse(out.sa.erhebungsphase.beschreibung_tagged), tagHelper.countWords(out.sa.erhebungsphase.beschreibung_tagged));
            if(Math.abs(emotionResult.weight) > that.thresholdWeight ||
                emotionResult.senseRateOverAll > that.thresholdSenseRateAll ||
                emotionResult.senseRateInscpectedList > that.thresholdSenseRateInspectedList){

                korrektur_list.push(new KorrekturModel("beschreibung", "Die Beschreibung der Situation ist sehr subjektiv/emotional."));
            }

            for(let i = 0; i < out.sa.erhebungsphase.interpretation_tagged.length; i++){
                const countWords = tagHelper.countWords(out.sa.erhebungsphase.interpretation_tagged[i]);
                const countSentences = tagHelper.countSentences(out.sa.erhebungsphase.interpretation_tagged[i]);

                if(countWords > that.thresholdWordsNormal){
                    korrektur_list.push(new KorrekturModel("interpretation[" + i + "]", "Die " + (i + 1) + ". Interpretation ist zu ausfuehrlich (zu viele Woerter)"));
                } else if(countSentences > 1){
                    korrektur_list.push(new KorrekturModel("interpretation[" + i + "]", "Die " + (i + 1) + ". Interpretation ist zu ausfuehrlich (zu viele Saetze)"));
                }
            }

            const countWordsErgebnisWunsch = tagHelper.countWords(out.sa.erhebungsphase.ergebnis_wunsch_tagged);
            const countSentencesEgebnis = tagHelper.countSentences(out.sa.erhebungsphase.ergebnis_wunsch_tagged);
            if(countWordsErgebnisWunsch > that.thresholdWordsNormal){
                korrektur_list.push(new KorrekturModel("ergebnis_wunsch", "Das gewuenschte Ergebnis ist zu ausfuehrlich (zu viele Woerter)"));
            } else if(countSentencesEgebnis > 1){
                korrektur_list.push(new KorrekturModel("ergebnis_wunsch", "Das gewuenschte Ergebnis ist zu ausfuehrlich (zu viele Saetze)"));
            }

            for(let i = 0; i < out.sa.loesungsphase.revision_tagged.length; i++){
                const countWords = tagHelper.countWords(out.sa.loesungsphase.revision_tagged[i]);
                const countSentences = tagHelper.countSentences(out.sa.loesungsphase.revision_tagged[i]);

                console.log(countWords);

                if(countWords > that.thresholdWordsNormal){
                    korrektur_list.push(new KorrekturModel("revision[" + i + "]", "Die " + (i + 1) + ". Revision ist zu ausfuehrlich (zu viele Woerter)"));
                } else if(countSentences > 1){
                    korrektur_list.push(new KorrekturModel("revision[" + i + "]", "Die " + (i + 1) + ". Revision ist zu ausfuehrlich (zu viele Saetze)"));
                }
            }

            for(let i = 0; i < out.sa.loesungsphase.schlachtrufe_tagged.length; i++){
                const countWords = tagHelper.countWords(out.sa.loesungsphase.schlachtrufe_tagged[i]);

                if(countWords > that.thresholdWordsShort){
                    korrektur_list.push(new KorrekturModel("schlachtrufe[" + i + "]", "Der " + (i + 1) + ". Schlachtruf ist zu ausfuehrlich (zu viele Woerter)"));
                }
            }

            return korrektur_list;

        };

        const output = new SAAnalyzerOutput();

        return func_tagEmotion(sa, output)
            .then(() => {
                func_analyzeEmotion(output);
                output.result = func_analyzeEmotion(output);
                output.result.korrektur_list = func_analyzeQuality(output);
                return output
            });
    }


}

module.exports = function (dictManager) {
    return new SAAnalyzer(dictManager);
};