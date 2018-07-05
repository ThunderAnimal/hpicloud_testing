const EmotionAnalyzerOutput = require('../model/emotion-analyzer-output');

class EmotionAnalyzer {
    /**
     *
     * @param filtertEmotionalTaggedText
     * @param wordCountAll
     * @returns {EmotionAnalyzerOutput}
     */
    analyseTaggedText(filtertEmotionalTaggedText, wordCountAll){
        const out = new EmotionAnalyzerOutput();

        function computeEmotion() {
            let emotion;
            const emotionList = [];
            for(let i = 0; i < filtertEmotionalTaggedText.length; i++){
                if(filtertEmotionalTaggedText[i].german_emotions){
                    if(emotionList[filtertEmotionalTaggedText[i].german_emotions]){
                        emotionList[filtertEmotionalTaggedText[i].german_emotions]++;
                    }else{
                        emotionList[filtertEmotionalTaggedText[i].german_emotions] = 1;
                    }
                }
            }

            let max = 0;
            for(let i in emotionList){
                if(emotionList[i] > max){
                    max = emotionList[i];
                    emotion = i;
                }
            }

            return emotion;
        }

        function computePolarity() {
            let polarity;

            const polarityList = [];
            for(let i = 0; i < filtertEmotionalTaggedText.length; i++){
                if(filtertEmotionalTaggedText[i].german_polarity_clues){
                    if(polarityList[filtertEmotionalTaggedText[i].german_polarity_clues.polarity]){
                        polarityList[filtertEmotionalTaggedText[i].german_polarity_clues.polarity]++;
                    }else{
                        polarityList[filtertEmotionalTaggedText[i].german_polarity_clues.polarity] = 1;
                    }
                }
            }

            let max = 0;
            for(let i in polarityList){
                if(polarityList[i] > max){
                    max = polarityList[i];
                    polarity = i;
                }
            }

            return polarity;
        }

        function computeWeight() {
            const weightList = [];

            for(let i = 0; i < filtertEmotionalTaggedText.length; i++){
                if(filtertEmotionalTaggedText[i].opm) {
                    weightList.push(filtertEmotionalTaggedText[i].opm);
                } else if(filtertEmotionalTaggedText[i].german_polarity_clues) {
                    if(filtertEmotionalTaggedText[i].german_polarity_clues.weight){
                        weightList.push(filtertEmotionalTaggedText[i].german_polarity_clues.weight);
                    } else {
                        weightList.push(0);
                    }
                } else {
                    weightList.push(0);
                }
            }

            let sum = 0.0;
            for(let i = 0; i < weightList.length; i++){
                sum = parseFloat(weightList[i]) + sum;
            }

            return sum/weightList.length;
        }

        function computeNumberSenseWords() {
            let count = 0;
            for(let i = 0; i < filtertEmotionalTaggedText.length; i++){
                if(filtertEmotionalTaggedText[i].german_emotions) {
                    count++;
                    continue;
                }
                if(filtertEmotionalTaggedText[i].german_polarity_clues) {
                    if(filtertEmotionalTaggedText[i].german_polarity_clues.polarity !== 'neutral'){
                        count++;
                        continue;
                    }
                }

                if (filtertEmotionalTaggedText[i].opm) {
                    count++;
                }
            }
            return count;
        }

        const senseWordCount = computeNumberSenseWords();

        out.emotion = computeEmotion();
        out.polarity = computePolarity();
        out.weight = computeWeight();
        out.senseRateInscpectedList = senseWordCount / filtertEmotionalTaggedText.length;
        out.senseRateOverAll = senseWordCount / wordCountAll;

        return out;
    }
}

module.exports = new EmotionAnalyzer();