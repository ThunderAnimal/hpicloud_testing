class GermanPolarityClues {
    constructor(lemma, polarity, probability, artifact){
        this.lemma = lemma;
        this.polarity = polarity;
        this.probability = {
            positiveProbability: 0,
            negativeProbability: 0,
            neutralProbability: 0
        };

        this.hasWeight = false;
        this.hasProbability = false;


        if(artifact === "L"){
            this.hasWeight = true;

            if(polarity === "negative"){
                this.weight = probability.split("/")[1];
            } else if (polarity === "positive"){
                this.weight = probability.split("/")[0];
            }

        }

        if(artifact === "D"){
            const echProbability = probability.split("/");

            if(echProbability[0] !== "-"){
                this.probability.positiveProbability = parseFloat(echProbability[0]);
                this.hasProbability = true;
            }
            if(echProbability[1] !== "-"){
                this.probability.negativeProbability = parseFloat(echProbability[1]);
                this.hasProbability = true;
            }
            if(echProbability[2] !== "-"){
                this.probability.neutralProbability = parseFloat(echProbability[2]);
                this.hasProbability = true;
            }
        }

    }
}

module.exports = GermanPolarityClues;