const fs = require('fs');
const es = require('event-stream');
const path = require('path');
const xml2js = require('xml2js');

const appRoot = require('app-root-path');

const GermanPolarityClues = require('../model/german-polarity-clues');
const OPM = require('../model/opm');

class DictManager {

    constructor() {
        this.clearDicts();
        this.dictDir = path.join(appRoot.path, 'dict');
    }


    /**
     *
     * @returns {Promise<any[]>}
     */
    init() {
        const that = this;

        /**
         *
         * @param pathDir
         * @returns {Promise<[any]>}
         */
        const loadGermanEmotions = function (pathDir) {

            /**
             *
             * @param array
             * @param fileName
             * @returns {Promise<any>}
             */
            const loadGermanEmotionsGeneral = function (array, fileName) {
                return new Promise((resolve, reject) => {
                    const timeGermanEmotions = Date.now();
                    fs.createReadStream(path.join(pathDir, fileName))
                        .pipe(es.split())
                        .pipe(es.mapSync((line) => {
                            array.push(line);
                        }))
                        .on('error', function (err) {
                            console.log('Error while reading file ' + fileName, err);
                            reject(err);
                        })
                        .on('end', function () {
                            // console.log('Read entire file ' + fileName + ' ' + (Date.now() - timeGermanEmotions) + "ms");
                            resolve();
                        })
                });

            };
            const timeGermanEmotions = Date.now();
            return Promise.all([
                loadGermanEmotionsGeneral(that.german_emotions.ekel, "Ekel.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.freude, "Freude.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.furcht, "Furcht.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.trauer, "Trauer.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.ueberrasschung, "Ueberraschung.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.verachtung, "Verachtung.txt"),
                loadGermanEmotionsGeneral(that.german_emotions.wut, "Wut.txt")
            ])
                .then(() => {
                    console.log("Finished load german-emotion dict: " + (Date.now() - timeGermanEmotions) + "ms");
                })
        };

        /**
         *
         * @param pathDir
         * @returns {Promise<[any]>}
         */
        const loadGermanPolarityClues = function (pathDir) {

            /**
             *
             * @param array
             * @param fileName
             * @returns {Promise<any>}
             */
            const loadGermanPolarityCluesGeneral = function (array, fileName) {
                return new Promise((resolve, reject) => {
                    const timeGermanPolarityClues = Date.now();
                    fs.createReadStream(path.join(pathDir, fileName))
                        .pipe(es.split())
                        .pipe(es.mapSync((line) => {
                            const eachEntity = line.split("\t");
                            const germanPolarityClue = new GermanPolarityClues(eachEntity[1], eachEntity[3], eachEntity[4], eachEntity[5]);

                            if(germanPolarityClue.lemma){
                                array.push(germanPolarityClue);
                            }

                        }))
                        .on('error', function (err) {
                            console.log('Error while reading file ' + fileName, err);
                            reject(err);
                        })
                        .on('end', function () {
                            // console.log('Read entire file ' + fileName + ' ' + (Date.now() - timeGermanPolarityClues) + "ms");
                            resolve();
                        })
                });
            };

            const timeGermanPolarityClues = Date.now();
            return Promise.all([
                loadGermanPolarityCluesGeneral(that.german_polarity_clues.positive, "GermanPolarityClues-Positive-Lemma-21042012.tsv"),
                loadGermanPolarityCluesGeneral(that.german_polarity_clues.neutral, "GermanPolarityClues-Neutral-Lemma-21042012.tsv"),
                loadGermanPolarityCluesGeneral(that.german_polarity_clues.negative, "GermanPolarityClues-Negative-Lemma-21042012.tsv")
            ])
                .then(() => {
                    console.log("Finished load GermanPolarityClues dict: " + (Date.now() - timeGermanPolarityClues) + "ms");
                });
        };

        const loadOPM = function (pathDir) {
            const parser = new xml2js.Parser();
            const timeOPM = Date.now();

            return new Promise(((resolve, reject) => {
                fs.readFile(path.join(pathDir, "OPdict.xml"),"utf8", (err, data) => {
                    if (err) {
                        console.error("file error: ", err);
                        reject(err);
                    }
                    parser.parseString(data, (err, result) =>{
                        if (err) {
                            console.error("parse error: ", err);
                            reject(err);
                        }
                        const opms = result.entries.entry;

                        for(let i = 0; i < opms.length; i++){
                            that.opm.push(new OPM(opms[i].term[0], opms[i].opinion[0].$.polarity));
                        }
                        resolve();
                    });
                });
            }))
                .then( () => {
                    console.log("Finished load OPM dict: " + (Date.now() - timeOPM) + "ms");
                });
        };

        return Promise.all([
            loadGermanEmotions(path.join(this.dictDir, 'german-emotion')),
            loadGermanPolarityClues(path.join(this.dictDir, 'GermanPolarityClues')),
            loadOPM(path.join(this.dictDir, 'opm'))
        ]);
    }

    /**
     *
     */
    clearDicts() {
        this.german_emotions = {
            ekel: [],
            freude: [],
            furcht: [],
            trauer: [],
            ueberrasschung: [],
            verachtung: [],
            wut: []
        };

        this.german_polarity_clues = {
            negative: [],
            positive: [],
            neutral: []
        };

        this.opm = [];
    }


}

module.exports = new DictManager();