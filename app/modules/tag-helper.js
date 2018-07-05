const ETagHelper = require('../model/ETagTable');

class TagHelper{
    constructor(){
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
            ETagHelper.$Komma,
            ETagHelper.$Klammer,

            ETagHelper.XY
        ]
    }

    /**
     *
     * @param treeTaggerOut
     * @returns number
     */
    countWords(treeTaggerOut){
        return treeTaggerOut.filter(x => this.blackListWords.indexOf(x.tag) === -1).length;
    }

    /**
     *
     * @param treeTaggerOut
     * @returns [any]
     */
    filterListForEmotionalAnalyse(treeTaggerOut){
        return treeTaggerOut.filter(x => this.analyzeEmotionWhiteList.indexOf(x.tag) !== -1);
    }


}

module.exports = new TagHelper();