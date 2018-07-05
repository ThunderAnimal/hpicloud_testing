class EmotionAnalyzerOutput {
    constructor(){
        this.emotion = undefined; // from german-emotion
        this.polarity = undefined; // negative, neutral, positive
        this.weight = 0; // weigth of the polarity
        this.senseRateInscpectedList = 0; // sense from filtert list of word tpe wich could have sense
        this.senseRateOverAll = 0; // between 0-1 percentage counting all words
    }
}

module.exports = EmotionAnalyzerOutput;