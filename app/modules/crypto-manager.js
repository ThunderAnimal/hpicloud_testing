const NodeRSA = require('node-rsa');
const CryptoJS = require("crypto-js");

class CryptoManager {

    constructor() {
        this.key = undefined;
    }

    /**
     *
     * @returns {*} Public Key base64
     */
    generateKeys() {
        this.key = new NodeRSA();
        this.key.generateKeyPair(2048, 65537);
        this.key.setOptions({encryptionScheme: 'pkcs1'});
    }

    /**
     *
     * @returns {*} pcks8 scheme as pem string
     */
    getPublicKey(){
        if(!this.key){
            throw new Error('generate keys first');
        }
        return this.key.exportKey('pkcs8-public-pem');
    }

    /**
     * Asymetrische Verschluesselung
     * @param toEncrypt
     * @returns {*}
     */
    encryptRSA(toEncrypt){
        if(!this.key){
            throw new Error('generate keys first');
        }
        return this.key.encrypt(toEncrypt, 'base64');
    }

    /**
     * Asymetrische Entschluesselung
     * @param toDecrypt
     * @returns {*}
     */
    decryptRSA(toDecrypt){
        if(!this.key){
            throw new Error('generate keys first');
        }
        return this.key.decrypt(toDecrypt, 'utf8');
    }

    /**
     * Symetrische Verschluesselung AES
     * @param toEncrypt
     * @param key
     * @param iv
     */
    encrypAES(toEncrypt, key){
        return CryptoJS.AES.encrypt(toEncrypt, key);
    }

    /**
     * Symetrische Entshluesselung AES
     * @param toDecrypt
     * @param key
     * @param iv
     * @returns {*}
     */
    decryptAES(toDecrypt, key){
        return CryptoJS.AES.decrypt(toDecrypt, key).toString(CryptoJS.enc.Utf8);
    }

}

module.exports = new CryptoManager();