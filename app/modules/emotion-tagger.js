const EGermanEmotions = require('../model/Egerman-emotions');


class EmotionTagger {

    constructor(dictManager) {
        this.dictManager = dictManager;
    }

    /**
     *
     * @param treeTaggerOut
     * @returns {Promise<any>}
     */
    tagAll(treeTaggerOut){
        return Promise.all([
            this.tagGermanEmotions(treeTaggerOut),
            this.tagGermanPolarityClues(treeTaggerOut),
            this.tagOPM(treeTaggerOut)
        ]).then((data) => {
            return data[0];
        })
    }

    /**
     *
     * @param treeTaggerOut
     * @returns {Promise<any>}
     */
    tagGermanEmotions(treeTaggerOut){
        const taggerOut = treeTaggerOut;

        const searchInDic = function(dic, word){
            for(let i = 0; i < dic.length; i++){
                if(word.toLowerCase() === dic[i].toLowerCase()){
                    return true;
                }
            }
            return false;
        };

        for(let i = 0; i < taggerOut.length; i++){
            if(searchInDic(this.dictManager.german_emotions.ekel, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.ekel;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.freude, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.freude;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.furcht, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.furcht;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.trauer, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.trauer;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.ueberrasschung, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.ueberrasschung;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.verachtung, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.verachtung;
                continue;
            }
            if(searchInDic(this.dictManager.german_emotions.wut, taggerOut[i].lemma)){
                taggerOut[i].german_emotions = EGermanEmotions.wut;
                continue;
            }
            taggerOut[i].german_emotions = undefined;
        }

        return new Promise(resolve => resolve(taggerOut));
    }

    /**
     *
     * @param treeTaggerOut
     * @returns {Promise<any>}
     */
    tagGermanPolarityClues(treeTaggerOut){
        const taggerOut = treeTaggerOut;

        const searchInDic = function (dic, word) {
            for(let i = 0; i < dic.length; i++){
                if(word.toLowerCase() === dic[i].lemma.toLowerCase()){
                    return dic[i];
                }
            }
            return undefined;
        };

        const addGermanPolarityClues = function (taggerOutEntity, germanPolarityEntity) {
            const obj = {};
            obj.polarity = germanPolarityEntity.polarity;
            if(germanPolarityEntity.hasWeight){
                obj.weight = germanPolarityEntity.weight;
            }
            if(germanPolarityEntity.hasProbability){
                obj.probability = germanPolarityEntity.probability;
            }

            taggerOutEntity.german_polarity_clues = obj;
        };

        for(let i = 0; i < taggerOut.length; i++){

            let searchResult = searchInDic(this.dictManager.german_polarity_clues.negative, taggerOut[i].lemma);
            if(searchResult){
                addGermanPolarityClues(taggerOut[i], searchResult);
                continue;
            }

            searchResult = searchInDic(this.dictManager.german_polarity_clues.positive, taggerOut[i].lemma);
            if(searchResult){
                addGermanPolarityClues(taggerOut[i], searchResult);
                continue;
            }

            searchResult = searchInDic(this.dictManager.german_polarity_clues.neutral, taggerOut[i].lemma);
            if(searchResult){
                addGermanPolarityClues(taggerOut[i], searchResult);
                continue;
            }

            taggerOut[i].german_polarity_clues = undefined;
        }

        return new Promise(resolve => resolve(taggerOut));
    }

    /**
     *
     * @param treeTaggerOut
     * @returns {Promise<any>}
     */
    tagOPM(treeTaggerOut){
        const taggerOut = treeTaggerOut;

        for(let i = 0; i < taggerOut.length; i++){
            let lFound = false;
            for(let k = 0; k < this.dictManager.opm.length; k++){
                if(taggerOut[i].lemma.toLowerCase() === this.dictManager.opm[k].word.toLowerCase()){
                    lFound = true;
                    taggerOut[i].opm = this.dictManager.opm[k].polarity;
                    break;
                }
            }
            if(!lFound){
                taggerOut[i].opm = undefined;
            }
        }
        return new Promise(resolve => resolve(taggerOut));
    }

}

module.exports = function(dictManager){
    return new EmotionTagger(dictManager);
};