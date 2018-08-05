const ETagHelper = require('../model/ETagTable');

class TagHelper {
    constructor() {
        this.analyzeEmotionWhiteList = [
            ETagHelper.ADJA,
            ETagHelper.ADJD,

            ETagHelper.ADV,

            ETagHelper.NN,

            ETagHelper.PIS,
            ETagHelper.PIAT,
            ETagHelper.PIDAT,

            ETagHelper.PAV,

            ETagHelper.PTKNEG,
            ETagHelper.PTKANT,

            ETagHelper.VVFIN,
            ETagHelper.VVIMP,
            ETagHelper.VVINF,
            ETagHelper.VVIZU,
            ETagHelper.VVPP,
            ETagHelper.VAFIN,
            ETagHelper.VAIMP,
            ETagHelper.VAINF,
            ETagHelper.APPO,
            ETagHelper.VMFIN,
            ETagHelper.VMPP
        ];

        this.blackListWords = [
            ETagHelper.$Punkt,
            ETagHelper.$Koma,
            ETagHelper.$Klammer,

            ETagHelper.XY
        ]
    }

    /**
     *
     * @param treeTaggerOut
     * @returns number
     */
    countWords(treeTaggerOut) {
        return treeTaggerOut.filter(x => this.blackListWords.indexOf(x.tag) === -1).length;
    }

    /**
     *
     * @param treeTaggerOut
     * @returns {number}
     */
    countSentences(treeTaggerOut) {
        let counter = 0;
        if (treeTaggerOut) {
            counter = 1;
        } else {
            return counter;
        }

        let markFoundEndSentence = false;
        for (let i = 0; i < treeTaggerOut.length; i++) {
            if(treeTaggerOut[i].tag === ETagHelper.$Punkt){
                markFoundEndSentence = true;
            } else if (markFoundEndSentence) {
                markFoundEndSentence = false;
                counter++;
            }
        }
        return counter;
    }

    /**
     *
     * @param treeTaggerOut
     * @returns [any]
     */
    filterListForEmotionalAnalyse(treeTaggerOut) {
        return treeTaggerOut.filter(x => this.analyzeEmotionWhiteList.indexOf(x.tag) !== -1);
    }


}

module.exports = new TagHelper();