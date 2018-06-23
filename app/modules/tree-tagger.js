
const path = require('path');
const fs = require("fs");
const {exec} = require('child_process');

const appRoot = require('app-root-path');

const TreeTaggerOut = require('../model/tree-tagger-out');

class TreeTagger {
    constructor() {
        this.workDir = path.join(appRoot.path, 'wrk_tree_tagger');
    }

    /**
     *
     * @param text
     * @param cb Array<TreetaggerOut>
     */
    tagText(text, cb) {
        const today = Date.now();
        const fileNameIn = today + '_in.txt';
        const fileNameOut = today + '_out.txt';

        /**
         *
         * @param path
         * @param text
         * @param cb
         */
        const writeFile = function (path, text, cb) {
            fs.writeFile(path, text, (err) => {
                if (err) {
                    console.error("file error: ", err);
                    throw err;
                }
                cb();
            })
        };

        /**
         *
         * @param path
         * @param cb
         */
        const readFile = function (path, cb) {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    console.error("file error: ", err);
                    throw err;
                }
                cb(data);
            });
        };

        /**
         *
         * @param path
         * @param cb
         */
        const deleteFile = function (path, cb) {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error("file error: ", err);
                    throw err;
                }
                if(cb){
                    cb();
                }
            });
        };

        /**
         *
         * @param filePathIn
         * @param filePathOut
         * @param cb
         */
        const execTreeTagger = function (filePathIn, filePathOut, cb) {
            exec("tag-german " + filePathIn + " " + filePathOut, (err) => {
                if (err) {
                    console.error(`exec error: ${error}`);
                    throw err;
                }
                cb();
            });
        };

        writeFile(path.join(this.workDir, fileNameIn), text, () => {
            execTreeTagger(path.join(this.workDir, fileNameIn), path.join(this.workDir, fileNameOut), () => {
                readFile(path.join(this.workDir, fileNameOut), (data) => {
                    const arrayResult = [];

                    const eachLine = data.split("\n");
                    for(let i = 0; i < eachLine.length; i++){
                        const eachEntity = eachLine[i].split("\t");

                        if(eachEntity[0] !== ""){
                            arrayResult.push(new TreeTaggerOut(eachEntity[0], eachEntity[1], eachEntity[2].replace(/\r?\n|\r/, "")));
                        }
                    }

                    cb(arrayResult);

                    deleteFile(path.join(this.workDir, fileNameIn));
                    deleteFile(path.join(this.workDir, fileNameOut));
                });
            });
        })
    }

}

module.exports = new TreeTagger();