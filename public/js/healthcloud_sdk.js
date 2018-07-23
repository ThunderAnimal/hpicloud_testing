/*! Version: "0.1.0" */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("GC", [], factory);
	else if(typeof exports === 'object')
		exports["GC"] = factory();
	else
		root["GC"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var envConfig = exports.envConfig = {
    development: {
        api: 'https://api-dev.hpsgc.de'
    },
    staging: {
        api: 'https://staging.hpihc.de'
    },
    production: {
        api: 'https://api.gesundheitscloud.de'
    }
};

var config = {
    // TODO: need to change to internal url once deployed.
    fhirSchemaUrl: 'https://raw.githubusercontent.com/harsimran1/fhir-validator-js' + '/master/lib/conformance/3.0.1/schema.json',
    environmentConfig: {},
    apiUrl: function apiUrl() {
        return this.environmentConfig.api;
    }
};

exports.default = config;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _superagentBluebirdPromise = __webpack_require__(32);

var _superagentBluebirdPromise2 = _interopRequireDefault(_superagentBluebirdPromise);

var _authRoutes = __webpack_require__(41);

var _authRoutes2 = _interopRequireDefault(_authRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maxRetries = 2;

var isHealthCloudPath = function isHealthCloudPath(path) {
    return path.startsWith(_config2.default.environmentConfig.api);
};

var isExpired = function isExpired(error) {
    return error.status === 401;
};

var hcRequest = {
    currentUserId: null,
    // the accessToken of the logged in user, which is used for getting other users tokens
    masterAccessToken: null,
    accessTokens: {},

    /**
     * @returns {Promise<String>} resolves to the accessToken of the logged in user
    */
    requestAccessToken: null,

    reset: function reset() {
        this.currentUserId = null;
        this.masterAccessToken = null;
        this.accessTokens = {};
    },
    setMasterAccessToken: function setMasterAccessToken(accessToken) {
        this.masterAccessToken = 'Bearer ' + accessToken;
    },
    setAccessToken: function setAccessToken(userId, accessToken) {
        this.accessTokens[userId] = 'Bearer ' + accessToken;
    },


    /**
     * returns the accessToken if known or fetches it for the given ownerId and stores it.
     *
     * @param {String} ownerId=null - accessToken's ownerId, logged in user's by default
     * @returns {Promise<String>} the accessToken of the requested owner
     */
    getAccessToken: function getAccessToken(ownerId) {
        var _this = this;

        // getAccessToken for current user's access token
        if (!ownerId || ownerId === this.currentUserId) {
            return Promise.resolve(this.masterAccessToken);
        }
        // getAccessToken for other user's access token
        if (this.accessTokens[ownerId]) {
            return Promise.resolve(this.accessTokens[ownerId]);
        }

        // fetch for accessToken for the given user
        return _authRoutes2.default.fetchAccessToken(ownerId).then(function (response) {
            _this.setAccessToken(ownerId, response.access_token);
            return _this.accessTokens[ownerId];
        });
    },
    submit: function submit(type, path) {
        var _this2 = this;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            body = _ref.body,
            _ref$query = _ref.query,
            query = _ref$query === undefined ? {} : _ref$query,
            _ref$headers = _ref.headers,
            headers = _ref$headers === undefined ? {} : _ref$headers,
            _ref$responseType = _ref.responseType,
            responseType = _ref$responseType === undefined ? '' : _ref$responseType,
            _ref$authorize = _ref.authorize,
            authorize = _ref$authorize === undefined ? false : _ref$authorize,
            _ref$ownerId = _ref.ownerId,
            ownerId = _ref$ownerId === undefined ? null : _ref$ownerId,
            _ref$includeResponseH = _ref.includeResponseHeaders,
            includeResponseHeaders = _ref$includeResponseH === undefined ? false : _ref$includeResponseH;

        var retries = 0;
        var httpHeaders = headers;

        // noop promise if authorize is not set
        var accessTokenPromise = authorize ? this.getAccessToken(ownerId) : Promise.resolve(null);

        if (isHealthCloudPath(path)) {
            // TODO uncomment whenever vega allows the version Header
            // httpHeaders['GC-SDK-Version'] = `JS ${VERSION}`;
        }

        var submitRequest = function submitRequest(accessToken) {
            return (0, _superagentBluebirdPromise2.default)(type, path).set(_extends({}, httpHeaders, {
                authorization: accessToken
            })).query(query).responseType(responseType).send(body).then(function (res) {
                if (includeResponseHeaders) {
                    return { body: res.body, headers: res.headers };
                }
                return res.body || res.text;
            }).catch(function (err) {
                if (isExpired(err) && _this2.requestAccessToken && retries < maxRetries) {
                    retries += 1;
                    var refreshPromise = void 0;
                    if (ownerId) {
                        // invalidate user's access token and get a new one
                        _this2.accessTokens[ownerId] = null;
                        refreshPromise = _this2.getAccessToken(ownerId);
                    } else {
                        // request accessToken for the logged in user's accessToken and set it
                        refreshPromise = _this2.requestAccessToken().then(_this2.setMasterAccessToken.bind(_this2)).then(_this2.getAccessToken.bind(_this2));
                    }

                    return refreshPromise.then(function (token) {
                        return submitRequest(token);
                    });
                }
                throw err;
            });
        };

        return accessTokenPromise.then(submitRequest);
    }
};

exports.default = hcRequest;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  copy: copy,
  checkDataType: checkDataType,
  checkDataTypes: checkDataTypes,
  coerceToTypes: coerceToTypes,
  toHash: toHash,
  getProperty: getProperty,
  escapeQuotes: escapeQuotes,
  equal: __webpack_require__(8),
  ucs2length: __webpack_require__(53),
  varOccurences: varOccurences,
  varReplace: varReplace,
  cleanUpCode: cleanUpCode,
  finalCleanUpCode: finalCleanUpCode,
  schemaHasRules: schemaHasRules,
  schemaHasRulesExcept: schemaHasRulesExcept,
  toQuotedString: toQuotedString,
  getPathExpr: getPathExpr,
  getPath: getPath,
  getData: getData,
  unescapeFragment: unescapeFragment,
  unescapeJsonPointer: unescapeJsonPointer,
  escapeFragment: escapeFragment,
  escapeJsonPointer: escapeJsonPointer
};

function copy(o, to) {
  to = to || {};
  for (var key in o) {
    to[key] = o[key];
  }return to;
}

function checkDataType(dataType, data, negate) {
  var EQUAL = negate ? ' !== ' : ' === ',
      AND = negate ? ' || ' : ' && ',
      OK = negate ? '!' : '',
      NOT = negate ? '' : '!';
  switch (dataType) {
    case 'null':
      return data + EQUAL + 'null';
    case 'array':
      return OK + 'Array.isArray(' + data + ')';
    case 'object':
      return '(' + OK + data + AND + 'typeof ' + data + EQUAL + '"object"' + AND + NOT + 'Array.isArray(' + data + '))';
    case 'integer':
      return '(typeof ' + data + EQUAL + '"number"' + AND + NOT + '(' + data + ' % 1)' + AND + data + EQUAL + data + ')';
    default:
      return 'typeof ' + data + EQUAL + '"' + dataType + '"';
  }
}

function checkDataTypes(dataTypes, data) {
  switch (dataTypes.length) {
    case 1:
      return checkDataType(dataTypes[0], data, true);
    default:
      var code = '';
      var types = toHash(dataTypes);
      if (types.array && types.object) {
        code = types.null ? '(' : '(!' + data + ' || ';
        code += 'typeof ' + data + ' !== "object")';
        delete types.null;
        delete types.array;
        delete types.object;
      }
      if (types.number) delete types.integer;
      for (var t in types) {
        code += (code ? ' && ' : '') + checkDataType(t, data, true);
      }return code;
  }
}

var COERCE_TO_TYPES = toHash(['string', 'number', 'integer', 'boolean', 'null']);
function coerceToTypes(optionCoerceTypes, dataTypes) {
  if (Array.isArray(dataTypes)) {
    var types = [];
    for (var i = 0; i < dataTypes.length; i++) {
      var t = dataTypes[i];
      if (COERCE_TO_TYPES[t]) types[types.length] = t;else if (optionCoerceTypes === 'array' && t === 'array') types[types.length] = t;
    }
    if (types.length) return types;
  } else if (COERCE_TO_TYPES[dataTypes]) {
    return [dataTypes];
  } else if (optionCoerceTypes === 'array' && dataTypes === 'array') {
    return ['array'];
  }
}

function toHash(arr) {
  var hash = {};
  for (var i = 0; i < arr.length; i++) {
    hash[arr[i]] = true;
  }return hash;
}

var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
var SINGLE_QUOTE = /'|\\/g;
function getProperty(key) {
  return typeof key == 'number' ? '[' + key + ']' : IDENTIFIER.test(key) ? '.' + key : "['" + escapeQuotes(key) + "']";
}

function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, '\\$&').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\f/g, '\\f').replace(/\t/g, '\\t');
}

function varOccurences(str, dataVar) {
  dataVar += '[^0-9]';
  var matches = str.match(new RegExp(dataVar, 'g'));
  return matches ? matches.length : 0;
}

function varReplace(str, dataVar, expr) {
  dataVar += '([^0-9])';
  expr = expr.replace(/\$/g, '$$$$');
  return str.replace(new RegExp(dataVar, 'g'), expr + '$1');
}

var EMPTY_ELSE = /else\s*{\s*}/g,
    EMPTY_IF_NO_ELSE = /if\s*\([^)]+\)\s*\{\s*\}(?!\s*else)/g,
    EMPTY_IF_WITH_ELSE = /if\s*\(([^)]+)\)\s*\{\s*\}\s*else(?!\s*if)/g;
function cleanUpCode(out) {
  return out.replace(EMPTY_ELSE, '').replace(EMPTY_IF_NO_ELSE, '').replace(EMPTY_IF_WITH_ELSE, 'if (!($1))');
}

var ERRORS_REGEXP = /[^v.]errors/g,
    REMOVE_ERRORS = /var errors = 0;|var vErrors = null;|validate.errors = vErrors;/g,
    REMOVE_ERRORS_ASYNC = /var errors = 0;|var vErrors = null;/g,
    RETURN_VALID = 'return errors === 0;',
    RETURN_TRUE = 'validate.errors = null; return true;',
    RETURN_ASYNC = /if \(errors === 0\) return data;\s*else throw new ValidationError\(vErrors\);/,
    RETURN_DATA_ASYNC = 'return data;',
    ROOTDATA_REGEXP = /[^A-Za-z_$]rootData[^A-Za-z0-9_$]/g,
    REMOVE_ROOTDATA = /if \(rootData === undefined\) rootData = data;/;

function finalCleanUpCode(out, async) {
  var matches = out.match(ERRORS_REGEXP);
  if (matches && matches.length == 2) {
    out = async ? out.replace(REMOVE_ERRORS_ASYNC, '').replace(RETURN_ASYNC, RETURN_DATA_ASYNC) : out.replace(REMOVE_ERRORS, '').replace(RETURN_VALID, RETURN_TRUE);
  }

  matches = out.match(ROOTDATA_REGEXP);
  if (!matches || matches.length !== 3) return out;
  return out.replace(REMOVE_ROOTDATA, '');
}

function schemaHasRules(schema, rules) {
  if (typeof schema == 'boolean') return !schema;
  for (var key in schema) {
    if (rules[key]) return true;
  }
}

function schemaHasRulesExcept(schema, rules, exceptKeyword) {
  if (typeof schema == 'boolean') return !schema && exceptKeyword != 'not';
  for (var key in schema) {
    if (key != exceptKeyword && rules[key]) return true;
  }
}

function toQuotedString(str) {
  return '\'' + escapeQuotes(str) + '\'';
}

function getPathExpr(currentPath, expr, jsonPointers, isNumber) {
  var path = jsonPointers // false by default
  ? '\'/\' + ' + expr + (isNumber ? '' : '.replace(/~/g, \'~0\').replace(/\\//g, \'~1\')') : isNumber ? '\'[\' + ' + expr + ' + \']\'' : '\'[\\\'\' + ' + expr + ' + \'\\\']\'';
  return joinPaths(currentPath, path);
}

function getPath(currentPath, prop, jsonPointers) {
  var path = jsonPointers // false by default
  ? toQuotedString('/' + escapeJsonPointer(prop)) : toQuotedString(getProperty(prop));
  return joinPaths(currentPath, path);
}

var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData($data, lvl, paths) {
  var up, jsonPointer, data, matches;
  if ($data === '') return 'rootData';
  if ($data[0] == '/') {
    if (!JSON_POINTER.test($data)) throw new Error('Invalid JSON-pointer: ' + $data);
    jsonPointer = $data;
    data = 'rootData';
  } else {
    matches = $data.match(RELATIVE_JSON_POINTER);
    if (!matches) throw new Error('Invalid JSON-pointer: ' + $data);
    up = +matches[1];
    jsonPointer = matches[2];
    if (jsonPointer == '#') {
      if (up >= lvl) throw new Error('Cannot access property/index ' + up + ' levels up, current level is ' + lvl);
      return paths[lvl - up];
    }

    if (up > lvl) throw new Error('Cannot access data ' + up + ' levels up, current level is ' + lvl);
    data = 'data' + (lvl - up || '');
    if (!jsonPointer) return data;
  }

  var expr = data;
  var segments = jsonPointer.split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment) {
      data += getProperty(unescapeJsonPointer(segment));
      expr += ' && ' + data;
    }
  }
  return expr;
}

function joinPaths(a, b) {
  if (a == '""') return b;
  return (a + ' + ' + b).replace(/' \+ '/g, '');
}

function unescapeFragment(str) {
  return unescapeJsonPointer(decodeURIComponent(str));
}

function escapeFragment(str) {
  return encodeURIComponent(escapeJsonPointer(str));
}

function escapeJsonPointer(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationError = function ValidationError(message) {
    _classCallCheck(this, ValidationError);

    this.name = 'ValidationError';
    this.message = message || '';
};

exports.default = ValidationError;
var MISSING_PARAMETERS = exports.MISSING_PARAMETERS = 'no passed parameters';
var INVALID_PARAMETERS = exports.INVALID_PARAMETERS = 'invalid parameters';

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _base64Js = __webpack_require__(85);

var _base64Js2 = _interopRequireDefault(_base64Js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = window.crypto || window.msCrypto;
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

var keyTypes = {
    COMMON_KEY: 'ck',
    DATA_KEY: 'dk',
    PASSWORD_KEY: 'pk',
    ATTACHMENT_KEY: 'ak',
    TAG_ENCRYPTION_KEY: 'tek',
    APP: {
        PRIVATE_KEY: 'apriv',
        PUBLIC_KEY: 'apub'
    },
    USER: {
        PRIVATE_KEY: 'upriv',
        PUBLIC_KEY: 'upub'
    }
};

// ALGORITHMS
var AES_GCM = {
    name: 'AES-GCM',
    length: 256
};

var RSA_OAEP = {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: 'SHA-256' }
};

var PBKDF2 = {
    name: 'PBKDF2',
    salt: new Uint8Array(16),
    iterations: 100,
    hash: 'SHA-256'
};

var TEK_IV = new Uint8Array(16).fill(0);

var convertStringToArrayBufferView = textEncoder.encode.bind(textEncoder);

var convertObjectToArrayBufferView = function convertObjectToArrayBufferView(object) {
    return convertStringToArrayBufferView(JSON.stringify(object));
};

var convertArrayBufferViewToString = textDecoder.decode.bind(textDecoder);

var convertBlobToArrayBufferView = function convertBlobToArrayBufferView(blob) {
    return new Promise(function (resolve) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            resolve(new Uint8Array(event.target.result));
        };
        fileReader.readAsArrayBuffer(blob);
    });
};

/**
 * converts a base64 string to a Uint8Array
 *
 * @param {String} base64
 * @returns {Uint8Array} - the bytes of the base64 string
 *
 */
var convertBase64ToArrayBufferView = _base64Js2.default.toByteArray;

/**
 * converts the bytes to a base64 string
 *
 * @param {Uint8Array} bytes
 * @returns {String} - the base64 representation of the bytes
 *
 */
var convertArrayBufferViewToBase64 = _base64Js2.default.fromByteArray;

/**
 * Import from base64 encoded raw key to CryptoKey.
 *
 * @param {String} base64Key - base64 encoded key
 * @returns {Promise} Resolves to the key as a CryptoKey.
 */
var importSymKeyFromBase64 = function importSymKeyFromBase64(base64Key) {
    var alg = AES_GCM;

    return crypto.subtle.importKey('raw', convertBase64ToArrayBufferView(base64Key), alg, true, ['encrypt', 'decrypt']);
};

/**
 * Export symmetric CryptoKey as base64 encoded raw key.
 *
 * @param {Object} cryptoKey - the cryptoKey that should be exported
 * @returns {Promise} Resolves to the key as a base64 encoded String.
 */
var exportSymKeyToBase64 = function exportSymKeyToBase64(cryptoKey) {
    return crypto.subtle.exportKey('raw', cryptoKey).then(function (byteKey) {
        return new Uint8Array(byteKey);
    }).then(convertArrayBufferViewToBase64);
};

/**
 * Import private CryptoKey from base64 encoded PKCS8.
 *
 * @param {String} key - the base64 encoded PKCS8 string
 * @returns {Promise} Resolves to the private key as a CryptoKey.
 */
var importPrivateKeyFromPKCS8 = function importPrivateKeyFromPKCS8(PKCS8) {
    var alg = RSA_OAEP;

    return crypto.subtle.importKey('pkcs8', convertBase64ToArrayBufferView(PKCS8), alg, true, ['decrypt']);
};

/**
 * Export private CryptoKey to base64 encoded PKCS8.
 *
 * @param {Object} cryptoKey - the cryptoKey that should be exported
 * @returns {Promise} Resolves to the key as a base64 encoded String.
 */
var exportPrivateKeyToPKCS8 = function exportPrivateKeyToPKCS8(cryptoKey) {
    return crypto.subtle.exportKey('pkcs8', cryptoKey).then(function (PKCS8) {
        return new Uint8Array(PKCS8);
    }).then(convertArrayBufferViewToBase64);
};

/**
 * Import public CryptoKey from base64 encoded SPKI.
 *
 * @param {String} SPKI - the base64 encoded SPKI
 * @returns {Promise} Resolves to the public key as a CryptoKey.
 */
var importPublicKeyFromSPKI = function importPublicKeyFromSPKI(SPKI) {
    var alg = RSA_OAEP;
    return crypto.subtle.importKey('spki', convertBase64ToArrayBufferView(SPKI), alg, true, ['encrypt']);
};

/**
 * Export public CryptoKey to base64 encoded SPKI.
 *
 * @param {Object} cryptoKey - the key that should be exported
 * @returns {Promise} Resolves to the key as a base64 encoded String.
 */
var exportPublicKeyToSPKI = function exportPublicKeyToSPKI(cryptoKey) {
    return crypto.subtle.exportKey('spki', cryptoKey).then(function (SPKI) {
        return new Uint8Array(SPKI);
    }).then(convertArrayBufferViewToBase64);
};

var importKey = function importKey(key) {
    switch (key.t) {
        case keyTypes.COMMON_KEY:
        case keyTypes.DATA_KEY:
        case keyTypes.ATTACHMENT_KEY:
        case keyTypes.TAG_ENCRYPTION_KEY:
        case keyTypes.PASSWORD_KEY:
            return importSymKeyFromBase64(key.sym);
        case keyTypes.USER.PRIVATE_KEY:
        case keyTypes.APP.PRIVATE_KEY:
            return importPrivateKeyFromPKCS8(key.priv);
        case keyTypes.USER.PUBLIC_KEY:
        case keyTypes.APP.PUBLIC_KEY:
            return importPublicKeyFromSPKI(key.pub);
        default:
            throw new Error('invalid key type');
    }
};

var exportKey = function exportKey(key, type) {
    switch (type) {
        case keyTypes.COMMON_KEY:
        case keyTypes.DATA_KEY:
        case keyTypes.ATTACHMENT_KEY:
        case keyTypes.TAG_ENCRYPTION_KEY:
        case keyTypes.PASSWORD_KEY:
            return exportSymKeyToBase64(key).then(function (base64) {
                return {
                    t: type,
                    v: 1,
                    sym: base64
                };
            });
        case keyTypes.USER.PRIVATE_KEY:
        case keyTypes.APP.PRIVATE_KEY:
            return exportPrivateKeyToPKCS8(key).then(function (base64) {
                return {
                    t: type,
                    v: 1,
                    priv: base64
                };
            });
        case keyTypes.USER.PUBLIC_KEY:
        case keyTypes.APP.PUBLIC_KEY:
            return exportPublicKeyToSPKI(key).then(function (base64) {
                return {
                    t: type,
                    v: 1,
                    pub: base64
                };
            });
        default:
            throw new Error('invalid key type');
    }
};

var mergeUint8Arrays = function mergeUint8Arrays(arr1, arr2) {
    var merge = new Uint8Array(arr1.length + arr2.length);
    merge.set(arr1);
    merge.set(arr2, arr1.length);
    return merge;
};

/**
 * Symmetric encryption of data with hcKey
 *
 * @param {Object} hcKey - The hcKey representation of the key
 * @param {ArrayBufferView} data that should be encrypted
 * @returns {Promise} Resolves to encrypted data as an ArrayBufferView
 */
var symEncrypt = function symEncrypt(hcKey, data) {
    var isTagEncryption = hcKey.t === keyTypes.TAG_ENCRYPTION_KEY;
    var iv = isTagEncryption ? TEK_IV : crypto.getRandomValues(new Uint8Array(16));
    return importKey(hcKey).then(function (key) {
        return crypto.subtle.encrypt({
            name: key.algorithm.name,
            iv: iv
        }, key, data);
    }).then(function (result) {
        if (isTagEncryption) {
            return new Uint8Array(result);
        }
        return mergeUint8Arrays(iv, new Uint8Array(result));
    });
};

var symEncryptString = function symEncryptString(hcKey, string) {
    return symEncrypt(hcKey, convertStringToArrayBufferView(string)).then(convertArrayBufferViewToBase64);
};

var symEncryptObject = function symEncryptObject(hcKey, object) {
    return symEncryptString(hcKey, JSON.stringify(object));
};

var symEncryptBlob = function symEncryptBlob(hcKey, blob) {
    return convertBlobToArrayBufferView(blob).then(function (arrayBufferString) {
        return symEncrypt(hcKey, arrayBufferString);
    });
};

/**
 * Symmetric decryption of data with hcKey
 *
 * @param {Object} hcKey that specifies the crypto primitives
 * @param {ArrayBufferView} encrypted data that should be decrypted
 * @returns {Promise} Resolves to plain data as an ArrayBufferView
 */
var symDecrypt = function symDecrypt(hcKey, ivData) {
    var isTagDecryption = hcKey.t === keyTypes.TAG_ENCRYPTION_KEY;
    var iv = isTagDecryption ? TEK_IV : ivData.slice(0, 16);
    var data = isTagDecryption ? ivData : ivData.slice(16, ivData.length);
    return importKey(hcKey).then(function (key) {
        return crypto.subtle.decrypt({
            name: key.algorithm.name,
            iv: iv
        }, key, data);
    }).then(function (result) {
        return new Uint8Array(result);
    });
};

var symDecryptString = function symDecryptString(hcKey, base64String) {
    return symDecrypt(hcKey, convertBase64ToArrayBufferView(base64String)).then(convertArrayBufferViewToString);
};

var symDecryptObject = function symDecryptObject(hcKey, base64String) {
    return symDecryptString(hcKey, base64String).then(JSON.parse);
};

/**
 * Creates key out of given String (aka password)
 *
 * @param {String} masterKey
 * @returns {Promise} Resolves to from masterKey derived key as a CryptoKey
 */
var deriveKey = function deriveKey(masterKey) {
    return crypto.subtle.importKey('raw', masterKey, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']).then(function (key) {
        return crypto.subtle.deriveKey(PBKDF2, key, AES_GCM, true, ['encrypt', 'decrypt']);
    }).then(function (key) {
        return exportKey(key, keyTypes.PASSWORD_KEY);
    });
};

/**
 * Asymmetric encryption of data with hcKey
 *
 * @param {Object} hcPublicKey - hcKey representation of the a public key
 * @param {ArrayBufferView} data that will be encrypted
 * @returns {Promise} Resolves to encrypted data as an ArrayBufferView
 */
var asymEncrypt = function asymEncrypt(hcPublicKey, data) {
    return importKey(hcPublicKey).then(function (key) {
        return crypto.subtle.encrypt({
            name: key.algorithm.name
        }, key, data);
    }).then(function (result) {
        return new Uint8Array(result);
    });
};

var asymEncryptString = function asymEncryptString(publicKeySPKI, string) {
    return asymEncrypt(publicKeySPKI, convertStringToArrayBufferView(string)).then(convertArrayBufferViewToBase64);
};

/**
 * Asymmetric decryption of data with hcKey
 *
 * @param {Object} hcPrivateKey
 * @param {ArrayBufferView} data
 * @returns {Promise} Resolves to decrypted data as an ArrayBufferView
 */
var asymDecrypt = function asymDecrypt(hcPrivateKey, data) {
    return importKey(hcPrivateKey).then(function (key) {
        return crypto.subtle.decrypt({
            name: key.algorithm.name
        }, key, data);
    }).then(function (result) {
        return new Uint8Array(result);
    });
};

var asymDecryptString = function asymDecryptString(hcPrivateKey, base64String) {
    return asymDecrypt(hcPrivateKey, convertBase64ToArrayBufferView(base64String)).then(convertArrayBufferViewToString);
};

/**
 * Creates a random symmetric key.
 *
 * @param {String} type of the key
 * @returns {Promise} Resolves to a symmetric key as a hcKey object
 */
var generateSymKey = function generateSymKey(type) {
    return (
        // Parameters:
        // 1. Symmetric Encryption algorithm name and its requirements
        // 2. Boolean indicating extractable. which indicates whether or not the raw keying
        //    material may be exported by the application
        //    (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
        // 3. Usage of the key. (http://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
        crypto.subtle.generateKey(AES_GCM, true, ['encrypt', 'decrypt']).then(function (key) {
            return exportKey(key, type);
        })
    );
};

/**
 * Creates a random public-private key pair
 * @param {String} type - type of the keypair 'A' for App, 'U' for User
 * @returns {Promise} Resolves to an object containing a public and a private key as hcKey objects
 */
var generateAsymKeyPair = function generateAsymKeyPair(type) {
    return (
        // Parameters:
        // 1. Asymmetric Encryption algorithm name and its requirements
        // 2. Boolean indicating extractable which indicates whether or not the raw keying
        //    material may be exported by the application
        //    (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
        // 3. Usage of the keys. (http://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
        crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' }
        }, true, ['encrypt', 'decrypt']).then(function (keyPair) {
            return Promise.all([exportKey(keyPair.publicKey, type.PUBLIC_KEY), exportKey(keyPair.privateKey, type.PRIVATE_KEY)]);
        }).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                publicKey = _ref2[0],
                privateKey = _ref2[1];

            return { publicKey: publicKey, privateKey: privateKey };
        })
    );
};

var hcCrypto = {
    deriveKey: deriveKey,
    generateSymKey: generateSymKey,
    generateAsymKeyPair: generateAsymKeyPair,

    importKey: importKey,
    exportKey: exportKey,

    importSymKeyFromBase64: importSymKeyFromBase64,
    exportSymKeyToBase64: exportSymKeyToBase64,

    importPrivateKeyFromPKCS8: importPrivateKeyFromPKCS8,
    exportPrivateKeyToPKCS8: exportPrivateKeyToPKCS8,

    importPublicKeyFromSPKI: importPublicKeyFromSPKI,
    exportPublicKeyToSPKI: exportPublicKeyToSPKI,

    symEncrypt: symEncrypt,
    symEncryptString: symEncryptString,
    symEncryptObject: symEncryptObject,
    symEncryptBlob: symEncryptBlob,
    symDecrypt: symDecrypt,
    symDecryptString: symDecryptString,
    symDecryptObject: symDecryptObject,

    asymEncrypt: asymEncrypt,
    asymEncryptString: asymEncryptString,
    asymDecrypt: asymDecrypt,
    asymDecryptString: asymDecryptString,

    convertStringToArrayBufferView: convertStringToArrayBufferView,
    convertBase64ToArrayBufferView: convertBase64ToArrayBufferView,
    convertObjectToArrayBufferView: convertObjectToArrayBufferView,
    convertBlobToArrayBufferView: convertBlobToArrayBufferView,
    convertArrayBufferViewToString: convertArrayBufferViewToString,
    convertArrayBufferViewToBase64: convertArrayBufferViewToBase64,

    keyTypes: keyTypes
};

exports.default = hcCrypto;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tagKeys = undefined;

var _stringUtils = __webpack_require__(86);

var _stringUtils2 = _interopRequireDefault(_stringUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TAG_DELIMITER = '=';

var ANNOTATION_LABEL = 'custom';

var tagKeys = exports.tagKeys = {
    client: 'client',
    resourceType: 'resourceType'
};

var taggingUtils = {
    generateTags: function generateTags(fhirObject) {
        var _this = this;

        var tagObject = {};
        if (this.clientId) tagObject[tagKeys.client] = this.clientId;
        if (fhirObject.resourceType) tagObject[tagKeys.resourceType] = fhirObject.resourceType;

        return Object.keys(tagObject).map(function (tagKey) {
            return _this.buildTag(tagKey, tagObject[tagKey]);
        });
    },
    generateCustomTags: function generateCustomTags() {
        var _this2 = this;

        var annotationList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        return annotationList.map(function (el) {
            return _this2.buildTag(ANNOTATION_LABEL, el);
        });
    },
    buildTag: function buildTag(key, value) {
        return '' + _stringUtils2.default.prepareForUpload(key) + ('' + TAG_DELIMITER) + ('' + _stringUtils2.default.prepareForUpload(value));
    },
    getTagValueFromList: function getTagValueFromList(tagList, tagKey) {
        var clientTag = tagList.find(function (el) {
            return el.includes('' + tagKey + TAG_DELIMITER);
        });
        return clientTag ? this.getValue(clientTag) : undefined;
    },
    getValue: function getValue(tag) {
        var value = tag.split(TAG_DELIMITER)[1];
        return typeof value === 'string' ? _stringUtils2.default.removePercentEncoding(value) : undefined;
    },
    getAnnotations: function getAnnotations(tagList) {
        var _this3 = this;

        return tagList.reduce(function (annotations, el) {
            if (el.includes('' + ANNOTATION_LABEL + TAG_DELIMITER)) {
                annotations.push(_this3.getValue(el));
            }
            return annotations;
        }, []);
    }
};

exports.default = taggingUtils;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var url = __webpack_require__(46),
    equal = __webpack_require__(8),
    util = __webpack_require__(2),
    SchemaObject = __webpack_require__(18),
    traverse = __webpack_require__(54);

module.exports = resolve;

resolve.normalizeId = normalizeId;
resolve.fullPath = getFullPath;
resolve.url = resolveUrl;
resolve.ids = resolveIds;
resolve.inlineRef = inlineRef;
resolve.schema = resolveSchema;

/**
 * [resolve and compile the references ($ref)]
 * @this   Ajv
 * @param  {Function} compile reference to schema compilation funciton (localCompile)
 * @param  {Object} root object with information about the root schema for the current schema
 * @param  {String} ref reference to resolve
 * @return {Object|Function} schema object (if the schema can be inlined) or validation function
 */
function resolve(compile, root, ref) {
  /* jshint validthis: true */
  var refVal = this._refs[ref];
  if (typeof refVal == 'string') {
    if (this._refs[refVal]) refVal = this._refs[refVal];else return resolve.call(this, compile, root, refVal);
  }

  refVal = refVal || this._schemas[ref];
  if (refVal instanceof SchemaObject) {
    return inlineRef(refVal.schema, this._opts.inlineRefs) ? refVal.schema : refVal.validate || this._compile(refVal);
  }

  var res = resolveSchema.call(this, root, ref);
  var schema, v, baseId;
  if (res) {
    schema = res.schema;
    root = res.root;
    baseId = res.baseId;
  }

  if (schema instanceof SchemaObject) {
    v = schema.validate || compile.call(this, schema.schema, root, undefined, baseId);
  } else if (schema !== undefined) {
    v = inlineRef(schema, this._opts.inlineRefs) ? schema : compile.call(this, schema, root, undefined, baseId);
  }

  return v;
}

/**
 * Resolve schema, its root and baseId
 * @this Ajv
 * @param  {Object} root root object with properties schema, refVal, refs
 * @param  {String} ref  reference to resolve
 * @return {Object} object with properties schema, root, baseId
 */
function resolveSchema(root, ref) {
  /* jshint validthis: true */
  var p = url.parse(ref, false, true),
      refPath = _getFullPath(p),
      baseId = getFullPath(this._getId(root.schema));
  if (refPath !== baseId) {
    var id = normalizeId(refPath);
    var refVal = this._refs[id];
    if (typeof refVal == 'string') {
      return resolveRecursive.call(this, root, refVal, p);
    } else if (refVal instanceof SchemaObject) {
      if (!refVal.validate) this._compile(refVal);
      root = refVal;
    } else {
      refVal = this._schemas[id];
      if (refVal instanceof SchemaObject) {
        if (!refVal.validate) this._compile(refVal);
        if (id == normalizeId(ref)) return { schema: refVal, root: root, baseId: baseId };
        root = refVal;
      } else {
        return;
      }
    }
    if (!root.schema) return;
    baseId = getFullPath(this._getId(root.schema));
  }
  return getJsonPointer.call(this, p, baseId, root.schema, root);
}

/* @this Ajv */
function resolveRecursive(root, ref, parsedRef) {
  /* jshint validthis: true */
  var res = resolveSchema.call(this, root, ref);
  if (res) {
    var schema = res.schema;
    var baseId = res.baseId;
    root = res.root;
    var id = this._getId(schema);
    if (id) baseId = resolveUrl(baseId, id);
    return getJsonPointer.call(this, parsedRef, baseId, schema, root);
  }
}

var PREVENT_SCOPE_CHANGE = util.toHash(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
/* @this Ajv */
function getJsonPointer(parsedRef, baseId, schema, root) {
  /* jshint validthis: true */
  parsedRef.hash = parsedRef.hash || '';
  if (parsedRef.hash.slice(0, 2) != '#/') return;
  var parts = parsedRef.hash.split('/');

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];
    if (part) {
      part = util.unescapeFragment(part);
      schema = schema[part];
      if (schema === undefined) break;
      var id;
      if (!PREVENT_SCOPE_CHANGE[part]) {
        id = this._getId(schema);
        if (id) baseId = resolveUrl(baseId, id);
        if (schema.$ref) {
          var $ref = resolveUrl(baseId, schema.$ref);
          var res = resolveSchema.call(this, root, $ref);
          if (res) {
            schema = res.schema;
            root = res.root;
            baseId = res.baseId;
          }
        }
      }
    }
  }
  if (schema !== undefined && schema !== root.schema) return { schema: schema, root: root, baseId: baseId };
}

var SIMPLE_INLINED = util.toHash(['type', 'format', 'pattern', 'maxLength', 'minLength', 'maxProperties', 'minProperties', 'maxItems', 'minItems', 'maximum', 'minimum', 'uniqueItems', 'multipleOf', 'required', 'enum']);
function inlineRef(schema, limit) {
  if (limit === false) return false;
  if (limit === undefined || limit === true) return checkNoRef(schema);else if (limit) return countKeys(schema) <= limit;
}

function checkNoRef(schema) {
  var item;
  if (Array.isArray(schema)) {
    for (var i = 0; i < schema.length; i++) {
      item = schema[i];
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && !checkNoRef(item)) return false;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return false;
      item = schema[key];
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && !checkNoRef(item)) return false;
    }
  }
  return true;
}

function countKeys(schema) {
  var count = 0,
      item;
  if (Array.isArray(schema)) {
    for (var i = 0; i < schema.length; i++) {
      item = schema[i];
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object') count += countKeys(item);
      if (count == Infinity) return Infinity;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return Infinity;
      if (SIMPLE_INLINED[key]) {
        count++;
      } else {
        item = schema[key];
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object') count += countKeys(item) + 1;
        if (count == Infinity) return Infinity;
      }
    }
  }
  return count;
}

function getFullPath(id, normalize) {
  if (normalize !== false) id = normalizeId(id);
  var p = url.parse(id, false, true);
  return _getFullPath(p);
}

function _getFullPath(p) {
  var protocolSeparator = p.protocol || p.href.slice(0, 2) == '//' ? '//' : '';
  return (p.protocol || '') + protocolSeparator + (p.host || '') + (p.path || '') + '#';
}

var TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
  return id ? id.replace(TRAILING_SLASH_HASH, '') : '';
}

function resolveUrl(baseId, id) {
  id = normalizeId(id);
  return url.resolve(baseId, id);
}

/* @this Ajv */
function resolveIds(schema) {
  var schemaId = normalizeId(this._getId(schema));
  var baseIds = { '': schemaId };
  var fullPaths = { '': getFullPath(schemaId, false) };
  var localRefs = {};
  var self = this;

  traverse(schema, { allKeys: true }, function (sch, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (jsonPtr === '') return;
    var id = self._getId(sch);
    var baseId = baseIds[parentJsonPtr];
    var fullPath = fullPaths[parentJsonPtr] + '/' + parentKeyword;
    if (keyIndex !== undefined) fullPath += '/' + (typeof keyIndex == 'number' ? keyIndex : util.escapeFragment(keyIndex));

    if (typeof id == 'string') {
      id = baseId = normalizeId(baseId ? url.resolve(baseId, id) : id);

      var refVal = self._refs[id];
      if (typeof refVal == 'string') refVal = self._refs[refVal];
      if (refVal && refVal.schema) {
        if (!equal(sch, refVal.schema)) throw new Error('id "' + id + '" resolves to more than one schema');
      } else if (id != normalizeId(fullPath)) {
        if (id[0] == '#') {
          if (localRefs[id] && !equal(sch, localRefs[id])) throw new Error('id "' + id + '" resolves to more than one schema');
          localRefs[id] = sch;
        } else {
          self._refs[id] = fullPath;
        }
      }
    }
    baseIds[jsonPtr] = baseId;
    fullPaths[jsonPtr] = fullPath;
  });

  return localRefs;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = isArray(a),
      arrB = isArray(b),
      i,
      length,
      key;

  if (arrA && arrB) {
    length = a.length;
    if (length != b.length) return false;
    for (i = 0; i < length; i++) {
      if (!equal(a[i], b[i])) return false;
    }return true;
  }

  if (arrA != arrB) return false;

  var dateA = a instanceof Date,
      dateB = b instanceof Date;
  if (dateA != dateB) return false;
  if (dateA && dateB) return a.getTime() == b.getTime();

  var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp;
  if (regexpA != regexpB) return false;
  if (regexpA && regexpB) return a.toString() == b.toString();

  if (a instanceof Object && b instanceof Object) {
    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) return false;

    for (i = 0; i < length; i++) {
      if (!hasProp.call(b, keys[i])) return false;
    }for (i = 0; i < length; i++) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var resolve = __webpack_require__(7);

module.exports = {
  Validation: errorSubclass(ValidationError),
  MissingRef: errorSubclass(MissingRefError)
};

function ValidationError(errors) {
  this.message = 'validation failed';
  this.errors = errors;
  this.ajv = this.validation = true;
}

MissingRefError.message = function (baseId, ref) {
  return 'can\'t resolve reference ' + ref + ' from id ' + baseId;
};

function MissingRefError(baseId, ref, message) {
  this.message = message || MissingRefError.message(baseId, ref);
  this.missingRef = resolve.url(baseId, ref);
  this.missingSchema = resolve.normalizeId(resolve.fullPath(this.missingRef));
}

function errorSubclass(Subclass) {
  Subclass.prototype = Object.create(Error.prototype);
  Subclass.prototype.constructor = Subclass;
  return Subclass;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _userRoutes = __webpack_require__(84);

var _userRoutes2 = _interopRequireDefault(_userRoutes);

var _crypto = __webpack_require__(4);

var _crypto2 = _interopRequireDefault(_crypto);

var _taggingUtils = __webpack_require__(6);

var _taggingUtils2 = _interopRequireDefault(_taggingUtils);

var _SetupError = __webpack_require__(87);

var _SetupError2 = _interopRequireDefault(_SetupError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var userService = {
    currentUserId: null,
    currentAppId: null,
    users: {},
    privateKey: null,

    resetUser: function resetUser() {
        this.users = {};
        this.currentUserId = null;
        this.currentAppId = null;
        this.privateKey = null;
    },


    /**
     * Sets the loggedin user's privateKey
     * @param {String} base64PrivateKey - a privateKey of the loggedin user as a base64 string
    */
    setPrivateKey: function setPrivateKey(base64PrivateKey) {
        this.privateKey = JSON.parse(atob(base64PrivateKey));
    },
    getCurrentUserId: function getCurrentUserId() {
        return this.currentUserId;
    },
    getCurrentAppId: function getCurrentAppId() {
        return this.currentAppId;
    },
    isCurrentUser: function isCurrentUser(userId) {
        return userId === this.currentUserId;
    },


    /**
     *
     *  @param {String} userId - userId of the user whos data is requested.
     *      Loggedin user by default(even if this.currentUserId is not set yet).
     *  @returns {Promise} Resolves to a userObject that contains userId,
     *      commonKey and tagEncryptionKey
     */
    getUser: function getUser() {
        var userId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentUserId;

        return this.users[userId] ? Promise.resolve(this.users[userId]) : this.pullUser(userId);
    },


    /**
     *  @param {String} userId - userId of the user whos data is requested.
     *      Loggedin user by default.
     *  @returns {Promise} Resolves to a userObject that contains userId,
     *      commonKey and tagEncryptionKey
     */
    pullUser: function pullUser(userId) {
        var _this = this;

        if (!this.privateKey) {
            return Promise.reject(new _SetupError2.default(_SetupError.NOT_SETUP));
        }
        var commonKey = void 0;
        return _userRoutes2.default.fetchUserInfo(userId).then(function (res) {
            return _crypto2.default.asymDecryptString(_this.privateKey, res.common_key).then(JSON.parse).then(function (key) {
                commonKey = key;
                return _crypto2.default.symDecryptObject(commonKey, res.tag_encryption_key);
            }).then(function (tek) {
                if (!userId) {
                    _this.currentUserId = res.sub;
                    _this.currentAppId = res.app_id;
                    userId = _this.currentUserId;
                }

                _this.users[userId] = {
                    id: userId,
                    commonKey: commonKey,
                    tek: tek
                };
                return _this.users[userId];
            });
        });
    },


    /**
     *  @returns {Promise} Resolves to an array of received permissions.
     *      A permission contains:
     *          - permissionId: the id of the permission
     *          - appId: the id of the user-client combination that is allowed to access data
     *          - owner: the id of the user that owns the data
     *          - grantee: the id of the user that received the permission
     *          - granteePublicKey: the publicKey of the grantee (base64 encoded)
     *          - commonKey: the common key of the owner, encrypted with the grantee's
     *              public key (base64 encoded)
     *          - scope: the scope of the permission (array of strings)
     *
     * TODO: decide on which data should be exposed
     */
    getReceivedPermissions: function getReceivedPermissions() {
        var currentUserId = this.getCurrentUserId();
        if (!currentUserId) {
            return Promise.reject(new _SetupError2.default(_SetupError.NOT_SETUP));
        }
        return _userRoutes2.default.getReceivedPermissions(currentUserId).then(function (permissions) {
            return permissions.map(function (_ref) {
                var appId = _ref.app_id,
                    commonKey = _ref.common_key,
                    grantee = _ref.grantee,
                    granteePublicKey = _ref.grantee_public_key,
                    id = _ref.id,
                    owner = _ref.owner,
                    scope = _ref.scope;
                return {
                    appId: appId, commonKey: commonKey, grantee: grantee, granteePublicKey: granteePublicKey, id: id, owner: owner, scope: scope.split(' ')
                };
            });
        });
    },


    /**
     * @param {String} appId - the id of the user-client tuple the permission shall be granted to
     * @param {Array} annotations - the annotations that shall be shared.
     * @returns {Promise}
     */
    grantPermission: function grantPermission(appId) {
        var annotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var scope = ['rec:r', 'rec:w', 'attachment:r', 'attachment:w', 'user:r', 'user:w', 'user:q'];
        var ownerId = void 0;
        var granteeId = void 0;

        return Promise.all([_userRoutes2.default.getCAPs(appId), this.getUser()]).then(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                CAPs = _ref3[0],
                user = _ref3[1];

            var CAP = CAPs[0];
            ownerId = user.id;
            granteeId = CAP.owner;
            var publicKey = JSON.parse(atob(CAP.grantee_public_key));
            var commonKeyString = JSON.stringify(user.commonKey);
            var commonKeyPromise = _crypto2.default.asymEncryptString(publicKey, commonKeyString);

            var annotationsPromise = Promise.all(annotations.map(function (annotation) {
                return _crypto2.default.symEncryptString(user.tek, _taggingUtils2.default.buildTag('custom', annotation));
            }));

            return Promise.all([commonKeyPromise, annotationsPromise]);
        }).then(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                commonKey = _ref5[0],
                cipherAnnotations = _ref5[1];

            var annotationScope = cipherAnnotations.map(function (annotation) {
                return 'tag:' + annotation;
            });
            return _userRoutes2.default.grantPermission(ownerId, granteeId, appId, commonKey, [].concat(scope, _toConsumableArray(annotationScope)));
        });
    }
};

exports.default = userService;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ValidationError = __webpack_require__(3);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* eslint-disable complexity */


var HCAttachment = function HCAttachment(_ref) {
    var file = _ref.file,
        title = _ref.title,
        type = _ref.type,
        creationDate = _ref.creationDate,
        id = _ref.id;

    _classCallCheck(this, HCAttachment);

    if (!((file instanceof File || !file) && (typeof title === 'string' || !title) && (typeof type === 'string' || !type) && (creationDate instanceof Date || !creationDate) && (typeof id === 'string' || !id))) {
        throw new _ValidationError2.default('HCAttachment: Invalid arguments');
    }
    this.file = file;
    this.title = title || (file ? file.name : undefined);
    this.type = type || (file ? file.type : undefined);
    this.creationDate = creationDate || (file ? file.lastModifiedDate : undefined);
    this.id = id;
};

exports.default = HCAttachment;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var documentRoutes = {
    getFileDownloadURL: function getFileDownloadURL(ownerId, recordId, fileId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + ownerId + '/documents/' + recordId + '/files/' + fileId + '/download_access_token', { authorize: true, ownerId: ownerId });
    },
    getFileUploadURLs: function getFileUploadURLs(ownerId, recordId, fileNumber) {
        var body = { file_number: fileNumber };
        return _hcRequest2.default.submit('POST', _config2.default.apiUrl() + '/users/' + ownerId + '/documents/' + recordId + '/tokens', { body: body, authorize: true, ownerId: ownerId });
    },
    createRecord: function createRecord(ownerId, data) {
        return _hcRequest2.default.submit('POST', _config2.default.apiUrl() + '/users/' + ownerId + '/records', { body: data, authorize: true, ownerId: ownerId });
    },
    updateRecord: function updateRecord(ownerId, recordId, data) {
        return _hcRequest2.default.submit('PUT', _config2.default.apiUrl() + '/users/' + ownerId + '/records/' + recordId, { body: data, authorize: true, ownerId: ownerId });
    },
    searchRecords: function searchRecords(ownerId, queryParams) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + ownerId + '/records', {
            query: queryParams,
            authorize: true,
            includeResponseHeaders: true,
            ownerId: ownerId
        }).then(function (_ref) {
            var body = _ref.body,
                headers = _ref.headers;
            return { records: body, totalCount: headers['x-total-count'] };
        });
    },
    getRecordsCount: function getRecordsCount(ownerId, queryParams) {
        return _hcRequest2.default.submit('HEAD', _config2.default.apiUrl() + '/users/' + ownerId + '/records', {
            query: queryParams,
            authorize: true,
            includeResponseHeaders: true,
            ownerId: ownerId
        }).then(function (_ref2) {
            var headers = _ref2.headers;
            return { totalCount: headers['x-total-count'] };
        });
    },
    downloadRecord: function downloadRecord(ownerId, recordId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + ownerId + '/records/' + recordId, { authorize: true, ownerId: ownerId });
    },
    deleteRecord: function deleteRecord(ownerId, recordId) {
        return _hcRequest2.default.submit('DELETE', _config2.default.apiUrl() + '/users/' + ownerId + '/records/' + recordId, { authorize: true, ownerId: ownerId });
    },
    fetchAttachmentKey: function fetchAttachmentKey(ownerId, recordId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + ownerId + '/records/' + recordId + '/attachment_key', { authorize: true, ownerId: ownerId });
    }
};

exports.default = documentRoutes;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self !== 'undefined') {
  // Web Worker
  root = self;
} else {
  // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = undefined;
}

var Emitter = __webpack_require__(36);
var RequestBase = __webpack_require__(37);
var isObject = __webpack_require__(15);
var ResponseBase = __webpack_require__(38);
var Agent = __webpack_require__(40);

/**
 * Noop.
 */

function noop() {};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function (method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
};

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim ? function (s) {
  return s.trim();
} : function (s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function (v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for (var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify
};

/**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return (/[\/+]json($|[^-\w])/.test(mime)
  );
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD' ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (str) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function () {
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function () {
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch (e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
      }
    } catch (custom_err) {
      new_err = custom_err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function (user, pass, options) {
  if (1 === arguments.length) pass = '';
  if ((typeof pass === 'undefined' ? 'undefined' : _typeof(pass)) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto'
    };
  }

  var encoder = function encoder(string) {
    if ('function' === typeof btoa) {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function (val) {
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function (err, res) {
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function () {
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function () {
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function () {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function () {
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try {
      status = xhr.status;
    } catch (e) {
      status = 0;
    }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function handleProgress(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch (e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field)) xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

request.agent = function () {
  return new Agent();
};

["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (method) {
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    var req = new request.Request(method, url);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
});

Agent.prototype.del = Agent.prototype['delete'];

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function (url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function (url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function (url, data, fn) {
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function (url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function (url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function (url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isObject(obj) {
  return null !== obj && 'object' === (typeof obj === 'undefined' ? 'undefined' : _typeof(obj));
}

module.exports = isObject;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var compileSchema = __webpack_require__(45),
    resolve = __webpack_require__(7),
    Cache = __webpack_require__(55),
    SchemaObject = __webpack_require__(18),
    stableStringify = __webpack_require__(19),
    formats = __webpack_require__(56),
    rules = __webpack_require__(57),
    $dataMetaSchema = __webpack_require__(76),
    patternGroups = __webpack_require__(77),
    util = __webpack_require__(2),
    co = __webpack_require__(21);

module.exports = Ajv;

Ajv.prototype.validate = validate;
Ajv.prototype.compile = compile;
Ajv.prototype.addSchema = addSchema;
Ajv.prototype.addMetaSchema = addMetaSchema;
Ajv.prototype.validateSchema = validateSchema;
Ajv.prototype.getSchema = getSchema;
Ajv.prototype.removeSchema = removeSchema;
Ajv.prototype.addFormat = addFormat;
Ajv.prototype.errorsText = errorsText;

Ajv.prototype._addSchema = _addSchema;
Ajv.prototype._compile = _compile;

Ajv.prototype.compileAsync = __webpack_require__(78);
var customKeyword = __webpack_require__(79);
Ajv.prototype.addKeyword = customKeyword.add;
Ajv.prototype.getKeyword = customKeyword.get;
Ajv.prototype.removeKeyword = customKeyword.remove;

var errorClasses = __webpack_require__(9);
Ajv.ValidationError = errorClasses.Validation;
Ajv.MissingRefError = errorClasses.MissingRef;
Ajv.$dataMetaSchema = $dataMetaSchema;

var META_SCHEMA_ID = 'http://json-schema.org/draft-06/schema';

var META_IGNORE_OPTIONS = ['removeAdditional', 'useDefaults', 'coerceTypes'];
var META_SUPPORT_DATA = ['/properties'];

/**
 * Creates validator instance.
 * Usage: `Ajv(opts)`
 * @param {Object} opts optional options
 * @return {Object} ajv instance
 */
function Ajv(opts) {
  if (!(this instanceof Ajv)) return new Ajv(opts);
  opts = this._opts = util.copy(opts) || {};
  setLogger(this);
  this._schemas = {};
  this._refs = {};
  this._fragments = {};
  this._formats = formats(opts.format);
  var schemaUriFormat = this._schemaUriFormat = this._formats['uri-reference'];
  this._schemaUriFormatFunc = function (str) {
    return schemaUriFormat.test(str);
  };

  this._cache = opts.cache || new Cache();
  this._loadingSchemas = {};
  this._compilations = [];
  this.RULES = rules();
  this._getId = chooseGetId(opts);

  opts.loopRequired = opts.loopRequired || Infinity;
  if (opts.errorDataPath == 'property') opts._errorDataPathProperty = true;
  if (opts.serialize === undefined) opts.serialize = stableStringify;
  this._metaOpts = getMetaSchemaOptions(this);

  if (opts.formats) addInitialFormats(this);
  addDraft6MetaSchema(this);
  if (_typeof(opts.meta) == 'object') this.addMetaSchema(opts.meta);
  addInitialSchemas(this);
  if (opts.patternGroups) patternGroups(this);
}

/**
 * Validate data using schema
 * Schema will be compiled and cached (using serialized JSON as key. [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) is used to serialize.
 * @this   Ajv
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Any} data to be validated
 * @return {Boolean} validation result. Errors from the last validation will be available in `ajv.errors` (and also in compiled schema: `schema.errors`).
 */
function validate(schemaKeyRef, data) {
  var v;
  if (typeof schemaKeyRef == 'string') {
    v = this.getSchema(schemaKeyRef);
    if (!v) throw new Error('no schema with key or ref "' + schemaKeyRef + '"');
  } else {
    var schemaObj = this._addSchema(schemaKeyRef);
    v = schemaObj.validate || this._compile(schemaObj);
  }

  var valid = v(data);
  if (v.$async === true) return this._opts.async == '*' ? co(valid) : valid;
  this.errors = v.errors;
  return valid;
}

/**
 * Create validating function for passed schema.
 * @this   Ajv
 * @param  {Object} schema schema object
 * @param  {Boolean} _meta true if schema is a meta-schema. Used internally to compile meta schemas of custom keywords.
 * @return {Function} validating function
 */
function compile(schema, _meta) {
  var schemaObj = this._addSchema(schema, undefined, _meta);
  return schemaObj.validate || this._compile(schemaObj);
}

/**
 * Adds schema to the instance.
 * @this   Ajv
 * @param {Object|Array} schema schema or array of schemas. If array is passed, `key` and other parameters will be ignored.
 * @param {String} key Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
 * @param {Boolean} _skipValidation true to skip schema validation. Used internally, option validateSchema should be used instead.
 * @param {Boolean} _meta true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
 * @return {Ajv} this for method chaining
 */
function addSchema(schema, key, _skipValidation, _meta) {
  if (Array.isArray(schema)) {
    for (var i = 0; i < schema.length; i++) {
      this.addSchema(schema[i], undefined, _skipValidation, _meta);
    }return this;
  }
  var id = this._getId(schema);
  if (id !== undefined && typeof id != 'string') throw new Error('schema id must be string');
  key = resolve.normalizeId(key || id);
  checkUnique(this, key);
  this._schemas[key] = this._addSchema(schema, _skipValidation, _meta, true);
  return this;
}

/**
 * Add schema that will be used to validate other schemas
 * options in META_IGNORE_OPTIONS are alway set to false
 * @this   Ajv
 * @param {Object} schema schema object
 * @param {String} key optional schema key
 * @param {Boolean} skipValidation true to skip schema validation, can be used to override validateSchema option for meta-schema
 * @return {Ajv} this for method chaining
 */
function addMetaSchema(schema, key, skipValidation) {
  this.addSchema(schema, key, skipValidation, true);
  return this;
}

/**
 * Validate schema
 * @this   Ajv
 * @param {Object} schema schema to validate
 * @param {Boolean} throwOrLogError pass true to throw (or log) an error if invalid
 * @return {Boolean} true if schema is valid
 */
function validateSchema(schema, throwOrLogError) {
  var $schema = schema.$schema;
  if ($schema !== undefined && typeof $schema != 'string') throw new Error('$schema must be a string');
  $schema = $schema || this._opts.defaultMeta || defaultMeta(this);
  if (!$schema) {
    this.logger.warn('meta-schema not available');
    this.errors = null;
    return true;
  }
  var currentUriFormat = this._formats.uri;
  this._formats.uri = typeof currentUriFormat == 'function' ? this._schemaUriFormatFunc : this._schemaUriFormat;
  var valid;
  try {
    valid = this.validate($schema, schema);
  } finally {
    this._formats.uri = currentUriFormat;
  }
  if (!valid && throwOrLogError) {
    var message = 'schema is invalid: ' + this.errorsText();
    if (this._opts.validateSchema == 'log') this.logger.error(message);else throw new Error(message);
  }
  return valid;
}

function defaultMeta(self) {
  var meta = self._opts.meta;
  self._opts.defaultMeta = (typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) == 'object' ? self._getId(meta) || meta : self.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined;
  return self._opts.defaultMeta;
}

/**
 * Get compiled schema from the instance by `key` or `ref`.
 * @this   Ajv
 * @param  {String} keyRef `key` that was passed to `addSchema` or full schema reference (`schema.id` or resolved id).
 * @return {Function} schema validating function (with property `schema`).
 */
function getSchema(keyRef) {
  var schemaObj = _getSchemaObj(this, keyRef);
  switch (typeof schemaObj === 'undefined' ? 'undefined' : _typeof(schemaObj)) {
    case 'object':
      return schemaObj.validate || this._compile(schemaObj);
    case 'string':
      return this.getSchema(schemaObj);
    case 'undefined':
      return _getSchemaFragment(this, keyRef);
  }
}

function _getSchemaFragment(self, ref) {
  var res = resolve.schema.call(self, { schema: {} }, ref);
  if (res) {
    var schema = res.schema,
        root = res.root,
        baseId = res.baseId;
    var v = compileSchema.call(self, schema, root, undefined, baseId);
    self._fragments[ref] = new SchemaObject({
      ref: ref,
      fragment: true,
      schema: schema,
      root: root,
      baseId: baseId,
      validate: v
    });
    return v;
  }
}

function _getSchemaObj(self, keyRef) {
  keyRef = resolve.normalizeId(keyRef);
  return self._schemas[keyRef] || self._refs[keyRef] || self._fragments[keyRef];
}

/**
 * Remove cached schema(s).
 * If no parameter is passed all schemas but meta-schemas are removed.
 * If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
 * Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
 * @this   Ajv
 * @param  {String|Object|RegExp} schemaKeyRef key, ref, pattern to match key/ref or schema object
 * @return {Ajv} this for method chaining
 */
function removeSchema(schemaKeyRef) {
  if (schemaKeyRef instanceof RegExp) {
    _removeAllSchemas(this, this._schemas, schemaKeyRef);
    _removeAllSchemas(this, this._refs, schemaKeyRef);
    return this;
  }
  switch (typeof schemaKeyRef === 'undefined' ? 'undefined' : _typeof(schemaKeyRef)) {
    case 'undefined':
      _removeAllSchemas(this, this._schemas);
      _removeAllSchemas(this, this._refs);
      this._cache.clear();
      return this;
    case 'string':
      var schemaObj = _getSchemaObj(this, schemaKeyRef);
      if (schemaObj) this._cache.del(schemaObj.cacheKey);
      delete this._schemas[schemaKeyRef];
      delete this._refs[schemaKeyRef];
      return this;
    case 'object':
      var serialize = this._opts.serialize;
      var cacheKey = serialize ? serialize(schemaKeyRef) : schemaKeyRef;
      this._cache.del(cacheKey);
      var id = this._getId(schemaKeyRef);
      if (id) {
        id = resolve.normalizeId(id);
        delete this._schemas[id];
        delete this._refs[id];
      }
  }
  return this;
}

function _removeAllSchemas(self, schemas, regex) {
  for (var keyRef in schemas) {
    var schemaObj = schemas[keyRef];
    if (!schemaObj.meta && (!regex || regex.test(keyRef))) {
      self._cache.del(schemaObj.cacheKey);
      delete schemas[keyRef];
    }
  }
}

/* @this   Ajv */
function _addSchema(schema, skipValidation, meta, shouldAddSchema) {
  if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) != 'object' && typeof schema != 'boolean') throw new Error('schema should be object or boolean');
  var serialize = this._opts.serialize;
  var cacheKey = serialize ? serialize(schema) : schema;
  var cached = this._cache.get(cacheKey);
  if (cached) return cached;

  shouldAddSchema = shouldAddSchema || this._opts.addUsedSchema !== false;

  var id = resolve.normalizeId(this._getId(schema));
  if (id && shouldAddSchema) checkUnique(this, id);

  var willValidate = this._opts.validateSchema !== false && !skipValidation;
  var recursiveMeta;
  if (willValidate && !(recursiveMeta = id && id == resolve.normalizeId(schema.$schema))) this.validateSchema(schema, true);

  var localRefs = resolve.ids.call(this, schema);

  var schemaObj = new SchemaObject({
    id: id,
    schema: schema,
    localRefs: localRefs,
    cacheKey: cacheKey,
    meta: meta
  });

  if (id[0] != '#' && shouldAddSchema) this._refs[id] = schemaObj;
  this._cache.put(cacheKey, schemaObj);

  if (willValidate && recursiveMeta) this.validateSchema(schema, true);

  return schemaObj;
}

/* @this   Ajv */
function _compile(schemaObj, root) {
  if (schemaObj.compiling) {
    schemaObj.validate = callValidate;
    callValidate.schema = schemaObj.schema;
    callValidate.errors = null;
    callValidate.root = root ? root : callValidate;
    if (schemaObj.schema.$async === true) callValidate.$async = true;
    return callValidate;
  }
  schemaObj.compiling = true;

  var currentOpts;
  if (schemaObj.meta) {
    currentOpts = this._opts;
    this._opts = this._metaOpts;
  }

  var v;
  try {
    v = compileSchema.call(this, schemaObj.schema, root, schemaObj.localRefs);
  } finally {
    schemaObj.compiling = false;
    if (schemaObj.meta) this._opts = currentOpts;
  }

  schemaObj.validate = v;
  schemaObj.refs = v.refs;
  schemaObj.refVal = v.refVal;
  schemaObj.root = v.root;
  return v;

  function callValidate() {
    var _validate = schemaObj.validate;
    var result = _validate.apply(null, arguments);
    callValidate.errors = _validate.errors;
    return result;
  }
}

function chooseGetId(opts) {
  switch (opts.schemaId) {
    case '$id':
      return _get$Id;
    case 'id':
      return _getId;
    default:
      return _get$IdOrId;
  }
}

/* @this   Ajv */
function _getId(schema) {
  if (schema.$id) this.logger.warn('schema $id ignored', schema.$id);
  return schema.id;
}

/* @this   Ajv */
function _get$Id(schema) {
  if (schema.id) this.logger.warn('schema id ignored', schema.id);
  return schema.$id;
}

function _get$IdOrId(schema) {
  if (schema.$id && schema.id && schema.$id != schema.id) throw new Error('schema $id is different from id');
  return schema.$id || schema.id;
}

/**
 * Convert array of error message objects to string
 * @this   Ajv
 * @param  {Array<Object>} errors optional array of validation errors, if not passed errors from the instance are used.
 * @param  {Object} options optional options with properties `separator` and `dataVar`.
 * @return {String} human readable string with all errors descriptions
 */
function errorsText(errors, options) {
  errors = errors || this.errors;
  if (!errors) return 'No errors';
  options = options || {};
  var separator = options.separator === undefined ? ', ' : options.separator;
  var dataVar = options.dataVar === undefined ? 'data' : options.dataVar;

  var text = '';
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    if (e) text += dataVar + e.dataPath + ' ' + e.message + separator;
  }
  return text.slice(0, -separator.length);
}

/**
 * Add custom format
 * @this   Ajv
 * @param {String} name format name
 * @param {String|RegExp|Function} format string is converted to RegExp; function should return boolean (true when valid)
 * @return {Ajv} this for method chaining
 */
function addFormat(name, format) {
  if (typeof format == 'string') format = new RegExp(format);
  this._formats[name] = format;
  return this;
}

function addDraft6MetaSchema(self) {
  var $dataSchema;
  if (self._opts.$data) {
    $dataSchema = __webpack_require__(81);
    self.addMetaSchema($dataSchema, $dataSchema.$id, true);
  }
  if (self._opts.meta === false) return;
  var metaSchema = __webpack_require__(82);
  if (self._opts.$data) metaSchema = $dataMetaSchema(metaSchema, META_SUPPORT_DATA);
  self.addMetaSchema(metaSchema, META_SCHEMA_ID, true);
  self._refs['http://json-schema.org/schema'] = META_SCHEMA_ID;
}

function addInitialSchemas(self) {
  var optsSchemas = self._opts.schemas;
  if (!optsSchemas) return;
  if (Array.isArray(optsSchemas)) self.addSchema(optsSchemas);else for (var key in optsSchemas) {
    self.addSchema(optsSchemas[key], key);
  }
}

function addInitialFormats(self) {
  for (var name in self._opts.formats) {
    var format = self._opts.formats[name];
    self.addFormat(name, format);
  }
}

function checkUnique(self, id) {
  if (self._schemas[id] || self._refs[id]) throw new Error('schema with key or id "' + id + '" already exists');
}

function getMetaSchemaOptions(self) {
  var metaOpts = util.copy(self._opts);
  for (var i = 0; i < META_IGNORE_OPTIONS.length; i++) {
    delete metaOpts[META_IGNORE_OPTIONS[i]];
  }return metaOpts;
}

function setLogger(self) {
  var logger = self._opts.logger;
  if (logger === false) {
    self.logger = { log: noop, warn: noop, error: noop };
  } else {
    if (logger === undefined) logger = console;
    if (!((typeof logger === 'undefined' ? 'undefined' : _typeof(logger)) == 'object' && logger.log && logger.warn && logger.error)) throw new Error('logger must implement log, warn and error methods');
    self.logger = logger;
  }
}

function noop() {}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(2);

module.exports = SchemaObject;

function SchemaObject(obj) {
  util.copy(obj, this);
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (data, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var cycles = typeof opts.cycles === 'boolean' ? opts.cycles : false;

    var cmp = opts.cmp && function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    }(opts.cmp);

    var seen = [];
    return function stringify(node) {
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        if (node === undefined) return;
        if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
        if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') return JSON.stringify(node);

        var i, out;
        if (Array.isArray(node)) {
            out = '[';
            for (i = 0; i < node.length; i++) {
                if (i) out += ',';
                out += stringify(node[i]) || 'null';
            }
            return out + ']';
        }

        if (node === null) return 'null';

        if (seen.indexOf(node) !== -1) {
            if (cycles) return JSON.stringify('__cycle__');
            throw new TypeError('Converting circular structure to JSON');
        }

        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = '';
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);

            if (!value) continue;
            if (out) out += ',';
            out += JSON.stringify(key) + ':' + value;
        }
        seen.splice(seenIndex, 1);
        return '{' + out + '}';
    }(data);
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_validate(it, $keyword, $ruleType) {
  var out = '';
  var $async = it.schema.$async === true,
      $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref'),
      $id = it.self._getId(it.schema);
  if (it.isTop) {
    if ($async) {
      it.async = true;
      var $es7 = it.opts.async == 'es7';
      it.yieldAwait = $es7 ? 'await' : 'yield';
    }
    out += ' var validate = ';
    if ($async) {
      if ($es7) {
        out += ' (async function ';
      } else {
        if (it.opts.async != '*') {
          out += 'co.wrap';
        }
        out += '(function* ';
      }
    } else {
      out += ' (function ';
    }
    out += ' (data, dataPath, parentData, parentDataProperty, rootData) { \'use strict\'; ';
    if ($id && (it.opts.sourceCode || it.opts.processCode)) {
      out += ' ' + ('/\*# sourceURL=' + $id + ' */') + ' ';
    }
  }
  if (typeof it.schema == 'boolean' || !($refKeywords || it.schema.$ref)) {
    var $keyword = 'false schema';
    var $lvl = it.level;
    var $dataLvl = it.dataLevel;
    var $schema = it.schema[$keyword];
    var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
    var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
    var $breakOnError = !it.opts.allErrors;
    var $errorKeyword;
    var $data = 'data' + ($dataLvl || '');
    var $valid = 'valid' + $lvl;
    if (it.schema === false) {
      if (it.isTop) {
        $breakOnError = true;
      } else {
        out += ' var ' + $valid + ' = false; ';
      }
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = ''; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ($errorKeyword || 'false schema') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
        if (it.opts.messages !== false) {
          out += ' , message: \'boolean schema is false\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      var __err = out;
      out = $$outStack.pop();
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError([' + __err + ']); ';
        } else {
          out += ' validate.errors = [' + __err + ']; return false; ';
        }
      } else {
        out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      }
    } else {
      if (it.isTop) {
        if ($async) {
          out += ' return data; ';
        } else {
          out += ' validate.errors = null; return true; ';
        }
      } else {
        out += ' var ' + $valid + ' = true; ';
      }
    }
    if (it.isTop) {
      out += ' }); return validate; ';
    }
    return out;
  }
  if (it.isTop) {
    var $top = it.isTop,
        $lvl = it.level = 0,
        $dataLvl = it.dataLevel = 0,
        $data = 'data';
    it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));
    it.baseId = it.baseId || it.rootId;
    delete it.isTop;
    it.dataPathArr = [undefined];
    out += ' var vErrors = null; ';
    out += ' var errors = 0;     ';
    out += ' if (rootData === undefined) rootData = data; ';
  } else {
    var $lvl = it.level,
        $dataLvl = it.dataLevel,
        $data = 'data' + ($dataLvl || '');
    if ($id) it.baseId = it.resolve.url(it.baseId, $id);
    if ($async && !it.async) throw new Error('async schema in sync schema');
    out += ' var errs_' + $lvl + ' = errors;';
  }
  var $valid = 'valid' + $lvl,
      $breakOnError = !it.opts.allErrors,
      $closingBraces1 = '',
      $closingBraces2 = '';
  var $errorKeyword;
  var $typeSchema = it.schema.type,
      $typeIsArray = Array.isArray($typeSchema);
  if ($typeIsArray && $typeSchema.length == 1) {
    $typeSchema = $typeSchema[0];
    $typeIsArray = false;
  }
  if (it.schema.$ref && $refKeywords) {
    if (it.opts.extendRefs == 'fail') {
      throw new Error('$ref: validation keywords used in schema at path "' + it.errSchemaPath + '" (see option extendRefs)');
    } else if (it.opts.extendRefs !== true) {
      $refKeywords = false;
      it.logger.warn('$ref: keywords ignored in schema at path "' + it.errSchemaPath + '"');
    }
  }
  if ($typeSchema) {
    if (it.opts.coerceTypes) {
      var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema);
    }
    var $rulesGroup = it.RULES.types[$typeSchema];
    if ($coerceToTypes || $typeIsArray || $rulesGroup === true || $rulesGroup && !$shouldUseGroup($rulesGroup)) {
      var $schemaPath = it.schemaPath + '.type',
          $errSchemaPath = it.errSchemaPath + '/type';
      var $schemaPath = it.schemaPath + '.type',
          $errSchemaPath = it.errSchemaPath + '/type',
          $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';
      out += ' if (' + it.util[$method]($typeSchema, $data, true) + ') { ';
      if ($coerceToTypes) {
        var $dataType = 'dataType' + $lvl,
            $coerced = 'coerced' + $lvl;
        out += ' var ' + $dataType + ' = typeof ' + $data + '; ';
        if (it.opts.coerceTypes == 'array') {
          out += ' if (' + $dataType + ' == \'object\' && Array.isArray(' + $data + ')) ' + $dataType + ' = \'array\'; ';
        }
        out += ' var ' + $coerced + ' = undefined; ';
        var $bracesCoercion = '';
        var arr1 = $coerceToTypes;
        if (arr1) {
          var $type,
              $i = -1,
              l1 = arr1.length - 1;
          while ($i < l1) {
            $type = arr1[$i += 1];
            if ($i) {
              out += ' if (' + $coerced + ' === undefined) { ';
              $bracesCoercion += '}';
            }
            if (it.opts.coerceTypes == 'array' && $type != 'array') {
              out += ' if (' + $dataType + ' == \'array\' && ' + $data + '.length == 1) { ' + $coerced + ' = ' + $data + ' = ' + $data + '[0]; ' + $dataType + ' = typeof ' + $data + ';  } ';
            }
            if ($type == 'string') {
              out += ' if (' + $dataType + ' == \'number\' || ' + $dataType + ' == \'boolean\') ' + $coerced + ' = \'\' + ' + $data + '; else if (' + $data + ' === null) ' + $coerced + ' = \'\'; ';
            } else if ($type == 'number' || $type == 'integer') {
              out += ' if (' + $dataType + ' == \'boolean\' || ' + $data + ' === null || (' + $dataType + ' == \'string\' && ' + $data + ' && ' + $data + ' == +' + $data + ' ';
              if ($type == 'integer') {
                out += ' && !(' + $data + ' % 1)';
              }
              out += ')) ' + $coerced + ' = +' + $data + '; ';
            } else if ($type == 'boolean') {
              out += ' if (' + $data + ' === \'false\' || ' + $data + ' === 0 || ' + $data + ' === null) ' + $coerced + ' = false; else if (' + $data + ' === \'true\' || ' + $data + ' === 1) ' + $coerced + ' = true; ';
            } else if ($type == 'null') {
              out += ' if (' + $data + ' === \'\' || ' + $data + ' === 0 || ' + $data + ' === false) ' + $coerced + ' = null; ';
            } else if (it.opts.coerceTypes == 'array' && $type == 'array') {
              out += ' if (' + $dataType + ' == \'string\' || ' + $dataType + ' == \'number\' || ' + $dataType + ' == \'boolean\' || ' + $data + ' == null) ' + $coerced + ' = [' + $data + ']; ';
            }
          }
        }
        out += ' ' + $bracesCoercion + ' if (' + $coerced + ' === undefined) {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + $typeSchema.join(",");
          } else {
            out += '' + $typeSchema;
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + $typeSchema.join(",");
            } else {
              out += '' + $typeSchema;
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else {  ';
        var $parentData = $dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData',
            $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
        out += ' ' + $data + ' = ' + $coerced + '; ';
        if (!$dataLvl) {
          out += 'if (' + $parentData + ' !== undefined)';
        }
        out += ' ' + $parentData + '[' + $parentDataProperty + '] = ' + $coerced + '; } ';
      } else {
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + $typeSchema.join(",");
          } else {
            out += '' + $typeSchema;
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + $typeSchema.join(",");
            } else {
              out += '' + $typeSchema;
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
      }
      out += ' } ';
    }
  }
  if (it.schema.$ref && !$refKeywords) {
    out += ' ' + it.RULES.all.$ref.code(it, '$ref') + ' ';
    if ($breakOnError) {
      out += ' } if (errors === ';
      if ($top) {
        out += '0';
      } else {
        out += 'errs_' + $lvl;
      }
      out += ') { ';
      $closingBraces2 += '}';
    }
  } else {
    if (it.opts.v5 && it.schema.patternGroups) {
      it.logger.warn('keyword "patternGroups" is deprecated and disabled. Use option patternGroups: true to enable.');
    }
    var arr2 = it.RULES;
    if (arr2) {
      var $rulesGroup,
          i2 = -1,
          l2 = arr2.length - 1;
      while (i2 < l2) {
        $rulesGroup = arr2[i2 += 1];
        if ($shouldUseGroup($rulesGroup)) {
          if ($rulesGroup.type) {
            out += ' if (' + it.util.checkDataType($rulesGroup.type, $data) + ') { ';
          }
          if (it.opts.useDefaults && !it.compositeRule) {
            if ($rulesGroup.type == 'object' && it.schema.properties) {
              var $schema = it.schema.properties,
                  $schemaKeys = Object.keys($schema);
              var arr3 = $schemaKeys;
              if (arr3) {
                var $propertyKey,
                    i3 = -1,
                    l3 = arr3.length - 1;
                while (i3 < l3) {
                  $propertyKey = arr3[i3 += 1];
                  var $sch = $schema[$propertyKey];
                  if ($sch.default !== undefined) {
                    var $passData = $data + it.util.getProperty($propertyKey);
                    out += '  if (' + $passData + ' === undefined) ' + $passData + ' = ';
                    if (it.opts.useDefaults == 'shared') {
                      out += ' ' + it.useDefault($sch.default) + ' ';
                    } else {
                      out += ' ' + JSON.stringify($sch.default) + ' ';
                    }
                    out += '; ';
                  }
                }
              }
            } else if ($rulesGroup.type == 'array' && Array.isArray(it.schema.items)) {
              var arr4 = it.schema.items;
              if (arr4) {
                var $sch,
                    $i = -1,
                    l4 = arr4.length - 1;
                while ($i < l4) {
                  $sch = arr4[$i += 1];
                  if ($sch.default !== undefined) {
                    var $passData = $data + '[' + $i + ']';
                    out += '  if (' + $passData + ' === undefined) ' + $passData + ' = ';
                    if (it.opts.useDefaults == 'shared') {
                      out += ' ' + it.useDefault($sch.default) + ' ';
                    } else {
                      out += ' ' + JSON.stringify($sch.default) + ' ';
                    }
                    out += '; ';
                  }
                }
              }
            }
          }
          var arr5 = $rulesGroup.rules;
          if (arr5) {
            var $rule,
                i5 = -1,
                l5 = arr5.length - 1;
            while (i5 < l5) {
              $rule = arr5[i5 += 1];
              if ($shouldUseRule($rule)) {
                var $code = $rule.code(it, $rule.keyword, $rulesGroup.type);
                if ($code) {
                  out += ' ' + $code + ' ';
                  if ($breakOnError) {
                    $closingBraces1 += '}';
                  }
                }
              }
            }
          }
          if ($breakOnError) {
            out += ' ' + $closingBraces1 + ' ';
            $closingBraces1 = '';
          }
          if ($rulesGroup.type) {
            out += ' } ';
            if ($typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes) {
              out += ' else { ';
              var $schemaPath = it.schemaPath + '.type',
                  $errSchemaPath = it.errSchemaPath + '/type';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { type: \'';
                if ($typeIsArray) {
                  out += '' + $typeSchema.join(",");
                } else {
                  out += '' + $typeSchema;
                }
                out += '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'should be ';
                  if ($typeIsArray) {
                    out += '' + $typeSchema.join(",");
                  } else {
                    out += '' + $typeSchema;
                  }
                  out += '\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + __err + ']); ';
                } else {
                  out += ' validate.errors = [' + __err + ']; return false; ';
                }
              } else {
                out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              out += ' } ';
            }
          }
          if ($breakOnError) {
            out += ' if (errors === ';
            if ($top) {
              out += '0';
            } else {
              out += 'errs_' + $lvl;
            }
            out += ') { ';
            $closingBraces2 += '}';
          }
        }
      }
    }
  }
  if ($breakOnError) {
    out += ' ' + $closingBraces2 + ' ';
  }
  if ($top) {
    if ($async) {
      out += ' if (errors === 0) return data;           ';
      out += ' else throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; ';
      out += ' return errors === 0;       ';
    }
    out += ' }); return validate;';
  } else {
    out += ' var ' + $valid + ' = errors === errs_' + $lvl + ';';
  }
  out = it.util.cleanUpCode(out);
  if ($top) {
    out = it.util.finalCleanUpCode(out, $async);
  }

  function $shouldUseGroup($rulesGroup) {
    var rules = $rulesGroup.rules;
    for (var i = 0; i < rules.length; i++) {
      if ($shouldUseRule(rules[i])) return true;
    }
  }

  function $shouldUseRule($rule) {
    return it.schema[$rule.keyword] !== undefined || $rule.implements && $ruleImplementsSomeKeyword($rule);
  }

  function $ruleImplementsSomeKeyword($rule) {
    var impl = $rule.implements;
    for (var i = 0; i < impl.length; i++) {
      if (it.schema[impl[i]] !== undefined) return true;
    }
  }
  return out;
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `co`.
 */

module.exports = co['default'] = co.co = co;

/**
 * Wrap the given generator `fn` into a
 * function that returns a promise.
 * This is a separate function so that
 * every `co()` call doesn't create a new,
 * unnecessary closure.
 *
 * @param {GeneratorFunction} fn
 * @return {Function}
 * @api public
 */

co.wrap = function (fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return co.call(this, fn.apply(this, arguments));
  }
};

/**
 * Execute the generator function or a generator
 * and return a promise.
 *
 * @param {Function} fn
 * @return {Promise}
 * @api public
 */

function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function (resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

/**
 * Convert a `yield`ed value into a promise.
 *
 * @param {Mixed} obj
 * @return {Promise}
 * @api private
 */

function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

/**
 * Convert an array of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

/**
 * Convert an object of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Object} obj
 * @return {Promise}
 * @api private
 */

function objectToPromise(obj) {
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */

function isObject(val) {
  return Object == val.constructor;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate__limit(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $isMax = $keyword == 'maximum',
      $exclusiveKeyword = $isMax ? 'exclusiveMaximum' : 'exclusiveMinimum',
      $schemaExcl = it.schema[$exclusiveKeyword],
      $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,
      $op = $isMax ? '<' : '>',
      $notOp = $isMax ? '>' : '<',
      $errorKeyword = undefined;
  if ($isDataExcl) {
    var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr),
        $exclusive = 'exclusive' + $lvl,
        $exclType = 'exclType' + $lvl,
        $exclIsNumber = 'exclIsNumber' + $lvl,
        $opExpr = 'op' + $lvl,
        $opStr = '\' + ' + $opExpr + ' + \'';
    out += ' var schemaExcl' + $lvl + ' = ' + $schemaValueExcl + '; ';
    $schemaValueExcl = 'schemaExcl' + $lvl;
    out += ' var ' + $exclusive + '; var ' + $exclType + ' = typeof ' + $schemaValueExcl + '; if (' + $exclType + ' != \'boolean\' && ' + $exclType + ' != \'undefined\' && ' + $exclType + ' != \'number\') { ';
    var $errorKeyword = $exclusiveKeyword;
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ($errorKeyword || '_exclusiveLimit') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'' + $exclusiveKeyword + ' should be boolean\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + __err + ']); ';
      } else {
        out += ' validate.errors = [' + __err + ']; return false; ';
      }
    } else {
      out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } else if ( ';
    if ($isData) {
      out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
    }
    out += ' ' + $exclType + ' == \'number\' ? ( (' + $exclusive + ' = ' + $schemaValue + ' === undefined || ' + $schemaValueExcl + ' ' + $op + '= ' + $schemaValue + ') ? ' + $data + ' ' + $notOp + '= ' + $schemaValueExcl + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) : ( (' + $exclusive + ' = ' + $schemaValueExcl + ' === true) ? ' + $data + ' ' + $notOp + '= ' + $schemaValue + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) || ' + $data + ' !== ' + $data + ') { var op' + $lvl + ' = ' + $exclusive + ' ? \'' + $op + '\' : \'' + $op + '=\';';
  } else {
    var $exclIsNumber = typeof $schemaExcl == 'number',
        $opStr = $op;
    if ($exclIsNumber && $isData) {
      var $opExpr = '\'' + $opStr + '\'';
      out += ' if ( ';
      if ($isData) {
        out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
      }
      out += ' ( ' + $schemaValue + ' === undefined || ' + $schemaExcl + ' ' + $op + '= ' + $schemaValue + ' ? ' + $data + ' ' + $notOp + '= ' + $schemaExcl + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) || ' + $data + ' !== ' + $data + ') { ';
    } else {
      if ($exclIsNumber && $schema === undefined) {
        $exclusive = true;
        $errorKeyword = $exclusiveKeyword;
        $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
        $schemaValue = $schemaExcl;
        $notOp += '=';
      } else {
        if ($exclIsNumber) $schemaValue = Math[$isMax ? 'min' : 'max']($schemaExcl, $schema);
        if ($schemaExcl === ($exclIsNumber ? $schemaValue : true)) {
          $exclusive = true;
          $errorKeyword = $exclusiveKeyword;
          $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
          $notOp += '=';
        } else {
          $exclusive = false;
          $opStr += '=';
        }
      }
      var $opExpr = '\'' + $opStr + '\'';
      out += ' if ( ';
      if ($isData) {
        out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
      }
      out += ' ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' || ' + $data + ' !== ' + $data + ') { ';
    }
  }
  $errorKeyword = $errorKeyword || $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limit') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { comparison: ' + $opExpr + ', limit: ' + $schemaValue + ', exclusive: ' + $exclusive + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be ' + $opStr + ' ';
      if ($isData) {
        out += '\' + ' + $schemaValue;
      } else {
        out += '' + $schemaValue + '\'';
      }
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + $schema;
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate__limitItems(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxItems' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
  }
  out += ' ' + $data + '.length ' + $op + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitItems') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT have ';
      if ($keyword == 'maxItems') {
        out += 'more';
      } else {
        out += 'less';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + $schemaValue + ' + \'';
      } else {
        out += '' + $schema;
      }
      out += ' items\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + $schema;
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate__limitLength(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxLength' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
  }
  if (it.opts.unicode === false) {
    out += ' ' + $data + '.length ';
  } else {
    out += ' ucs2length(' + $data + ') ';
  }
  out += ' ' + $op + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitLength') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT be ';
      if ($keyword == 'maxLength') {
        out += 'longer';
      } else {
        out += 'shorter';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + $schemaValue + ' + \'';
      } else {
        out += '' + $schema;
      }
      out += ' characters\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + $schema;
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate__limitProperties(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxProperties' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'number\') || ';
  }
  out += ' Object.keys(' + $data + ').length ' + $op + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitProperties') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT have ';
      if ($keyword == 'maxProperties') {
        out += 'more';
      } else {
        out += 'less';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + $schemaValue + ' + \'';
      } else {
        out += '' + $schema;
      }
      out += ' properties\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + $schema;
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _crypto = __webpack_require__(4);

var _crypto2 = _interopRequireDefault(_crypto);

var _userService = __webpack_require__(10);

var _userService2 = _interopRequireDefault(_userService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// createEncryptData :: encrypt<Data> => Promise(JWK) -> Data ->
//      Promise([ String/ArrayBufferView, String ])
var createEncrypt = function createEncrypt(commonKeyPromise, encryptionMethod) {
    return function (data, givenEncryptedDataKeyPromise) {
        var dataKeyPromise = Promise.all([commonKeyPromise, givenEncryptedDataKeyPromise]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                commonKey = _ref2[0],
                encryptedDataKey = _ref2[1];

            if (encryptedDataKey) {
                return _crypto2.default.symDecryptObject(commonKey, encryptedDataKey);
            }
            return _crypto2.default.generateSymKey(_crypto2.default.keyTypes.DATA_KEY);
        });
        return Promise.all([commonKeyPromise, dataKeyPromise]).then(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                commonKey = _ref4[0],
                dataKey = _ref4[1];

            var encryptedDataKeyPromise = _crypto2.default.symEncryptObject(commonKey, dataKey);
            var encryptedDataPromise = encryptionMethod(dataKey, data);

            return Promise.all([encryptedDataPromise, encryptedDataKeyPromise]);
        });
    };
};

// createDecryptData :: Promise(JWK) -> String, ArrayBuffer -> Promise(ArrayBuffer)
var createDecryptData = function createDecryptData(commonKeyPromise) {
    return function (encryptedDataKey, encryptedData) {
        return commonKeyPromise.then(function (commonKey) {
            return _crypto2.default.symDecryptString(commonKey, encryptedDataKey);
        }).then(JSON.parse).then(function (dataKey) {
            return _crypto2.default.symDecrypt(dataKey, encryptedData);
        });
    };
};

// createCryptoService :: String -> Object
var createCryptoService = function createCryptoService(userId) {
    var commonKeyPromise = _userService2.default.getUser(userId).then(function (user) {
        return user.commonKey;
    });

    // encryptString :: String -> Promise([String(base64), String(base64)])
    var encryptString = createEncrypt(commonKeyPromise, _crypto2.default.symEncryptString);
    // encryptBlobs :: [ArrayBufferView] -> Promise([[ArrayBufferView], String(base64)])
    var encryptBlobs = createEncrypt(commonKeyPromise, function (dataKey, blobArray) {
        return Promise.all(blobArray.map(function (blob) {
            return _crypto2.default.symEncryptBlob(dataKey, blob);
        }));
    });
    // encryptObject :: ArrayBufferView -> Promise([String(base64), String(base64)])
    var encryptObject = createEncrypt(commonKeyPromise, _crypto2.default.symEncryptObject);

    // decryptData :: ArrayBuffer -> ArrayBuffer -> Promise(ArrayBuffer)
    var decryptData = createDecryptData(commonKeyPromise);

    return {
        encryptString: encryptString,
        encryptBlobs: encryptBlobs,
        encryptObject: encryptObject,
        decryptData: decryptData
    };
};

exports.default = createCryptoService;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _HCAttachment = __webpack_require__(11);

var _HCAttachment2 = _interopRequireDefault(_HCAttachment);

var _ValidationError = __webpack_require__(3);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HCDocument = function HCDocument() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$files = _ref.files,
        files = _ref$files === undefined ? [] : _ref$files,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'Document' : _ref$type,
        title = _ref.title,
        customCreationDate = _ref.customCreationDate,
        author = _ref.author,
        additionalIds = _ref.additionalIds,
        annotations = _ref.annotations,
        id = _ref.id;

    _classCallCheck(this, HCDocument);

    if (!(Array.isArray(files) && (!additionalIds || (typeof additionalIds === 'undefined' ? 'undefined' : _typeof(additionalIds)) === 'object') && typeof type === 'string' && (!annotations || (typeof annotations === 'undefined' ? 'undefined' : _typeof(annotations)) === 'object') && typeof title === 'string' && (!customCreationDate || customCreationDate instanceof Date) && (!author || (typeof author === 'undefined' ? 'undefined' : _typeof(author)) === 'object'))) {
        throw new _ValidationError2.default('HCDocument: Invalid arguments');
    }
    this.attachments = files.map(function (file) {
        return new _HCAttachment2.default({ file: file });
    });
    this.type = type;
    this.customCreationDate = customCreationDate;
    this.title = title;
    this.author = author;
    this.additionalIds = additionalIds;
    this.id = id;
    this.annotations = annotations;
};

exports.default = HCDocument;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ValidationError = __webpack_require__(3);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* eslint-disable complexity */


var HCAuthor = function HCAuthor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref.id,
        firstName = _ref.firstName,
        lastName = _ref.lastName,
        prefix = _ref.prefix,
        suffix = _ref.suffix,
        street = _ref.street,
        city = _ref.city,
        postalCode = _ref.postalCode,
        telephone = _ref.telephone,
        website = _ref.website,
        specialty = _ref.specialty;

    _classCallCheck(this, HCAuthor);

    if (!((typeof id === 'string' || !id) && (typeof firstName === 'string' || !firstName) && (typeof lastName === 'string' || !lastName) && (typeof prefix === 'string' || !prefix) && (typeof suffix === 'string' || !suffix) && (typeof street === 'string' || !street) && (typeof city === 'string' || !city) && (typeof postalCode === 'string' || !postalCode) && (typeof telephone === 'string' || !telephone) && (typeof website === 'string' || !website) && (typeof specialty === 'string' || !specialty))) {
        throw new _ValidationError2.default('HCAuthor: Invalid arguments');
    }
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.prefix = prefix;
    this.suffix = suffix;
    this.street = street;
    this.city = city;
    this.postalCode = postalCode;
    this.telephone = telephone;
    this.website = website;
    this.specialty = specialty;
};

exports.default = HCAuthor;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable radix */
var Specialty = {
    394539006: 'Pediatric surgery',
    394576009: 'Surgical-Accident & emergency',
    394577000: 'Anesthetics',
    394578005: 'Audiological medicine',
    394579002: 'Cardiology',
    394580004: 'Clinical genetics',
    394581000: 'Community medicine',
    394582007: 'Dermatology',
    394583002: 'Endocrinology',
    394584008: 'Gastroenterology',
    394585009: 'Obstetrics and gynecology',
    394586005: 'Gynecology',
    394587001: 'Psychiatry',
    394588006: 'Pediatric (Child and adolescent) psychiatry',
    394589003: 'Nephrology',
    394590007: 'Thoracic medicine',
    394591006: 'Neurology',
    394592004: 'Clinical oncology',
    394593009: 'Medical oncology',
    394594003: 'Ophthalmology',
    394597005: 'Histopathology',
    394598000: 'Immunopathology',
    394599008: 'Neuropathology',
    394600006: 'Clinical pharmacology',
    394601005: 'Clinical physiology',
    394602003: 'Rehabilitation',
    394604002: 'Surgery-Ear, nose and throat surgery',
    394605001: 'Surgery-Dental-Oral surgery',
    394606000: 'Surgery-Dentistry-Restorative dentistry',
    394607009: 'Pediatric dentistry',
    394608004: 'Surgery-Dentistry-surgical-Orthodontics',
    394609007: 'Surgery-general',
    394610002: 'Surgery-Neurosurgery',
    394611003: 'Surgery-Plastic surgery',
    394612005: 'Urology',
    394649004: 'Nuclear medicine',
    394732004: 'Surgical specialty--OTHER-NOT LISTED',
    394733009: 'Medical specialty--OTHER--NOT LISTED',
    394801008: 'Surgery-Trauma and orthopedics',
    394802001: 'General medicine',
    394803006: 'Clinical hematology',
    394804000: 'Clinical cytogenetics and molecular genetics',
    394806003: 'Palliative medicine',
    394807007: 'Infectious diseases',
    394808002: 'Genito-urinary medicine',
    394809005: 'Clinical neuro-physiology',
    394810000: 'Rheumatology',
    394811001: 'Geriatric medicine',
    394812008: 'Dental medicine specialties',
    394813003: 'Medical ophthalmology',
    394814009: 'General practice',
    394821009: 'Occupational medicine',
    394882004: 'Pain management',
    394913002: 'Psychotherapy',
    394914008: 'Radiology',
    394915009: 'General pathology',
    394916005: 'Hematopathology',
    408440000: 'Public health medicine',
    408441001: 'Surgery-Dental-Endodontics',
    408443003: 'General medical practice',
    408444009: 'Dental-General dental practice',
    408446006: 'Gynecological oncology',
    408447002: 'Respite care',
    408448007: 'Tropical medicine',
    408449004: 'Surgery-Dentistry--surgical',
    408450004: 'Sleep studies',
    408454008: 'Clinical microbiology',
    408455009: 'Radiology-Interventional radiology ',
    408459003: 'Pediatric cardiology',
    408460008: 'Surgery-Dental-surgical-Prosthodontics',
    408461007: 'Surgery-Dental-Periodontal surgery',
    408462000: 'Burns care',
    408463005: 'Surgery-Vascular',
    408464004: 'Surgery-Colorectal surgery',
    408465003: 'Surgery-Dental-Oral and maxillofacial surgery',
    408466002: 'Surgery-Cardiac surgery',
    408467006: 'Adult mental illness',
    408468001: 'Learning disability',
    408469009: 'Surgery-Breast surgery',
    408470005: 'Obstetrics',
    408471009: 'Surgery-Cardiothoracic transplantation',
    408472002: 'Hepatology',
    408474001: 'Surgery-Hepatobiliary and pancreatic surgery',
    408475000: 'Diabetic medicine',
    408476004: 'Surgery-Bone and marrow transplantation',
    408477008: 'Surgery-Transplantation surgery',
    408478003: 'Critical care medicine',
    408480009: 'Clinical immunology',
    409967009: 'Toxicology ',
    409968004: 'Preventive medicine',
    410001006: 'Military medicine',
    410005002: 'Dive medicine',
    416304004: 'Osteopathic manipulative medicine',
    418002000: 'Pediatric oncology',
    418018006: 'Surgery-Dermatologic surgery',
    418058008: 'Pediatric gastroenterology',
    418112009: 'Pulmonary medicine',
    418535003: 'Pediatric immunology',
    418652005: 'Pediatric hematology',
    418862001: 'Pediatric infectious diseases',
    418960008: 'Otolaryngology',
    419043006: 'Urological oncology',
    419170002: 'Pediatric pulmonology',
    419192003: 'Internal medicine',
    419321007: 'Surgical oncology',
    419365004: 'Pediatric nephrology',
    419472004: 'Pediatric rheumatology',
    419610006: 'Pediatric endocrinology',
    419772000: 'Family practice',
    419815003: 'Radiation oncology',
    419983000: 'Pediatric ophthalmology',
    420112009: 'Pediatric surgery-bone marrow transplantation',
    420208008: 'Pediatric genetics',
    421661004: 'Blood banking and transfusion medicine',
    422191005: 'Ophthalmic surgery'
};

var hcSpecialtyUtils = {
    display: function display(int) {
        return Specialty[int];
    },
    getSpecialties: function getSpecialties() {
        return Object.keys(Specialty);
    },


    // Specialty is not resourceType in FHIR but is often used as codeable concept
    // We use it to define the practice setting in which document was created
    // Speciality in our model is a single value.So the coding array always has one
    // value.
    fromFhirCodeableConcept: function fromFhirCodeableConcept(fhirCodeableConcept) {
        return fhirCodeableConcept.coding && fhirCodeableConcept.coding[0] && fhirCodeableConcept.coding[0].code;
    },
    toFhirCodeableConcept: function toFhirCodeableConcept(specialty) {
        return {
            coding: [{
                display: this.display(specialty),
                code: specialty
            }]
        };
    }
};

exports.default = hcSpecialtyUtils;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _documentService = __webpack_require__(31);

var _documentService2 = _interopRequireDefault(_documentService);

var _crypto = __webpack_require__(4);

var _crypto2 = _interopRequireDefault(_crypto);

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

var _taggingUtils = __webpack_require__(6);

var _taggingUtils2 = _interopRequireDefault(_taggingUtils);

var _userService = __webpack_require__(10);

var _userService2 = _interopRequireDefault(_userService);

var _HCDocument = __webpack_require__(27);

var _HCDocument2 = _interopRequireDefault(_HCDocument);

var _HCAttachment = __webpack_require__(11);

var _HCAttachment2 = _interopRequireDefault(_HCAttachment);

var _HCAuthor = __webpack_require__(28);

var _HCAuthor2 = _interopRequireDefault(_HCAuthor);

var _HCSpecialty = __webpack_require__(92);

var _HCSpecialty2 = _interopRequireDefault(_HCSpecialty);

var _authCloud = __webpack_require__(93);

var _authCloud2 = _interopRequireDefault(_authCloud);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var healthCloud = {
    getCurrentUserId: _userService2.default.getCurrentUserId.bind(_userService2.default),
    getCurrentAppId: _userService2.default.getCurrentAppId.bind(_userService2.default),
    grantPermission: _userService2.default.grantPermission.bind(_userService2.default),
    getReceivedPermissions: _userService2.default.getReceivedPermissions.bind(_userService2.default),
    downloadDocument: _documentService2.default.downloadDocument.bind(_documentService2.default),
    deleteDocument: _documentService2.default.deleteDocument.bind(_documentService2.default),
    getDocuments: _documentService2.default.getDocuments.bind(_documentService2.default),
    getDocumentsCount: _documentService2.default.getDocumentsCount.bind(_documentService2.default),
    uploadDocument: _documentService2.default.uploadDocument.bind(_documentService2.default),
    updateDocument: _documentService2.default.updateDocument.bind(_documentService2.default),
    createCAP: function createCAP() {
        return _crypto2.default.generateAsymKeyPair(_crypto2.default.keyTypes.APP).then(function (_ref) {
            var publicKey = _ref.publicKey,
                privateKey = _ref.privateKey;
            return {
                publicKey: btoa(JSON.stringify(publicKey)),
                privateKey: btoa(JSON.stringify(privateKey))
            };
        });
    },

    models: {
        HCDocument: _HCDocument2.default,
        HCAttachment: _HCAttachment2.default,
        HCAuthor: _HCAuthor2.default,
        HCSpecialty: _HCSpecialty2.default
    },

    /**
     * sets up the GC-SDK
     * @param {String} clientId - the clientId provided by GesundheitsCloud
     * @param {String} base64PrivateKey - the privateKey returned from the createCAP method
     *      (base64 encoded privateKey)
     * @param {Function} requestAccessToken - () => Promise<String>: returns a new valid accessToken
     *      of the logged in user
     * @returns {Promise<String>} the id of the logged in user
     */
    setup: function setup(clientId, environment, base64PrivateKey, requestAccessToken) {
        _taggingUtils2.default.clientId = clientId;
        _config2.default.environmentConfig = _config.envConfig[environment];
        _hcRequest2.default.requestAccessToken = requestAccessToken;
        _userService2.default.setPrivateKey(base64PrivateKey);
        return requestAccessToken().then(function (accessToken) {
            _hcRequest2.default.setMasterAccessToken(accessToken);
            return _userService2.default.pullUser();
        }).then(function (_ref2) {
            var id = _ref2.id;

            _hcRequest2.default.currentUserId = id;
            return id;
        });
    },


    /**
     * resets the SDK
     */
    reset: function reset() {
        _taggingUtils2.default.clientId = null;
        _hcRequest2.default.reset();
        _userService2.default.resetUser();
    }
};

module.exports = {
    SDK: healthCloud,
    AUTH: _authCloud2.default
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _documentRoutes = __webpack_require__(12);

var _documentRoutes2 = _interopRequireDefault(_documentRoutes);

var _fileRoutes = __webpack_require__(42);

var _fileRoutes2 = _interopRequireDefault(_fileRoutes);

var _fhirService = __webpack_require__(43);

var _fhirService2 = _interopRequireDefault(_fhirService);

var _taggingUtils = __webpack_require__(6);

var _taggingUtils2 = _interopRequireDefault(_taggingUtils);

var _hcDocumentUtils = __webpack_require__(89);

var _hcDocumentUtils2 = _interopRequireDefault(_hcDocumentUtils);

var _ValidationError = __webpack_require__(3);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _crypto = __webpack_require__(4);

var _crypto2 = _interopRequireDefault(_crypto);

var _cryptoService = __webpack_require__(26);

var _cryptoService2 = _interopRequireDefault(_cryptoService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var separateByGiven = function separateByGiven(attribute, collection) {
    return collection.reduce(function (sum, value) {
        if (value[attribute]) {
            sum.withAttribute.push(value);
        } else {
            sum.withoutAttribute.push(value);
        }
        return sum;
    }, { withAttribute: [], withoutAttribute: [] });
};

var documentService = {
    /**
     * Downloads the document with given owner and documentId with all its files.
     *
     * @param {String} ownerId - the id of the owner of the document
     * @param {String} documentId - the id of the document
     * @returns {Promise<hcDocument>} the requested hcDocument
     */
    downloadDocument: function downloadDocument(ownerId, documentId) {
        var hcDocument = void 0;
        var encryptedAttachmentKey = void 0;
        return _fhirService2.default.downloadFhirRecord(ownerId, documentId).then(function (record) {
            hcDocument = _hcDocumentUtils2.default.fromFhirObject(record.fhirResource);
            hcDocument.client = _taggingUtils2.default.getTagValueFromList(record.tags, _taggingUtils.tagKeys.client);
            hcDocument.annotations = _taggingUtils2.default.getAnnotations(record.tags);
            hcDocument.updatedDate = record.updatedDate;
            hcDocument.customCreationDate = record.customCreationDate;
            encryptedAttachmentKey = record.attachment_key;
            return Promise.all(hcDocument.attachments.map(function (attachment) {
                return _documentRoutes2.default.getFileDownloadURL(ownerId, documentId, attachment.id);
            }));
        }).then(function (sasUrls) {
            return Promise.all(sasUrls.map(function (sasUrl) {
                return _fileRoutes2.default.downloadFile(sasUrl.sas_token).then(_crypto2.default.convertBlobToArrayBufferView);
            }));
        }).then(function (encryptedData) {
            return Promise.all(encryptedData.map(function (data) {
                return (0, _cryptoService2.default)(ownerId).decryptData(encryptedAttachmentKey, data);
            }));
        }).then(function (dataArray) {
            var attachment = void 0;
            return dataArray.map(function (data, index) {
                attachment = hcDocument.attachments[index];
                attachment.file = new File([data], attachment.title, {
                    type: attachment.type,
                    lastModifiedData: attachment.creation
                });
                return attachment;
            });
        }).then(function (attachments) {
            hcDocument.attachments = attachments;
            hcDocument.id = documentId;
            return hcDocument;
        });
    },


    /**
     * Uploads a document to a users GesundheitsCloud
     * @param {String} ownerId - the id of the owner of the document
     * @param {hcDocument} hcDocument - the hcDocument that should be uploaded
     * @returns {Promise<hcDocument>} - the uploaded hcDocument with id and attachmentIds
     */
    uploadDocument: function uploadDocument(ownerId, hcDocument) {
        var _this = this;

        if (!_hcDocumentUtils2.default.isValid(hcDocument)) {
            return Promise.reject(new _ValidationError2.default('Not a valid hcDocument'));
        }
        // creationDate is only set during the upload of document.
        hcDocument.creationDate = new Date();
        // If there is no customCreationDate, it is set same as creationDate;
        if (!hcDocument.customCreationDate) {
            hcDocument.customCreationDate = hcDocument.creationDate;
        }
        return _fhirService2.default.createFhirRecord(ownerId, {
            fhirResource: _hcDocumentUtils2.default.toFhirObject(hcDocument, this.clientId),
            customCreationDate: hcDocument.customCreationDate
        }).then(function (record) {
            hcDocument.id = record.record_id;
            return _this.updateDocument(ownerId, hcDocument);
        });
    },


    /**
     * Updates a hcDocument. Changing attachments files is not possible,
     * but uploading new attachments and removing old ones.
     * @param {String} ownerId - the id of the owner of the document
     * @param {hcDocument} hcDocument - the updated hcDocument.
     * @returns {Promise<hcDocument>} - the updated hcDocument.
     */
    updateDocument: function updateDocument(ownerId, hcDocument) {
        var _this2 = this;

        if (!_hcDocumentUtils2.default.isValid(hcDocument)) {
            return Promise.reject(new _ValidationError2.default('Not a valid hcDocument'));
        }

        var _separateByGiven = separateByGiven('id', hcDocument.attachments),
            oldAttachments = _separateByGiven.withAttribute,
            newAttachments = _separateByGiven.withoutAttribute;

        var attachmentKeyPromise = _documentRoutes2.default.downloadRecord(ownerId, hcDocument.id).then(function (record) {
            return record.attachment_key;
        });

        var encryptedFilesPromise = attachmentKeyPromise.then(function (ak) {
            return (0, _cryptoService2.default)(ownerId).encryptBlobs(newAttachments.map(function (attachment) {
                return attachment.file;
            }), ak);
        });

        return Promise.all([encryptedFilesPromise, newAttachments.length ? _documentRoutes2.default.getFileUploadURLs(ownerId, hcDocument.id, newAttachments.length) : Promise.resolve([])]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                _ref2$ = _slicedToArray(_ref2[0], 2),
                encryptedFiles = _ref2$[0],
                attachmentKey = _ref2$[1],
                uploadInformation = _ref2[1];

            var uploadFilesPromise = encryptedFiles.map(function (encryptedFile, index) {
                newAttachments[index].id = uploadInformation[index].id;
                return _fileRoutes2.default.uploadFile(uploadInformation[index].sas_token, encryptedFile);
            });
            hcDocument.attachments = [].concat(_toConsumableArray(oldAttachments), _toConsumableArray(newAttachments));
            var updateFhirRecordPromise = _fhirService2.default.updateFhirRecord(ownerId, {
                id: hcDocument.id,
                fhirResource: _hcDocumentUtils2.default.toFhirObject(hcDocument, _this2.clientId),
                tags: _taggingUtils2.default.generateCustomTags(hcDocument.annotations),
                attachmentKey: attachmentKey,
                customCreationDate: hcDocument.customCreationDate
            });
            return Promise.all([updateFhirRecordPromise, Promise.all(uploadFilesPromise)]);
        }).then(function () {
            return hcDocument;
        });
    },


    /**
     * Deletes the hcDocument
     * @param {String} ownerId - the id of the owner of the hcDocument
     * @param {String} documentId - the id of the hcDocument that should be deleted
     */
    deleteDocument: function deleteDocument(ownerId, documentId) {
        return _fhirService2.default.deleteRecord(ownerId, documentId);
    },


    /**
     * returns the metadata(everyting but the files) of the matching hcDocuments
     * @param {String} ownerId - the id of the owner of the hcDocument
     * @param {Object} params - search parameters check in sdk.md for more information
     * @returns {Object} documents
     * @returns {Number} documents.totalCount - the total number of matching documents
     * @returns {Array<hcDocument>} documents.records - the matching records
     */
    getDocuments: function getDocuments(ownerId) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        params.tags = [_taggingUtils2.default.buildTag('resourceType', 'documentReference')];
        return _fhirService2.default.searchRecords(ownerId, params).then(function (result) {
            result.records = result.records.map(function (record) {
                var hcDocument = _hcDocumentUtils2.default.fromFhirObject(record.fhirResource);
                hcDocument.client = _taggingUtils2.default.getTagValueFromList(record.tags, _taggingUtils.tagKeys.client);
                hcDocument.annotations = _taggingUtils2.default.getAnnotations(record.tags);
                hcDocument.updatedDate = record.updatedDate;
                hcDocument.customCreationDate = record.customCreationDate;
                hcDocument.id = record.record_id;
                return hcDocument;
            });
            return result;
        });
    },


    /**
     * Returns the number of elements that match the params
     * @param {String} ownerId - the id of the owner of the hcDocument
     * @param {Object} params - search parameters check in sdk.md for more information
     * @returns {Number} the number of hcDocuments that match the params
     */
    getDocumentsCount: function getDocumentsCount(ownerId) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        params.tags = [_taggingUtils2.default.buildTag('resourceType', 'documentReference')];
        return _fhirService2.default.searchRecords(ownerId, params, true).then(function (res) {
            return res.totalCount;
        });
    }
};

exports.default = documentService;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// From https://gist.github.com/epeli/11209665

var Promise = __webpack_require__(33);

// So you can `var request = require("superagent-bluebird-promise")`
var superagent = module.exports = __webpack_require__(14);
var Request = superagent.Request;

try {
  Promise.config({
    // Enable cancellation.
    cancellation: true
  });
} catch (e) {
  console.warn(["Enabling bluebird cancellation failed.", "If you are using bluebird elsewhere in your application,", "be sure to enable cancellation there as well.", "Promise.config({cancellation: true});"].join(" "));
  console.warn(e.stack);
}
// Create custom error type.
// Create a new object, that prototypally inherits from the Error constructor.
var SuperagentPromiseError = function SuperagentPromiseError(message, originalError) {
  var stack;
  this.message = message;
  this.originalError = originalError;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
    stack = this.stack;
  } else {
    stack = new Error(message).stack;
  }

  if (Object.defineProperty) {
    Object.defineProperty(this, "stack", {
      configurable: true, // required for Bluebird long stack traces
      get: function get() {
        if (this.originalError) {
          return stack + "\nCaused by:  " + this.originalError.stack;
        }

        return stack;
      },
      set: function set(value) {
        stack = value;
      }
    });
  }
};

SuperagentPromiseError.prototype = new Error();
SuperagentPromiseError.prototype.constructor = SuperagentPromiseError;
SuperagentPromiseError.prototype.name = "SuperagentPromiseError";
superagent.SuperagentPromiseError = SuperagentPromiseError;

/**
 * @namespace utils
 * @class Superagent
 */

/**
 *
 * Add promise support for superagent/supertest
 *
 * Call .promise() to return promise for the request
 *
 * @method then
 * @return {Bluebird.Promise}
 */
Request.prototype.promise = function () {
  var req = this;
  var error;

  return new Promise(function (resolve, reject, onCancel) {
    req.end(function (err, res) {
      if (typeof res !== "undefined" && res !== null && res.status >= 400) {
        var msg = "cannot " + req.method + " " + req.url + " (" + res.status + ")";
        error = new SuperagentPromiseError(msg);
        error.status = res.status;
        error.body = res.body;
        error.res = res;
        reject(error);
      } else if (err) {
        reject(new SuperagentPromiseError(err.message, err));
      } else {
        resolve(res);
      }
    });

    if (typeof onCancel === "function") {
      onCancel(function () {
        req.abort();
      });
    }
  });
};

/**
 *
 * Make superagent requests Promises ES6 conformant
 *
 * Call .then([onFulfilled], [onRejected]) to register callbacks
 *
 * @method then
 * @param {function} [onFulfilled]
 * @param {function} [onRejected]
 * @return {Bluebird.Promise}
 */
Request.prototype.then = function () {
  var promise = this.promise();
  return promise.then.apply(promise, arguments);
};

/**
 *
 * Make superagent requests Promises ES6 conformant
 *
 * Call .catch([onRejected]) to register callback
 *
 * @method catch
 * @param {function} [onRejected]
 * @return {Bluebird.Promise}
 */
Request.prototype.catch = function () {
  var promise = this.promise();
  return promise.catch.apply(promise, arguments);
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2017 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.5.1
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function (e) {
    if ("object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {
        var f;"undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.Promise = e();
    }
}(function () {
    var define, module, exports;return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({ 1: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise) {
                var SomePromiseArray = Promise._SomePromiseArray;
                function any(promises) {
                    var ret = new SomePromiseArray(promises);
                    var promise = ret.promise();
                    ret.setHowMany(1);
                    ret.setUnwrap();
                    ret.init();
                    return promise;
                }

                Promise.any = function (promises) {
                    return any(promises);
                };

                Promise.prototype.any = function () {
                    return any(this);
                };
            };
        }, {}], 2: [function (_dereq_, module, exports) {
            "use strict";

            var firstLineError;
            try {
                throw new Error();
            } catch (e) {
                firstLineError = e;
            }
            var schedule = _dereq_("./schedule");
            var Queue = _dereq_("./queue");
            var util = _dereq_("./util");

            function Async() {
                this._customScheduler = false;
                this._isTickUsed = false;
                this._lateQueue = new Queue(16);
                this._normalQueue = new Queue(16);
                this._haveDrainedQueues = false;
                this._trampolineEnabled = true;
                var self = this;
                this.drainQueues = function () {
                    self._drainQueues();
                };
                this._schedule = schedule;
            }

            Async.prototype.setScheduler = function (fn) {
                var prev = this._schedule;
                this._schedule = fn;
                this._customScheduler = true;
                return prev;
            };

            Async.prototype.hasCustomScheduler = function () {
                return this._customScheduler;
            };

            Async.prototype.enableTrampoline = function () {
                this._trampolineEnabled = true;
            };

            Async.prototype.disableTrampolineIfNecessary = function () {
                if (util.hasDevTools) {
                    this._trampolineEnabled = false;
                }
            };

            Async.prototype.haveItemsQueued = function () {
                return this._isTickUsed || this._haveDrainedQueues;
            };

            Async.prototype.fatalError = function (e, isNode) {
                if (isNode) {
                    process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
                    process.exit(2);
                } else {
                    this.throwLater(e);
                }
            };

            Async.prototype.throwLater = function (fn, arg) {
                if (arguments.length === 1) {
                    arg = fn;
                    fn = function fn() {
                        throw arg;
                    };
                }
                if (typeof setTimeout !== "undefined") {
                    setTimeout(function () {
                        fn(arg);
                    }, 0);
                } else try {
                    this._schedule(function () {
                        fn(arg);
                    });
                } catch (e) {
                    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                }
            };

            function AsyncInvokeLater(fn, receiver, arg) {
                this._lateQueue.push(fn, receiver, arg);
                this._queueTick();
            }

            function AsyncInvoke(fn, receiver, arg) {
                this._normalQueue.push(fn, receiver, arg);
                this._queueTick();
            }

            function AsyncSettlePromises(promise) {
                this._normalQueue._pushOne(promise);
                this._queueTick();
            }

            if (!util.hasDevTools) {
                Async.prototype.invokeLater = AsyncInvokeLater;
                Async.prototype.invoke = AsyncInvoke;
                Async.prototype.settlePromises = AsyncSettlePromises;
            } else {
                Async.prototype.invokeLater = function (fn, receiver, arg) {
                    if (this._trampolineEnabled) {
                        AsyncInvokeLater.call(this, fn, receiver, arg);
                    } else {
                        this._schedule(function () {
                            setTimeout(function () {
                                fn.call(receiver, arg);
                            }, 100);
                        });
                    }
                };

                Async.prototype.invoke = function (fn, receiver, arg) {
                    if (this._trampolineEnabled) {
                        AsyncInvoke.call(this, fn, receiver, arg);
                    } else {
                        this._schedule(function () {
                            fn.call(receiver, arg);
                        });
                    }
                };

                Async.prototype.settlePromises = function (promise) {
                    if (this._trampolineEnabled) {
                        AsyncSettlePromises.call(this, promise);
                    } else {
                        this._schedule(function () {
                            promise._settlePromises();
                        });
                    }
                };
            }

            Async.prototype._drainQueue = function (queue) {
                while (queue.length() > 0) {
                    var fn = queue.shift();
                    if (typeof fn !== "function") {
                        fn._settlePromises();
                        continue;
                    }
                    var receiver = queue.shift();
                    var arg = queue.shift();
                    fn.call(receiver, arg);
                }
            };

            Async.prototype._drainQueues = function () {
                this._drainQueue(this._normalQueue);
                this._reset();
                this._haveDrainedQueues = true;
                this._drainQueue(this._lateQueue);
            };

            Async.prototype._queueTick = function () {
                if (!this._isTickUsed) {
                    this._isTickUsed = true;
                    this._schedule(this.drainQueues);
                }
            };

            Async.prototype._reset = function () {
                this._isTickUsed = false;
            };

            module.exports = Async;
            module.exports.firstLineError = firstLineError;
        }, { "./queue": 26, "./schedule": 29, "./util": 36 }], 3: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, debug) {
                var calledBind = false;
                var rejectThis = function rejectThis(_, e) {
                    this._reject(e);
                };

                var targetRejected = function targetRejected(e, context) {
                    context.promiseRejectionQueued = true;
                    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
                };

                var bindingResolved = function bindingResolved(thisArg, context) {
                    if ((this._bitField & 50397184) === 0) {
                        this._resolveCallback(context.target);
                    }
                };

                var bindingRejected = function bindingRejected(e, context) {
                    if (!context.promiseRejectionQueued) this._reject(e);
                };

                Promise.prototype.bind = function (thisArg) {
                    if (!calledBind) {
                        calledBind = true;
                        Promise.prototype._propagateFrom = debug.propagateFromFunction();
                        Promise.prototype._boundValue = debug.boundValueFunction();
                    }
                    var maybePromise = tryConvertToPromise(thisArg);
                    var ret = new Promise(INTERNAL);
                    ret._propagateFrom(this, 1);
                    var target = this._target();
                    ret._setBoundTo(maybePromise);
                    if (maybePromise instanceof Promise) {
                        var context = {
                            promiseRejectionQueued: false,
                            promise: ret,
                            target: target,
                            bindingPromise: maybePromise
                        };
                        target._then(INTERNAL, targetRejected, undefined, ret, context);
                        maybePromise._then(bindingResolved, bindingRejected, undefined, ret, context);
                        ret._setOnCancel(maybePromise);
                    } else {
                        ret._resolveCallback(target);
                    }
                    return ret;
                };

                Promise.prototype._setBoundTo = function (obj) {
                    if (obj !== undefined) {
                        this._bitField = this._bitField | 2097152;
                        this._boundTo = obj;
                    } else {
                        this._bitField = this._bitField & ~2097152;
                    }
                };

                Promise.prototype._isBound = function () {
                    return (this._bitField & 2097152) === 2097152;
                };

                Promise.bind = function (thisArg, value) {
                    return Promise.resolve(value).bind(thisArg);
                };
            };
        }, {}], 4: [function (_dereq_, module, exports) {
            "use strict";

            var old;
            if (typeof Promise !== "undefined") old = Promise;
            function noConflict() {
                try {
                    if (Promise === bluebird) Promise = old;
                } catch (e) {}
                return bluebird;
            }
            var bluebird = _dereq_("./promise")();
            bluebird.noConflict = noConflict;
            module.exports = bluebird;
        }, { "./promise": 22 }], 5: [function (_dereq_, module, exports) {
            "use strict";

            var cr = Object.create;
            if (cr) {
                var callerCache = cr(null);
                var getterCache = cr(null);
                callerCache[" size"] = getterCache[" size"] = 0;
            }

            module.exports = function (Promise) {
                var util = _dereq_("./util");
                var canEvaluate = util.canEvaluate;
                var isIdentifier = util.isIdentifier;

                var getMethodCaller;
                var getGetter;
                if (false) {
                    var makeMethodCaller = function makeMethodCaller(methodName) {
                        return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
                    };

                    var makeGetter = function makeGetter(propertyName) {
                        return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
                    };

                    var getCompiled = function getCompiled(name, compiler, cache) {
                        var ret = cache[name];
                        if (typeof ret !== "function") {
                            if (!isIdentifier(name)) {
                                return null;
                            }
                            ret = compiler(name);
                            cache[name] = ret;
                            cache[" size"]++;
                            if (cache[" size"] > 512) {
                                var keys = Object.keys(cache);
                                for (var i = 0; i < 256; ++i) {
                                    delete cache[keys[i]];
                                }cache[" size"] = keys.length - 256;
                            }
                        }
                        return ret;
                    };

                    getMethodCaller = function getMethodCaller(name) {
                        return getCompiled(name, makeMethodCaller, callerCache);
                    };

                    getGetter = function getGetter(name) {
                        return getCompiled(name, makeGetter, getterCache);
                    };
                }

                function ensureMethod(obj, methodName) {
                    var fn;
                    if (obj != null) fn = obj[methodName];
                    if (typeof fn !== "function") {
                        var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
                        throw new Promise.TypeError(message);
                    }
                    return fn;
                }

                function caller(obj) {
                    var methodName = this.pop();
                    var fn = ensureMethod(obj, methodName);
                    return fn.apply(obj, this);
                }
                Promise.prototype.call = function (methodName) {
                    var args = [].slice.call(arguments, 1);;
                    if (false) {
                        if (canEvaluate) {
                            var maybeCaller = getMethodCaller(methodName);
                            if (maybeCaller !== null) {
                                return this._then(maybeCaller, undefined, undefined, args, undefined);
                            }
                        }
                    }
                    args.push(methodName);
                    return this._then(caller, undefined, undefined, args, undefined);
                };

                function namedGetter(obj) {
                    return obj[this];
                }
                function indexedGetter(obj) {
                    var index = +this;
                    if (index < 0) index = Math.max(0, index + obj.length);
                    return obj[index];
                }
                Promise.prototype.get = function (propertyName) {
                    var isIndex = typeof propertyName === "number";
                    var getter;
                    if (!isIndex) {
                        if (canEvaluate) {
                            var maybeGetter = getGetter(propertyName);
                            getter = maybeGetter !== null ? maybeGetter : namedGetter;
                        } else {
                            getter = namedGetter;
                        }
                    } else {
                        getter = indexedGetter;
                    }
                    return this._then(getter, undefined, undefined, propertyName, undefined);
                };
            };
        }, { "./util": 36 }], 6: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, apiRejection, debug) {
                var util = _dereq_("./util");
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;
                var async = Promise._async;

                Promise.prototype["break"] = Promise.prototype.cancel = function () {
                    if (!debug.cancellation()) return this._warn("cancellation is disabled");

                    var promise = this;
                    var child = promise;
                    while (promise._isCancellable()) {
                        if (!promise._cancelBy(child)) {
                            if (child._isFollowing()) {
                                child._followee().cancel();
                            } else {
                                child._cancelBranched();
                            }
                            break;
                        }

                        var parent = promise._cancellationParent;
                        if (parent == null || !parent._isCancellable()) {
                            if (promise._isFollowing()) {
                                promise._followee().cancel();
                            } else {
                                promise._cancelBranched();
                            }
                            break;
                        } else {
                            if (promise._isFollowing()) promise._followee().cancel();
                            promise._setWillBeCancelled();
                            child = promise;
                            promise = parent;
                        }
                    }
                };

                Promise.prototype._branchHasCancelled = function () {
                    this._branchesRemainingToCancel--;
                };

                Promise.prototype._enoughBranchesHaveCancelled = function () {
                    return this._branchesRemainingToCancel === undefined || this._branchesRemainingToCancel <= 0;
                };

                Promise.prototype._cancelBy = function (canceller) {
                    if (canceller === this) {
                        this._branchesRemainingToCancel = 0;
                        this._invokeOnCancel();
                        return true;
                    } else {
                        this._branchHasCancelled();
                        if (this._enoughBranchesHaveCancelled()) {
                            this._invokeOnCancel();
                            return true;
                        }
                    }
                    return false;
                };

                Promise.prototype._cancelBranched = function () {
                    if (this._enoughBranchesHaveCancelled()) {
                        this._cancel();
                    }
                };

                Promise.prototype._cancel = function () {
                    if (!this._isCancellable()) return;
                    this._setCancelled();
                    async.invoke(this._cancelPromises, this, undefined);
                };

                Promise.prototype._cancelPromises = function () {
                    if (this._length() > 0) this._settlePromises();
                };

                Promise.prototype._unsetOnCancel = function () {
                    this._onCancelField = undefined;
                };

                Promise.prototype._isCancellable = function () {
                    return this.isPending() && !this._isCancelled();
                };

                Promise.prototype.isCancellable = function () {
                    return this.isPending() && !this.isCancelled();
                };

                Promise.prototype._doInvokeOnCancel = function (onCancelCallback, internalOnly) {
                    if (util.isArray(onCancelCallback)) {
                        for (var i = 0; i < onCancelCallback.length; ++i) {
                            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                        }
                    } else if (onCancelCallback !== undefined) {
                        if (typeof onCancelCallback === "function") {
                            if (!internalOnly) {
                                var e = tryCatch(onCancelCallback).call(this._boundValue());
                                if (e === errorObj) {
                                    this._attachExtraTrace(e.e);
                                    async.throwLater(e.e);
                                }
                            }
                        } else {
                            onCancelCallback._resultCancelled(this);
                        }
                    }
                };

                Promise.prototype._invokeOnCancel = function () {
                    var onCancelCallback = this._onCancel();
                    this._unsetOnCancel();
                    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                };

                Promise.prototype._invokeInternalOnCancel = function () {
                    if (this._isCancellable()) {
                        this._doInvokeOnCancel(this._onCancel(), true);
                        this._unsetOnCancel();
                    }
                };

                Promise.prototype._resultCancelled = function () {
                    this.cancel();
                };
            };
        }, { "./util": 36 }], 7: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (NEXT_FILTER) {
                var util = _dereq_("./util");
                var getKeys = _dereq_("./es5").keys;
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;

                function catchFilter(instances, cb, promise) {
                    return function (e) {
                        var boundTo = promise._boundValue();
                        predicateLoop: for (var i = 0; i < instances.length; ++i) {
                            var item = instances[i];

                            if (item === Error || item != null && item.prototype instanceof Error) {
                                if (e instanceof item) {
                                    return tryCatch(cb).call(boundTo, e);
                                }
                            } else if (typeof item === "function") {
                                var matchesPredicate = tryCatch(item).call(boundTo, e);
                                if (matchesPredicate === errorObj) {
                                    return matchesPredicate;
                                } else if (matchesPredicate) {
                                    return tryCatch(cb).call(boundTo, e);
                                }
                            } else if (util.isObject(e)) {
                                var keys = getKeys(item);
                                for (var j = 0; j < keys.length; ++j) {
                                    var key = keys[j];
                                    if (item[key] != e[key]) {
                                        continue predicateLoop;
                                    }
                                }
                                return tryCatch(cb).call(boundTo, e);
                            }
                        }
                        return NEXT_FILTER;
                    };
                }

                return catchFilter;
            };
        }, { "./es5": 13, "./util": 36 }], 8: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise) {
                var longStackTraces = false;
                var contextStack = [];

                Promise.prototype._promiseCreated = function () {};
                Promise.prototype._pushContext = function () {};
                Promise.prototype._popContext = function () {
                    return null;
                };
                Promise._peekContext = Promise.prototype._peekContext = function () {};

                function Context() {
                    this._trace = new Context.CapturedTrace(peekContext());
                }
                Context.prototype._pushContext = function () {
                    if (this._trace !== undefined) {
                        this._trace._promiseCreated = null;
                        contextStack.push(this._trace);
                    }
                };

                Context.prototype._popContext = function () {
                    if (this._trace !== undefined) {
                        var trace = contextStack.pop();
                        var ret = trace._promiseCreated;
                        trace._promiseCreated = null;
                        return ret;
                    }
                    return null;
                };

                function createContext() {
                    if (longStackTraces) return new Context();
                }

                function peekContext() {
                    var lastIndex = contextStack.length - 1;
                    if (lastIndex >= 0) {
                        return contextStack[lastIndex];
                    }
                    return undefined;
                }
                Context.CapturedTrace = null;
                Context.create = createContext;
                Context.deactivateLongStackTraces = function () {};
                Context.activateLongStackTraces = function () {
                    var Promise_pushContext = Promise.prototype._pushContext;
                    var Promise_popContext = Promise.prototype._popContext;
                    var Promise_PeekContext = Promise._peekContext;
                    var Promise_peekContext = Promise.prototype._peekContext;
                    var Promise_promiseCreated = Promise.prototype._promiseCreated;
                    Context.deactivateLongStackTraces = function () {
                        Promise.prototype._pushContext = Promise_pushContext;
                        Promise.prototype._popContext = Promise_popContext;
                        Promise._peekContext = Promise_PeekContext;
                        Promise.prototype._peekContext = Promise_peekContext;
                        Promise.prototype._promiseCreated = Promise_promiseCreated;
                        longStackTraces = false;
                    };
                    longStackTraces = true;
                    Promise.prototype._pushContext = Context.prototype._pushContext;
                    Promise.prototype._popContext = Context.prototype._popContext;
                    Promise._peekContext = Promise.prototype._peekContext = peekContext;
                    Promise.prototype._promiseCreated = function () {
                        var ctx = this._peekContext();
                        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
                    };
                };
                return Context;
            };
        }, {}], 9: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, Context) {
                var getDomain = Promise._getDomain;
                var async = Promise._async;
                var Warning = _dereq_("./errors").Warning;
                var util = _dereq_("./util");
                var canAttachTrace = util.canAttachTrace;
                var unhandledRejectionHandled;
                var possiblyUnhandledRejection;
                var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
                var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
                var stackFramePattern = null;
                var formatStack = null;
                var indentStackFrames = false;
                var printWarning;
                var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (true || util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));

                var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));

                var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

                var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

                Promise.prototype.suppressUnhandledRejections = function () {
                    var target = this._target();
                    target._bitField = target._bitField & ~1048576 | 524288;
                };

                Promise.prototype._ensurePossibleRejectionHandled = function () {
                    if ((this._bitField & 524288) !== 0) return;
                    this._setRejectionIsUnhandled();
                    var self = this;
                    setTimeout(function () {
                        self._notifyUnhandledRejection();
                    }, 1);
                };

                Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
                    fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, undefined, this);
                };

                Promise.prototype._setReturnedNonUndefined = function () {
                    this._bitField = this._bitField | 268435456;
                };

                Promise.prototype._returnedNonUndefined = function () {
                    return (this._bitField & 268435456) !== 0;
                };

                Promise.prototype._notifyUnhandledRejection = function () {
                    if (this._isRejectionUnhandled()) {
                        var reason = this._settledValue();
                        this._setUnhandledRejectionIsNotified();
                        fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
                    }
                };

                Promise.prototype._setUnhandledRejectionIsNotified = function () {
                    this._bitField = this._bitField | 262144;
                };

                Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
                    this._bitField = this._bitField & ~262144;
                };

                Promise.prototype._isUnhandledRejectionNotified = function () {
                    return (this._bitField & 262144) > 0;
                };

                Promise.prototype._setRejectionIsUnhandled = function () {
                    this._bitField = this._bitField | 1048576;
                };

                Promise.prototype._unsetRejectionIsUnhandled = function () {
                    this._bitField = this._bitField & ~1048576;
                    if (this._isUnhandledRejectionNotified()) {
                        this._unsetUnhandledRejectionIsNotified();
                        this._notifyUnhandledRejectionIsHandled();
                    }
                };

                Promise.prototype._isRejectionUnhandled = function () {
                    return (this._bitField & 1048576) > 0;
                };

                Promise.prototype._warn = function (message, shouldUseOwnTrace, promise) {
                    return warn(message, shouldUseOwnTrace, promise || this);
                };

                Promise.onPossiblyUnhandledRejection = function (fn) {
                    var domain = getDomain();
                    possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
                };

                Promise.onUnhandledRejectionHandled = function (fn) {
                    var domain = getDomain();
                    unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
                };

                var disableLongStackTraces = function disableLongStackTraces() {};
                Promise.longStackTraces = function () {
                    if (async.haveItemsQueued() && !config.longStackTraces) {
                        throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    if (!config.longStackTraces && longStackTracesIsSupported()) {
                        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                        config.longStackTraces = true;
                        disableLongStackTraces = function disableLongStackTraces() {
                            if (async.haveItemsQueued() && !config.longStackTraces) {
                                throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                            Context.deactivateLongStackTraces();
                            async.enableTrampoline();
                            config.longStackTraces = false;
                        };
                        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                        Context.activateLongStackTraces();
                        async.disableTrampolineIfNecessary();
                    }
                };

                Promise.hasLongStackTraces = function () {
                    return config.longStackTraces && longStackTracesIsSupported();
                };

                var fireDomEvent = function () {
                    try {
                        if (typeof CustomEvent === "function") {
                            var event = new CustomEvent("CustomEvent");
                            util.global.dispatchEvent(event);
                            return function (name, event) {
                                var domEvent = new CustomEvent(name.toLowerCase(), {
                                    detail: event,
                                    cancelable: true
                                });
                                return !util.global.dispatchEvent(domEvent);
                            };
                        } else if (typeof Event === "function") {
                            var event = new Event("CustomEvent");
                            util.global.dispatchEvent(event);
                            return function (name, event) {
                                var domEvent = new Event(name.toLowerCase(), {
                                    cancelable: true
                                });
                                domEvent.detail = event;
                                return !util.global.dispatchEvent(domEvent);
                            };
                        } else {
                            var event = document.createEvent("CustomEvent");
                            event.initCustomEvent("testingtheevent", false, true, {});
                            util.global.dispatchEvent(event);
                            return function (name, event) {
                                var domEvent = document.createEvent("CustomEvent");
                                domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
                                return !util.global.dispatchEvent(domEvent);
                            };
                        }
                    } catch (e) {}
                    return function () {
                        return false;
                    };
                }();

                var fireGlobalEvent = function () {
                    if (util.isNode) {
                        return function () {
                            return process.emit.apply(process, arguments);
                        };
                    } else {
                        if (!util.global) {
                            return function () {
                                return false;
                            };
                        }
                        return function (name) {
                            var methodName = "on" + name.toLowerCase();
                            var method = util.global[methodName];
                            if (!method) return false;
                            method.apply(util.global, [].slice.call(arguments, 1));
                            return true;
                        };
                    }
                }();

                function generatePromiseLifecycleEventObject(name, promise) {
                    return { promise: promise };
                }

                var eventToObjectGenerator = {
                    promiseCreated: generatePromiseLifecycleEventObject,
                    promiseFulfilled: generatePromiseLifecycleEventObject,
                    promiseRejected: generatePromiseLifecycleEventObject,
                    promiseResolved: generatePromiseLifecycleEventObject,
                    promiseCancelled: generatePromiseLifecycleEventObject,
                    promiseChained: function promiseChained(name, promise, child) {
                        return { promise: promise, child: child };
                    },
                    warning: function warning(name, _warning) {
                        return { warning: _warning };
                    },
                    unhandledRejection: function unhandledRejection(name, reason, promise) {
                        return { reason: reason, promise: promise };
                    },
                    rejectionHandled: generatePromiseLifecycleEventObject
                };

                var activeFireEvent = function activeFireEvent(name) {
                    var globalEventFired = false;
                    try {
                        globalEventFired = fireGlobalEvent.apply(null, arguments);
                    } catch (e) {
                        async.throwLater(e);
                        globalEventFired = true;
                    }

                    var domEventFired = false;
                    try {
                        domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                    } catch (e) {
                        async.throwLater(e);
                        domEventFired = true;
                    }

                    return domEventFired || globalEventFired;
                };

                Promise.config = function (opts) {
                    opts = Object(opts);
                    if ("longStackTraces" in opts) {
                        if (opts.longStackTraces) {
                            Promise.longStackTraces();
                        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
                            disableLongStackTraces();
                        }
                    }
                    if ("warnings" in opts) {
                        var warningsOption = opts.warnings;
                        config.warnings = !!warningsOption;
                        wForgottenReturn = config.warnings;

                        if (util.isObject(warningsOption)) {
                            if ("wForgottenReturn" in warningsOption) {
                                wForgottenReturn = !!warningsOption.wForgottenReturn;
                            }
                        }
                    }
                    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
                        if (async.haveItemsQueued()) {
                            throw new Error("cannot enable cancellation after promises are in use");
                        }
                        Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                        Promise.prototype._propagateFrom = cancellationPropagateFrom;
                        Promise.prototype._onCancel = cancellationOnCancel;
                        Promise.prototype._setOnCancel = cancellationSetOnCancel;
                        Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                        Promise.prototype._execute = cancellationExecute;
                        _propagateFromFunction = cancellationPropagateFrom;
                        config.cancellation = true;
                    }
                    if ("monitoring" in opts) {
                        if (opts.monitoring && !config.monitoring) {
                            config.monitoring = true;
                            Promise.prototype._fireEvent = activeFireEvent;
                        } else if (!opts.monitoring && config.monitoring) {
                            config.monitoring = false;
                            Promise.prototype._fireEvent = defaultFireEvent;
                        }
                    }
                    return Promise;
                };

                function defaultFireEvent() {
                    return false;
                }

                Promise.prototype._fireEvent = defaultFireEvent;
                Promise.prototype._execute = function (executor, resolve, reject) {
                    try {
                        executor(resolve, reject);
                    } catch (e) {
                        return e;
                    }
                };
                Promise.prototype._onCancel = function () {};
                Promise.prototype._setOnCancel = function (handler) {
                    ;
                };
                Promise.prototype._attachCancellationCallback = function (onCancel) {
                    ;
                };
                Promise.prototype._captureStackTrace = function () {};
                Promise.prototype._attachExtraTrace = function () {};
                Promise.prototype._clearCancellationData = function () {};
                Promise.prototype._propagateFrom = function (parent, flags) {
                    ;
                    ;
                };

                function cancellationExecute(executor, resolve, reject) {
                    var promise = this;
                    try {
                        executor(resolve, reject, function (onCancel) {
                            if (typeof onCancel !== "function") {
                                throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
                            }
                            promise._attachCancellationCallback(onCancel);
                        });
                    } catch (e) {
                        return e;
                    }
                }

                function cancellationAttachCancellationCallback(onCancel) {
                    if (!this._isCancellable()) return this;

                    var previousOnCancel = this._onCancel();
                    if (previousOnCancel !== undefined) {
                        if (util.isArray(previousOnCancel)) {
                            previousOnCancel.push(onCancel);
                        } else {
                            this._setOnCancel([previousOnCancel, onCancel]);
                        }
                    } else {
                        this._setOnCancel(onCancel);
                    }
                }

                function cancellationOnCancel() {
                    return this._onCancelField;
                }

                function cancellationSetOnCancel(onCancel) {
                    this._onCancelField = onCancel;
                }

                function cancellationClearCancellationData() {
                    this._cancellationParent = undefined;
                    this._onCancelField = undefined;
                }

                function cancellationPropagateFrom(parent, flags) {
                    if ((flags & 1) !== 0) {
                        this._cancellationParent = parent;
                        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                        if (branchesRemainingToCancel === undefined) {
                            branchesRemainingToCancel = 0;
                        }
                        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                    }
                    if ((flags & 2) !== 0 && parent._isBound()) {
                        this._setBoundTo(parent._boundTo);
                    }
                }

                function bindingPropagateFrom(parent, flags) {
                    if ((flags & 2) !== 0 && parent._isBound()) {
                        this._setBoundTo(parent._boundTo);
                    }
                }
                var _propagateFromFunction = bindingPropagateFrom;

                function _boundValueFunction() {
                    var ret = this._boundTo;
                    if (ret !== undefined) {
                        if (ret instanceof Promise) {
                            if (ret.isFulfilled()) {
                                return ret.value();
                            } else {
                                return undefined;
                            }
                        }
                    }
                    return ret;
                }

                function longStackTracesCaptureStackTrace() {
                    this._trace = new CapturedTrace(this._peekContext());
                }

                function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                    if (canAttachTrace(error)) {
                        var trace = this._trace;
                        if (trace !== undefined) {
                            if (ignoreSelf) trace = trace._parent;
                        }
                        if (trace !== undefined) {
                            trace.attachExtraTrace(error);
                        } else if (!error.__stackCleaned__) {
                            var parsed = parseStackAndMessage(error);
                            util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
                            util.notEnumerableProp(error, "__stackCleaned__", true);
                        }
                    }
                }

                function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                    if (returnValue === undefined && promiseCreated !== null && wForgottenReturn) {
                        if (parent !== undefined && parent._returnedNonUndefined()) return;
                        if ((promise._bitField & 65535) === 0) return;

                        if (name) name = name + " ";
                        var handlerLine = "";
                        var creatorLine = "";
                        if (promiseCreated._trace) {
                            var traceLines = promiseCreated._trace.stack.split("\n");
                            var stack = cleanStack(traceLines);
                            for (var i = stack.length - 1; i >= 0; --i) {
                                var line = stack[i];
                                if (!nodeFramePattern.test(line)) {
                                    var lineMatches = line.match(parseLinePattern);
                                    if (lineMatches) {
                                        handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                                    }
                                    break;
                                }
                            }

                            if (stack.length > 0) {
                                var firstUserLine = stack[0];
                                for (var i = 0; i < traceLines.length; ++i) {

                                    if (traceLines[i] === firstUserLine) {
                                        if (i > 0) {
                                            creatorLine = "\n" + traceLines[i - 1];
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, " + "see http://goo.gl/rRqMUw" + creatorLine;
                        promise._warn(msg, true, promiseCreated);
                    }
                }

                function deprecated(name, replacement) {
                    var message = name + " is deprecated and will be removed in a future version.";
                    if (replacement) message += " Use " + replacement + " instead.";
                    return warn(message);
                }

                function warn(message, shouldUseOwnTrace, promise) {
                    if (!config.warnings) return;
                    var warning = new Warning(message);
                    var ctx;
                    if (shouldUseOwnTrace) {
                        promise._attachExtraTrace(warning);
                    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
                        ctx.attachExtraTrace(warning);
                    } else {
                        var parsed = parseStackAndMessage(warning);
                        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                    }

                    if (!activeFireEvent("warning", warning)) {
                        formatAndLogError(warning, "", true);
                    }
                }

                function reconstructStack(message, stacks) {
                    for (var i = 0; i < stacks.length - 1; ++i) {
                        stacks[i].push("From previous event:");
                        stacks[i] = stacks[i].join("\n");
                    }
                    if (i < stacks.length) {
                        stacks[i] = stacks[i].join("\n");
                    }
                    return message + "\n" + stacks.join("\n");
                }

                function removeDuplicateOrEmptyJumps(stacks) {
                    for (var i = 0; i < stacks.length; ++i) {
                        if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                            stacks.splice(i, 1);
                            i--;
                        }
                    }
                }

                function removeCommonRoots(stacks) {
                    var current = stacks[0];
                    for (var i = 1; i < stacks.length; ++i) {
                        var prev = stacks[i];
                        var currentLastIndex = current.length - 1;
                        var currentLastLine = current[currentLastIndex];
                        var commonRootMeetPoint = -1;

                        for (var j = prev.length - 1; j >= 0; --j) {
                            if (prev[j] === currentLastLine) {
                                commonRootMeetPoint = j;
                                break;
                            }
                        }

                        for (var j = commonRootMeetPoint; j >= 0; --j) {
                            var line = prev[j];
                            if (current[currentLastIndex] === line) {
                                current.pop();
                                currentLastIndex--;
                            } else {
                                break;
                            }
                        }
                        current = prev;
                    }
                }

                function cleanStack(stack) {
                    var ret = [];
                    for (var i = 0; i < stack.length; ++i) {
                        var line = stack[i];
                        var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
                        var isInternalFrame = isTraceLine && shouldIgnore(line);
                        if (isTraceLine && !isInternalFrame) {
                            if (indentStackFrames && line.charAt(0) !== " ") {
                                line = "    " + line;
                            }
                            ret.push(line);
                        }
                    }
                    return ret;
                }

                function stackFramesAsArray(error) {
                    var stack = error.stack.replace(/\s+$/g, "").split("\n");
                    for (var i = 0; i < stack.length; ++i) {
                        var line = stack[i];
                        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
                            break;
                        }
                    }
                    if (i > 0 && error.name != "SyntaxError") {
                        stack = stack.slice(i);
                    }
                    return stack;
                }

                function parseStackAndMessage(error) {
                    var stack = error.stack;
                    var message = error.toString();
                    stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
                    return {
                        message: message,
                        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
                    };
                }

                function formatAndLogError(error, title, isSoft) {
                    if (typeof console !== "undefined") {
                        var message;
                        if (util.isObject(error)) {
                            var stack = error.stack;
                            message = title + formatStack(stack, error);
                        } else {
                            message = title + String(error);
                        }
                        if (typeof printWarning === "function") {
                            printWarning(message, isSoft);
                        } else if (typeof console.log === "function" || _typeof(console.log) === "object") {
                            console.log(message);
                        }
                    }
                }

                function fireRejectionEvent(name, localHandler, reason, promise) {
                    var localEventFired = false;
                    try {
                        if (typeof localHandler === "function") {
                            localEventFired = true;
                            if (name === "rejectionHandled") {
                                localHandler(promise);
                            } else {
                                localHandler(reason, promise);
                            }
                        }
                    } catch (e) {
                        async.throwLater(e);
                    }

                    if (name === "unhandledRejection") {
                        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
                            formatAndLogError(reason, "Unhandled rejection ");
                        }
                    } else {
                        activeFireEvent(name, promise);
                    }
                }

                function formatNonError(obj) {
                    var str;
                    if (typeof obj === "function") {
                        str = "[function " + (obj.name || "anonymous") + "]";
                    } else {
                        str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
                        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
                        if (ruselessToString.test(str)) {
                            try {
                                var newStr = JSON.stringify(obj);
                                str = newStr;
                            } catch (e) {}
                        }
                        if (str.length === 0) {
                            str = "(empty array)";
                        }
                    }
                    return "(<" + snip(str) + ">, no stack trace)";
                }

                function snip(str) {
                    var maxChars = 41;
                    if (str.length < maxChars) {
                        return str;
                    }
                    return str.substr(0, maxChars - 3) + "...";
                }

                function longStackTracesIsSupported() {
                    return typeof captureStackTrace === "function";
                }

                var shouldIgnore = function shouldIgnore() {
                    return false;
                };
                var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                function parseLineInfo(line) {
                    var matches = line.match(parseLineInfoRegex);
                    if (matches) {
                        return {
                            fileName: matches[1],
                            line: parseInt(matches[2], 10)
                        };
                    }
                }

                function setBounds(firstLineError, lastLineError) {
                    if (!longStackTracesIsSupported()) return;
                    var firstStackLines = firstLineError.stack.split("\n");
                    var lastStackLines = lastLineError.stack.split("\n");
                    var firstIndex = -1;
                    var lastIndex = -1;
                    var firstFileName;
                    var lastFileName;
                    for (var i = 0; i < firstStackLines.length; ++i) {
                        var result = parseLineInfo(firstStackLines[i]);
                        if (result) {
                            firstFileName = result.fileName;
                            firstIndex = result.line;
                            break;
                        }
                    }
                    for (var i = 0; i < lastStackLines.length; ++i) {
                        var result = parseLineInfo(lastStackLines[i]);
                        if (result) {
                            lastFileName = result.fileName;
                            lastIndex = result.line;
                            break;
                        }
                    }
                    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
                        return;
                    }

                    shouldIgnore = function shouldIgnore(line) {
                        if (bluebirdFramePattern.test(line)) return true;
                        var info = parseLineInfo(line);
                        if (info) {
                            if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) {
                                return true;
                            }
                        }
                        return false;
                    };
                }

                function CapturedTrace(parent) {
                    this._parent = parent;
                    this._promisesCreated = 0;
                    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
                    captureStackTrace(this, CapturedTrace);
                    if (length > 32) this.uncycle();
                }
                util.inherits(CapturedTrace, Error);
                Context.CapturedTrace = CapturedTrace;

                CapturedTrace.prototype.uncycle = function () {
                    var length = this._length;
                    if (length < 2) return;
                    var nodes = [];
                    var stackToIndex = {};

                    for (var i = 0, node = this; node !== undefined; ++i) {
                        nodes.push(node);
                        node = node._parent;
                    }
                    length = this._length = i;
                    for (var i = length - 1; i >= 0; --i) {
                        var stack = nodes[i].stack;
                        if (stackToIndex[stack] === undefined) {
                            stackToIndex[stack] = i;
                        }
                    }
                    for (var i = 0; i < length; ++i) {
                        var currentStack = nodes[i].stack;
                        var index = stackToIndex[currentStack];
                        if (index !== undefined && index !== i) {
                            if (index > 0) {
                                nodes[index - 1]._parent = undefined;
                                nodes[index - 1]._length = 1;
                            }
                            nodes[i]._parent = undefined;
                            nodes[i]._length = 1;
                            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                            if (index < length - 1) {
                                cycleEdgeNode._parent = nodes[index + 1];
                                cycleEdgeNode._parent.uncycle();
                                cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                            } else {
                                cycleEdgeNode._parent = undefined;
                                cycleEdgeNode._length = 1;
                            }
                            var currentChildLength = cycleEdgeNode._length + 1;
                            for (var j = i - 2; j >= 0; --j) {
                                nodes[j]._length = currentChildLength;
                                currentChildLength++;
                            }
                            return;
                        }
                    }
                };

                CapturedTrace.prototype.attachExtraTrace = function (error) {
                    if (error.__stackCleaned__) return;
                    this.uncycle();
                    var parsed = parseStackAndMessage(error);
                    var message = parsed.message;
                    var stacks = [parsed.stack];

                    var trace = this;
                    while (trace !== undefined) {
                        stacks.push(cleanStack(trace.stack.split("\n")));
                        trace = trace._parent;
                    }
                    removeCommonRoots(stacks);
                    removeDuplicateOrEmptyJumps(stacks);
                    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                    util.notEnumerableProp(error, "__stackCleaned__", true);
                };

                var captureStackTrace = function stackDetection() {
                    var v8stackFramePattern = /^\s*at\s*/;
                    var v8stackFormatter = function v8stackFormatter(stack, error) {
                        if (typeof stack === "string") return stack;

                        if (error.name !== undefined && error.message !== undefined) {
                            return error.toString();
                        }
                        return formatNonError(error);
                    };

                    if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
                        Error.stackTraceLimit += 6;
                        stackFramePattern = v8stackFramePattern;
                        formatStack = v8stackFormatter;
                        var captureStackTrace = Error.captureStackTrace;

                        shouldIgnore = function shouldIgnore(line) {
                            return bluebirdFramePattern.test(line);
                        };
                        return function (receiver, ignoreUntil) {
                            Error.stackTraceLimit += 6;
                            captureStackTrace(receiver, ignoreUntil);
                            Error.stackTraceLimit -= 6;
                        };
                    }
                    var err = new Error();

                    if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                        stackFramePattern = /@/;
                        formatStack = v8stackFormatter;
                        indentStackFrames = true;
                        return function captureStackTrace(o) {
                            o.stack = new Error().stack;
                        };
                    }

                    var hasStackAfterThrow;
                    try {
                        throw new Error();
                    } catch (e) {
                        hasStackAfterThrow = "stack" in e;
                    }
                    if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
                        stackFramePattern = v8stackFramePattern;
                        formatStack = v8stackFormatter;
                        return function captureStackTrace(o) {
                            Error.stackTraceLimit += 6;
                            try {
                                throw new Error();
                            } catch (e) {
                                o.stack = e.stack;
                            }
                            Error.stackTraceLimit -= 6;
                        };
                    }

                    formatStack = function formatStack(stack, error) {
                        if (typeof stack === "string") return stack;

                        if (((typeof error === "undefined" ? "undefined" : _typeof(error)) === "object" || typeof error === "function") && error.name !== undefined && error.message !== undefined) {
                            return error.toString();
                        }
                        return formatNonError(error);
                    };

                    return null;
                }([]);

                if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
                    printWarning = function printWarning(message) {
                        console.warn(message);
                    };
                    if (util.isNode && process.stderr.isTTY) {
                        printWarning = function printWarning(message, isSoft) {
                            var color = isSoft ? "\x1B[33m" : "\x1B[31m";
                            console.warn(color + message + "\x1B[0m\n");
                        };
                    } else if (!util.isNode && typeof new Error().stack === "string") {
                        printWarning = function printWarning(message, isSoft) {
                            console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
                        };
                    }
                }

                var config = {
                    warnings: warnings,
                    longStackTraces: false,
                    cancellation: false,
                    monitoring: false
                };

                if (longStackTraces) Promise.longStackTraces();

                return {
                    longStackTraces: function longStackTraces() {
                        return config.longStackTraces;
                    },
                    warnings: function warnings() {
                        return config.warnings;
                    },
                    cancellation: function cancellation() {
                        return config.cancellation;
                    },
                    monitoring: function monitoring() {
                        return config.monitoring;
                    },
                    propagateFromFunction: function propagateFromFunction() {
                        return _propagateFromFunction;
                    },
                    boundValueFunction: function boundValueFunction() {
                        return _boundValueFunction;
                    },
                    checkForgottenReturns: checkForgottenReturns,
                    setBounds: setBounds,
                    warn: warn,
                    deprecated: deprecated,
                    CapturedTrace: CapturedTrace,
                    fireDomEvent: fireDomEvent,
                    fireGlobalEvent: fireGlobalEvent
                };
            };
        }, { "./errors": 12, "./util": 36 }], 10: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise) {
                function returner() {
                    return this.value;
                }
                function thrower() {
                    throw this.reason;
                }

                Promise.prototype["return"] = Promise.prototype.thenReturn = function (value) {
                    if (value instanceof Promise) value.suppressUnhandledRejections();
                    return this._then(returner, undefined, undefined, { value: value }, undefined);
                };

                Promise.prototype["throw"] = Promise.prototype.thenThrow = function (reason) {
                    return this._then(thrower, undefined, undefined, { reason: reason }, undefined);
                };

                Promise.prototype.catchThrow = function (reason) {
                    if (arguments.length <= 1) {
                        return this._then(undefined, thrower, undefined, { reason: reason }, undefined);
                    } else {
                        var _reason = arguments[1];
                        var handler = function handler() {
                            throw _reason;
                        };
                        return this.caught(reason, handler);
                    }
                };

                Promise.prototype.catchReturn = function (value) {
                    if (arguments.length <= 1) {
                        if (value instanceof Promise) value.suppressUnhandledRejections();
                        return this._then(undefined, returner, undefined, { value: value }, undefined);
                    } else {
                        var _value = arguments[1];
                        if (_value instanceof Promise) _value.suppressUnhandledRejections();
                        var handler = function handler() {
                            return _value;
                        };
                        return this.caught(value, handler);
                    }
                };
            };
        }, {}], 11: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL) {
                var PromiseReduce = Promise.reduce;
                var PromiseAll = Promise.all;

                function promiseAllThis() {
                    return PromiseAll(this);
                }

                function PromiseMapSeries(promises, fn) {
                    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
                }

                Promise.prototype.each = function (fn) {
                    return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, undefined, undefined, this, undefined);
                };

                Promise.prototype.mapSeries = function (fn) {
                    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
                };

                Promise.each = function (promises, fn) {
                    return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, undefined, undefined, promises, undefined);
                };

                Promise.mapSeries = PromiseMapSeries;
            };
        }, {}], 12: [function (_dereq_, module, exports) {
            "use strict";

            var es5 = _dereq_("./es5");
            var Objectfreeze = es5.freeze;
            var util = _dereq_("./util");
            var inherits = util.inherits;
            var notEnumerableProp = util.notEnumerableProp;

            function subError(nameProperty, defaultMessage) {
                function SubError(message) {
                    if (!(this instanceof SubError)) return new SubError(message);
                    notEnumerableProp(this, "message", typeof message === "string" ? message : defaultMessage);
                    notEnumerableProp(this, "name", nameProperty);
                    if (Error.captureStackTrace) {
                        Error.captureStackTrace(this, this.constructor);
                    } else {
                        Error.call(this);
                    }
                }
                inherits(SubError, Error);
                return SubError;
            }

            var _TypeError, _RangeError;
            var Warning = subError("Warning", "warning");
            var CancellationError = subError("CancellationError", "cancellation error");
            var TimeoutError = subError("TimeoutError", "timeout error");
            var AggregateError = subError("AggregateError", "aggregate error");
            try {
                _TypeError = TypeError;
                _RangeError = RangeError;
            } catch (e) {
                _TypeError = subError("TypeError", "type error");
                _RangeError = subError("RangeError", "range error");
            }

            var methods = ("join pop push shift unshift slice filter forEach some " + "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

            for (var i = 0; i < methods.length; ++i) {
                if (typeof Array.prototype[methods[i]] === "function") {
                    AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                }
            }

            es5.defineProperty(AggregateError.prototype, "length", {
                value: 0,
                configurable: false,
                writable: true,
                enumerable: true
            });
            AggregateError.prototype["isOperational"] = true;
            var level = 0;
            AggregateError.prototype.toString = function () {
                var indent = Array(level * 4 + 1).join(" ");
                var ret = "\n" + indent + "AggregateError of:" + "\n";
                level++;
                indent = Array(level * 4 + 1).join(" ");
                for (var i = 0; i < this.length; ++i) {
                    var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                    var lines = str.split("\n");
                    for (var j = 0; j < lines.length; ++j) {
                        lines[j] = indent + lines[j];
                    }
                    str = lines.join("\n");
                    ret += str + "\n";
                }
                level--;
                return ret;
            };

            function OperationalError(message) {
                if (!(this instanceof OperationalError)) return new OperationalError(message);
                notEnumerableProp(this, "name", "OperationalError");
                notEnumerableProp(this, "message", message);
                this.cause = message;
                this["isOperational"] = true;

                if (message instanceof Error) {
                    notEnumerableProp(this, "message", message.message);
                    notEnumerableProp(this, "stack", message.stack);
                } else if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, this.constructor);
                }
            }
            inherits(OperationalError, Error);

            var errorTypes = Error["__BluebirdErrorTypes__"];
            if (!errorTypes) {
                errorTypes = Objectfreeze({
                    CancellationError: CancellationError,
                    TimeoutError: TimeoutError,
                    OperationalError: OperationalError,
                    RejectionError: OperationalError,
                    AggregateError: AggregateError
                });
                es5.defineProperty(Error, "__BluebirdErrorTypes__", {
                    value: errorTypes,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            }

            module.exports = {
                Error: Error,
                TypeError: _TypeError,
                RangeError: _RangeError,
                CancellationError: errorTypes.CancellationError,
                OperationalError: errorTypes.OperationalError,
                TimeoutError: errorTypes.TimeoutError,
                AggregateError: errorTypes.AggregateError,
                Warning: Warning
            };
        }, { "./es5": 13, "./util": 36 }], 13: [function (_dereq_, module, exports) {
            var isES5 = function () {
                "use strict";

                return this === undefined;
            }();

            if (isES5) {
                module.exports = {
                    freeze: Object.freeze,
                    defineProperty: Object.defineProperty,
                    getDescriptor: Object.getOwnPropertyDescriptor,
                    keys: Object.keys,
                    names: Object.getOwnPropertyNames,
                    getPrototypeOf: Object.getPrototypeOf,
                    isArray: Array.isArray,
                    isES5: isES5,
                    propertyIsWritable: function propertyIsWritable(obj, prop) {
                        var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                        return !!(!descriptor || descriptor.writable || descriptor.set);
                    }
                };
            } else {
                var has = {}.hasOwnProperty;
                var str = {}.toString;
                var proto = {}.constructor.prototype;

                var ObjectKeys = function ObjectKeys(o) {
                    var ret = [];
                    for (var key in o) {
                        if (has.call(o, key)) {
                            ret.push(key);
                        }
                    }
                    return ret;
                };

                var ObjectGetDescriptor = function ObjectGetDescriptor(o, key) {
                    return { value: o[key] };
                };

                var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
                    o[key] = desc.value;
                    return o;
                };

                var ObjectFreeze = function ObjectFreeze(obj) {
                    return obj;
                };

                var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
                    try {
                        return Object(obj).constructor.prototype;
                    } catch (e) {
                        return proto;
                    }
                };

                var ArrayIsArray = function ArrayIsArray(obj) {
                    try {
                        return str.call(obj) === "[object Array]";
                    } catch (e) {
                        return false;
                    }
                };

                module.exports = {
                    isArray: ArrayIsArray,
                    keys: ObjectKeys,
                    names: ObjectKeys,
                    defineProperty: ObjectDefineProperty,
                    getDescriptor: ObjectGetDescriptor,
                    freeze: ObjectFreeze,
                    getPrototypeOf: ObjectGetPrototypeOf,
                    isES5: isES5,
                    propertyIsWritable: function propertyIsWritable() {
                        return true;
                    }
                };
            }
        }, {}], 14: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL) {
                var PromiseMap = Promise.map;

                Promise.prototype.filter = function (fn, options) {
                    return PromiseMap(this, fn, options, INTERNAL);
                };

                Promise.filter = function (promises, fn, options) {
                    return PromiseMap(promises, fn, options, INTERNAL);
                };
            };
        }, {}], 15: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, tryConvertToPromise, NEXT_FILTER) {
                var util = _dereq_("./util");
                var CancellationError = Promise.CancellationError;
                var errorObj = util.errorObj;
                var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

                function PassThroughHandlerContext(promise, type, handler) {
                    this.promise = promise;
                    this.type = type;
                    this.handler = handler;
                    this.called = false;
                    this.cancelPromise = null;
                }

                PassThroughHandlerContext.prototype.isFinallyHandler = function () {
                    return this.type === 0;
                };

                function FinallyHandlerCancelReaction(finallyHandler) {
                    this.finallyHandler = finallyHandler;
                }

                FinallyHandlerCancelReaction.prototype._resultCancelled = function () {
                    checkCancel(this.finallyHandler);
                };

                function checkCancel(ctx, reason) {
                    if (ctx.cancelPromise != null) {
                        if (arguments.length > 1) {
                            ctx.cancelPromise._reject(reason);
                        } else {
                            ctx.cancelPromise._cancel();
                        }
                        ctx.cancelPromise = null;
                        return true;
                    }
                    return false;
                }

                function succeed() {
                    return finallyHandler.call(this, this.promise._target()._settledValue());
                }
                function fail(reason) {
                    if (checkCancel(this, reason)) return;
                    errorObj.e = reason;
                    return errorObj;
                }
                function finallyHandler(reasonOrValue) {
                    var promise = this.promise;
                    var handler = this.handler;

                    if (!this.called) {
                        this.called = true;
                        var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                        if (ret === NEXT_FILTER) {
                            return ret;
                        } else if (ret !== undefined) {
                            promise._setReturnedNonUndefined();
                            var maybePromise = tryConvertToPromise(ret, promise);
                            if (maybePromise instanceof Promise) {
                                if (this.cancelPromise != null) {
                                    if (maybePromise._isCancelled()) {
                                        var reason = new CancellationError("late cancellation observer");
                                        promise._attachExtraTrace(reason);
                                        errorObj.e = reason;
                                        return errorObj;
                                    } else if (maybePromise.isPending()) {
                                        maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                    }
                                }
                                return maybePromise._then(succeed, fail, undefined, this, undefined);
                            }
                        }
                    }

                    if (promise.isRejected()) {
                        checkCancel(this);
                        errorObj.e = reasonOrValue;
                        return errorObj;
                    } else {
                        checkCancel(this);
                        return reasonOrValue;
                    }
                }

                Promise.prototype._passThrough = function (handler, type, success, fail) {
                    if (typeof handler !== "function") return this.then();
                    return this._then(success, fail, undefined, new PassThroughHandlerContext(this, type, handler), undefined);
                };

                Promise.prototype.lastly = Promise.prototype["finally"] = function (handler) {
                    return this._passThrough(handler, 0, finallyHandler, finallyHandler);
                };

                Promise.prototype.tap = function (handler) {
                    return this._passThrough(handler, 1, finallyHandler);
                };

                Promise.prototype.tapCatch = function (handlerOrPredicate) {
                    var len = arguments.length;
                    if (len === 1) {
                        return this._passThrough(handlerOrPredicate, 1, undefined, finallyHandler);
                    } else {
                        var catchInstances = new Array(len - 1),
                            j = 0,
                            i;
                        for (i = 0; i < len - 1; ++i) {
                            var item = arguments[i];
                            if (util.isObject(item)) {
                                catchInstances[j++] = item;
                            } else {
                                return Promise.reject(new TypeError("tapCatch statement predicate: " + "expecting an object but got " + util.classString(item)));
                            }
                        }
                        catchInstances.length = j;
                        var handler = arguments[i];
                        return this._passThrough(catchFilter(catchInstances, handler, this), 1, undefined, finallyHandler);
                    }
                };

                return PassThroughHandlerContext;
            };
        }, { "./catch_filter": 7, "./util": 36 }], 16: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
                var errors = _dereq_("./errors");
                var TypeError = errors.TypeError;
                var util = _dereq_("./util");
                var errorObj = util.errorObj;
                var tryCatch = util.tryCatch;
                var yieldHandlers = [];

                function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
                    for (var i = 0; i < yieldHandlers.length; ++i) {
                        traceParent._pushContext();
                        var result = tryCatch(yieldHandlers[i])(value);
                        traceParent._popContext();
                        if (result === errorObj) {
                            traceParent._pushContext();
                            var ret = Promise.reject(errorObj.e);
                            traceParent._popContext();
                            return ret;
                        }
                        var maybePromise = tryConvertToPromise(result, traceParent);
                        if (maybePromise instanceof Promise) return maybePromise;
                    }
                    return null;
                }

                function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
                    if (debug.cancellation()) {
                        var internal = new Promise(INTERNAL);
                        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
                        this._promise = internal.lastly(function () {
                            return _finallyPromise;
                        });
                        internal._captureStackTrace();
                        internal._setOnCancel(this);
                    } else {
                        var promise = this._promise = new Promise(INTERNAL);
                        promise._captureStackTrace();
                    }
                    this._stack = stack;
                    this._generatorFunction = generatorFunction;
                    this._receiver = receiver;
                    this._generator = undefined;
                    this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
                    this._yieldedPromise = null;
                    this._cancellationPhase = false;
                }
                util.inherits(PromiseSpawn, Proxyable);

                PromiseSpawn.prototype._isResolved = function () {
                    return this._promise === null;
                };

                PromiseSpawn.prototype._cleanup = function () {
                    this._promise = this._generator = null;
                    if (debug.cancellation() && this._finallyPromise !== null) {
                        this._finallyPromise._fulfill();
                        this._finallyPromise = null;
                    }
                };

                PromiseSpawn.prototype._promiseCancelled = function () {
                    if (this._isResolved()) return;
                    var implementsReturn = typeof this._generator["return"] !== "undefined";

                    var result;
                    if (!implementsReturn) {
                        var reason = new Promise.CancellationError("generator .return() sentinel");
                        Promise.coroutine.returnSentinel = reason;
                        this._promise._attachExtraTrace(reason);
                        this._promise._pushContext();
                        result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                        this._promise._popContext();
                    } else {
                        this._promise._pushContext();
                        result = tryCatch(this._generator["return"]).call(this._generator, undefined);
                        this._promise._popContext();
                    }
                    this._cancellationPhase = true;
                    this._yieldedPromise = null;
                    this._continue(result);
                };

                PromiseSpawn.prototype._promiseFulfilled = function (value) {
                    this._yieldedPromise = null;
                    this._promise._pushContext();
                    var result = tryCatch(this._generator.next).call(this._generator, value);
                    this._promise._popContext();
                    this._continue(result);
                };

                PromiseSpawn.prototype._promiseRejected = function (reason) {
                    this._yieldedPromise = null;
                    this._promise._attachExtraTrace(reason);
                    this._promise._pushContext();
                    var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                    this._promise._popContext();
                    this._continue(result);
                };

                PromiseSpawn.prototype._resultCancelled = function () {
                    if (this._yieldedPromise instanceof Promise) {
                        var promise = this._yieldedPromise;
                        this._yieldedPromise = null;
                        promise.cancel();
                    }
                };

                PromiseSpawn.prototype.promise = function () {
                    return this._promise;
                };

                PromiseSpawn.prototype._run = function () {
                    this._generator = this._generatorFunction.call(this._receiver);
                    this._receiver = this._generatorFunction = undefined;
                    this._promiseFulfilled(undefined);
                };

                PromiseSpawn.prototype._continue = function (result) {
                    var promise = this._promise;
                    if (result === errorObj) {
                        this._cleanup();
                        if (this._cancellationPhase) {
                            return promise.cancel();
                        } else {
                            return promise._rejectCallback(result.e, false);
                        }
                    }

                    var value = result.value;
                    if (result.done === true) {
                        this._cleanup();
                        if (this._cancellationPhase) {
                            return promise.cancel();
                        } else {
                            return promise._resolveCallback(value);
                        }
                    } else {
                        var maybePromise = tryConvertToPromise(value, this._promise);
                        if (!(maybePromise instanceof Promise)) {
                            maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
                            if (maybePromise === null) {
                                this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                                return;
                            }
                        }
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if ((bitField & 50397184) === 0) {
                            this._yieldedPromise = maybePromise;
                            maybePromise._proxy(this, null);
                        } else if ((bitField & 33554432) !== 0) {
                            Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value());
                        } else if ((bitField & 16777216) !== 0) {
                            Promise._async.invoke(this._promiseRejected, this, maybePromise._reason());
                        } else {
                            this._promiseCancelled();
                        }
                    }
                };

                Promise.coroutine = function (generatorFunction, options) {
                    if (typeof generatorFunction !== "function") {
                        throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    var yieldHandler = Object(options).yieldHandler;
                    var PromiseSpawn$ = PromiseSpawn;
                    var stack = new Error().stack;
                    return function () {
                        var generator = generatorFunction.apply(this, arguments);
                        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler, stack);
                        var ret = spawn.promise();
                        spawn._generator = generator;
                        spawn._promiseFulfilled(undefined);
                        return ret;
                    };
                };

                Promise.coroutine.addYieldHandler = function (fn) {
                    if (typeof fn !== "function") {
                        throw new TypeError("expecting a function but got " + util.classString(fn));
                    }
                    yieldHandlers.push(fn);
                };

                Promise.spawn = function (generatorFunction) {
                    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
                    if (typeof generatorFunction !== "function") {
                        return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    var spawn = new PromiseSpawn(generatorFunction, this);
                    var ret = spawn.promise();
                    spawn._run(Promise.spawn);
                    return ret;
                };
            };
        }, { "./errors": 12, "./util": 36 }], 17: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain) {
                var util = _dereq_("./util");
                var canEvaluate = util.canEvaluate;
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;
                var reject;

                if (false) {
                    if (canEvaluate) {
                        var thenCallback = function thenCallback(i) {
                            return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
                        };

                        var promiseSetter = function promiseSetter(i) {
                            return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
                        };

                        var generateHolderClass = function generateHolderClass(total) {
                            var props = new Array(total);
                            for (var i = 0; i < props.length; ++i) {
                                props[i] = "this.p" + (i + 1);
                            }
                            var assignment = props.join(" = ") + " = null;";
                            var cancellationCode = "var promise;\n" + props.map(function (prop) {
                                return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
                            }).join("\n");
                            var passedArguments = props.join(", ");
                            var name = "Holder$" + total;

                            var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

                            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);

                            return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch, errorObj, Promise, async);
                        };

                        var holderClasses = [];
                        var thenCallbacks = [];
                        var promiseSetters = [];

                        for (var i = 0; i < 8; ++i) {
                            holderClasses.push(generateHolderClass(i + 1));
                            thenCallbacks.push(thenCallback(i + 1));
                            promiseSetters.push(promiseSetter(i + 1));
                        }

                        reject = function reject(reason) {
                            this._reject(reason);
                        };
                    }
                }

                Promise.join = function () {
                    var last = arguments.length - 1;
                    var fn;
                    if (last > 0 && typeof arguments[last] === "function") {
                        fn = arguments[last];
                        if (false) {
                            if (last <= 8 && canEvaluate) {
                                var ret = new Promise(INTERNAL);
                                ret._captureStackTrace();
                                var HolderClass = holderClasses[last - 1];
                                var holder = new HolderClass(fn);
                                var callbacks = thenCallbacks;

                                for (var i = 0; i < last; ++i) {
                                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                                    if (maybePromise instanceof Promise) {
                                        maybePromise = maybePromise._target();
                                        var bitField = maybePromise._bitField;
                                        ;
                                        if ((bitField & 50397184) === 0) {
                                            maybePromise._then(callbacks[i], reject, undefined, ret, holder);
                                            promiseSetters[i](maybePromise, holder);
                                            holder.asyncNeeded = false;
                                        } else if ((bitField & 33554432) !== 0) {
                                            callbacks[i].call(ret, maybePromise._value(), holder);
                                        } else if ((bitField & 16777216) !== 0) {
                                            ret._reject(maybePromise._reason());
                                        } else {
                                            ret._cancel();
                                        }
                                    } else {
                                        callbacks[i].call(ret, maybePromise, holder);
                                    }
                                }

                                if (!ret._isFateSealed()) {
                                    if (holder.asyncNeeded) {
                                        var domain = getDomain();
                                        if (domain !== null) {
                                            holder.fn = util.domainBind(domain, holder.fn);
                                        }
                                    }
                                    ret._setAsyncGuaranteed();
                                    ret._setOnCancel(holder);
                                }
                                return ret;
                            }
                        }
                    }
                    var args = [].slice.call(arguments);;
                    if (fn) args.pop();
                    var ret = new PromiseArray(args).promise();
                    return fn !== undefined ? ret.spread(fn) : ret;
                };
            };
        }, { "./util": 36 }], 18: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                var getDomain = Promise._getDomain;
                var util = _dereq_("./util");
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;
                var async = Promise._async;

                function MappingPromiseArray(promises, fn, limit, _filter) {
                    this.constructor$(promises);
                    this._promise._captureStackTrace();
                    var domain = getDomain();
                    this._callback = domain === null ? fn : util.domainBind(domain, fn);
                    this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
                    this._limit = limit;
                    this._inFlight = 0;
                    this._queue = [];
                    async.invoke(this._asyncInit, this, undefined);
                }
                util.inherits(MappingPromiseArray, PromiseArray);

                MappingPromiseArray.prototype._asyncInit = function () {
                    this._init$(undefined, -2);
                };

                MappingPromiseArray.prototype._init = function () {};

                MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
                    var values = this._values;
                    var length = this.length();
                    var preservedValues = this._preservedValues;
                    var limit = this._limit;

                    if (index < 0) {
                        index = index * -1 - 1;
                        values[index] = value;
                        if (limit >= 1) {
                            this._inFlight--;
                            this._drainQueue();
                            if (this._isResolved()) return true;
                        }
                    } else {
                        if (limit >= 1 && this._inFlight >= limit) {
                            values[index] = value;
                            this._queue.push(index);
                            return false;
                        }
                        if (preservedValues !== null) preservedValues[index] = value;

                        var promise = this._promise;
                        var callback = this._callback;
                        var receiver = promise._boundValue();
                        promise._pushContext();
                        var ret = tryCatch(callback).call(receiver, value, index, length);
                        var promiseCreated = promise._popContext();
                        debug.checkForgottenReturns(ret, promiseCreated, preservedValues !== null ? "Promise.filter" : "Promise.map", promise);
                        if (ret === errorObj) {
                            this._reject(ret.e);
                            return true;
                        }

                        var maybePromise = tryConvertToPromise(ret, this._promise);
                        if (maybePromise instanceof Promise) {
                            maybePromise = maybePromise._target();
                            var bitField = maybePromise._bitField;
                            ;
                            if ((bitField & 50397184) === 0) {
                                if (limit >= 1) this._inFlight++;
                                values[index] = maybePromise;
                                maybePromise._proxy(this, (index + 1) * -1);
                                return false;
                            } else if ((bitField & 33554432) !== 0) {
                                ret = maybePromise._value();
                            } else if ((bitField & 16777216) !== 0) {
                                this._reject(maybePromise._reason());
                                return true;
                            } else {
                                this._cancel();
                                return true;
                            }
                        }
                        values[index] = ret;
                    }
                    var totalResolved = ++this._totalResolved;
                    if (totalResolved >= length) {
                        if (preservedValues !== null) {
                            this._filter(values, preservedValues);
                        } else {
                            this._resolve(values);
                        }
                        return true;
                    }
                    return false;
                };

                MappingPromiseArray.prototype._drainQueue = function () {
                    var queue = this._queue;
                    var limit = this._limit;
                    var values = this._values;
                    while (queue.length > 0 && this._inFlight < limit) {
                        if (this._isResolved()) return;
                        var index = queue.pop();
                        this._promiseFulfilled(values[index], index);
                    }
                };

                MappingPromiseArray.prototype._filter = function (booleans, values) {
                    var len = values.length;
                    var ret = new Array(len);
                    var j = 0;
                    for (var i = 0; i < len; ++i) {
                        if (booleans[i]) ret[j++] = values[i];
                    }
                    ret.length = j;
                    this._resolve(ret);
                };

                MappingPromiseArray.prototype.preservedValues = function () {
                    return this._preservedValues;
                };

                function map(promises, fn, options, _filter) {
                    if (typeof fn !== "function") {
                        return apiRejection("expecting a function but got " + util.classString(fn));
                    }

                    var limit = 0;
                    if (options !== undefined) {
                        if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" && options !== null) {
                            if (typeof options.concurrency !== "number") {
                                return Promise.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
                            }
                            limit = options.concurrency;
                        } else {
                            return Promise.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
                        }
                    }
                    limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
                    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
                }

                Promise.prototype.map = function (fn, options) {
                    return map(this, fn, options, null);
                };

                Promise.map = function (promises, fn, options, _filter) {
                    return map(promises, fn, options, _filter);
                };
            };
        }, { "./util": 36 }], 19: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
                var util = _dereq_("./util");
                var tryCatch = util.tryCatch;

                Promise.method = function (fn) {
                    if (typeof fn !== "function") {
                        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
                    }
                    return function () {
                        var ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._pushContext();
                        var value = tryCatch(fn).apply(this, arguments);
                        var promiseCreated = ret._popContext();
                        debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
                        ret._resolveFromSyncValue(value);
                        return ret;
                    };
                };

                Promise.attempt = Promise["try"] = function (fn) {
                    if (typeof fn !== "function") {
                        return apiRejection("expecting a function but got " + util.classString(fn));
                    }
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    ret._pushContext();
                    var value;
                    if (arguments.length > 1) {
                        debug.deprecated("calling Promise.try with more than 1 argument");
                        var arg = arguments[1];
                        var ctx = arguments[2];
                        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
                    } else {
                        value = tryCatch(fn)();
                    }
                    var promiseCreated = ret._popContext();
                    debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
                    ret._resolveFromSyncValue(value);
                    return ret;
                };

                Promise.prototype._resolveFromSyncValue = function (value) {
                    if (value === util.errorObj) {
                        this._rejectCallback(value.e, false);
                    } else {
                        this._resolveCallback(value, true);
                    }
                };
            };
        }, { "./util": 36 }], 20: [function (_dereq_, module, exports) {
            "use strict";

            var util = _dereq_("./util");
            var maybeWrapAsError = util.maybeWrapAsError;
            var errors = _dereq_("./errors");
            var OperationalError = errors.OperationalError;
            var es5 = _dereq_("./es5");

            function isUntypedError(obj) {
                return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
            }

            var rErrorKey = /^(?:name|message|stack|cause)$/;
            function wrapAsOperationalError(obj) {
                var ret;
                if (isUntypedError(obj)) {
                    ret = new OperationalError(obj);
                    ret.name = obj.name;
                    ret.message = obj.message;
                    ret.stack = obj.stack;
                    var keys = es5.keys(obj);
                    for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];
                        if (!rErrorKey.test(key)) {
                            ret[key] = obj[key];
                        }
                    }
                    return ret;
                }
                util.markAsOriginatingFromRejection(obj);
                return obj;
            }

            function nodebackForPromise(promise, multiArgs) {
                return function (err, value) {
                    if (promise === null) return;
                    if (err) {
                        var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                        promise._attachExtraTrace(wrapped);
                        promise._reject(wrapped);
                    } else if (!multiArgs) {
                        promise._fulfill(value);
                    } else {
                        var args = [].slice.call(arguments, 1);;
                        promise._fulfill(args);
                    }
                    promise = null;
                };
            }

            module.exports = nodebackForPromise;
        }, { "./errors": 12, "./es5": 13, "./util": 36 }], 21: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise) {
                var util = _dereq_("./util");
                var async = Promise._async;
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;

                function spreadAdapter(val, nodeback) {
                    var promise = this;
                    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
                    var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
                    if (ret === errorObj) {
                        async.throwLater(ret.e);
                    }
                }

                function successAdapter(val, nodeback) {
                    var promise = this;
                    var receiver = promise._boundValue();
                    var ret = val === undefined ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
                    if (ret === errorObj) {
                        async.throwLater(ret.e);
                    }
                }
                function errorAdapter(reason, nodeback) {
                    var promise = this;
                    if (!reason) {
                        var newReason = new Error(reason + "");
                        newReason.cause = reason;
                        reason = newReason;
                    }
                    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
                    if (ret === errorObj) {
                        async.throwLater(ret.e);
                    }
                }

                Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback, options) {
                    if (typeof nodeback == "function") {
                        var adapter = successAdapter;
                        if (options !== undefined && Object(options).spread) {
                            adapter = spreadAdapter;
                        }
                        this._then(adapter, errorAdapter, undefined, this, nodeback);
                    }
                    return this;
                };
            };
        }, { "./util": 36 }], 22: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function () {
                var makeSelfResolutionError = function makeSelfResolutionError() {
                    return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
                };
                var reflectHandler = function reflectHandler() {
                    return new Promise.PromiseInspection(this._target());
                };
                var apiRejection = function apiRejection(msg) {
                    return Promise.reject(new TypeError(msg));
                };
                function Proxyable() {}
                var UNDEFINED_BINDING = {};
                var util = _dereq_("./util");

                var getDomain;
                if (util.isNode) {
                    getDomain = function getDomain() {
                        var ret = process.domain;
                        if (ret === undefined) ret = null;
                        return ret;
                    };
                } else {
                    getDomain = function getDomain() {
                        return null;
                    };
                }
                util.notEnumerableProp(Promise, "_getDomain", getDomain);

                var es5 = _dereq_("./es5");
                var Async = _dereq_("./async");
                var async = new Async();
                es5.defineProperty(Promise, "_async", { value: async });
                var errors = _dereq_("./errors");
                var TypeError = Promise.TypeError = errors.TypeError;
                Promise.RangeError = errors.RangeError;
                var CancellationError = Promise.CancellationError = errors.CancellationError;
                Promise.TimeoutError = errors.TimeoutError;
                Promise.OperationalError = errors.OperationalError;
                Promise.RejectionError = errors.OperationalError;
                Promise.AggregateError = errors.AggregateError;
                var INTERNAL = function INTERNAL() {};
                var APPLY = {};
                var NEXT_FILTER = {};
                var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
                var PromiseArray = _dereq_("./promise_array")(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                var Context = _dereq_("./context")(Promise);
                /*jshint unused:false*/
                var createContext = Context.create;
                var debug = _dereq_("./debuggability")(Promise, Context);
                var CapturedTrace = debug.CapturedTrace;
                var PassThroughHandlerContext = _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
                var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
                var nodebackForPromise = _dereq_("./nodeback");
                var errorObj = util.errorObj;
                var tryCatch = util.tryCatch;
                function check(self, executor) {
                    if (self == null || self.constructor !== Promise) {
                        throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    if (typeof executor !== "function") {
                        throw new TypeError("expecting a function but got " + util.classString(executor));
                    }
                }

                function Promise(executor) {
                    if (executor !== INTERNAL) {
                        check(this, executor);
                    }
                    this._bitField = 0;
                    this._fulfillmentHandler0 = undefined;
                    this._rejectionHandler0 = undefined;
                    this._promise0 = undefined;
                    this._receiver0 = undefined;
                    this._resolveFromExecutor(executor);
                    this._promiseCreated();
                    this._fireEvent("promiseCreated", this);
                }

                Promise.prototype.toString = function () {
                    return "[object Promise]";
                };

                Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
                    var len = arguments.length;
                    if (len > 1) {
                        var catchInstances = new Array(len - 1),
                            j = 0,
                            i;
                        for (i = 0; i < len - 1; ++i) {
                            var item = arguments[i];
                            if (util.isObject(item)) {
                                catchInstances[j++] = item;
                            } else {
                                return apiRejection("Catch statement predicate: " + "expecting an object but got " + util.classString(item));
                            }
                        }
                        catchInstances.length = j;
                        fn = arguments[i];
                        return this.then(undefined, catchFilter(catchInstances, fn, this));
                    }
                    return this.then(undefined, fn);
                };

                Promise.prototype.reflect = function () {
                    return this._then(reflectHandler, reflectHandler, undefined, this, undefined);
                };

                Promise.prototype.then = function (didFulfill, didReject) {
                    if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
                        var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
                        if (arguments.length > 1) {
                            msg += ", " + util.classString(didReject);
                        }
                        this._warn(msg);
                    }
                    return this._then(didFulfill, didReject, undefined, undefined, undefined);
                };

                Promise.prototype.done = function (didFulfill, didReject) {
                    var promise = this._then(didFulfill, didReject, undefined, undefined, undefined);
                    promise._setIsFinal();
                };

                Promise.prototype.spread = function (fn) {
                    if (typeof fn !== "function") {
                        return apiRejection("expecting a function but got " + util.classString(fn));
                    }
                    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
                };

                Promise.prototype.toJSON = function () {
                    var ret = {
                        isFulfilled: false,
                        isRejected: false,
                        fulfillmentValue: undefined,
                        rejectionReason: undefined
                    };
                    if (this.isFulfilled()) {
                        ret.fulfillmentValue = this.value();
                        ret.isFulfilled = true;
                    } else if (this.isRejected()) {
                        ret.rejectionReason = this.reason();
                        ret.isRejected = true;
                    }
                    return ret;
                };

                Promise.prototype.all = function () {
                    if (arguments.length > 0) {
                        this._warn(".all() was passed arguments but it does not take any");
                    }
                    return new PromiseArray(this).promise();
                };

                Promise.prototype.error = function (fn) {
                    return this.caught(util.originatesFromRejection, fn);
                };

                Promise.getNewLibraryCopy = module.exports;

                Promise.is = function (val) {
                    return val instanceof Promise;
                };

                Promise.fromNode = Promise.fromCallback = function (fn) {
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
                    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                    if (result === errorObj) {
                        ret._rejectCallback(result.e, true);
                    }
                    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
                    return ret;
                };

                Promise.all = function (promises) {
                    return new PromiseArray(promises).promise();
                };

                Promise.cast = function (obj) {
                    var ret = tryConvertToPromise(obj);
                    if (!(ret instanceof Promise)) {
                        ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._setFulfilled();
                        ret._rejectionHandler0 = obj;
                    }
                    return ret;
                };

                Promise.resolve = Promise.fulfilled = Promise.cast;

                Promise.reject = Promise.rejected = function (reason) {
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    ret._rejectCallback(reason, true);
                    return ret;
                };

                Promise.setScheduler = function (fn) {
                    if (typeof fn !== "function") {
                        throw new TypeError("expecting a function but got " + util.classString(fn));
                    }
                    return async.setScheduler(fn);
                };

                Promise.prototype._then = function (didFulfill, didReject, _, receiver, internalData) {
                    var haveInternalData = internalData !== undefined;
                    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                    var target = this._target();
                    var bitField = target._bitField;

                    if (!haveInternalData) {
                        promise._propagateFrom(this, 3);
                        promise._captureStackTrace();
                        if (receiver === undefined && (this._bitField & 2097152) !== 0) {
                            if (!((bitField & 50397184) === 0)) {
                                receiver = this._boundValue();
                            } else {
                                receiver = target === this ? undefined : this._boundTo;
                            }
                        }
                        this._fireEvent("promiseChained", this, promise);
                    }

                    var domain = getDomain();
                    if (!((bitField & 50397184) === 0)) {
                        var handler,
                            value,
                            settler = target._settlePromiseCtx;
                        if ((bitField & 33554432) !== 0) {
                            value = target._rejectionHandler0;
                            handler = didFulfill;
                        } else if ((bitField & 16777216) !== 0) {
                            value = target._fulfillmentHandler0;
                            handler = didReject;
                            target._unsetRejectionIsUnhandled();
                        } else {
                            settler = target._settlePromiseLateCancellationObserver;
                            value = new CancellationError("late cancellation observer");
                            target._attachExtraTrace(value);
                            handler = didReject;
                        }

                        async.invoke(settler, target, {
                            handler: domain === null ? handler : typeof handler === "function" && util.domainBind(domain, handler),
                            promise: promise,
                            receiver: receiver,
                            value: value
                        });
                    } else {
                        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                    }

                    return promise;
                };

                Promise.prototype._length = function () {
                    return this._bitField & 65535;
                };

                Promise.prototype._isFateSealed = function () {
                    return (this._bitField & 117506048) !== 0;
                };

                Promise.prototype._isFollowing = function () {
                    return (this._bitField & 67108864) === 67108864;
                };

                Promise.prototype._setLength = function (len) {
                    this._bitField = this._bitField & -65536 | len & 65535;
                };

                Promise.prototype._setFulfilled = function () {
                    this._bitField = this._bitField | 33554432;
                    this._fireEvent("promiseFulfilled", this);
                };

                Promise.prototype._setRejected = function () {
                    this._bitField = this._bitField | 16777216;
                    this._fireEvent("promiseRejected", this);
                };

                Promise.prototype._setFollowing = function () {
                    this._bitField = this._bitField | 67108864;
                    this._fireEvent("promiseResolved", this);
                };

                Promise.prototype._setIsFinal = function () {
                    this._bitField = this._bitField | 4194304;
                };

                Promise.prototype._isFinal = function () {
                    return (this._bitField & 4194304) > 0;
                };

                Promise.prototype._unsetCancelled = function () {
                    this._bitField = this._bitField & ~65536;
                };

                Promise.prototype._setCancelled = function () {
                    this._bitField = this._bitField | 65536;
                    this._fireEvent("promiseCancelled", this);
                };

                Promise.prototype._setWillBeCancelled = function () {
                    this._bitField = this._bitField | 8388608;
                };

                Promise.prototype._setAsyncGuaranteed = function () {
                    if (async.hasCustomScheduler()) return;
                    this._bitField = this._bitField | 134217728;
                };

                Promise.prototype._receiverAt = function (index) {
                    var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
                    if (ret === UNDEFINED_BINDING) {
                        return undefined;
                    } else if (ret === undefined && this._isBound()) {
                        return this._boundValue();
                    }
                    return ret;
                };

                Promise.prototype._promiseAt = function (index) {
                    return this[index * 4 - 4 + 2];
                };

                Promise.prototype._fulfillmentHandlerAt = function (index) {
                    return this[index * 4 - 4 + 0];
                };

                Promise.prototype._rejectionHandlerAt = function (index) {
                    return this[index * 4 - 4 + 1];
                };

                Promise.prototype._boundValue = function () {};

                Promise.prototype._migrateCallback0 = function (follower) {
                    var bitField = follower._bitField;
                    var fulfill = follower._fulfillmentHandler0;
                    var reject = follower._rejectionHandler0;
                    var promise = follower._promise0;
                    var receiver = follower._receiverAt(0);
                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                };

                Promise.prototype._migrateCallbackAt = function (follower, index) {
                    var fulfill = follower._fulfillmentHandlerAt(index);
                    var reject = follower._rejectionHandlerAt(index);
                    var promise = follower._promiseAt(index);
                    var receiver = follower._receiverAt(index);
                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                };

                Promise.prototype._addCallbacks = function (fulfill, reject, promise, receiver, domain) {
                    var index = this._length();

                    if (index >= 65535 - 4) {
                        index = 0;
                        this._setLength(0);
                    }

                    if (index === 0) {
                        this._promise0 = promise;
                        this._receiver0 = receiver;
                        if (typeof fulfill === "function") {
                            this._fulfillmentHandler0 = domain === null ? fulfill : util.domainBind(domain, fulfill);
                        }
                        if (typeof reject === "function") {
                            this._rejectionHandler0 = domain === null ? reject : util.domainBind(domain, reject);
                        }
                    } else {
                        var base = index * 4 - 4;
                        this[base + 2] = promise;
                        this[base + 3] = receiver;
                        if (typeof fulfill === "function") {
                            this[base + 0] = domain === null ? fulfill : util.domainBind(domain, fulfill);
                        }
                        if (typeof reject === "function") {
                            this[base + 1] = domain === null ? reject : util.domainBind(domain, reject);
                        }
                    }
                    this._setLength(index + 1);
                    return index;
                };

                Promise.prototype._proxy = function (proxyable, arg) {
                    this._addCallbacks(undefined, undefined, arg, proxyable, null);
                };

                Promise.prototype._resolveCallback = function (value, shouldBind) {
                    if ((this._bitField & 117506048) !== 0) return;
                    if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
                    var maybePromise = tryConvertToPromise(value, this);
                    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

                    if (shouldBind) this._propagateFrom(maybePromise, 2);

                    var promise = maybePromise._target();

                    if (promise === this) {
                        this._reject(makeSelfResolutionError());
                        return;
                    }

                    var bitField = promise._bitField;
                    if ((bitField & 50397184) === 0) {
                        var len = this._length();
                        if (len > 0) promise._migrateCallback0(this);
                        for (var i = 1; i < len; ++i) {
                            promise._migrateCallbackAt(this, i);
                        }
                        this._setFollowing();
                        this._setLength(0);
                        this._setFollowee(promise);
                    } else if ((bitField & 33554432) !== 0) {
                        this._fulfill(promise._value());
                    } else if ((bitField & 16777216) !== 0) {
                        this._reject(promise._reason());
                    } else {
                        var reason = new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        this._reject(reason);
                    }
                };

                Promise.prototype._rejectCallback = function (reason, synchronous, ignoreNonErrorWarnings) {
                    var trace = util.ensureErrorObject(reason);
                    var hasStack = trace === reason;
                    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                        var message = "a promise was rejected with a non-error: " + util.classString(reason);
                        this._warn(message, true);
                    }
                    this._attachExtraTrace(trace, synchronous ? hasStack : false);
                    this._reject(reason);
                };

                Promise.prototype._resolveFromExecutor = function (executor) {
                    if (executor === INTERNAL) return;
                    var promise = this;
                    this._captureStackTrace();
                    this._pushContext();
                    var synchronous = true;
                    var r = this._execute(executor, function (value) {
                        promise._resolveCallback(value);
                    }, function (reason) {
                        promise._rejectCallback(reason, synchronous);
                    });
                    synchronous = false;
                    this._popContext();

                    if (r !== undefined) {
                        promise._rejectCallback(r, true);
                    }
                };

                Promise.prototype._settlePromiseFromHandler = function (handler, receiver, value, promise) {
                    var bitField = promise._bitField;
                    if ((bitField & 65536) !== 0) return;
                    promise._pushContext();
                    var x;
                    if (receiver === APPLY) {
                        if (!value || typeof value.length !== "number") {
                            x = errorObj;
                            x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
                        } else {
                            x = tryCatch(handler).apply(this._boundValue(), value);
                        }
                    } else {
                        x = tryCatch(handler).call(receiver, value);
                    }
                    var promiseCreated = promise._popContext();
                    bitField = promise._bitField;
                    if ((bitField & 65536) !== 0) return;

                    if (x === NEXT_FILTER) {
                        promise._reject(value);
                    } else if (x === errorObj) {
                        promise._rejectCallback(x.e, false);
                    } else {
                        debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
                        promise._resolveCallback(x);
                    }
                };

                Promise.prototype._target = function () {
                    var ret = this;
                    while (ret._isFollowing()) {
                        ret = ret._followee();
                    }return ret;
                };

                Promise.prototype._followee = function () {
                    return this._rejectionHandler0;
                };

                Promise.prototype._setFollowee = function (promise) {
                    this._rejectionHandler0 = promise;
                };

                Promise.prototype._settlePromise = function (promise, handler, receiver, value) {
                    var isPromise = promise instanceof Promise;
                    var bitField = this._bitField;
                    var asyncGuaranteed = (bitField & 134217728) !== 0;
                    if ((bitField & 65536) !== 0) {
                        if (isPromise) promise._invokeInternalOnCancel();

                        if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
                            receiver.cancelPromise = promise;
                            if (tryCatch(handler).call(receiver, value) === errorObj) {
                                promise._reject(errorObj.e);
                            }
                        } else if (handler === reflectHandler) {
                            promise._fulfill(reflectHandler.call(receiver));
                        } else if (receiver instanceof Proxyable) {
                            receiver._promiseCancelled(promise);
                        } else if (isPromise || promise instanceof PromiseArray) {
                            promise._cancel();
                        } else {
                            receiver.cancel();
                        }
                    } else if (typeof handler === "function") {
                        if (!isPromise) {
                            handler.call(receiver, value, promise);
                        } else {
                            if (asyncGuaranteed) promise._setAsyncGuaranteed();
                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                        }
                    } else if (receiver instanceof Proxyable) {
                        if (!receiver._isResolved()) {
                            if ((bitField & 33554432) !== 0) {
                                receiver._promiseFulfilled(value, promise);
                            } else {
                                receiver._promiseRejected(value, promise);
                            }
                        }
                    } else if (isPromise) {
                        if (asyncGuaranteed) promise._setAsyncGuaranteed();
                        if ((bitField & 33554432) !== 0) {
                            promise._fulfill(value);
                        } else {
                            promise._reject(value);
                        }
                    }
                };

                Promise.prototype._settlePromiseLateCancellationObserver = function (ctx) {
                    var handler = ctx.handler;
                    var promise = ctx.promise;
                    var receiver = ctx.receiver;
                    var value = ctx.value;
                    if (typeof handler === "function") {
                        if (!(promise instanceof Promise)) {
                            handler.call(receiver, value, promise);
                        } else {
                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                        }
                    } else if (promise instanceof Promise) {
                        promise._reject(value);
                    }
                };

                Promise.prototype._settlePromiseCtx = function (ctx) {
                    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                };

                Promise.prototype._settlePromise0 = function (handler, value, bitField) {
                    var promise = this._promise0;
                    var receiver = this._receiverAt(0);
                    this._promise0 = undefined;
                    this._receiver0 = undefined;
                    this._settlePromise(promise, handler, receiver, value);
                };

                Promise.prototype._clearCallbackDataAtIndex = function (index) {
                    var base = index * 4 - 4;
                    this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = undefined;
                };

                Promise.prototype._fulfill = function (value) {
                    var bitField = this._bitField;
                    if ((bitField & 117506048) >>> 16) return;
                    if (value === this) {
                        var err = makeSelfResolutionError();
                        this._attachExtraTrace(err);
                        return this._reject(err);
                    }
                    this._setFulfilled();
                    this._rejectionHandler0 = value;

                    if ((bitField & 65535) > 0) {
                        if ((bitField & 134217728) !== 0) {
                            this._settlePromises();
                        } else {
                            async.settlePromises(this);
                        }
                    }
                };

                Promise.prototype._reject = function (reason) {
                    var bitField = this._bitField;
                    if ((bitField & 117506048) >>> 16) return;
                    this._setRejected();
                    this._fulfillmentHandler0 = reason;

                    if (this._isFinal()) {
                        return async.fatalError(reason, util.isNode);
                    }

                    if ((bitField & 65535) > 0) {
                        async.settlePromises(this);
                    } else {
                        this._ensurePossibleRejectionHandled();
                    }
                };

                Promise.prototype._fulfillPromises = function (len, value) {
                    for (var i = 1; i < len; i++) {
                        var handler = this._fulfillmentHandlerAt(i);
                        var promise = this._promiseAt(i);
                        var receiver = this._receiverAt(i);
                        this._clearCallbackDataAtIndex(i);
                        this._settlePromise(promise, handler, receiver, value);
                    }
                };

                Promise.prototype._rejectPromises = function (len, reason) {
                    for (var i = 1; i < len; i++) {
                        var handler = this._rejectionHandlerAt(i);
                        var promise = this._promiseAt(i);
                        var receiver = this._receiverAt(i);
                        this._clearCallbackDataAtIndex(i);
                        this._settlePromise(promise, handler, receiver, reason);
                    }
                };

                Promise.prototype._settlePromises = function () {
                    var bitField = this._bitField;
                    var len = bitField & 65535;

                    if (len > 0) {
                        if ((bitField & 16842752) !== 0) {
                            var reason = this._fulfillmentHandler0;
                            this._settlePromise0(this._rejectionHandler0, reason, bitField);
                            this._rejectPromises(len, reason);
                        } else {
                            var value = this._rejectionHandler0;
                            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                            this._fulfillPromises(len, value);
                        }
                        this._setLength(0);
                    }
                    this._clearCancellationData();
                };

                Promise.prototype._settledValue = function () {
                    var bitField = this._bitField;
                    if ((bitField & 33554432) !== 0) {
                        return this._rejectionHandler0;
                    } else if ((bitField & 16777216) !== 0) {
                        return this._fulfillmentHandler0;
                    }
                };

                function deferResolve(v) {
                    this.promise._resolveCallback(v);
                }
                function deferReject(v) {
                    this.promise._rejectCallback(v, false);
                }

                Promise.defer = Promise.pending = function () {
                    debug.deprecated("Promise.defer", "new Promise");
                    var promise = new Promise(INTERNAL);
                    return {
                        promise: promise,
                        resolve: deferResolve,
                        reject: deferReject
                    };
                };

                util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);

                _dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
                _dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
                _dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
                _dereq_("./direct_resolve")(Promise);
                _dereq_("./synchronous_inspection")(Promise);
                _dereq_("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
                Promise.Promise = Promise;
                Promise.version = "3.5.1";
                _dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
                _dereq_('./call_get.js')(Promise);
                _dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
                _dereq_('./timers.js')(Promise, INTERNAL, debug);
                _dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
                _dereq_('./nodeify.js')(Promise);
                _dereq_('./promisify.js')(Promise, INTERNAL);
                _dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
                _dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
                _dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
                _dereq_('./settle.js')(Promise, PromiseArray, debug);
                _dereq_('./some.js')(Promise, PromiseArray, apiRejection);
                _dereq_('./filter.js')(Promise, INTERNAL);
                _dereq_('./each.js')(Promise, INTERNAL);
                _dereq_('./any.js')(Promise);

                util.toFastProperties(Promise);
                util.toFastProperties(Promise.prototype);
                function fillTypes(value) {
                    var p = new Promise(INTERNAL);
                    p._fulfillmentHandler0 = value;
                    p._rejectionHandler0 = value;
                    p._promise0 = value;
                    p._receiver0 = value;
                }
                // Complete slack tracking, opt out of field-type tracking and           
                // stabilize map                                                         
                fillTypes({ a: 1 });
                fillTypes({ b: 2 });
                fillTypes({ c: 3 });
                fillTypes(1);
                fillTypes(function () {});
                fillTypes(undefined);
                fillTypes(false);
                fillTypes(new Promise(INTERNAL));
                debug.setBounds(Async.firstLineError, util.lastLineError);
                return Promise;
            };
        }, { "./any.js": 1, "./async": 2, "./bind": 3, "./call_get.js": 5, "./cancel": 6, "./catch_filter": 7, "./context": 8, "./debuggability": 9, "./direct_resolve": 10, "./each.js": 11, "./errors": 12, "./es5": 13, "./filter.js": 14, "./finally": 15, "./generators.js": 16, "./join": 17, "./map.js": 18, "./method": 19, "./nodeback": 20, "./nodeify.js": 21, "./promise_array": 23, "./promisify.js": 24, "./props.js": 25, "./race.js": 27, "./reduce.js": 28, "./settle.js": 30, "./some.js": 31, "./synchronous_inspection": 32, "./thenables": 33, "./timers.js": 34, "./using.js": 35, "./util": 36 }], 23: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                var util = _dereq_("./util");
                var isArray = util.isArray;

                function toResolutionValue(val) {
                    switch (val) {
                        case -2:
                            return [];
                        case -3:
                            return {};
                        case -6:
                            return new Map();
                    }
                }

                function PromiseArray(values) {
                    var promise = this._promise = new Promise(INTERNAL);
                    if (values instanceof Promise) {
                        promise._propagateFrom(values, 3);
                    }
                    promise._setOnCancel(this);
                    this._values = values;
                    this._length = 0;
                    this._totalResolved = 0;
                    this._init(undefined, -2);
                }
                util.inherits(PromiseArray, Proxyable);

                PromiseArray.prototype.length = function () {
                    return this._length;
                };

                PromiseArray.prototype.promise = function () {
                    return this._promise;
                };

                PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                    var values = tryConvertToPromise(this._values, this._promise);
                    if (values instanceof Promise) {
                        values = values._target();
                        var bitField = values._bitField;
                        ;
                        this._values = values;

                        if ((bitField & 50397184) === 0) {
                            this._promise._setAsyncGuaranteed();
                            return values._then(init, this._reject, undefined, this, resolveValueIfEmpty);
                        } else if ((bitField & 33554432) !== 0) {
                            values = values._value();
                        } else if ((bitField & 16777216) !== 0) {
                            return this._reject(values._reason());
                        } else {
                            return this._cancel();
                        }
                    }
                    values = util.asArray(values);
                    if (values === null) {
                        var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
                        this._promise._rejectCallback(err, false);
                        return;
                    }

                    if (values.length === 0) {
                        if (resolveValueIfEmpty === -5) {
                            this._resolveEmptyArray();
                        } else {
                            this._resolve(toResolutionValue(resolveValueIfEmpty));
                        }
                        return;
                    }
                    this._iterate(values);
                };

                PromiseArray.prototype._iterate = function (values) {
                    var len = this.getActualLength(values.length);
                    this._length = len;
                    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                    var result = this._promise;
                    var isResolved = false;
                    var bitField = null;
                    for (var i = 0; i < len; ++i) {
                        var maybePromise = tryConvertToPromise(values[i], result);

                        if (maybePromise instanceof Promise) {
                            maybePromise = maybePromise._target();
                            bitField = maybePromise._bitField;
                        } else {
                            bitField = null;
                        }

                        if (isResolved) {
                            if (bitField !== null) {
                                maybePromise.suppressUnhandledRejections();
                            }
                        } else if (bitField !== null) {
                            if ((bitField & 50397184) === 0) {
                                maybePromise._proxy(this, i);
                                this._values[i] = maybePromise;
                            } else if ((bitField & 33554432) !== 0) {
                                isResolved = this._promiseFulfilled(maybePromise._value(), i);
                            } else if ((bitField & 16777216) !== 0) {
                                isResolved = this._promiseRejected(maybePromise._reason(), i);
                            } else {
                                isResolved = this._promiseCancelled(i);
                            }
                        } else {
                            isResolved = this._promiseFulfilled(maybePromise, i);
                        }
                    }
                    if (!isResolved) result._setAsyncGuaranteed();
                };

                PromiseArray.prototype._isResolved = function () {
                    return this._values === null;
                };

                PromiseArray.prototype._resolve = function (value) {
                    this._values = null;
                    this._promise._fulfill(value);
                };

                PromiseArray.prototype._cancel = function () {
                    if (this._isResolved() || !this._promise._isCancellable()) return;
                    this._values = null;
                    this._promise._cancel();
                };

                PromiseArray.prototype._reject = function (reason) {
                    this._values = null;
                    this._promise._rejectCallback(reason, false);
                };

                PromiseArray.prototype._promiseFulfilled = function (value, index) {
                    this._values[index] = value;
                    var totalResolved = ++this._totalResolved;
                    if (totalResolved >= this._length) {
                        this._resolve(this._values);
                        return true;
                    }
                    return false;
                };

                PromiseArray.prototype._promiseCancelled = function () {
                    this._cancel();
                    return true;
                };

                PromiseArray.prototype._promiseRejected = function (reason) {
                    this._totalResolved++;
                    this._reject(reason);
                    return true;
                };

                PromiseArray.prototype._resultCancelled = function () {
                    if (this._isResolved()) return;
                    var values = this._values;
                    this._cancel();
                    if (values instanceof Promise) {
                        values.cancel();
                    } else {
                        for (var i = 0; i < values.length; ++i) {
                            if (values[i] instanceof Promise) {
                                values[i].cancel();
                            }
                        }
                    }
                };

                PromiseArray.prototype.shouldCopyValues = function () {
                    return true;
                };

                PromiseArray.prototype.getActualLength = function (len) {
                    return len;
                };

                return PromiseArray;
            };
        }, { "./util": 36 }], 24: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL) {
                var THIS = {};
                var util = _dereq_("./util");
                var nodebackForPromise = _dereq_("./nodeback");
                var withAppended = util.withAppended;
                var maybeWrapAsError = util.maybeWrapAsError;
                var canEvaluate = util.canEvaluate;
                var TypeError = _dereq_("./errors").TypeError;
                var defaultSuffix = "Async";
                var defaultPromisified = { __isPromisified__: true };
                var noCopyProps = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"];
                var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

                var defaultFilter = function defaultFilter(name) {
                    return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
                };

                function propsFilter(key) {
                    return !noCopyPropsPattern.test(key);
                }

                function isPromisified(fn) {
                    try {
                        return fn.__isPromisified__ === true;
                    } catch (e) {
                        return false;
                    }
                }

                function hasPromisified(obj, key, suffix) {
                    var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
                    return val ? isPromisified(val) : false;
                }
                function checkValid(ret, suffix, suffixRegexp) {
                    for (var i = 0; i < ret.length; i += 2) {
                        var key = ret[i];
                        if (suffixRegexp.test(key)) {
                            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
                            for (var j = 0; j < ret.length; j += 2) {
                                if (ret[j] === keyWithoutAsyncSuffix) {
                                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
                                }
                            }
                        }
                    }
                }

                function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
                    var keys = util.inheritedDataKeys(obj);
                    var ret = [];
                    for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];
                        var value = obj[key];
                        var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj);
                        if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter(key, value, obj, passesDefaultFilter)) {
                            ret.push(key, value);
                        }
                    }
                    checkValid(ret, suffix, suffixRegexp);
                    return ret;
                }

                var escapeIdentRegex = function escapeIdentRegex(str) {
                    return str.replace(/([$])/, "\\$");
                };

                var makeNodePromisifiedEval;
                if (false) {
                    var switchCaseArgumentOrder = function switchCaseArgumentOrder(likelyArgumentCount) {
                        var ret = [likelyArgumentCount];
                        var min = Math.max(0, likelyArgumentCount - 1 - 3);
                        for (var i = likelyArgumentCount - 1; i >= min; --i) {
                            ret.push(i);
                        }
                        for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
                            ret.push(i);
                        }
                        return ret;
                    };

                    var argumentSequence = function argumentSequence(argumentCount) {
                        return util.filledRange(argumentCount, "_arg", "");
                    };

                    var parameterDeclaration = function parameterDeclaration(parameterCount) {
                        return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
                    };

                    var parameterCount = function parameterCount(fn) {
                        if (typeof fn.length === "number") {
                            return Math.max(Math.min(fn.length, 1023 + 1), 0);
                        }
                        return 0;
                    };

                    makeNodePromisifiedEval = function makeNodePromisifiedEval(callback, receiver, originalName, fn, _, multiArgs) {
                        var newParameterCount = Math.max(0, parameterCount(fn) - 1);
                        var argumentOrder = switchCaseArgumentOrder(newParameterCount);
                        var shouldProxyThis = typeof callback === "string" || receiver === THIS;

                        function generateCallForArgumentCount(count) {
                            var args = argumentSequence(count).join(", ");
                            var comma = count > 0 ? ", " : "";
                            var ret;
                            if (shouldProxyThis) {
                                ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
                            } else {
                                ret = receiver === undefined ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
                            }
                            return ret.replace("{{args}}", args).replace(", ", comma);
                        }

                        function generateArgumentSwitchCase() {
                            var ret = "";
                            for (var i = 0; i < argumentOrder.length; ++i) {
                                ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
                            }

                            ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
                            return ret;
                        }

                        var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
                        var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
                        body = body.replace("Parameters", parameterDeclaration(newParameterCount));
                        return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise, fn, receiver, withAppended, maybeWrapAsError, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
                    };
                }

                function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
                    var defaultThis = function () {
                        return this;
                    }();
                    var method = callback;
                    if (typeof method === "string") {
                        callback = fn;
                    }
                    function promisified() {
                        var _receiver = receiver;
                        if (receiver === THIS) _receiver = this;
                        var promise = new Promise(INTERNAL);
                        promise._captureStackTrace();
                        var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
                        var fn = nodebackForPromise(promise, multiArgs);
                        try {
                            cb.apply(_receiver, withAppended(arguments, fn));
                        } catch (e) {
                            promise._rejectCallback(maybeWrapAsError(e), true, true);
                        }
                        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
                        return promise;
                    }
                    util.notEnumerableProp(promisified, "__isPromisified__", true);
                    return promisified;
                }

                var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;

                function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
                    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
                    var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);

                    for (var i = 0, len = methods.length; i < len; i += 2) {
                        var key = methods[i];
                        var fn = methods[i + 1];
                        var promisifiedKey = key + suffix;
                        if (promisifier === makeNodePromisified) {
                            obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                        } else {
                            var promisified = promisifier(fn, function () {
                                return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                            });
                            util.notEnumerableProp(promisified, "__isPromisified__", true);
                            obj[promisifiedKey] = promisified;
                        }
                    }
                    util.toFastProperties(obj);
                    return obj;
                }

                function promisify(callback, receiver, multiArgs) {
                    return makeNodePromisified(callback, receiver, undefined, callback, null, multiArgs);
                }

                Promise.promisify = function (fn, options) {
                    if (typeof fn !== "function") {
                        throw new TypeError("expecting a function but got " + util.classString(fn));
                    }
                    if (isPromisified(fn)) {
                        return fn;
                    }
                    options = Object(options);
                    var receiver = options.context === undefined ? THIS : options.context;
                    var multiArgs = !!options.multiArgs;
                    var ret = promisify(fn, receiver, multiArgs);
                    util.copyDescriptors(fn, ret, propsFilter);
                    return ret;
                };

                Promise.promisifyAll = function (target, options) {
                    if (typeof target !== "function" && (typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object") {
                        throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    options = Object(options);
                    var multiArgs = !!options.multiArgs;
                    var suffix = options.suffix;
                    if (typeof suffix !== "string") suffix = defaultSuffix;
                    var filter = options.filter;
                    if (typeof filter !== "function") filter = defaultFilter;
                    var promisifier = options.promisifier;
                    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

                    if (!util.isIdentifier(suffix)) {
                        throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
                    }

                    var keys = util.inheritedDataKeys(target);
                    for (var i = 0; i < keys.length; ++i) {
                        var value = target[keys[i]];
                        if (keys[i] !== "constructor" && util.isClass(value)) {
                            promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
                            promisifyAll(value, suffix, filter, promisifier, multiArgs);
                        }
                    }

                    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
                };
            };
        }, { "./errors": 12, "./nodeback": 20, "./util": 36 }], 25: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, tryConvertToPromise, apiRejection) {
                var util = _dereq_("./util");
                var isObject = util.isObject;
                var es5 = _dereq_("./es5");
                var Es6Map;
                if (typeof Map === "function") Es6Map = Map;

                var mapToEntries = function () {
                    var index = 0;
                    var size = 0;

                    function extractEntry(value, key) {
                        this[index] = value;
                        this[index + size] = key;
                        index++;
                    }

                    return function mapToEntries(map) {
                        size = map.size;
                        index = 0;
                        var ret = new Array(map.size * 2);
                        map.forEach(extractEntry, ret);
                        return ret;
                    };
                }();

                var entriesToMap = function entriesToMap(entries) {
                    var ret = new Es6Map();
                    var length = entries.length / 2 | 0;
                    for (var i = 0; i < length; ++i) {
                        var key = entries[length + i];
                        var value = entries[i];
                        ret.set(key, value);
                    }
                    return ret;
                };

                function PropertiesPromiseArray(obj) {
                    var isMap = false;
                    var entries;
                    if (Es6Map !== undefined && obj instanceof Es6Map) {
                        entries = mapToEntries(obj);
                        isMap = true;
                    } else {
                        var keys = es5.keys(obj);
                        var len = keys.length;
                        entries = new Array(len * 2);
                        for (var i = 0; i < len; ++i) {
                            var key = keys[i];
                            entries[i] = obj[key];
                            entries[i + len] = key;
                        }
                    }
                    this.constructor$(entries);
                    this._isMap = isMap;
                    this._init$(undefined, isMap ? -6 : -3);
                }
                util.inherits(PropertiesPromiseArray, PromiseArray);

                PropertiesPromiseArray.prototype._init = function () {};

                PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
                    this._values[index] = value;
                    var totalResolved = ++this._totalResolved;
                    if (totalResolved >= this._length) {
                        var val;
                        if (this._isMap) {
                            val = entriesToMap(this._values);
                        } else {
                            val = {};
                            var keyOffset = this.length();
                            for (var i = 0, len = this.length(); i < len; ++i) {
                                val[this._values[i + keyOffset]] = this._values[i];
                            }
                        }
                        this._resolve(val);
                        return true;
                    }
                    return false;
                };

                PropertiesPromiseArray.prototype.shouldCopyValues = function () {
                    return false;
                };

                PropertiesPromiseArray.prototype.getActualLength = function (len) {
                    return len >> 1;
                };

                function props(promises) {
                    var ret;
                    var castValue = tryConvertToPromise(promises);

                    if (!isObject(castValue)) {
                        return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
                    } else if (castValue instanceof Promise) {
                        ret = castValue._then(Promise.props, undefined, undefined, undefined, undefined);
                    } else {
                        ret = new PropertiesPromiseArray(castValue).promise();
                    }

                    if (castValue instanceof Promise) {
                        ret._propagateFrom(castValue, 2);
                    }
                    return ret;
                }

                Promise.prototype.props = function () {
                    return props(this);
                };

                Promise.props = function (promises) {
                    return props(promises);
                };
            };
        }, { "./es5": 13, "./util": 36 }], 26: [function (_dereq_, module, exports) {
            "use strict";

            function arrayMove(src, srcIndex, dst, dstIndex, len) {
                for (var j = 0; j < len; ++j) {
                    dst[j + dstIndex] = src[j + srcIndex];
                    src[j + srcIndex] = void 0;
                }
            }

            function Queue(capacity) {
                this._capacity = capacity;
                this._length = 0;
                this._front = 0;
            }

            Queue.prototype._willBeOverCapacity = function (size) {
                return this._capacity < size;
            };

            Queue.prototype._pushOne = function (arg) {
                var length = this.length();
                this._checkCapacity(length + 1);
                var i = this._front + length & this._capacity - 1;
                this[i] = arg;
                this._length = length + 1;
            };

            Queue.prototype.push = function (fn, receiver, arg) {
                var length = this.length() + 3;
                if (this._willBeOverCapacity(length)) {
                    this._pushOne(fn);
                    this._pushOne(receiver);
                    this._pushOne(arg);
                    return;
                }
                var j = this._front + length - 3;
                this._checkCapacity(length);
                var wrapMask = this._capacity - 1;
                this[j + 0 & wrapMask] = fn;
                this[j + 1 & wrapMask] = receiver;
                this[j + 2 & wrapMask] = arg;
                this._length = length;
            };

            Queue.prototype.shift = function () {
                var front = this._front,
                    ret = this[front];

                this[front] = undefined;
                this._front = front + 1 & this._capacity - 1;
                this._length--;
                return ret;
            };

            Queue.prototype.length = function () {
                return this._length;
            };

            Queue.prototype._checkCapacity = function (size) {
                if (this._capacity < size) {
                    this._resizeTo(this._capacity << 1);
                }
            };

            Queue.prototype._resizeTo = function (capacity) {
                var oldCapacity = this._capacity;
                this._capacity = capacity;
                var front = this._front;
                var length = this._length;
                var moveItemsCount = front + length & oldCapacity - 1;
                arrayMove(this, 0, this, oldCapacity, moveItemsCount);
            };

            module.exports = Queue;
        }, {}], 27: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                var util = _dereq_("./util");

                var raceLater = function raceLater(promise) {
                    return promise.then(function (array) {
                        return race(array, promise);
                    });
                };

                function race(promises, parent) {
                    var maybePromise = tryConvertToPromise(promises);

                    if (maybePromise instanceof Promise) {
                        return raceLater(maybePromise);
                    } else {
                        promises = util.asArray(promises);
                        if (promises === null) return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
                    }

                    var ret = new Promise(INTERNAL);
                    if (parent !== undefined) {
                        ret._propagateFrom(parent, 3);
                    }
                    var fulfill = ret._fulfill;
                    var reject = ret._reject;
                    for (var i = 0, len = promises.length; i < len; ++i) {
                        var val = promises[i];

                        if (val === undefined && !(i in promises)) {
                            continue;
                        }

                        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
                    }
                    return ret;
                }

                Promise.race = function (promises) {
                    return race(promises, undefined);
                };

                Promise.prototype.race = function () {
                    return race(this, undefined);
                };
            };
        }, { "./util": 36 }], 28: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                var getDomain = Promise._getDomain;
                var util = _dereq_("./util");
                var tryCatch = util.tryCatch;

                function ReductionPromiseArray(promises, fn, initialValue, _each) {
                    this.constructor$(promises);
                    var domain = getDomain();
                    this._fn = domain === null ? fn : util.domainBind(domain, fn);
                    if (initialValue !== undefined) {
                        initialValue = Promise.resolve(initialValue);
                        initialValue._attachCancellationCallback(this);
                    }
                    this._initialValue = initialValue;
                    this._currentCancellable = null;
                    if (_each === INTERNAL) {
                        this._eachValues = Array(this._length);
                    } else if (_each === 0) {
                        this._eachValues = null;
                    } else {
                        this._eachValues = undefined;
                    }
                    this._promise._captureStackTrace();
                    this._init$(undefined, -5);
                }
                util.inherits(ReductionPromiseArray, PromiseArray);

                ReductionPromiseArray.prototype._gotAccum = function (accum) {
                    if (this._eachValues !== undefined && this._eachValues !== null && accum !== INTERNAL) {
                        this._eachValues.push(accum);
                    }
                };

                ReductionPromiseArray.prototype._eachComplete = function (value) {
                    if (this._eachValues !== null) {
                        this._eachValues.push(value);
                    }
                    return this._eachValues;
                };

                ReductionPromiseArray.prototype._init = function () {};

                ReductionPromiseArray.prototype._resolveEmptyArray = function () {
                    this._resolve(this._eachValues !== undefined ? this._eachValues : this._initialValue);
                };

                ReductionPromiseArray.prototype.shouldCopyValues = function () {
                    return false;
                };

                ReductionPromiseArray.prototype._resolve = function (value) {
                    this._promise._resolveCallback(value);
                    this._values = null;
                };

                ReductionPromiseArray.prototype._resultCancelled = function (sender) {
                    if (sender === this._initialValue) return this._cancel();
                    if (this._isResolved()) return;
                    this._resultCancelled$();
                    if (this._currentCancellable instanceof Promise) {
                        this._currentCancellable.cancel();
                    }
                    if (this._initialValue instanceof Promise) {
                        this._initialValue.cancel();
                    }
                };

                ReductionPromiseArray.prototype._iterate = function (values) {
                    this._values = values;
                    var value;
                    var i;
                    var length = values.length;
                    if (this._initialValue !== undefined) {
                        value = this._initialValue;
                        i = 0;
                    } else {
                        value = Promise.resolve(values[0]);
                        i = 1;
                    }

                    this._currentCancellable = value;

                    if (!value.isRejected()) {
                        for (; i < length; ++i) {
                            var ctx = {
                                accum: null,
                                value: values[i],
                                index: i,
                                length: length,
                                array: this
                            };
                            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
                        }
                    }

                    if (this._eachValues !== undefined) {
                        value = value._then(this._eachComplete, undefined, undefined, this, undefined);
                    }
                    value._then(completed, completed, undefined, value, this);
                };

                Promise.prototype.reduce = function (fn, initialValue) {
                    return reduce(this, fn, initialValue, null);
                };

                Promise.reduce = function (promises, fn, initialValue, _each) {
                    return reduce(promises, fn, initialValue, _each);
                };

                function completed(valueOrReason, array) {
                    if (this.isFulfilled()) {
                        array._resolve(valueOrReason);
                    } else {
                        array._reject(valueOrReason);
                    }
                }

                function reduce(promises, fn, initialValue, _each) {
                    if (typeof fn !== "function") {
                        return apiRejection("expecting a function but got " + util.classString(fn));
                    }
                    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
                    return array.promise();
                }

                function gotAccum(accum) {
                    this.accum = accum;
                    this.array._gotAccum(accum);
                    var value = tryConvertToPromise(this.value, this.array._promise);
                    if (value instanceof Promise) {
                        this.array._currentCancellable = value;
                        return value._then(gotValue, undefined, undefined, this, undefined);
                    } else {
                        return gotValue.call(this, value);
                    }
                }

                function gotValue(value) {
                    var array = this.array;
                    var promise = array._promise;
                    var fn = tryCatch(array._fn);
                    promise._pushContext();
                    var ret;
                    if (array._eachValues !== undefined) {
                        ret = fn.call(promise._boundValue(), value, this.index, this.length);
                    } else {
                        ret = fn.call(promise._boundValue(), this.accum, value, this.index, this.length);
                    }
                    if (ret instanceof Promise) {
                        array._currentCancellable = ret;
                    }
                    var promiseCreated = promise._popContext();
                    debug.checkForgottenReturns(ret, promiseCreated, array._eachValues !== undefined ? "Promise.each" : "Promise.reduce", promise);
                    return ret;
                }
            };
        }, { "./util": 36 }], 29: [function (_dereq_, module, exports) {
            "use strict";

            var util = _dereq_("./util");
            var schedule;
            var noAsyncScheduler = function noAsyncScheduler() {
                throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
            };
            var NativePromise = util.getNativePromise();
            if (util.isNode && typeof MutationObserver === "undefined") {
                var GlobalSetImmediate = global.setImmediate;
                var ProcessNextTick = process.nextTick;
                schedule = util.isRecentNode ? function (fn) {
                    GlobalSetImmediate.call(global, fn);
                } : function (fn) {
                    ProcessNextTick.call(process, fn);
                };
            } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
                var nativePromise = NativePromise.resolve();
                schedule = function schedule(fn) {
                    nativePromise.then(fn);
                };
            } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) {
                schedule = function () {
                    var div = document.createElement("div");
                    var opts = { attributes: true };
                    var toggleScheduled = false;
                    var div2 = document.createElement("div");
                    var o2 = new MutationObserver(function () {
                        div.classList.toggle("foo");
                        toggleScheduled = false;
                    });
                    o2.observe(div2, opts);

                    var scheduleToggle = function scheduleToggle() {
                        if (toggleScheduled) return;
                        toggleScheduled = true;
                        div2.classList.toggle("foo");
                    };

                    return function schedule(fn) {
                        var o = new MutationObserver(function () {
                            o.disconnect();
                            fn();
                        });
                        o.observe(div, opts);
                        scheduleToggle();
                    };
                }();
            } else if (typeof setImmediate !== "undefined") {
                schedule = function schedule(fn) {
                    setImmediate(fn);
                };
            } else if (typeof setTimeout !== "undefined") {
                schedule = function schedule(fn) {
                    setTimeout(fn, 0);
                };
            } else {
                schedule = noAsyncScheduler;
            }
            module.exports = schedule;
        }, { "./util": 36 }], 30: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, debug) {
                var PromiseInspection = Promise.PromiseInspection;
                var util = _dereq_("./util");

                function SettledPromiseArray(values) {
                    this.constructor$(values);
                }
                util.inherits(SettledPromiseArray, PromiseArray);

                SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
                    this._values[index] = inspection;
                    var totalResolved = ++this._totalResolved;
                    if (totalResolved >= this._length) {
                        this._resolve(this._values);
                        return true;
                    }
                    return false;
                };

                SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
                    var ret = new PromiseInspection();
                    ret._bitField = 33554432;
                    ret._settledValueField = value;
                    return this._promiseResolved(index, ret);
                };
                SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
                    var ret = new PromiseInspection();
                    ret._bitField = 16777216;
                    ret._settledValueField = reason;
                    return this._promiseResolved(index, ret);
                };

                Promise.settle = function (promises) {
                    debug.deprecated(".settle()", ".reflect()");
                    return new SettledPromiseArray(promises).promise();
                };

                Promise.prototype.settle = function () {
                    return Promise.settle(this);
                };
            };
        }, { "./util": 36 }], 31: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, PromiseArray, apiRejection) {
                var util = _dereq_("./util");
                var RangeError = _dereq_("./errors").RangeError;
                var AggregateError = _dereq_("./errors").AggregateError;
                var isArray = util.isArray;
                var CANCELLATION = {};

                function SomePromiseArray(values) {
                    this.constructor$(values);
                    this._howMany = 0;
                    this._unwrap = false;
                    this._initialized = false;
                }
                util.inherits(SomePromiseArray, PromiseArray);

                SomePromiseArray.prototype._init = function () {
                    if (!this._initialized) {
                        return;
                    }
                    if (this._howMany === 0) {
                        this._resolve([]);
                        return;
                    }
                    this._init$(undefined, -5);
                    var isArrayResolved = isArray(this._values);
                    if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
                        this._reject(this._getRangeError(this.length()));
                    }
                };

                SomePromiseArray.prototype.init = function () {
                    this._initialized = true;
                    this._init();
                };

                SomePromiseArray.prototype.setUnwrap = function () {
                    this._unwrap = true;
                };

                SomePromiseArray.prototype.howMany = function () {
                    return this._howMany;
                };

                SomePromiseArray.prototype.setHowMany = function (count) {
                    this._howMany = count;
                };

                SomePromiseArray.prototype._promiseFulfilled = function (value) {
                    this._addFulfilled(value);
                    if (this._fulfilled() === this.howMany()) {
                        this._values.length = this.howMany();
                        if (this.howMany() === 1 && this._unwrap) {
                            this._resolve(this._values[0]);
                        } else {
                            this._resolve(this._values);
                        }
                        return true;
                    }
                    return false;
                };
                SomePromiseArray.prototype._promiseRejected = function (reason) {
                    this._addRejected(reason);
                    return this._checkOutcome();
                };

                SomePromiseArray.prototype._promiseCancelled = function () {
                    if (this._values instanceof Promise || this._values == null) {
                        return this._cancel();
                    }
                    this._addRejected(CANCELLATION);
                    return this._checkOutcome();
                };

                SomePromiseArray.prototype._checkOutcome = function () {
                    if (this.howMany() > this._canPossiblyFulfill()) {
                        var e = new AggregateError();
                        for (var i = this.length(); i < this._values.length; ++i) {
                            if (this._values[i] !== CANCELLATION) {
                                e.push(this._values[i]);
                            }
                        }
                        if (e.length > 0) {
                            this._reject(e);
                        } else {
                            this._cancel();
                        }
                        return true;
                    }
                    return false;
                };

                SomePromiseArray.prototype._fulfilled = function () {
                    return this._totalResolved;
                };

                SomePromiseArray.prototype._rejected = function () {
                    return this._values.length - this.length();
                };

                SomePromiseArray.prototype._addRejected = function (reason) {
                    this._values.push(reason);
                };

                SomePromiseArray.prototype._addFulfilled = function (value) {
                    this._values[this._totalResolved++] = value;
                };

                SomePromiseArray.prototype._canPossiblyFulfill = function () {
                    return this.length() - this._rejected();
                };

                SomePromiseArray.prototype._getRangeError = function (count) {
                    var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
                    return new RangeError(message);
                };

                SomePromiseArray.prototype._resolveEmptyArray = function () {
                    this._reject(this._getRangeError(0));
                };

                function some(promises, howMany) {
                    if ((howMany | 0) !== howMany || howMany < 0) {
                        return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    var ret = new SomePromiseArray(promises);
                    var promise = ret.promise();
                    ret.setHowMany(howMany);
                    ret.init();
                    return promise;
                }

                Promise.some = function (promises, howMany) {
                    return some(promises, howMany);
                };

                Promise.prototype.some = function (howMany) {
                    return some(this, howMany);
                };

                Promise._SomePromiseArray = SomePromiseArray;
            };
        }, { "./errors": 12, "./util": 36 }], 32: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise) {
                function PromiseInspection(promise) {
                    if (promise !== undefined) {
                        promise = promise._target();
                        this._bitField = promise._bitField;
                        this._settledValueField = promise._isFateSealed() ? promise._settledValue() : undefined;
                    } else {
                        this._bitField = 0;
                        this._settledValueField = undefined;
                    }
                }

                PromiseInspection.prototype._settledValue = function () {
                    return this._settledValueField;
                };

                var value = PromiseInspection.prototype.value = function () {
                    if (!this.isFulfilled()) {
                        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    return this._settledValue();
                };

                var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function () {
                    if (!this.isRejected()) {
                        throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                    }
                    return this._settledValue();
                };

                var isFulfilled = PromiseInspection.prototype.isFulfilled = function () {
                    return (this._bitField & 33554432) !== 0;
                };

                var isRejected = PromiseInspection.prototype.isRejected = function () {
                    return (this._bitField & 16777216) !== 0;
                };

                var isPending = PromiseInspection.prototype.isPending = function () {
                    return (this._bitField & 50397184) === 0;
                };

                var isResolved = PromiseInspection.prototype.isResolved = function () {
                    return (this._bitField & 50331648) !== 0;
                };

                PromiseInspection.prototype.isCancelled = function () {
                    return (this._bitField & 8454144) !== 0;
                };

                Promise.prototype.__isCancelled = function () {
                    return (this._bitField & 65536) === 65536;
                };

                Promise.prototype._isCancelled = function () {
                    return this._target().__isCancelled();
                };

                Promise.prototype.isCancelled = function () {
                    return (this._target()._bitField & 8454144) !== 0;
                };

                Promise.prototype.isPending = function () {
                    return isPending.call(this._target());
                };

                Promise.prototype.isRejected = function () {
                    return isRejected.call(this._target());
                };

                Promise.prototype.isFulfilled = function () {
                    return isFulfilled.call(this._target());
                };

                Promise.prototype.isResolved = function () {
                    return isResolved.call(this._target());
                };

                Promise.prototype.value = function () {
                    return value.call(this._target());
                };

                Promise.prototype.reason = function () {
                    var target = this._target();
                    target._unsetRejectionIsUnhandled();
                    return reason.call(target);
                };

                Promise.prototype._value = function () {
                    return this._settledValue();
                };

                Promise.prototype._reason = function () {
                    this._unsetRejectionIsUnhandled();
                    return this._settledValue();
                };

                Promise.PromiseInspection = PromiseInspection;
            };
        }, {}], 33: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL) {
                var util = _dereq_("./util");
                var errorObj = util.errorObj;
                var isObject = util.isObject;

                function tryConvertToPromise(obj, context) {
                    if (isObject(obj)) {
                        if (obj instanceof Promise) return obj;
                        var then = getThen(obj);
                        if (then === errorObj) {
                            if (context) context._pushContext();
                            var ret = Promise.reject(then.e);
                            if (context) context._popContext();
                            return ret;
                        } else if (typeof then === "function") {
                            if (isAnyBluebirdPromise(obj)) {
                                var ret = new Promise(INTERNAL);
                                obj._then(ret._fulfill, ret._reject, undefined, ret, null);
                                return ret;
                            }
                            return doThenable(obj, then, context);
                        }
                    }
                    return obj;
                }

                function doGetThen(obj) {
                    return obj.then;
                }

                function getThen(obj) {
                    try {
                        return doGetThen(obj);
                    } catch (e) {
                        errorObj.e = e;
                        return errorObj;
                    }
                }

                var hasProp = {}.hasOwnProperty;
                function isAnyBluebirdPromise(obj) {
                    try {
                        return hasProp.call(obj, "_promise0");
                    } catch (e) {
                        return false;
                    }
                }

                function doThenable(x, then, context) {
                    var promise = new Promise(INTERNAL);
                    var ret = promise;
                    if (context) context._pushContext();
                    promise._captureStackTrace();
                    if (context) context._popContext();
                    var synchronous = true;
                    var result = util.tryCatch(then).call(x, resolve, reject);
                    synchronous = false;

                    if (promise && result === errorObj) {
                        promise._rejectCallback(result.e, true, true);
                        promise = null;
                    }

                    function resolve(value) {
                        if (!promise) return;
                        promise._resolveCallback(value);
                        promise = null;
                    }

                    function reject(reason) {
                        if (!promise) return;
                        promise._rejectCallback(reason, synchronous, true);
                        promise = null;
                    }
                    return ret;
                }

                return tryConvertToPromise;
            };
        }, { "./util": 36 }], 34: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, INTERNAL, debug) {
                var util = _dereq_("./util");
                var TimeoutError = Promise.TimeoutError;

                function HandleWrapper(handle) {
                    this.handle = handle;
                }

                HandleWrapper.prototype._resultCancelled = function () {
                    clearTimeout(this.handle);
                };

                var afterValue = function afterValue(value) {
                    return delay(+this).thenReturn(value);
                };
                var delay = Promise.delay = function (ms, value) {
                    var ret;
                    var handle;
                    if (value !== undefined) {
                        ret = Promise.resolve(value)._then(afterValue, null, null, ms, undefined);
                        if (debug.cancellation() && value instanceof Promise) {
                            ret._setOnCancel(value);
                        }
                    } else {
                        ret = new Promise(INTERNAL);
                        handle = setTimeout(function () {
                            ret._fulfill();
                        }, +ms);
                        if (debug.cancellation()) {
                            ret._setOnCancel(new HandleWrapper(handle));
                        }
                        ret._captureStackTrace();
                    }
                    ret._setAsyncGuaranteed();
                    return ret;
                };

                Promise.prototype.delay = function (ms) {
                    return delay(ms, this);
                };

                var afterTimeout = function afterTimeout(promise, message, parent) {
                    var err;
                    if (typeof message !== "string") {
                        if (message instanceof Error) {
                            err = message;
                        } else {
                            err = new TimeoutError("operation timed out");
                        }
                    } else {
                        err = new TimeoutError(message);
                    }
                    util.markAsOriginatingFromRejection(err);
                    promise._attachExtraTrace(err);
                    promise._reject(err);

                    if (parent != null) {
                        parent.cancel();
                    }
                };

                function successClear(value) {
                    clearTimeout(this.handle);
                    return value;
                }

                function failureClear(reason) {
                    clearTimeout(this.handle);
                    throw reason;
                }

                Promise.prototype.timeout = function (ms, message) {
                    ms = +ms;
                    var ret, parent;

                    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
                        if (ret.isPending()) {
                            afterTimeout(ret, message, parent);
                        }
                    }, ms));

                    if (debug.cancellation()) {
                        parent = this.then();
                        ret = parent._then(successClear, failureClear, undefined, handleWrapper, undefined);
                        ret._setOnCancel(handleWrapper);
                    } else {
                        ret = this._then(successClear, failureClear, undefined, handleWrapper, undefined);
                    }

                    return ret;
                };
            };
        }, { "./util": 36 }], 35: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = function (Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
                var util = _dereq_("./util");
                var TypeError = _dereq_("./errors").TypeError;
                var inherits = _dereq_("./util").inherits;
                var errorObj = util.errorObj;
                var tryCatch = util.tryCatch;
                var NULL = {};

                function thrower(e) {
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }

                function castPreservingDisposable(thenable) {
                    var maybePromise = tryConvertToPromise(thenable);
                    if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
                        maybePromise._setDisposable(thenable._getDisposer());
                    }
                    return maybePromise;
                }
                function dispose(resources, inspection) {
                    var i = 0;
                    var len = resources.length;
                    var ret = new Promise(INTERNAL);
                    function iterator() {
                        if (i >= len) return ret._fulfill();
                        var maybePromise = castPreservingDisposable(resources[i++]);
                        if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
                            try {
                                maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
                            } catch (e) {
                                return thrower(e);
                            }
                            if (maybePromise instanceof Promise) {
                                return maybePromise._then(iterator, thrower, null, null, null);
                            }
                        }
                        iterator();
                    }
                    iterator();
                    return ret;
                }

                function Disposer(data, promise, context) {
                    this._data = data;
                    this._promise = promise;
                    this._context = context;
                }

                Disposer.prototype.data = function () {
                    return this._data;
                };

                Disposer.prototype.promise = function () {
                    return this._promise;
                };

                Disposer.prototype.resource = function () {
                    if (this.promise().isFulfilled()) {
                        return this.promise().value();
                    }
                    return NULL;
                };

                Disposer.prototype.tryDispose = function (inspection) {
                    var resource = this.resource();
                    var context = this._context;
                    if (context !== undefined) context._pushContext();
                    var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
                    if (context !== undefined) context._popContext();
                    this._promise._unsetDisposable();
                    this._data = null;
                    return ret;
                };

                Disposer.isDisposer = function (d) {
                    return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
                };

                function FunctionDisposer(fn, promise, context) {
                    this.constructor$(fn, promise, context);
                }
                inherits(FunctionDisposer, Disposer);

                FunctionDisposer.prototype.doDispose = function (resource, inspection) {
                    var fn = this.data();
                    return fn.call(resource, resource, inspection);
                };

                function maybeUnwrapDisposer(value) {
                    if (Disposer.isDisposer(value)) {
                        this.resources[this.index]._setDisposable(value);
                        return value.promise();
                    }
                    return value;
                }

                function ResourceList(length) {
                    this.length = length;
                    this.promise = null;
                    this[length - 1] = null;
                }

                ResourceList.prototype._resultCancelled = function () {
                    var len = this.length;
                    for (var i = 0; i < len; ++i) {
                        var item = this[i];
                        if (item instanceof Promise) {
                            item.cancel();
                        }
                    }
                };

                Promise.using = function () {
                    var len = arguments.length;
                    if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
                    var fn = arguments[len - 1];
                    if (typeof fn !== "function") {
                        return apiRejection("expecting a function but got " + util.classString(fn));
                    }
                    var input;
                    var spreadArgs = true;
                    if (len === 2 && Array.isArray(arguments[0])) {
                        input = arguments[0];
                        len = input.length;
                        spreadArgs = false;
                    } else {
                        input = arguments;
                        len--;
                    }
                    var resources = new ResourceList(len);
                    for (var i = 0; i < len; ++i) {
                        var resource = input[i];
                        if (Disposer.isDisposer(resource)) {
                            var disposer = resource;
                            resource = resource.promise();
                            resource._setDisposable(disposer);
                        } else {
                            var maybePromise = tryConvertToPromise(resource);
                            if (maybePromise instanceof Promise) {
                                resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                                    resources: resources,
                                    index: i
                                }, undefined);
                            }
                        }
                        resources[i] = resource;
                    }

                    var reflectedResources = new Array(resources.length);
                    for (var i = 0; i < reflectedResources.length; ++i) {
                        reflectedResources[i] = Promise.resolve(resources[i]).reflect();
                    }

                    var resultPromise = Promise.all(reflectedResources).then(function (inspections) {
                        for (var i = 0; i < inspections.length; ++i) {
                            var inspection = inspections[i];
                            if (inspection.isRejected()) {
                                errorObj.e = inspection.error();
                                return errorObj;
                            } else if (!inspection.isFulfilled()) {
                                resultPromise.cancel();
                                return;
                            }
                            inspections[i] = inspection.value();
                        }
                        promise._pushContext();

                        fn = tryCatch(fn);
                        var ret = spreadArgs ? fn.apply(undefined, inspections) : fn(inspections);
                        var promiseCreated = promise._popContext();
                        debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise);
                        return ret;
                    });

                    var promise = resultPromise.lastly(function () {
                        var inspection = new Promise.PromiseInspection(resultPromise);
                        return dispose(resources, inspection);
                    });
                    resources.promise = promise;
                    promise._setOnCancel(resources);
                    return promise;
                };

                Promise.prototype._setDisposable = function (disposer) {
                    this._bitField = this._bitField | 131072;
                    this._disposer = disposer;
                };

                Promise.prototype._isDisposable = function () {
                    return (this._bitField & 131072) > 0;
                };

                Promise.prototype._getDisposer = function () {
                    return this._disposer;
                };

                Promise.prototype._unsetDisposable = function () {
                    this._bitField = this._bitField & ~131072;
                    this._disposer = undefined;
                };

                Promise.prototype.disposer = function (fn) {
                    if (typeof fn === "function") {
                        return new FunctionDisposer(fn, this, createContext());
                    }
                    throw new TypeError();
                };
            };
        }, { "./errors": 12, "./util": 36 }], 36: [function (_dereq_, module, exports) {
            "use strict";

            var es5 = _dereq_("./es5");
            var canEvaluate = typeof navigator == "undefined";

            var errorObj = { e: {} };
            var tryCatchTarget;
            var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this !== undefined ? this : null;

            function tryCatcher() {
                try {
                    var target = tryCatchTarget;
                    tryCatchTarget = null;
                    return target.apply(this, arguments);
                } catch (e) {
                    errorObj.e = e;
                    return errorObj;
                }
            }
            function tryCatch(fn) {
                tryCatchTarget = fn;
                return tryCatcher;
            }

            var inherits = function inherits(Child, Parent) {
                var hasProp = {}.hasOwnProperty;

                function T() {
                    this.constructor = Child;
                    this.constructor$ = Parent;
                    for (var propertyName in Parent.prototype) {
                        if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
                            this[propertyName + "$"] = Parent.prototype[propertyName];
                        }
                    }
                }
                T.prototype = Parent.prototype;
                Child.prototype = new T();
                return Child.prototype;
            };

            function isPrimitive(val) {
                return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
            }

            function isObject(value) {
                return typeof value === "function" || (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null;
            }

            function maybeWrapAsError(maybeError) {
                if (!isPrimitive(maybeError)) return maybeError;

                return new Error(safeToString(maybeError));
            }

            function withAppended(target, appendee) {
                var len = target.length;
                var ret = new Array(len + 1);
                var i;
                for (i = 0; i < len; ++i) {
                    ret[i] = target[i];
                }
                ret[i] = appendee;
                return ret;
            }

            function getDataPropertyOrDefault(obj, key, defaultValue) {
                if (es5.isES5) {
                    var desc = Object.getOwnPropertyDescriptor(obj, key);

                    if (desc != null) {
                        return desc.get == null && desc.set == null ? desc.value : defaultValue;
                    }
                } else {
                    return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                }
            }

            function notEnumerableProp(obj, name, value) {
                if (isPrimitive(obj)) return obj;
                var descriptor = {
                    value: value,
                    configurable: true,
                    enumerable: false,
                    writable: true
                };
                es5.defineProperty(obj, name, descriptor);
                return obj;
            }

            function thrower(r) {
                throw r;
            }

            var inheritedDataKeys = function () {
                var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

                var isExcludedProto = function isExcludedProto(val) {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (excludedPrototypes[i] === val) {
                            return true;
                        }
                    }
                    return false;
                };

                if (es5.isES5) {
                    var getKeys = Object.getOwnPropertyNames;
                    return function (obj) {
                        var ret = [];
                        var visitedKeys = Object.create(null);
                        while (obj != null && !isExcludedProto(obj)) {
                            var keys;
                            try {
                                keys = getKeys(obj);
                            } catch (e) {
                                return ret;
                            }
                            for (var i = 0; i < keys.length; ++i) {
                                var key = keys[i];
                                if (visitedKeys[key]) continue;
                                visitedKeys[key] = true;
                                var desc = Object.getOwnPropertyDescriptor(obj, key);
                                if (desc != null && desc.get == null && desc.set == null) {
                                    ret.push(key);
                                }
                            }
                            obj = es5.getPrototypeOf(obj);
                        }
                        return ret;
                    };
                } else {
                    var hasProp = {}.hasOwnProperty;
                    return function (obj) {
                        if (isExcludedProto(obj)) return [];
                        var ret = [];

                        /*jshint forin:false */
                        enumeration: for (var key in obj) {
                            if (hasProp.call(obj, key)) {
                                ret.push(key);
                            } else {
                                for (var i = 0; i < excludedPrototypes.length; ++i) {
                                    if (hasProp.call(excludedPrototypes[i], key)) {
                                        continue enumeration;
                                    }
                                }
                                ret.push(key);
                            }
                        }
                        return ret;
                    };
                }
            }();

            var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
            function isClass(fn) {
                try {
                    if (typeof fn === "function") {
                        var keys = es5.names(fn.prototype);

                        var hasMethods = es5.isES5 && keys.length > 1;
                        var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
                        var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

                        if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
                            return true;
                        }
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            }

            function toFastProperties(obj) {
                /*jshint -W027,-W055,-W031*/
                function FakeConstructor() {}
                FakeConstructor.prototype = obj;
                var l = 8;
                while (l--) {
                    new FakeConstructor();
                }return obj;
                eval(obj);
            }

            var rident = /^[a-z$_][a-z$_0-9]*$/i;
            function isIdentifier(str) {
                return rident.test(str);
            }

            function filledRange(count, prefix, suffix) {
                var ret = new Array(count);
                for (var i = 0; i < count; ++i) {
                    ret[i] = prefix + i + suffix;
                }
                return ret;
            }

            function safeToString(obj) {
                try {
                    return obj + "";
                } catch (e) {
                    return "[no string representation]";
                }
            }

            function isError(obj) {
                return obj instanceof Error || obj !== null && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof obj.message === "string" && typeof obj.name === "string";
            }

            function markAsOriginatingFromRejection(e) {
                try {
                    notEnumerableProp(e, "isOperational", true);
                } catch (ignore) {}
            }

            function originatesFromRejection(e) {
                if (e == null) return false;
                return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
            }

            function canAttachTrace(obj) {
                return isError(obj) && es5.propertyIsWritable(obj, "stack");
            }

            var ensureErrorObject = function () {
                if (!("stack" in new Error())) {
                    return function (value) {
                        if (canAttachTrace(value)) return value;
                        try {
                            throw new Error(safeToString(value));
                        } catch (err) {
                            return err;
                        }
                    };
                } else {
                    return function (value) {
                        if (canAttachTrace(value)) return value;
                        return new Error(safeToString(value));
                    };
                }
            }();

            function classString(obj) {
                return {}.toString.call(obj);
            }

            function copyDescriptors(from, to, filter) {
                var keys = es5.names(from);
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (filter(key)) {
                        try {
                            es5.defineProperty(to, key, es5.getDescriptor(from, key));
                        } catch (ignore) {}
                    }
                }
            }

            var asArray = function asArray(v) {
                if (es5.isArray(v)) {
                    return v;
                }
                return null;
            };

            if (typeof Symbol !== "undefined" && Symbol.iterator) {
                var ArrayFrom = typeof Array.from === "function" ? function (v) {
                    return Array.from(v);
                } : function (v) {
                    var ret = [];
                    var it = v[Symbol.iterator]();
                    var itResult;
                    while (!(itResult = it.next()).done) {
                        ret.push(itResult.value);
                    }
                    return ret;
                };

                asArray = function asArray(v) {
                    if (es5.isArray(v)) {
                        return v;
                    } else if (v != null && typeof v[Symbol.iterator] === "function") {
                        return ArrayFrom(v);
                    }
                    return null;
                };
            }

            var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";

            var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";

            function env(key) {
                return hasEnvVariables ? process.env[key] : undefined;
            }

            function getNativePromise() {
                if (typeof Promise === "function") {
                    try {
                        var promise = new Promise(function () {});
                        if ({}.toString.call(promise) === "[object Promise]") {
                            return Promise;
                        }
                    } catch (e) {}
                }
            }

            function domainBind(self, cb) {
                return self.bind(cb);
            }

            var ret = {
                isClass: isClass,
                isIdentifier: isIdentifier,
                inheritedDataKeys: inheritedDataKeys,
                getDataPropertyOrDefault: getDataPropertyOrDefault,
                thrower: thrower,
                isArray: es5.isArray,
                asArray: asArray,
                notEnumerableProp: notEnumerableProp,
                isPrimitive: isPrimitive,
                isObject: isObject,
                isError: isError,
                canEvaluate: canEvaluate,
                errorObj: errorObj,
                tryCatch: tryCatch,
                inherits: inherits,
                withAppended: withAppended,
                maybeWrapAsError: maybeWrapAsError,
                toFastProperties: toFastProperties,
                filledRange: filledRange,
                toString: safeToString,
                canAttachTrace: canAttachTrace,
                ensureErrorObject: ensureErrorObject,
                originatesFromRejection: originatesFromRejection,
                markAsOriginatingFromRejection: markAsOriginatingFromRejection,
                classString: classString,
                copyDescriptors: copyDescriptors,
                hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
                isNode: isNode,
                hasEnvVariables: hasEnvVariables,
                env: env,
                global: globalObject,
                getNativePromise: getNativePromise,
                domainBind: domainBind
            };
            ret.isRecentNode = ret.isNode && function () {
                var version = process.versions.node.split(".").map(Number);
                return version[0] === 0 && version[1] > 10 || version[0] > 0;
            }();

            if (ret.isNode) ret.toFastProperties(process);

            try {
                throw new Error();
            } catch (e) {
                ret.lastLineError = e;
            }
            module.exports = ret;
        }, { "./es5": 13 }] }, {}, [4])(4);
});;if (typeof window !== 'undefined' && window !== null) {
    window.P = window.Promise;
} else if (typeof self !== 'undefined' && self !== null) {
    self.P = self.Promise;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(5), __webpack_require__(34).setImmediate))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(35);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || undefined && undefined.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || undefined && undefined.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(13)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module of mixed-in functions shared between node and client code
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isObject = __webpack_require__(15);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout() {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn) {
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function (val) {
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn) {
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options) {
  if (!options || 'object' !== (typeof options === 'undefined' ? 'undefined' : _typeof(options))) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for (var option in options) {
    switch (option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
RequestBase.prototype._shouldRetry = function (err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch (e) {
      console.error(e);
    }
  }
  if (res && res.status && res.status >= 500 && res.status != 501) return true;
  if (err) {
    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    // Superagent timeout
    if (err.timeout && err.code == 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function () {

  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function (innerResolve, innerReject) {
      self.end(function (err, res) {
        if (err) innerReject(err);else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype['catch'] = function (cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function (cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, val) {
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function (name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function (n) {
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function (data) {
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data ? this._data + '&' + data : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function () {
  console.trace("Unsupported");
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function () {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var utils = __webpack_require__(39);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util

  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct);

  // params
  var params = utils.params(ct);
  for (var key in params) {
    this[key] = params[key];
  }this.links = {};

  // links
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {
    // ignore
  }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function (status) {
  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.redirect = 3 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = 4 == type || 5 == type ? this.toError() : false;

  // sugar
  this.created = 201 == status;
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.forbidden = 403 == status;
  this.notFound = 404 == status;
  this.unprocessableEntity = 422 == status;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function (str) {
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function (str) {
  return str.split(/ *; */).reduce(function (obj, str) {
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function (str) {
  return str.split(/ *, */).reduce(function (obj, str) {
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function (header, changesOrigin) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  // secuirty
  if (changesOrigin) {
    delete header['authorization'];
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Agent() {
  this._defaults = [];
}

["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function (fn) {
  /** Default setting for all requests from this agent */
  Agent.prototype[fn] = function () /*varargs*/{
    this._defaults.push({ fn: fn, arguments: arguments });
    return this;
  };
});

Agent.prototype._setDefaults = function (req) {
  this._defaults.forEach(function (def) {
    req[def.fn].apply(req, def.arguments);
  });
};

module.exports = Agent;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRoutes = {
    fetchAccessToken: function fetchAccessToken(userId) {
        var query = { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', owner: userId };
        return _hcRequest2.default.submit('POST', _config2.default.apiUrl() + '/oauth/token', { query: query, authorize: true });
    }
};

exports.default = authRoutes;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileRoutes = {
    downloadFile: function downloadFile(sasUrl) {
        return _hcRequest2.default.submit('GET', sasUrl, { responseType: 'blob' });
    },
    uploadFile: function uploadFile(sasUrl, blob) {
        var headers = {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': 'application/octet-stream'
        };
        return _hcRequest2.default.submit('PUT', sasUrl, { body: blob, headers: headers });
    }
};

exports.default = fileRoutes;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fhirValidator = __webpack_require__(44);

var _fhirValidator2 = _interopRequireDefault(_fhirValidator);

var _documentRoutes = __webpack_require__(12);

var _documentRoutes2 = _interopRequireDefault(_documentRoutes);

var _userService = __webpack_require__(10);

var _userService2 = _interopRequireDefault(_userService);

var _taggingUtils = __webpack_require__(6);

var _taggingUtils2 = _interopRequireDefault(_taggingUtils);

var _dateUtils = __webpack_require__(88);

var _dateUtils2 = _interopRequireDefault(_dateUtils);

var _crypto = __webpack_require__(4);

var _crypto2 = _interopRequireDefault(_crypto);

var _cryptoService = __webpack_require__(26);

var _cryptoService2 = _interopRequireDefault(_cryptoService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fhirService = {
    /**
     * @param {string} ownerId
     * @param {Object} record
     * @param {string} record.id
     * @param {Object} record.fhirResource The Fhir Resource contained in record
     * @param {Array<string>} record.tags
     * @param {string} record.attachmentKey
     * @param {Date} record.customCreationDate The custom date entered by user
     * @param {Date} record.updatedDate The date of update of record
     * @returns {Promise<Object>}
     */
    updateFhirRecord: function updateFhirRecord(ownerId, record) {
        var updateRequest = function updateRequest(userId, params) {
            return _documentRoutes2.default.updateRecord(userId, record.id, params);
        };

        return this.uploadFhirRecord(ownerId, record, updateRequest);
    },


    /**
     * @param {string} ownerId
     * @param {Object} record
     * @returns {Promise<Object>}
     */
    createFhirRecord: function createFhirRecord(ownerId, record) {
        return this.uploadFhirRecord(ownerId, record, _documentRoutes2.default.createRecord);
    },

    /**
     * @param {string} ownerId
     * @param {Object} record
     * @param {string} record.id
     * @param {Object} record.fhirResource The Fhir Resource contained in record
     * @param {Array<string>} record.tags
     * @param {string} record.attachmentKey
     * @param {Date} record.customCreationDate The custom date entered by user
     * @param {Date} record.updatedDate The date of update of record
     * @returns {Promise<Object>}
     */
    uploadFhirRecord: function uploadFhirRecord(ownerId, record, uploadRequest) {
        var _this = this;

        return _fhirValidator2.default.validate(record.fhirResource).then(function () {
            record.tags = [].concat(_toConsumableArray(record.tags || []), _toConsumableArray(_taggingUtils2.default.generateTags(record.fhirResource)));
            return _this.uploadRecord(ownerId, record, uploadRequest);
        });
    },

    /**
     * @param {string} ownerId
     * @param {Object} record
     * @param {string} record.id
     * @param {Object} record.fhirResource The Fhir Resource contained in record
     * @param {Array<string>} record.tags
     * @param {string} record.attachmentKey
     * @param {Date} record.customCreationDate The custom date entered by user
     * @param {Date} record.updatedDate The date of update of record
     * @returns {Promise<Object>}
     */
    uploadRecord: function uploadRecord(ownerId, record, uploadRequest) {
        var owner = void 0;
        return _userService2.default.getUser(ownerId).then(function (user) {
            owner = user;
            return Promise.all([(0, _cryptoService2.default)(owner.id).encryptObject(record.fhirResource), Promise.all(record.tags.map(function (tag) {
                return _crypto2.default.symEncryptString(owner.tek, tag);
            }))]);
        }).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                _ref2$ = _slicedToArray(_ref2[0], 2),
                cipherData = _ref2$[0],
                cipherKey = _ref2$[1],
                encryptedTags = _ref2[1];

            var params = {
                encrypted_body: cipherData,
                encrypted_key: cipherKey,
                encrypted_tags: encryptedTags,
                date: _dateUtils2.default.formatDateYyyyMmDd(record.customCreationDate || new Date()),
                attachment_key: record.attachmentKey,
                model_version: 1
            };
            return uploadRequest(owner.id, params);
        }).then(function (result) {
            return {
                fhirResource: record.fhirResource,
                tags: record.tags,
                customCreationDate: result.date,
                updatedDate: result.createdAt,
                record_id: result.record_id
            };
        });
    },
    downloadFhirRecord: function downloadFhirRecord(ownerId, recordId) {
        var _this2 = this;

        return _documentRoutes2.default.downloadRecord(ownerId, recordId).then(function (result) {
            return _userService2.default.getUser(ownerId).then(function (user) {
                return _this2.decryptRecordAndTags(result, user.tek);
            });
        });
    },
    searchRecords: function searchRecords(ownerId, params) {
        var _this3 = this;

        var countOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var user = void 0;
        var totalCount = void 0;

        return _userService2.default.getUser(ownerId).then(function (userObject) {
            user = userObject;
            if (params.client_id) {
                var clientTag = _taggingUtils2.default.buildTag('client', params.client_id);
                params.tags = params.tags ? [].concat(_toConsumableArray(params.tags), [clientTag]) : [clientTag];
                delete params.client_id;
            }

            if (params.tags) {
                return Promise.all(params.tags.map(function (tag) {
                    return _crypto2.default.symEncryptString(user.tek, tag);
                })).then(function (encryptedTags) {
                    return encryptedTags.join(',');
                }).then(function (tags) {
                    params.tags = tags;
                    return params;
                });
            }
            return params;
        }).then(function (queryParams) {
            if (countOnly) {
                return _documentRoutes2.default.getRecordsCount(user.id, queryParams);
            }
            return _documentRoutes2.default.searchRecords(user.id, queryParams);
        }).then(function (searchResult) {
            totalCount = searchResult.totalCount;
            return searchResult.records ? Promise.all(searchResult.records.map(function (result) {
                return _this3.decryptRecordAndTags(result, user.tek).catch(function (err) {
                    console.warn('Decryption failed for record: ' + result.record_id, err);
                    return new Error(err);
                });
            })) : undefined;
        }).then(function (results) {
            return results ? { totalCount: totalCount, records: results.filter(function (result) {
                    return !(result instanceof Error);
                }) } : { totalCount: totalCount };
        });
    },
    deleteRecord: function deleteRecord(ownerId, recordId) {
        return _documentRoutes2.default.deleteRecord(ownerId, recordId);
    },
    decryptRecordAndTags: function decryptRecordAndTags(record, tagKey) {
        var tagsPromise = Promise.all(record.encrypted_tags.map(function (tag) {
            return _crypto2.default.symDecryptString(tagKey, tag);
        }));

        var recordPromise = (0, _cryptoService2.default)(record.user_id).decryptData(record.encrypted_key, _crypto2.default.convertBase64ToArrayBufferView(record.encrypted_body)).then(_crypto2.default.convertArrayBufferViewToString).then(JSON.parse);
        return Promise.all([recordPromise, tagsPromise]).then(function (results) {
            return {
                fhirResource: results[0],
                tags: results[1],
                updatedDate: new Date(record.createdAt),
                customCreationDate: new Date(record.date),
                record_id: record.record_id,
                attachment_key: record.attachment_key
            };
        });
    }
};

exports.default = fhirService;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajv = __webpack_require__(16);

var _ajv2 = _interopRequireDefault(_ajv);

var _ValidationError = __webpack_require__(3);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _fhirRoutes = __webpack_require__(83);

var _fhirRoutes2 = _interopRequireDefault(_fhirRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ajv = new _ajv2.default({ extendRefs: true });

var FhirValidator = function () {
    function FhirValidator() {
        _classCallCheck(this, FhirValidator);
    }

    _createClass(FhirValidator, [{
        key: 'getConformance',
        value: function getConformance() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (_this.conformance) {
                    resolve(_this.conformance);
                    return;
                }
                _fhirRoutes2.default.getFhirSchema().then(function (res) {
                    var schema = JSON.parse(res);
                    Object.keys(schema.resources).forEach(function (key) {
                        schema.resources[key].types = Object.assign({}, schema.resources[key].types, schema.types);
                    });
                    _this.conformance = {
                        types: schema.types,
                        resources: schema.resources
                    };
                    resolve(_this.conformance);
                }).catch(reject);
            });
        }
    }, {
        key: 'isValidResourceType',
        value: function isValidResourceType(resourceType) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.getConformance().then(function (conform) {
                    if (Object.prototype.hasOwnProperty.call(conform.resources, resourceType)) resolve(true);else reject(false);
                }).catch(reject);
            });
        }
    }, {
        key: 'validate',
        value: function validate(data) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var resource = data;
                var errors = [];

                if (resource && resource.resourceType) {
                    _this3.isValidResourceType(resource.resourceType).then(function () {
                        var validation = ajv.compile(_this3.conformance.resources[resource.resourceType]);
                        validation(resource);
                        if (validation.errors) {
                            reject(errors.concat(validation.errors));
                        }
                        resolve(resource);
                    }).catch(function () {
                        errors.push(new _ValidationError2.default('Not a valid resource type'));
                        reject(errors);
                    });
                } else {
                    errors.push(new _ValidationError2.default('Not a valid resource type'));
                    reject(errors);
                }
            });
        }
    }]);

    return FhirValidator;
}();

exports.default = new FhirValidator();

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var resolve = __webpack_require__(7),
    util = __webpack_require__(2),
    errorClasses = __webpack_require__(9),
    stableStringify = __webpack_require__(19);

var validateGenerator = __webpack_require__(20);

/**
 * Functions below are used inside compiled validations function
 */

var co = __webpack_require__(21);
var ucs2length = util.ucs2length;
var equal = __webpack_require__(8);

// this error is thrown by async schemas to return validation errors via exception
var ValidationError = errorClasses.Validation;

module.exports = compile;

/**
 * Compiles schema to validation function
 * @this   Ajv
 * @param  {Object} schema schema object
 * @param  {Object} root object with information about the root schema for this schema
 * @param  {Object} localRefs the hash of local references inside the schema (created by resolve.id), used for inline resolution
 * @param  {String} baseId base ID for IDs in the schema
 * @return {Function} validation function
 */
function compile(schema, root, localRefs, baseId) {
  /* jshint validthis: true, evil: true */
  /* eslint no-shadow: 0 */
  var self = this,
      opts = this._opts,
      refVal = [undefined],
      refs = {},
      patterns = [],
      patternsHash = {},
      defaults = [],
      defaultsHash = {},
      customRules = [];

  root = root || { schema: schema, refVal: refVal, refs: refs };

  var c = checkCompiling.call(this, schema, root, baseId);
  var compilation = this._compilations[c.index];
  if (c.compiling) return compilation.callValidate = callValidate;

  var formats = this._formats;
  var RULES = this.RULES;

  try {
    var v = localCompile(schema, root, localRefs, baseId);
    compilation.validate = v;
    var cv = compilation.callValidate;
    if (cv) {
      cv.schema = v.schema;
      cv.errors = null;
      cv.refs = v.refs;
      cv.refVal = v.refVal;
      cv.root = v.root;
      cv.$async = v.$async;
      if (opts.sourceCode) cv.source = v.source;
    }
    return v;
  } finally {
    endCompiling.call(this, schema, root, baseId);
  }

  function callValidate() {
    var validate = compilation.validate;
    var result = validate.apply(null, arguments);
    callValidate.errors = validate.errors;
    return result;
  }

  function localCompile(_schema, _root, localRefs, baseId) {
    var isRoot = !_root || _root && _root.schema == _schema;
    if (_root.schema != root.schema) return compile.call(self, _schema, _root, localRefs, baseId);

    var $async = _schema.$async === true;

    var sourceCode = validateGenerator({
      isTop: true,
      schema: _schema,
      isRoot: isRoot,
      baseId: baseId,
      root: _root,
      schemaPath: '',
      errSchemaPath: '#',
      errorPath: '""',
      MissingRefError: errorClasses.MissingRef,
      RULES: RULES,
      validate: validateGenerator,
      util: util,
      resolve: resolve,
      resolveRef: resolveRef,
      usePattern: usePattern,
      useDefault: useDefault,
      useCustomRule: useCustomRule,
      opts: opts,
      formats: formats,
      logger: self.logger,
      self: self
    });

    sourceCode = vars(refVal, refValCode) + vars(patterns, patternCode) + vars(defaults, defaultCode) + vars(customRules, customRuleCode) + sourceCode;

    if (opts.processCode) sourceCode = opts.processCode(sourceCode);
    // console.log('\n\n\n *** \n', JSON.stringify(sourceCode));
    var validate;
    try {
      var makeValidate = new Function('self', 'RULES', 'formats', 'root', 'refVal', 'defaults', 'customRules', 'co', 'equal', 'ucs2length', 'ValidationError', sourceCode);

      validate = makeValidate(self, RULES, formats, root, refVal, defaults, customRules, co, equal, ucs2length, ValidationError);

      refVal[0] = validate;
    } catch (e) {
      self.logger.error('Error compiling schema, function code:', sourceCode);
      throw e;
    }

    validate.schema = _schema;
    validate.errors = null;
    validate.refs = refs;
    validate.refVal = refVal;
    validate.root = isRoot ? validate : _root;
    if ($async) validate.$async = true;
    if (opts.sourceCode === true) {
      validate.source = {
        code: sourceCode,
        patterns: patterns,
        defaults: defaults
      };
    }

    return validate;
  }

  function resolveRef(baseId, ref, isRoot) {
    ref = resolve.url(baseId, ref);
    var refIndex = refs[ref];
    var _refVal, refCode;
    if (refIndex !== undefined) {
      _refVal = refVal[refIndex];
      refCode = 'refVal[' + refIndex + ']';
      return resolvedRef(_refVal, refCode);
    }
    if (!isRoot && root.refs) {
      var rootRefId = root.refs[ref];
      if (rootRefId !== undefined) {
        _refVal = root.refVal[rootRefId];
        refCode = addLocalRef(ref, _refVal);
        return resolvedRef(_refVal, refCode);
      }
    }

    refCode = addLocalRef(ref);
    var v = resolve.call(self, localCompile, root, ref);
    if (v === undefined) {
      var localSchema = localRefs && localRefs[ref];
      if (localSchema) {
        v = resolve.inlineRef(localSchema, opts.inlineRefs) ? localSchema : compile.call(self, localSchema, root, localRefs, baseId);
      }
    }

    if (v === undefined) {
      removeLocalRef(ref);
    } else {
      replaceLocalRef(ref, v);
      return resolvedRef(v, refCode);
    }
  }

  function addLocalRef(ref, v) {
    var refId = refVal.length;
    refVal[refId] = v;
    refs[ref] = refId;
    return 'refVal' + refId;
  }

  function removeLocalRef(ref) {
    delete refs[ref];
  }

  function replaceLocalRef(ref, v) {
    var refId = refs[ref];
    refVal[refId] = v;
  }

  function resolvedRef(refVal, code) {
    return (typeof refVal === 'undefined' ? 'undefined' : _typeof(refVal)) == 'object' || typeof refVal == 'boolean' ? { code: code, schema: refVal, inline: true } : { code: code, $async: refVal && refVal.$async };
  }

  function usePattern(regexStr) {
    var index = patternsHash[regexStr];
    if (index === undefined) {
      index = patternsHash[regexStr] = patterns.length;
      patterns[index] = regexStr;
    }
    return 'pattern' + index;
  }

  function useDefault(value) {
    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
      case 'boolean':
      case 'number':
        return '' + value;
      case 'string':
        return util.toQuotedString(value);
      case 'object':
        if (value === null) return 'null';
        var valueStr = stableStringify(value);
        var index = defaultsHash[valueStr];
        if (index === undefined) {
          index = defaultsHash[valueStr] = defaults.length;
          defaults[index] = value;
        }
        return 'default' + index;
    }
  }

  function useCustomRule(rule, schema, parentSchema, it) {
    var validateSchema = rule.definition.validateSchema;
    if (validateSchema && self._opts.validateSchema !== false) {
      var valid = validateSchema(schema);
      if (!valid) {
        var message = 'keyword schema is invalid: ' + self.errorsText(validateSchema.errors);
        if (self._opts.validateSchema == 'log') self.logger.error(message);else throw new Error(message);
      }
    }

    var compile = rule.definition.compile,
        inline = rule.definition.inline,
        macro = rule.definition.macro;

    var validate;
    if (compile) {
      validate = compile.call(self, schema, parentSchema, it);
    } else if (macro) {
      validate = macro.call(self, schema, parentSchema, it);
      if (opts.validateSchema !== false) self.validateSchema(validate, true);
    } else if (inline) {
      validate = inline.call(self, it, rule.keyword, schema, parentSchema);
    } else {
      validate = rule.definition.validate;
      if (!validate) return;
    }

    if (validate === undefined) throw new Error('custom keyword "' + rule.keyword + '"failed to compile');

    var index = customRules.length;
    customRules[index] = validate;

    return {
      code: 'customRule' + index,
      validate: validate
    };
  }
}

/**
 * Checks if the schema is currently compiled
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Object} object with properties "index" (compilation index) and "compiling" (boolean)
 */
function checkCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var index = compIndex.call(this, schema, root, baseId);
  if (index >= 0) return { index: index, compiling: true };
  index = this._compilations.length;
  this._compilations[index] = {
    schema: schema,
    root: root,
    baseId: baseId
  };
  return { index: index, compiling: false };
}

/**
 * Removes the schema from the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 */
function endCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var i = compIndex.call(this, schema, root, baseId);
  if (i >= 0) this._compilations.splice(i, 1);
}

/**
 * Index of schema compilation in the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Integer} compilation index
 */
function compIndex(schema, root, baseId) {
  /* jshint validthis: true */
  for (var i = 0; i < this._compilations.length; i++) {
    var c = this._compilations[i];
    if (c.schema == schema && c.root == root && c.baseId == baseId) return i;
  }
  return -1;
}

function patternCode(i, patterns) {
  return 'var pattern' + i + ' = new RegExp(' + util.toQuotedString(patterns[i]) + ');';
}

function defaultCode(i) {
  return 'var default' + i + ' = defaults[' + i + '];';
}

function refValCode(i, refVal) {
  return refVal[i] === undefined ? '' : 'var refVal' + i + ' = refVal[' + i + '];';
}

function customRuleCode(i) {
  return 'var customRule' + i + ' = customRules[' + i + '];';
}

function vars(arr, statement) {
  if (!arr.length) return '';
  var code = '';
  for (var i = 0; i < arr.length; i++) {
    code += statement(i, arr);
  }return code;
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var punycode = __webpack_require__(47);
var util = __webpack_require__(49);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,


// Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = __webpack_require__(50);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,


	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,


	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * https://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,

		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.4.1',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(17)) == 'object' && __webpack_require__(17)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(48)(module), __webpack_require__(5)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  isString: function isString(arg) {
    return typeof arg === 'string';
  },
  isObject: function isObject(arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
  },
  isNull: function isNull(arg) {
    return arg === null;
  },
  isNullOrUndefined: function isNullOrUndefined(arg) {
    return arg == null;
  }
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(51);
exports.encode = exports.stringify = __webpack_require__(52);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode

module.exports = function ucs2length(str) {
  var length = 0,
      len = str.length,
      pos = 0,
      value;
  while (pos < len) {
    length++;
    value = str.charCodeAt(pos++);
    if (value >= 0xD800 && value <= 0xDBFF && pos < len) {
      // high surrogate, and there is a next character
      value = str.charCodeAt(pos);
      if ((value & 0xFC00) == 0xDC00) pos++; // low surrogate
    }
  }
  return length;
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var traverse = module.exports = function (schema, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }
  _traverse(opts, cb, schema, '', schema);
};

traverse.keywords = {
  additionalItems: true,
  items: true,
  contains: true,
  additionalProperties: true,
  propertyNames: true,
  not: true
};

traverse.arrayKeywords = {
  items: true,
  allOf: true,
  anyOf: true,
  oneOf: true
};

traverse.propsKeywords = {
  definitions: true,
  properties: true,
  patternProperties: true,
  dependencies: true
};

traverse.skipKeywords = {
  enum: true,
  const: true,
  required: true,
  maximum: true,
  minimum: true,
  exclusiveMaximum: true,
  exclusiveMinimum: true,
  multipleOf: true,
  maxLength: true,
  minLength: true,
  pattern: true,
  format: true,
  maxItems: true,
  minItems: true,
  uniqueItems: true,
  maxProperties: true,
  minProperties: true
};

function _traverse(opts, cb, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
  if (schema && (typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) == 'object' && !Array.isArray(schema)) {
    cb(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    for (var key in schema) {
      var sch = schema[key];
      if (Array.isArray(sch)) {
        if (key in traverse.arrayKeywords) {
          for (var i = 0; i < sch.length; i++) {
            _traverse(opts, cb, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);
          }
        }
      } else if (key in traverse.propsKeywords) {
        if (sch && (typeof sch === 'undefined' ? 'undefined' : _typeof(sch)) == 'object') {
          for (var prop in sch) {
            _traverse(opts, cb, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
          }
        }
      } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
        _traverse(opts, cb, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);
      }
    }
  }
}

function escapeJsonPtr(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cache = module.exports = function Cache() {
  this._cache = {};
};

Cache.prototype.put = function Cache_put(key, value) {
  this._cache[key] = value;
};

Cache.prototype.get = function Cache_get(key) {
  return this._cache[key];
};

Cache.prototype.del = function Cache_del(key) {
  delete this._cache[key];
};

Cache.prototype.clear = function Cache_clear() {
  this._cache = {};
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(2);

var DATE = /^\d\d\d\d-(\d\d)-(\d\d)$/;
var DAYS = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i;
var HOSTNAME = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*$/i;
var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
var URIREF = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
// uri-template: https://tools.ietf.org/html/rfc6570
var URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
// For the source: https://gist.github.com/dperini/729294
// For test cases: https://mathiasbynens.be/demo/url-regex
// @todo Delete current URL in favour of the commented out URL rule when this issue is fixed https://github.com/eslint/eslint/issues/7983.
// var URL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
var URL = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i;
var UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
var JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$|^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
var RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;

module.exports = formats;

function formats(mode) {
  mode = mode == 'full' ? 'full' : 'fast';
  return util.copy(formats[mode]);
}

formats.fast = {
  // date: http://tools.ietf.org/html/rfc3339#section-5.6
  date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
  // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
  time: /^[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
  'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:z|[+-]\d\d:\d\d)$/i,
  // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
  uri: /^(?:[a-z][a-z0-9+-.]*)(?::|\/)\/?[^\s]*$/i,
  'uri-reference': /^(?:(?:[a-z][a-z0-9+-.]*:)?\/\/)?[^\s]*$/i,
  'uri-template': URITEMPLATE,
  url: URL,
  // email (sources from jsen validator):
  // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
  // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
  email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  hostname: HOSTNAME,
  // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  // uuid: http://tools.ietf.org/html/rfc4122
  uuid: UUID,
  // JSON-pointer: https://tools.ietf.org/html/rfc6901
  // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
  'json-pointer': JSON_POINTER,
  // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
  'relative-json-pointer': RELATIVE_JSON_POINTER
};

formats.full = {
  date: date,
  time: time,
  'date-time': date_time,
  uri: uri,
  'uri-reference': URIREF,
  'uri-template': URITEMPLATE,
  url: URL,
  email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  hostname: hostname,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  uuid: UUID,
  'json-pointer': JSON_POINTER,
  'relative-json-pointer': RELATIVE_JSON_POINTER
};

function date(str) {
  // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
  var matches = str.match(DATE);
  if (!matches) return false;

  var month = +matches[1];
  var day = +matches[2];
  return month >= 1 && month <= 12 && day >= 1 && day <= DAYS[month];
}

function time(str, full) {
  var matches = str.match(TIME);
  if (!matches) return false;

  var hour = matches[1];
  var minute = matches[2];
  var second = matches[3];
  var timeZone = matches[5];
  return hour <= 23 && minute <= 59 && second <= 59 && (!full || timeZone);
}

var DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  var dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(dateTime[1], true);
}

function hostname(str) {
  // https://tools.ietf.org/html/rfc1034#section-3.5
  // https://tools.ietf.org/html/rfc1123#section-2
  return str.length <= 255 && HOSTNAME.test(str);
}

var NOT_URI_FRAGMENT = /\/|:/;
function uri(str) {
  // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
  return NOT_URI_FRAGMENT.test(str) && URI.test(str);
}

var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return false;
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ruleModules = __webpack_require__(58),
    toHash = __webpack_require__(2).toHash;

module.exports = function rules() {
  var RULES = [{ type: 'number',
    rules: [{ 'maximum': ['exclusiveMaximum'] }, { 'minimum': ['exclusiveMinimum'] }, 'multipleOf', 'format'] }, { type: 'string',
    rules: ['maxLength', 'minLength', 'pattern', 'format'] }, { type: 'array',
    rules: ['maxItems', 'minItems', 'uniqueItems', 'contains', 'items'] }, { type: 'object',
    rules: ['maxProperties', 'minProperties', 'required', 'dependencies', 'propertyNames', { 'properties': ['additionalProperties', 'patternProperties'] }] }, { rules: ['$ref', 'const', 'enum', 'not', 'anyOf', 'oneOf', 'allOf'] }];

  var ALL = ['type'];
  var KEYWORDS = ['additionalItems', '$schema', '$id', 'id', 'title', 'description', 'default', 'definitions'];
  var TYPES = ['number', 'integer', 'string', 'array', 'object', 'boolean', 'null'];
  RULES.all = toHash(ALL);
  RULES.types = toHash(TYPES);

  RULES.forEach(function (group) {
    group.rules = group.rules.map(function (keyword) {
      var implKeywords;
      if ((typeof keyword === 'undefined' ? 'undefined' : _typeof(keyword)) == 'object') {
        var key = Object.keys(keyword)[0];
        implKeywords = keyword[key];
        keyword = key;
        implKeywords.forEach(function (k) {
          ALL.push(k);
          RULES.all[k] = true;
        });
      }
      ALL.push(keyword);
      var rule = RULES.all[keyword] = {
        keyword: keyword,
        code: ruleModules[keyword],
        implements: implKeywords
      };
      return rule;
    });

    if (group.type) RULES.types[group.type] = group;
  });

  RULES.keywords = toHash(ALL.concat(KEYWORDS));
  RULES.custom = {};

  return RULES;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//all requires must be explicit because browserify won't work with dynamic requires

module.exports = {
  '$ref': __webpack_require__(59),
  allOf: __webpack_require__(60),
  anyOf: __webpack_require__(61),
  const: __webpack_require__(62),
  contains: __webpack_require__(63),
  dependencies: __webpack_require__(64),
  'enum': __webpack_require__(65),
  format: __webpack_require__(66),
  items: __webpack_require__(67),
  maximum: __webpack_require__(22),
  minimum: __webpack_require__(22),
  maxItems: __webpack_require__(23),
  minItems: __webpack_require__(23),
  maxLength: __webpack_require__(24),
  minLength: __webpack_require__(24),
  maxProperties: __webpack_require__(25),
  minProperties: __webpack_require__(25),
  multipleOf: __webpack_require__(68),
  not: __webpack_require__(69),
  oneOf: __webpack_require__(70),
  pattern: __webpack_require__(71),
  properties: __webpack_require__(72),
  propertyNames: __webpack_require__(73),
  required: __webpack_require__(74),
  uniqueItems: __webpack_require__(75),
  validate: __webpack_require__(20)
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_ref(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $async, $refCode;
  if ($schema == '#' || $schema == '#/') {
    if (it.isRoot) {
      $async = it.async;
      $refCode = 'validate';
    } else {
      $async = it.root.schema.$async === true;
      $refCode = 'root.refVal[0]';
    }
  } else {
    var $refVal = it.resolveRef(it.baseId, $schema, it.isRoot);
    if ($refVal === undefined) {
      var $message = it.MissingRefError.message(it.baseId, $schema);
      if (it.opts.missingRefs == 'fail') {
        it.logger.error($message);
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + '$ref' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { ref: \'' + it.util.escapeQuotes($schema) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'can\\\'t resolve reference ' + it.util.escapeQuotes($schema) + '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: ' + it.util.toQuotedString($schema) + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        if ($breakOnError) {
          out += ' if (false) { ';
        }
      } else if (it.opts.missingRefs == 'ignore') {
        it.logger.warn($message);
        if ($breakOnError) {
          out += ' if (true) { ';
        }
      } else {
        throw new it.MissingRefError(it.baseId, $schema, $message);
      }
    } else if ($refVal.inline) {
      var $it = it.util.copy(it);
      $it.level++;
      var $nextValid = 'valid' + $it.level;
      $it.schema = $refVal.schema;
      $it.schemaPath = '';
      $it.errSchemaPath = $schema;
      var $code = it.validate($it).replace(/validate\.schema/g, $refVal.code);
      out += ' ' + $code + ' ';
      if ($breakOnError) {
        out += ' if (' + $nextValid + ') { ';
      }
    } else {
      $async = $refVal.$async === true;
      $refCode = $refVal.code;
    }
  }
  if ($refCode) {
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    if (it.opts.passContext) {
      out += ' ' + $refCode + '.call(this, ';
    } else {
      out += ' ' + $refCode + '( ';
    }
    out += ' ' + $data + ', (dataPath || \'\')';
    if (it.errorPath != '""') {
      out += ' + ' + it.errorPath;
    }
    var $parentData = $dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData',
        $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
    out += ' , ' + $parentData + ' , ' + $parentDataProperty + ', rootData)  ';
    var __callValidate = out;
    out = $$outStack.pop();
    if ($async) {
      if (!it.async) throw new Error('async schema referenced by sync schema');
      if ($breakOnError) {
        out += ' var ' + $valid + '; ';
      }
      out += ' try { ' + it.yieldAwait + ' ' + __callValidate + '; ';
      if ($breakOnError) {
        out += ' ' + $valid + ' = true; ';
      }
      out += ' } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ';
      if ($breakOnError) {
        out += ' ' + $valid + ' = false; ';
      }
      out += ' } ';
      if ($breakOnError) {
        out += ' if (' + $valid + ') { ';
      }
    } else {
      out += ' if (!' + __callValidate + ') { if (vErrors === null) vErrors = ' + $refCode + '.errors; else vErrors = vErrors.concat(' + $refCode + '.errors); errors = vErrors.length; } ';
      if ($breakOnError) {
        out += ' else { ';
      }
    }
  }
  return out;
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_allOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $currentBaseId = $it.baseId,
      $allSchemasEmpty = true;
  var arr1 = $schema;
  if (arr1) {
    var $sch,
        $i = -1,
        l1 = arr1.length - 1;
    while ($i < l1) {
      $sch = arr1[$i += 1];
      if (it.util.schemaHasRules($sch, it.RULES.all)) {
        $allSchemasEmpty = false;
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + it.validate($it) + ' ';
        $it.baseId = $currentBaseId;
        if ($breakOnError) {
          out += ' if (' + $nextValid + ') { ';
          $closingBraces += '}';
        }
      }
    }
  }
  if ($breakOnError) {
    if ($allSchemasEmpty) {
      out += ' if (true) { ';
    } else {
      out += ' ' + $closingBraces.slice(0, -1) + ' ';
    }
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_anyOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $noEmptySchema = $schema.every(function ($sch) {
    return it.util.schemaHasRules($sch, it.RULES.all);
  });
  if ($noEmptySchema) {
    var $currentBaseId = $it.baseId;
    out += ' var ' + $errs + ' = errors; var ' + $valid + ' = false;  ';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var arr1 = $schema;
    if (arr1) {
      var $sch,
          $i = -1,
          l1 = arr1.length - 1;
      while ($i < l1) {
        $sch = arr1[$i += 1];
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + it.validate($it) + ' ';
        $it.baseId = $currentBaseId;
        out += ' ' + $valid + ' = ' + $valid + ' || ' + $nextValid + '; if (!' + $valid + ') { ';
        $closingBraces += '}';
      }
    }
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + $closingBraces + ' if (!' + $valid + ') {   var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + 'anyOf' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should match some schema in anyOf\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError(vErrors); ';
      } else {
        out += ' validate.errors = vErrors; return false; ';
      }
    }
    out += ' } else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';
    if (it.opts.allErrors) {
      out += ' } ';
    }
    out = it.util.cleanUpCode(out);
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_const(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  if (!$isData) {
    out += ' var schema' + $lvl + ' = validate.schema' + $schemaPath + ';';
  }
  out += 'var ' + $valid + ' = equal(' + $data + ', schema' + $lvl + '); if (!' + $valid + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'const' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be equal to constant\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' }';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_contains(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $idx = 'i' + $lvl,
      $dataNxt = $it.dataLevel = it.dataLevel + 1,
      $nextData = 'data' + $dataNxt,
      $currentBaseId = it.baseId,
      $nonEmptySchema = it.util.schemaHasRules($schema, it.RULES.all);
  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if ($nonEmptySchema) {
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + $nextValid + ' = false; for (var ' + $idx + ' = 0; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    var $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
    } else {
      out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
    }
    out += ' if (' + $nextValid + ') break; }  ';
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + $closingBraces + ' if (!' + $nextValid + ') {';
  } else {
    out += ' if (' + $data + '.length == 0) {';
  }
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'contains' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should contain a valid item\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } else { ';
  if ($nonEmptySchema) {
    out += '  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';
  }
  if (it.opts.allErrors) {
    out += ' } ';
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_dependencies(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $schemaDeps = {},
      $propertyDeps = {},
      $ownProperties = it.opts.ownProperties;
  for ($property in $schema) {
    var $sch = $schema[$property];
    var $deps = Array.isArray($sch) ? $propertyDeps : $schemaDeps;
    $deps[$property] = $sch;
  }
  out += 'var ' + $errs + ' = errors;';
  var $currentErrorPath = it.errorPath;
  out += 'var missing' + $lvl + ';';
  for (var $property in $propertyDeps) {
    $deps = $propertyDeps[$property];
    if ($deps.length) {
      out += ' if ( ' + $data + it.util.getProperty($property) + ' !== undefined ';
      if ($ownProperties) {
        out += ' && Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($property) + '\') ';
      }
      if ($breakOnError) {
        out += ' && ( ';
        var arr1 = $deps;
        if (arr1) {
          var $propertyKey,
              $i = -1,
              l1 = arr1.length - 1;
          while ($i < l1) {
            $propertyKey = arr1[$i += 1];
            if ($i) {
              out += ' || ';
            }
            var $prop = it.util.getProperty($propertyKey),
                $useData = $data + $prop;
            out += ' ( ( ' + $useData + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
            }
            out += ') && (missing' + $lvl + ' = ' + it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop) + ') ) ';
          }
        }
        out += ')) {  ';
        var $propertyPath = 'missing' + $lvl,
            $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;
        }
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + 'dependencies' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { property: \'' + it.util.escapeQuotes($property) + '\', missingProperty: \'' + $missingProperty + '\', depsCount: ' + $deps.length + ', deps: \'' + it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(", ")) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should have ';
            if ($deps.length == 1) {
              out += 'property ' + it.util.escapeQuotes($deps[0]);
            } else {
              out += 'properties ' + it.util.escapeQuotes($deps.join(", "));
            }
            out += ' when property ' + it.util.escapeQuotes($property) + ' is present\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
      } else {
        out += ' ) { ';
        var arr2 = $deps;
        if (arr2) {
          var $propertyKey,
              i2 = -1,
              l2 = arr2.length - 1;
          while (i2 < l2) {
            $propertyKey = arr2[i2 += 1];
            var $prop = it.util.getProperty($propertyKey),
                $missingProperty = it.util.escapeQuotes($propertyKey),
                $useData = $data + $prop;
            if (it.opts._errorDataPathProperty) {
              it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
            }
            out += ' if ( ' + $useData + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
            }
            out += ') {  var err =   '; /* istanbul ignore else */
            if (it.createErrors !== false) {
              out += ' { keyword: \'' + 'dependencies' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { property: \'' + it.util.escapeQuotes($property) + '\', missingProperty: \'' + $missingProperty + '\', depsCount: ' + $deps.length + ', deps: \'' + it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(", ")) + '\' } ';
              if (it.opts.messages !== false) {
                out += ' , message: \'should have ';
                if ($deps.length == 1) {
                  out += 'property ' + it.util.escapeQuotes($deps[0]);
                } else {
                  out += 'properties ' + it.util.escapeQuotes($deps.join(", "));
                }
                out += ' when property ' + it.util.escapeQuotes($property) + ' is present\' ';
              }
              if (it.opts.verbose) {
                out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
              }
              out += ' } ';
            } else {
              out += ' {} ';
            }
            out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
          }
        }
      }
      out += ' }   ';
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
  }
  it.errorPath = $currentErrorPath;
  var $currentBaseId = $it.baseId;
  for (var $property in $schemaDeps) {
    var $sch = $schemaDeps[$property];
    if (it.util.schemaHasRules($sch, it.RULES.all)) {
      out += ' ' + $nextValid + ' = true; if ( ' + $data + it.util.getProperty($property) + ' !== undefined ';
      if ($ownProperties) {
        out += ' && Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($property) + '\') ';
      }
      out += ') { ';
      $it.schema = $sch;
      $it.schemaPath = $schemaPath + it.util.getProperty($property);
      $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($property);
      out += '  ' + it.validate($it) + ' ';
      $it.baseId = $currentBaseId;
      out += ' }  ';
      if ($breakOnError) {
        out += ' if (' + $nextValid + ') { ';
        $closingBraces += '}';
      }
    }
  }
  if ($breakOnError) {
    out += '   ' + $closingBraces + ' if (' + $errs + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_enum(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $i = 'i' + $lvl,
      $vSchema = 'schema' + $lvl;
  if (!$isData) {
    out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + ';';
  }
  out += 'var ' + $valid + ';';
  if ($isData) {
    out += ' if (schema' + $lvl + ' === undefined) ' + $valid + ' = true; else if (!Array.isArray(schema' + $lvl + ')) ' + $valid + ' = false; else {';
  }
  out += '' + $valid + ' = false;for (var ' + $i + '=0; ' + $i + '<' + $vSchema + '.length; ' + $i + '++) if (equal(' + $data + ', ' + $vSchema + '[' + $i + '])) { ' + $valid + ' = true; break; }';
  if ($isData) {
    out += '  }  ';
  }
  out += ' if (!' + $valid + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'enum' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { allowedValues: schema' + $lvl + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be equal to one of the allowed values\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' }';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function generate_format(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  if (it.opts.format === false) {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
    return out;
  }
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $unknownFormats = it.opts.unknownFormats,
      $allowUnknown = Array.isArray($unknownFormats);
  if ($isData) {
    var $format = 'format' + $lvl,
        $isObject = 'isObject' + $lvl,
        $formatType = 'formatType' + $lvl;
    out += ' var ' + $format + ' = formats[' + $schemaValue + ']; var ' + $isObject + ' = typeof ' + $format + ' == \'object\' && !(' + $format + ' instanceof RegExp) && ' + $format + '.validate; var ' + $formatType + ' = ' + $isObject + ' && ' + $format + '.type || \'string\'; if (' + $isObject + ') { ';
    if (it.async) {
      out += ' var async' + $lvl + ' = ' + $format + '.async; ';
    }
    out += ' ' + $format + ' = ' + $format + '.validate; } if (  ';
    if ($isData) {
      out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'string\') || ';
    }
    out += ' (';
    if ($unknownFormats != 'ignore') {
      out += ' (' + $schemaValue + ' && !' + $format + ' ';
      if ($allowUnknown) {
        out += ' && self._opts.unknownFormats.indexOf(' + $schemaValue + ') == -1 ';
      }
      out += ') || ';
    }
    out += ' (' + $format + ' && ' + $formatType + ' == \'' + $ruleType + '\' && !(typeof ' + $format + ' == \'function\' ? ';
    if (it.async) {
      out += ' (async' + $lvl + ' ? ' + it.yieldAwait + ' ' + $format + '(' + $data + ') : ' + $format + '(' + $data + ')) ';
    } else {
      out += ' ' + $format + '(' + $data + ') ';
    }
    out += ' : ' + $format + '.test(' + $data + '))))) {';
  } else {
    var $format = it.formats[$schema];
    if (!$format) {
      if ($unknownFormats == 'ignore') {
        it.logger.warn('unknown format "' + $schema + '" ignored in schema at path "' + it.errSchemaPath + '"');
        if ($breakOnError) {
          out += ' if (true) { ';
        }
        return out;
      } else if ($allowUnknown && $unknownFormats.indexOf($schema) >= 0) {
        if ($breakOnError) {
          out += ' if (true) { ';
        }
        return out;
      } else {
        throw new Error('unknown format "' + $schema + '" is used in schema at path "' + it.errSchemaPath + '"');
      }
    }
    var $isObject = (typeof $format === 'undefined' ? 'undefined' : _typeof($format)) == 'object' && !($format instanceof RegExp) && $format.validate;
    var $formatType = $isObject && $format.type || 'string';
    if ($isObject) {
      var $async = $format.async === true;
      $format = $format.validate;
    }
    if ($formatType != $ruleType) {
      if ($breakOnError) {
        out += ' if (true) { ';
      }
      return out;
    }
    if ($async) {
      if (!it.async) throw new Error('async format in sync schema');
      var $formatRef = 'formats' + it.util.getProperty($schema) + '.validate';
      out += ' if (!(' + it.yieldAwait + ' ' + $formatRef + '(' + $data + '))) { ';
    } else {
      out += ' if (! ';
      var $formatRef = 'formats' + it.util.getProperty($schema);
      if ($isObject) $formatRef += '.validate';
      if (typeof $format == 'function') {
        out += ' ' + $formatRef + '(' + $data + ') ';
      } else {
        out += ' ' + $formatRef + '.test(' + $data + ') ';
      }
      out += ') { ';
    }
  }
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'format' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { format:  ';
    if ($isData) {
      out += '' + $schemaValue;
    } else {
      out += '' + it.util.toQuotedString($schema);
    }
    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match format "';
      if ($isData) {
        out += '\' + ' + $schemaValue + ' + \'';
      } else {
        out += '' + it.util.escapeQuotes($schema);
      }
      out += '"\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + it.util.toQuotedString($schema);
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function generate_items(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $idx = 'i' + $lvl,
      $dataNxt = $it.dataLevel = it.dataLevel + 1,
      $nextData = 'data' + $dataNxt,
      $currentBaseId = it.baseId;
  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if (Array.isArray($schema)) {
    var $additionalItems = it.schema.additionalItems;
    if ($additionalItems === false) {
      out += ' ' + $valid + ' = ' + $data + '.length <= ' + $schema.length + '; ';
      var $currErrSchemaPath = $errSchemaPath;
      $errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += '  if (!' + $valid + ') {   ';
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = ''; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + 'additionalItems' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schema.length + ' } ';
        if (it.opts.messages !== false) {
          out += ' , message: \'should NOT have more than ' + $schema.length + ' items\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      var __err = out;
      out = $$outStack.pop();
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError([' + __err + ']); ';
        } else {
          out += ' validate.errors = [' + __err + ']; return false; ';
        }
      } else {
        out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      }
      out += ' } ';
      $errSchemaPath = $currErrSchemaPath;
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
    var arr1 = $schema;
    if (arr1) {
      var $sch,
          $i = -1,
          l1 = arr1.length - 1;
      while ($i < l1) {
        $sch = arr1[$i += 1];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          out += ' ' + $nextValid + ' = true; if (' + $data + '.length > ' + $i + ') { ';
          var $passData = $data + '[' + $i + ']';
          $it.schema = $sch;
          $it.schemaPath = $schemaPath + '[' + $i + ']';
          $it.errSchemaPath = $errSchemaPath + '/' + $i;
          $it.errorPath = it.util.getPathExpr(it.errorPath, $i, it.opts.jsonPointers, true);
          $it.dataPathArr[$dataNxt] = $i;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
          } else {
            out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
          }
          out += ' }  ';
          if ($breakOnError) {
            out += ' if (' + $nextValid + ') { ';
            $closingBraces += '}';
          }
        }
      }
    }
    if ((typeof $additionalItems === 'undefined' ? 'undefined' : _typeof($additionalItems)) == 'object' && it.util.schemaHasRules($additionalItems, it.RULES.all)) {
      $it.schema = $additionalItems;
      $it.schemaPath = it.schemaPath + '.additionalItems';
      $it.errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += ' ' + $nextValid + ' = true; if (' + $data + '.length > ' + $schema.length + ') {  for (var ' + $idx + ' = ' + $schema.length + '; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
      $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
      var $passData = $data + '[' + $idx + ']';
      $it.dataPathArr[$dataNxt] = $idx;
      var $code = it.validate($it);
      $it.baseId = $currentBaseId;
      if (it.util.varOccurences($code, $nextData) < 2) {
        out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
      } else {
        out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
      }
      if ($breakOnError) {
        out += ' if (!' + $nextValid + ') break; ';
      }
      out += ' } }  ';
      if ($breakOnError) {
        out += ' if (' + $nextValid + ') { ';
        $closingBraces += '}';
      }
    }
  } else if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += '  for (var ' + $idx + ' = ' + 0 + '; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    var $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
    } else {
      out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
    }
    if ($breakOnError) {
      out += ' if (!' + $nextValid + ') break; ';
    }
    out += ' }';
  }
  if ($breakOnError) {
    out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_multipleOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  out += 'var division' + $lvl + ';if (';
  if ($isData) {
    out += ' ' + $schemaValue + ' !== undefined && ( typeof ' + $schemaValue + ' != \'number\' || ';
  }
  out += ' (division' + $lvl + ' = ' + $data + ' / ' + $schemaValue + ', ';
  if (it.opts.multipleOfPrecision) {
    out += ' Math.abs(Math.round(division' + $lvl + ') - division' + $lvl + ') > 1e-' + it.opts.multipleOfPrecision + ' ';
  } else {
    out += ' division' + $lvl + ' !== parseInt(division' + $lvl + ') ';
  }
  out += ' ) ';
  if ($isData) {
    out += '  )  ';
  }
  out += ' ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'multipleOf' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { multipleOf: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be multiple of ';
      if ($isData) {
        out += '\' + ' + $schemaValue;
      } else {
        out += '' + $schemaValue + '\'';
      }
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + $schema;
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_not(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + $errs + ' = errors;  ';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.createErrors = false;
    var $allErrorsOption;
    if ($it.opts.allErrors) {
      $allErrorsOption = $it.opts.allErrors;
      $it.opts.allErrors = false;
    }
    out += ' ' + it.validate($it) + ' ';
    $it.createErrors = true;
    if ($allErrorsOption) $it.opts.allErrors = $allErrorsOption;
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (' + $nextValid + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + 'not' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT be valid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + __err + ']); ';
      } else {
        out += ' validate.errors = [' + __err + ']; return false; ';
      }
    } else {
      out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';
    if (it.opts.allErrors) {
      out += ' } ';
    }
  } else {
    out += '  var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + 'not' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT be valid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if ($breakOnError) {
      out += ' if (false) { ';
    }
  }
  return out;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_oneOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  out += 'var ' + $errs + ' = errors;var prevValid' + $lvl + ' = false;var ' + $valid + ' = false;';
  var $currentBaseId = $it.baseId;
  var $wasComposite = it.compositeRule;
  it.compositeRule = $it.compositeRule = true;
  var arr1 = $schema;
  if (arr1) {
    var $sch,
        $i = -1,
        l1 = arr1.length - 1;
    while ($i < l1) {
      $sch = arr1[$i += 1];
      if (it.util.schemaHasRules($sch, it.RULES.all)) {
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + it.validate($it) + ' ';
        $it.baseId = $currentBaseId;
      } else {
        out += ' var ' + $nextValid + ' = true; ';
      }
      if ($i) {
        out += ' if (' + $nextValid + ' && prevValid' + $lvl + ') ' + $valid + ' = false; else { ';
        $closingBraces += '}';
      }
      out += ' if (' + $nextValid + ') ' + $valid + ' = prevValid' + $lvl + ' = true;';
    }
  }
  it.compositeRule = $it.compositeRule = $wasComposite;
  out += '' + $closingBraces + 'if (!' + $valid + ') {   var err =   '; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'oneOf' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match exactly one schema in oneOf\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; return false; ';
    }
  }
  out += '} else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; }';
  if (it.opts.allErrors) {
    out += ' } ';
  }
  return out;
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_pattern(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $regexp = $isData ? '(new RegExp(' + $schemaValue + '))' : it.usePattern($schema);
  out += 'if ( ';
  if ($isData) {
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + ' != \'string\') || ';
  }
  out += ' !' + $regexp + '.test(' + $data + ') ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + 'pattern' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { pattern:  ';
    if ($isData) {
      out += '' + $schemaValue;
    } else {
      out += '' + it.util.toQuotedString($schema);
    }
    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match pattern "';
      if ($isData) {
        out += '\' + ' + $schemaValue + ' + \'';
      } else {
        out += '' + it.util.escapeQuotes($schema);
      }
      out += '"\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + $schemaPath;
      } else {
        out += '' + it.util.toQuotedString($schema);
      }
      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + __err + ']); ';
    } else {
      out += ' validate.errors = [' + __err + ']; return false; ';
    }
  } else {
    out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function generate_properties(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $key = 'key' + $lvl,
      $idx = 'idx' + $lvl,
      $dataNxt = $it.dataLevel = it.dataLevel + 1,
      $nextData = 'data' + $dataNxt,
      $dataProperties = 'dataProperties' + $lvl;
  var $schemaKeys = Object.keys($schema || {}),
      $pProperties = it.schema.patternProperties || {},
      $pPropertyKeys = Object.keys($pProperties),
      $aProperties = it.schema.additionalProperties,
      $someProperties = $schemaKeys.length || $pPropertyKeys.length,
      $noAdditional = $aProperties === false,
      $additionalIsSchema = (typeof $aProperties === 'undefined' ? 'undefined' : _typeof($aProperties)) == 'object' && Object.keys($aProperties).length,
      $removeAdditional = it.opts.removeAdditional,
      $checkAdditional = $noAdditional || $additionalIsSchema || $removeAdditional,
      $ownProperties = it.opts.ownProperties,
      $currentBaseId = it.baseId;
  var $required = it.schema.required;
  if ($required && !(it.opts.v5 && $required.$data) && $required.length < it.opts.loopRequired) var $requiredHash = it.util.toHash($required);
  if (it.opts.patternGroups) {
    var $pgProperties = it.schema.patternGroups || {},
        $pgPropertyKeys = Object.keys($pgProperties);
  }
  out += 'var ' + $errs + ' = errors;var ' + $nextValid + ' = true;';
  if ($ownProperties) {
    out += ' var ' + $dataProperties + ' = undefined;';
  }
  if ($checkAdditional) {
    if ($ownProperties) {
      out += ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; ';
    } else {
      out += ' for (var ' + $key + ' in ' + $data + ') { ';
    }
    if ($someProperties) {
      out += ' var isAdditional' + $lvl + ' = !(false ';
      if ($schemaKeys.length) {
        if ($schemaKeys.length > 5) {
          out += ' || validate.schema' + $schemaPath + '[' + $key + '] ';
        } else {
          var arr1 = $schemaKeys;
          if (arr1) {
            var $propertyKey,
                i1 = -1,
                l1 = arr1.length - 1;
            while (i1 < l1) {
              $propertyKey = arr1[i1 += 1];
              out += ' || ' + $key + ' == ' + it.util.toQuotedString($propertyKey) + ' ';
            }
          }
        }
      }
      if ($pPropertyKeys.length) {
        var arr2 = $pPropertyKeys;
        if (arr2) {
          var $pProperty,
              $i = -1,
              l2 = arr2.length - 1;
          while ($i < l2) {
            $pProperty = arr2[$i += 1];
            out += ' || ' + it.usePattern($pProperty) + '.test(' + $key + ') ';
          }
        }
      }
      if (it.opts.patternGroups && $pgPropertyKeys.length) {
        var arr3 = $pgPropertyKeys;
        if (arr3) {
          var $pgProperty,
              $i = -1,
              l3 = arr3.length - 1;
          while ($i < l3) {
            $pgProperty = arr3[$i += 1];
            out += ' || ' + it.usePattern($pgProperty) + '.test(' + $key + ') ';
          }
        }
      }
      out += ' ); if (isAdditional' + $lvl + ') { ';
    }
    if ($removeAdditional == 'all') {
      out += ' delete ' + $data + '[' + $key + ']; ';
    } else {
      var $currentErrorPath = it.errorPath;
      var $additionalProperty = '\' + ' + $key + ' + \'';
      if (it.opts._errorDataPathProperty) {
        it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
      }
      if ($noAdditional) {
        if ($removeAdditional) {
          out += ' delete ' + $data + '[' + $key + ']; ';
        } else {
          out += ' ' + $nextValid + ' = false; ';
          var $currErrSchemaPath = $errSchemaPath;
          $errSchemaPath = it.errSchemaPath + '/additionalProperties';
          var $$outStack = $$outStack || [];
          $$outStack.push(out);
          out = ''; /* istanbul ignore else */
          if (it.createErrors !== false) {
            out += ' { keyword: \'' + 'additionalProperties' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { additionalProperty: \'' + $additionalProperty + '\' } ';
            if (it.opts.messages !== false) {
              out += ' , message: \'should NOT have additional properties\' ';
            }
            if (it.opts.verbose) {
              out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
            }
            out += ' } ';
          } else {
            out += ' {} ';
          }
          var __err = out;
          out = $$outStack.pop();
          if (!it.compositeRule && $breakOnError) {
            /* istanbul ignore if */
            if (it.async) {
              out += ' throw new ValidationError([' + __err + ']); ';
            } else {
              out += ' validate.errors = [' + __err + ']; return false; ';
            }
          } else {
            out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
          }
          $errSchemaPath = $currErrSchemaPath;
          if ($breakOnError) {
            out += ' break; ';
          }
        }
      } else if ($additionalIsSchema) {
        if ($removeAdditional == 'failing') {
          out += ' var ' + $errs + ' = errors;  ';
          var $wasComposite = it.compositeRule;
          it.compositeRule = $it.compositeRule = true;
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
          } else {
            out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
          }
          out += ' if (!' + $nextValid + ') { errors = ' + $errs + '; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete ' + $data + '[' + $key + ']; }  ';
          it.compositeRule = $it.compositeRule = $wasComposite;
        } else {
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
          } else {
            out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
          }
          if ($breakOnError) {
            out += ' if (!' + $nextValid + ') break; ';
          }
        }
      }
      it.errorPath = $currentErrorPath;
    }
    if ($someProperties) {
      out += ' } ';
    }
    out += ' }  ';
    if ($breakOnError) {
      out += ' if (' + $nextValid + ') { ';
      $closingBraces += '}';
    }
  }
  var $useDefaults = it.opts.useDefaults && !it.compositeRule;
  if ($schemaKeys.length) {
    var arr4 = $schemaKeys;
    if (arr4) {
      var $propertyKey,
          i4 = -1,
          l4 = arr4.length - 1;
      while (i4 < l4) {
        $propertyKey = arr4[i4 += 1];
        var $sch = $schema[$propertyKey];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          var $prop = it.util.getProperty($propertyKey),
              $passData = $data + $prop,
              $hasDefault = $useDefaults && $sch.default !== undefined;
          $it.schema = $sch;
          $it.schemaPath = $schemaPath + $prop;
          $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($propertyKey);
          $it.errorPath = it.util.getPath(it.errorPath, $propertyKey, it.opts.jsonPointers);
          $it.dataPathArr[$dataNxt] = it.util.toQuotedString($propertyKey);
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            $code = it.util.varReplace($code, $nextData, $passData);
            var $useData = $passData;
          } else {
            var $useData = $nextData;
            out += ' var ' + $nextData + ' = ' + $passData + '; ';
          }
          if ($hasDefault) {
            out += ' ' + $code + ' ';
          } else {
            if ($requiredHash && $requiredHash[$propertyKey]) {
              out += ' if ( ' + $useData + ' === undefined ';
              if ($ownProperties) {
                out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
              }
              out += ') { ' + $nextValid + ' = false; ';
              var $currentErrorPath = it.errorPath,
                  $currErrSchemaPath = $errSchemaPath,
                  $missingProperty = it.util.escapeQuotes($propertyKey);
              if (it.opts._errorDataPathProperty) {
                it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
              }
              $errSchemaPath = it.errSchemaPath + '/required';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'';
                  if (it.opts._errorDataPathProperty) {
                    out += 'is a required property';
                  } else {
                    out += 'should have required property \\\'' + $missingProperty + '\\\'';
                  }
                  out += '\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + __err + ']); ';
                } else {
                  out += ' validate.errors = [' + __err + ']; return false; ';
                }
              } else {
                out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              $errSchemaPath = $currErrSchemaPath;
              it.errorPath = $currentErrorPath;
              out += ' } else { ';
            } else {
              if ($breakOnError) {
                out += ' if ( ' + $useData + ' === undefined ';
                if ($ownProperties) {
                  out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
                }
                out += ') { ' + $nextValid + ' = true; } else { ';
              } else {
                out += ' if (' + $useData + ' !== undefined ';
                if ($ownProperties) {
                  out += ' &&   Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
                }
                out += ' ) { ';
              }
            }
            out += ' ' + $code + ' } ';
          }
        }
        if ($breakOnError) {
          out += ' if (' + $nextValid + ') { ';
          $closingBraces += '}';
        }
      }
    }
  }
  if ($pPropertyKeys.length) {
    var arr5 = $pPropertyKeys;
    if (arr5) {
      var $pProperty,
          i5 = -1,
          l5 = arr5.length - 1;
      while (i5 < l5) {
        $pProperty = arr5[i5 += 1];
        var $sch = $pProperties[$pProperty];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          $it.schema = $sch;
          $it.schemaPath = it.schemaPath + '.patternProperties' + it.util.getProperty($pProperty);
          $it.errSchemaPath = it.errSchemaPath + '/patternProperties/' + it.util.escapeFragment($pProperty);
          if ($ownProperties) {
            out += ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; ';
          } else {
            out += ' for (var ' + $key + ' in ' + $data + ') { ';
          }
          out += ' if (' + it.usePattern($pProperty) + '.test(' + $key + ')) { ';
          $it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
          } else {
            out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
          }
          if ($breakOnError) {
            out += ' if (!' + $nextValid + ') break; ';
          }
          out += ' } ';
          if ($breakOnError) {
            out += ' else ' + $nextValid + ' = true; ';
          }
          out += ' }  ';
          if ($breakOnError) {
            out += ' if (' + $nextValid + ') { ';
            $closingBraces += '}';
          }
        }
      }
    }
  }
  if (it.opts.patternGroups && $pgPropertyKeys.length) {
    var arr6 = $pgPropertyKeys;
    if (arr6) {
      var $pgProperty,
          i6 = -1,
          l6 = arr6.length - 1;
      while (i6 < l6) {
        $pgProperty = arr6[i6 += 1];
        var $pgSchema = $pgProperties[$pgProperty],
            $sch = $pgSchema.schema;
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          $it.schema = $sch;
          $it.schemaPath = it.schemaPath + '.patternGroups' + it.util.getProperty($pgProperty) + '.schema';
          $it.errSchemaPath = it.errSchemaPath + '/patternGroups/' + it.util.escapeFragment($pgProperty) + '/schema';
          out += ' var pgPropCount' + $lvl + ' = 0;  ';
          if ($ownProperties) {
            out += ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; ';
          } else {
            out += ' for (var ' + $key + ' in ' + $data + ') { ';
          }
          out += ' if (' + it.usePattern($pgProperty) + '.test(' + $key + ')) { pgPropCount' + $lvl + '++; ';
          $it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
          } else {
            out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
          }
          if ($breakOnError) {
            out += ' if (!' + $nextValid + ') break; ';
          }
          out += ' } ';
          if ($breakOnError) {
            out += ' else ' + $nextValid + ' = true; ';
          }
          out += ' }  ';
          if ($breakOnError) {
            out += ' if (' + $nextValid + ') { ';
            $closingBraces += '}';
          }
          var $pgMin = $pgSchema.minimum,
              $pgMax = $pgSchema.maximum;
          if ($pgMin !== undefined || $pgMax !== undefined) {
            out += ' var ' + $valid + ' = true; ';
            var $currErrSchemaPath = $errSchemaPath;
            if ($pgMin !== undefined) {
              var $limit = $pgMin,
                  $reason = 'minimum',
                  $moreOrLess = 'less';
              out += ' ' + $valid + ' = pgPropCount' + $lvl + ' >= ' + $pgMin + '; ';
              $errSchemaPath = it.errSchemaPath + '/patternGroups/minimum';
              out += '  if (!' + $valid + ') {   ';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + 'patternGroups' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { reason: \'' + $reason + '\', limit: ' + $limit + ', pattern: \'' + it.util.escapeQuotes($pgProperty) + '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'should NOT have ' + $moreOrLess + ' than ' + $limit + ' properties matching pattern "' + it.util.escapeQuotes($pgProperty) + '"\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + __err + ']); ';
                } else {
                  out += ' validate.errors = [' + __err + ']; return false; ';
                }
              } else {
                out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              out += ' } ';
              if ($pgMax !== undefined) {
                out += ' else ';
              }
            }
            if ($pgMax !== undefined) {
              var $limit = $pgMax,
                  $reason = 'maximum',
                  $moreOrLess = 'more';
              out += ' ' + $valid + ' = pgPropCount' + $lvl + ' <= ' + $pgMax + '; ';
              $errSchemaPath = it.errSchemaPath + '/patternGroups/maximum';
              out += '  if (!' + $valid + ') {   ';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + 'patternGroups' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { reason: \'' + $reason + '\', limit: ' + $limit + ', pattern: \'' + it.util.escapeQuotes($pgProperty) + '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'should NOT have ' + $moreOrLess + ' than ' + $limit + ' properties matching pattern "' + it.util.escapeQuotes($pgProperty) + '"\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + __err + ']); ';
                } else {
                  out += ' validate.errors = [' + __err + ']; return false; ';
                }
              } else {
                out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              out += ' } ';
            }
            $errSchemaPath = $currErrSchemaPath;
            if ($breakOnError) {
              out += ' if (' + $valid + ') { ';
              $closingBraces += '}';
            }
          }
        }
      }
    }
  }
  if ($breakOnError) {
    out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_propertyNames(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    var $key = 'key' + $lvl,
        $idx = 'idx' + $lvl,
        $i = 'i' + $lvl,
        $invalidName = '\' + ' + $key + ' + \'',
        $dataNxt = $it.dataLevel = it.dataLevel + 1,
        $nextData = 'data' + $dataNxt,
        $dataProperties = 'dataProperties' + $lvl,
        $ownProperties = it.opts.ownProperties,
        $currentBaseId = it.baseId;
    out += ' var ' + $errs + ' = errors; ';
    if ($ownProperties) {
      out += ' var ' + $dataProperties + ' = undefined; ';
    }
    if ($ownProperties) {
      out += ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; ';
    } else {
      out += ' for (var ' + $key + ' in ' + $data + ') { ';
    }
    out += ' var startErrs' + $lvl + ' = errors; ';
    var $passData = $key;
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + it.util.varReplace($code, $nextData, $passData) + ' ';
    } else {
      out += ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';
    }
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (!' + $nextValid + ') { for (var ' + $i + '=startErrs' + $lvl + '; ' + $i + '<errors; ' + $i + '++) { vErrors[' + $i + '].propertyName = ' + $key + '; }   var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + 'propertyNames' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { propertyName: \'' + $invalidName + '\' } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'property name \\\'' + $invalidName + '\\\' is invalid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError(vErrors); ';
      } else {
        out += ' validate.errors = vErrors; return false; ';
      }
    }
    if ($breakOnError) {
      out += ' break; ';
    }
    out += ' } }';
  }
  if ($breakOnError) {
    out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_required(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $vSchema = 'schema' + $lvl;
  if (!$isData) {
    if ($schema.length < it.opts.loopRequired && it.schema.properties && Object.keys(it.schema.properties).length) {
      var $required = [];
      var arr1 = $schema;
      if (arr1) {
        var $property,
            i1 = -1,
            l1 = arr1.length - 1;
        while (i1 < l1) {
          $property = arr1[i1 += 1];
          var $propertySch = it.schema.properties[$property];
          if (!($propertySch && it.util.schemaHasRules($propertySch, it.RULES.all))) {
            $required[$required.length] = $property;
          }
        }
      }
    } else {
      var $required = $schema;
    }
  }
  if ($isData || $required.length) {
    var $currentErrorPath = it.errorPath,
        $loopRequired = $isData || $required.length >= it.opts.loopRequired,
        $ownProperties = it.opts.ownProperties;
    if ($breakOnError) {
      out += ' var missing' + $lvl + '; ';
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + '; ';
        }
        var $i = 'i' + $lvl,
            $propertyPath = 'schema' + $lvl + '[' + $i + ']',
            $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        out += ' var ' + $valid + ' = true; ';
        if ($isData) {
          out += ' if (schema' + $lvl + ' === undefined) ' + $valid + ' = true; else if (!Array.isArray(schema' + $lvl + ')) ' + $valid + ' = false; else {';
        }
        out += ' for (var ' + $i + ' = 0; ' + $i + ' < ' + $vSchema + '.length; ' + $i + '++) { ' + $valid + ' = ' + $data + '[' + $vSchema + '[' + $i + ']] !== undefined ';
        if ($ownProperties) {
          out += ' &&   Object.prototype.hasOwnProperty.call(' + $data + ', ' + $vSchema + '[' + $i + ']) ';
        }
        out += '; if (!' + $valid + ') break; } ';
        if ($isData) {
          out += '  }  ';
        }
        out += '  if (!' + $valid + ') {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + $missingProperty + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      } else {
        out += ' if ( ';
        var arr2 = $required;
        if (arr2) {
          var $propertyKey,
              $i = -1,
              l2 = arr2.length - 1;
          while ($i < l2) {
            $propertyKey = arr2[$i += 1];
            if ($i) {
              out += ' || ';
            }
            var $prop = it.util.getProperty($propertyKey),
                $useData = $data + $prop;
            out += ' ( ( ' + $useData + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
            }
            out += ') && (missing' + $lvl + ' = ' + it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop) + ') ) ';
          }
        }
        out += ') {  ';
        var $propertyPath = 'missing' + $lvl,
            $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;
        }
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + $missingProperty + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + __err + ']); ';
          } else {
            out += ' validate.errors = [' + __err + ']; return false; ';
          }
        } else {
          out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      }
    } else {
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + '; ';
        }
        var $i = 'i' + $lvl,
            $propertyPath = 'schema' + $lvl + '[' + $i + ']',
            $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        if ($isData) {
          out += ' if (' + $vSchema + ' && !Array.isArray(' + $vSchema + ')) {  var err =   '; /* istanbul ignore else */
          if (it.createErrors !== false) {
            out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
            if (it.opts.messages !== false) {
              out += ' , message: \'';
              if (it.opts._errorDataPathProperty) {
                out += 'is a required property';
              } else {
                out += 'should have required property \\\'' + $missingProperty + '\\\'';
              }
              out += '\' ';
            }
            if (it.opts.verbose) {
              out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
            }
            out += ' } ';
          } else {
            out += ' {} ';
          }
          out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (' + $vSchema + ' !== undefined) { ';
        }
        out += ' for (var ' + $i + ' = 0; ' + $i + ' < ' + $vSchema + '.length; ' + $i + '++) { if (' + $data + '[' + $vSchema + '[' + $i + ']] === undefined ';
        if ($ownProperties) {
          out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', ' + $vSchema + '[' + $i + ']) ';
        }
        out += ') {  var err =   '; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + $missingProperty + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ';
        if ($isData) {
          out += '  }  ';
        }
      } else {
        var arr3 = $required;
        if (arr3) {
          var $propertyKey,
              i3 = -1,
              l3 = arr3.length - 1;
          while (i3 < l3) {
            $propertyKey = arr3[i3 += 1];
            var $prop = it.util.getProperty($propertyKey),
                $missingProperty = it.util.escapeQuotes($propertyKey),
                $useData = $data + $prop;
            if (it.opts._errorDataPathProperty) {
              it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
            }
            out += ' if ( ' + $useData + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', \'' + it.util.escapeQuotes($propertyKey) + '\') ';
            }
            out += ') {  var err =   '; /* istanbul ignore else */
            if (it.createErrors !== false) {
              out += ' { keyword: \'' + 'required' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { missingProperty: \'' + $missingProperty + '\' } ';
              if (it.opts.messages !== false) {
                out += ' , message: \'';
                if (it.opts._errorDataPathProperty) {
                  out += 'is a required property';
                } else {
                  out += 'should have required property \\\'' + $missingProperty + '\\\'';
                }
                out += '\' ';
              }
              if (it.opts.verbose) {
                out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
              }
              out += ' } ';
            } else {
              out += ' {} ';
            }
            out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
          }
        }
      }
    }
    it.errorPath = $currentErrorPath;
  } else if ($breakOnError) {
    out += ' if (true) {';
  }
  return out;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_uniqueItems(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  if (($schema || $isData) && it.opts.uniqueItems !== false) {
    if ($isData) {
      out += ' var ' + $valid + '; if (' + $schemaValue + ' === false || ' + $schemaValue + ' === undefined) ' + $valid + ' = true; else if (typeof ' + $schemaValue + ' != \'boolean\') ' + $valid + ' = false; else { ';
    }
    out += ' var ' + $valid + ' = true; if (' + $data + '.length > 1) { var i = ' + $data + '.length, j; outer: for (;i--;) { for (j = i; j--;) { if (equal(' + $data + '[i], ' + $data + '[j])) { ' + $valid + ' = false; break outer; } } } } ';
    if ($isData) {
      out += '  }  ';
    }
    out += ' if (!' + $valid + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + 'uniqueItems' + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { i: i, j: j } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT have duplicate items (items ## \' + j + \' and \' + i + \' are identical)\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema:  ';
        if ($isData) {
          out += 'validate.schema' + $schemaPath;
        } else {
          out += '' + $schema;
        }
        out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + __err + ']); ';
      } else {
        out += ' validate.errors = [' + __err + ']; return false; ';
      }
    } else {
      out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } ';
    if ($breakOnError) {
      out += ' else { ';
    }
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var KEYWORDS = ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum', 'maxLength', 'minLength', 'pattern', 'additionalItems', 'maxItems', 'minItems', 'uniqueItems', 'maxProperties', 'minProperties', 'required', 'additionalProperties', 'enum', 'format', 'const'];

module.exports = function (metaSchema, keywordsJsonPointers) {
  for (var i = 0; i < keywordsJsonPointers.length; i++) {
    metaSchema = JSON.parse(JSON.stringify(metaSchema));
    var segments = keywordsJsonPointers[i].split('/');
    var keywords = metaSchema;
    var j;
    for (j = 1; j < segments.length; j++) {
      keywords = keywords[segments[j]];
    }for (j = 0; j < KEYWORDS.length; j++) {
      var key = KEYWORDS[j];
      var schema = keywords[key];
      if (schema) {
        keywords[key] = {
          anyOf: [schema, { $ref: 'https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/$data.json#' }]
        };
      }
    }
  }

  return metaSchema;
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var META_SCHEMA_ID = 'http://json-schema.org/draft-06/schema';

module.exports = function (ajv) {
  var defaultMeta = ajv._opts.defaultMeta;
  var metaSchemaRef = typeof defaultMeta == 'string' ? { $ref: defaultMeta } : ajv.getSchema(META_SCHEMA_ID) ? { $ref: META_SCHEMA_ID } : {};

  ajv.addKeyword('patternGroups', {
    // implemented in properties.jst
    metaSchema: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        required: ['schema'],
        properties: {
          maximum: {
            type: 'integer',
            minimum: 0
          },
          minimum: {
            type: 'integer',
            minimum: 0
          },
          schema: metaSchemaRef
        },
        additionalProperties: false
      }
    }
  });
  ajv.RULES.all.properties.implements.push('patternGroups');
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MissingRefError = __webpack_require__(9).MissingRef;

module.exports = compileAsync;

/**
 * Creates validating function for passed schema with asynchronous loading of missing schemas.
 * `loadSchema` option should be a function that accepts schema uri and returns promise that resolves with the schema.
 * @this  Ajv
 * @param {Object}   schema schema object
 * @param {Boolean}  meta optional true to compile meta-schema; this parameter can be skipped
 * @param {Function} callback an optional node-style callback, it is called with 2 parameters: error (or null) and validating function.
 * @return {Promise} promise that resolves with a validating function.
 */
function compileAsync(schema, meta, callback) {
  /* eslint no-shadow: 0 */
  /* global Promise */
  /* jshint validthis: true */
  var self = this;
  if (typeof this._opts.loadSchema != 'function') throw new Error('options.loadSchema should be a function');

  if (typeof meta == 'function') {
    callback = meta;
    meta = undefined;
  }

  var p = loadMetaSchemaOf(schema).then(function () {
    var schemaObj = self._addSchema(schema, undefined, meta);
    return schemaObj.validate || _compileAsync(schemaObj);
  });

  if (callback) {
    p.then(function (v) {
      callback(null, v);
    }, callback);
  }

  return p;

  function loadMetaSchemaOf(sch) {
    var $schema = sch.$schema;
    return $schema && !self.getSchema($schema) ? compileAsync.call(self, { $ref: $schema }, true) : Promise.resolve();
  }

  function _compileAsync(schemaObj) {
    try {
      return self._compile(schemaObj);
    } catch (e) {
      if (e instanceof MissingRefError) return loadMissingSchema(e);
      throw e;
    }

    function loadMissingSchema(e) {
      var ref = e.missingSchema;
      if (added(ref)) throw new Error('Schema ' + ref + ' is loaded but ' + e.missingRef + ' cannot be resolved');

      var schemaPromise = self._loadingSchemas[ref];
      if (!schemaPromise) {
        schemaPromise = self._loadingSchemas[ref] = self._opts.loadSchema(ref);
        schemaPromise.then(removePromise, removePromise);
      }

      return schemaPromise.then(function (sch) {
        if (!added(ref)) {
          return loadMetaSchemaOf(sch).then(function () {
            if (!added(ref)) self.addSchema(sch, ref, undefined, meta);
          });
        }
      }).then(function () {
        return _compileAsync(schemaObj);
      });

      function removePromise() {
        delete self._loadingSchemas[ref];
      }

      function added(ref) {
        return self._refs[ref] || self._schemas[ref];
      }
    }
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var IDENTIFIER = /^[a-z_$][a-z0-9_$-]*$/i;
var customRuleCode = __webpack_require__(80);

module.exports = {
  add: addKeyword,
  get: getKeyword,
  remove: removeKeyword
};

/**
 * Define custom keyword
 * @this  Ajv
 * @param {String} keyword custom keyword, should be unique (including different from all standard, custom and macro keywords).
 * @param {Object} definition keyword definition object with properties `type` (type(s) which the keyword applies to), `validate` or `compile`.
 * @return {Ajv} this for method chaining
 */
function addKeyword(keyword, definition) {
  /* jshint validthis: true */
  /* eslint no-shadow: 0 */
  var RULES = this.RULES;

  if (RULES.keywords[keyword]) throw new Error('Keyword ' + keyword + ' is already defined');

  if (!IDENTIFIER.test(keyword)) throw new Error('Keyword ' + keyword + ' is not a valid identifier');

  if (definition) {
    if (definition.macro && definition.valid !== undefined) throw new Error('"valid" option cannot be used with macro keywords');

    var dataType = definition.type;
    if (Array.isArray(dataType)) {
      var i,
          len = dataType.length;
      for (i = 0; i < len; i++) {
        checkDataType(dataType[i]);
      }for (i = 0; i < len; i++) {
        _addRule(keyword, dataType[i], definition);
      }
    } else {
      if (dataType) checkDataType(dataType);
      _addRule(keyword, dataType, definition);
    }

    var $data = definition.$data === true && this._opts.$data;
    if ($data && !definition.validate) throw new Error('$data support: "validate" function is not defined');

    var metaSchema = definition.metaSchema;
    if (metaSchema) {
      if ($data) {
        metaSchema = {
          anyOf: [metaSchema, { '$ref': 'https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/$data.json#' }]
        };
      }
      definition.validateSchema = this.compile(metaSchema, true);
    }
  }

  RULES.keywords[keyword] = RULES.all[keyword] = true;

  function _addRule(keyword, dataType, definition) {
    var ruleGroup;
    for (var i = 0; i < RULES.length; i++) {
      var rg = RULES[i];
      if (rg.type == dataType) {
        ruleGroup = rg;
        break;
      }
    }

    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      RULES.push(ruleGroup);
    }

    var rule = {
      keyword: keyword,
      definition: definition,
      custom: true,
      code: customRuleCode,
      implements: definition.implements
    };
    ruleGroup.rules.push(rule);
    RULES.custom[keyword] = rule;
  }

  function checkDataType(dataType) {
    if (!RULES.types[dataType]) throw new Error('Unknown type ' + dataType);
  }

  return this;
}

/**
 * Get keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Object|Boolean} custom keyword definition, `true` if it is a predefined keyword, `false` otherwise.
 */
function getKeyword(keyword) {
  /* jshint validthis: true */
  var rule = this.RULES.custom[keyword];
  return rule ? rule.definition : this.RULES.keywords[keyword] || false;
}

/**
 * Remove keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Ajv} this for method chaining
 */
function removeKeyword(keyword) {
  /* jshint validthis: true */
  var RULES = this.RULES;
  delete RULES.keywords[keyword];
  delete RULES.all[keyword];
  delete RULES.custom[keyword];
  for (var i = 0; i < RULES.length; i++) {
    var rules = RULES[i].rules;
    for (var j = 0; j < rules.length; j++) {
      if (rules[j].keyword == keyword) {
        rules.splice(j, 1);
        break;
      }
    }
  }
  return this;
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function generate_custom(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
      $schemaValue;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $rule = this,
      $definition = 'definition' + $lvl,
      $rDef = $rule.definition,
      $closingBraces = '';
  var $compile, $inline, $macro, $ruleValidate, $validateCode;
  if ($isData && $rDef.$data) {
    $validateCode = 'keywordValidate' + $lvl;
    var $validateSchema = $rDef.validateSchema;
    out += ' var ' + $definition + ' = RULES.custom[\'' + $keyword + '\'].definition; var ' + $validateCode + ' = ' + $definition + '.validate;';
  } else {
    $ruleValidate = it.useCustomRule($rule, $schema, it.schema, it);
    if (!$ruleValidate) return;
    $schemaValue = 'validate.schema' + $schemaPath;
    $validateCode = $ruleValidate.code;
    $compile = $rDef.compile;
    $inline = $rDef.inline;
    $macro = $rDef.macro;
  }
  var $ruleErrs = $validateCode + '.errors',
      $i = 'i' + $lvl,
      $ruleErr = 'ruleErr' + $lvl,
      $asyncKeyword = $rDef.async;
  if ($asyncKeyword && !it.async) throw new Error('async keyword in sync schema');
  if (!($inline || $macro)) {
    out += '' + $ruleErrs + ' = null;';
  }
  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if ($isData && $rDef.$data) {
    $closingBraces += '}';
    out += ' if (' + $schemaValue + ' === undefined) { ' + $valid + ' = true; } else { ';
    if ($validateSchema) {
      $closingBraces += '}';
      out += ' ' + $valid + ' = ' + $definition + '.validateSchema(' + $schemaValue + '); if (' + $valid + ') { ';
    }
  }
  if ($inline) {
    if ($rDef.statements) {
      out += ' ' + $ruleValidate.validate + ' ';
    } else {
      out += ' ' + $valid + ' = ' + $ruleValidate.validate + '; ';
    }
  } else if ($macro) {
    var $it = it.util.copy(it);
    var $closingBraces = '';
    $it.level++;
    var $nextValid = 'valid' + $it.level;
    $it.schema = $ruleValidate.validate;
    $it.schemaPath = '';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it).replace(/validate\.schema/g, $validateCode);
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + $code;
  } else {
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    out += '  ' + $validateCode + '.call( ';
    if (it.opts.passContext) {
      out += 'this';
    } else {
      out += 'self';
    }
    if ($compile || $rDef.schema === false) {
      out += ' , ' + $data + ' ';
    } else {
      out += ' , ' + $schemaValue + ' , ' + $data + ' , validate.schema' + it.schemaPath + ' ';
    }
    out += ' , (dataPath || \'\')';
    if (it.errorPath != '""') {
      out += ' + ' + it.errorPath;
    }
    var $parentData = $dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData',
        $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
    out += ' , ' + $parentData + ' , ' + $parentDataProperty + ' , rootData )  ';
    var def_callRuleValidate = out;
    out = $$outStack.pop();
    if ($rDef.errors === false) {
      out += ' ' + $valid + ' = ';
      if ($asyncKeyword) {
        out += '' + it.yieldAwait;
      }
      out += '' + def_callRuleValidate + '; ';
    } else {
      if ($asyncKeyword) {
        $ruleErrs = 'customErrors' + $lvl;
        out += ' var ' + $ruleErrs + ' = null; try { ' + $valid + ' = ' + it.yieldAwait + def_callRuleValidate + '; } catch (e) { ' + $valid + ' = false; if (e instanceof ValidationError) ' + $ruleErrs + ' = e.errors; else throw e; } ';
      } else {
        out += ' ' + $ruleErrs + ' = null; ' + $valid + ' = ' + def_callRuleValidate + '; ';
      }
    }
  }
  if ($rDef.modifying) {
    out += ' if (' + $parentData + ') ' + $data + ' = ' + $parentData + '[' + $parentDataProperty + '];';
  }
  out += '' + $closingBraces;
  if ($rDef.valid) {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  } else {
    out += ' if ( ';
    if ($rDef.valid === undefined) {
      out += ' !';
      if ($macro) {
        out += '' + $nextValid;
      } else {
        out += '' + $valid;
      }
    } else {
      out += ' ' + !$rDef.valid + ' ';
    }
    out += ') { ';
    $errorKeyword = $rule.keyword;
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ($errorKeyword || 'custom') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { keyword: \'' + $rule.keyword + '\' } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should pass "' + $rule.keyword + '" keyword validation\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + __err + ']); ';
      } else {
        out += ' validate.errors = [' + __err + ']; return false; ';
      }
    } else {
      out += ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    var def_customError = out;
    out = $$outStack.pop();
    if ($inline) {
      if ($rDef.errors) {
        if ($rDef.errors != 'full') {
          out += '  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + '.dataPath = (dataPath || \'\') + ' + it.errorPath + '; if (' + $ruleErr + '.schemaPath === undefined) { ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '"; } ';
          if (it.opts.verbose) {
            out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';
          }
          out += ' } ';
        }
      } else {
        if ($rDef.errors === false) {
          out += ' ' + def_customError + ' ';
        } else {
          out += ' if (' + $errs + ' == errors) { ' + def_customError + ' } else {  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + '.dataPath = (dataPath || \'\') + ' + it.errorPath + '; if (' + $ruleErr + '.schemaPath === undefined) { ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '"; } ';
          if (it.opts.verbose) {
            out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';
          }
          out += ' } } ';
        }
      }
    } else if ($macro) {
      out += '   var err =   '; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ($errorKeyword || 'custom') + '\' , dataPath: (dataPath || \'\') + ' + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { keyword: \'' + $rule.keyword + '\' } ';
        if (it.opts.messages !== false) {
          out += ' , message: \'should pass "' + $rule.keyword + '" keyword validation\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError(vErrors); ';
        } else {
          out += ' validate.errors = vErrors; return false; ';
        }
      }
    } else {
      if ($rDef.errors === false) {
        out += ' ' + def_customError + ' ';
      } else {
        out += ' if (Array.isArray(' + $ruleErrs + ')) { if (vErrors === null) vErrors = ' + $ruleErrs + '; else vErrors = vErrors.concat(' + $ruleErrs + '); errors = vErrors.length;  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + '.dataPath = (dataPath || \'\') + ' + it.errorPath + ';  ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '";  ';
        if (it.opts.verbose) {
          out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';
        }
        out += ' } } else { ' + def_customError + ' } ';
      }
    }
    out += ' } ';
    if ($breakOnError) {
      out += ' else { ';
    }
  }
  return out;
};

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-06/schema#","$id":"https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/$data.json#","description":"Meta-schema for $data reference (JSON-schema extension proposal)","type":"object","required":["$data"],"properties":{"$data":{"type":"string","anyOf":[{"format":"relative-json-pointer"},{"format":"json-pointer"}]}},"additionalProperties":false}

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-06/schema#","$id":"http://json-schema.org/draft-06/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"title":{"type":"string"},"description":{"type":"string"},"default":{},"examples":{"type":"array","items":{}},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":{}},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":{},"enum":{"type":"array","minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":{}}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fhirSchemaUrl = _config2.default.fhirSchemaUrl;

var fhir = {
    getFhirSchema: function getFhirSchema() {
        return _hcRequest2.default.submit('GET', fhirSchemaUrl);
    }
};

exports.default = fhir;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _hcRequest = __webpack_require__(1);

var _hcRequest2 = _interopRequireDefault(_hcRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = {
    resolveUserId: function resolveUserId(hcUserAlias) {
        var body = { value: hcUserAlias };

        return _hcRequest2.default.submit('POST', _config2.default.apiUrl() + '/users/resolve', { body: body });
    },
    getUserDetails: function getUserDetails(userId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + userId, { authorize: true });
    },
    fetchUserInfo: function fetchUserInfo(userId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/userinfo', { authorize: true, ownerId: userId });
    },
    updateUser: function updateUser(userId, userData) {
        return _hcRequest2.default.submit('PUT', _config2.default.apiUrl() + '/users/' + userId, { body: userData, authorize: true });
    },
    getReceivedPermissions: function getReceivedPermissions(userId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/users/' + userId + '/permissions', { authorize: true });
    },
    getCAPs: function getCAPs(appId) {
        return _hcRequest2.default.submit('GET', _config2.default.apiUrl() + '/permissions', { authorize: true, query: { app_id: appId } });
    },
    grantPermission: function grantPermission(ownerId, granteeId, appId, commonKey, scope) {
        var scopeString = scope.join(' ');
        var body = {
            grantee: granteeId,
            common_key: commonKey,
            app_id: appId,
            scope: scopeString
        };
        return _hcRequest2.default.submit('POST', _config2.default.apiUrl() + '/users/' + ownerId + '/permissions', { body: body, authorize: true });
    }
};

exports.default = userRoutes;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;

  return [validLen, placeHoldersLen];
}

// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

  for (var i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var stringUtils = {
    addPercentEncoding: function addPercentEncoding(string) {
        return encodeURIComponent(string).replace(/[!'()*\-_.~]/g, function (c) {
            return "%" + c.charCodeAt(0).toString(16);
        });
    },
    removePercentEncoding: function removePercentEncoding(string) {
        return decodeURIComponent(string);
    },
    prepareForUpload: function prepareForUpload(string) {
        return this.addPercentEncoding(string.toLowerCase().trim());
    }
};

exports.default = stringUtils;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SetupError = function SetupError(message) {
    _classCallCheck(this, SetupError);

    this.name = 'SetupError';
    this.message = message || '';
};

exports.default = SetupError;
var NOT_SETUP = exports.NOT_SETUP = 'the sdk was not setup correctly';

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var helpers = {
    formatDateYyyyMmDd: function formatDateYyyyMmDd(date) {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
    }
};

exports.default = helpers;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ajv = __webpack_require__(16);

var _ajv2 = _interopRequireDefault(_ajv);

var _HCDocument = __webpack_require__(27);

var _HCDocument2 = _interopRequireDefault(_HCDocument);

var _hcAttachmentUtils = __webpack_require__(90);

var _hcAttachmentUtils2 = _interopRequireDefault(_hcAttachmentUtils);

var _hcAuthorUtils = __webpack_require__(91);

var _hcAuthorUtils2 = _interopRequireDefault(_hcAuthorUtils);

var _hcSpecialtyUtils = __webpack_require__(29);

var _hcSpecialtyUtils2 = _interopRequireDefault(_hcSpecialtyUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        author: _hcAuthorUtils.schema,
        additionalIds: {
            type: 'object'
        },
        type: { type: 'string' },
        attachments: {
            type: 'array',
            items: _hcAttachmentUtils.schema
        },
        id: { type: 'string' },
        annotations: {
            type: 'array',
            items: {
                type: 'string',
                maxLength: 256
            },
            maxLength: 16
        },
        creationDate: {
            type: 'object'
        },
        updatedDate: {
            type: 'object'
        },
        customCreationDate: {
            type: 'object'
        }
    },
    required: ['title', 'attachments', 'type']
};
var ajv = new _ajv2.default();
var validate = ajv.compile(schema);

var hcDocumentUtils = {
    isValid: function isValid(hcDocument) {
        return validate(hcDocument);
    },
    fromFhirObject: function fromFhirObject(fhirObject) {
        var hcDocument = new _HCDocument2.default({
            type: fhirObject.type.text,
            title: fhirObject.description,
            additionalIds: fhirObject.identifier && fhirObject.identifier.length > 0 ? fhirObject.identifier.reduce(function (obj, item) {
                obj[item.assigner.reference] = item.value;
                return obj;
            }, {}) : undefined,
            author: {}
        });
        if (fhirObject.indexed) {
            hcDocument.creationDate = new Date(fhirObject.indexed);
        }

        hcDocument.attachments = fhirObject.content ? fhirObject.content.map(function (content) {
            return _hcAttachmentUtils2.default.fromFhirObject(content.attachment);
        }) : [];
        // fhirObject.author contains the reference id to the author in contained array.
        if (fhirObject.contained && fhirObject.contained.length > 0) {
            var author = fhirObject.contained.find(function (el) {
                return el.id === 'contained-author-id';
            });
            hcDocument.author = author ? _hcAuthorUtils2.default.fromFhirObject(author) : {};
        }

        if (fhirObject.context && fhirObject.context.practiceSetting) {
            hcDocument.author.specialty = _hcSpecialtyUtils2.default.fromFhirCodeableConcept(fhirObject.context.practiceSetting);
        }

        return hcDocument;
    },
    toFhirObject: function toFhirObject(hcDocument, clientId) {
        var fhirObject = {
            resourceType: 'DocumentReference',
            status: 'current',
            type: { text: hcDocument.type },
            author: [{ reference: '#contained-author-id' }],
            description: hcDocument.title,
            subject: { reference: hcDocument.title },
            contained: []
        };
        if (hcDocument.creationDate) {
            fhirObject.indexed = hcDocument.creationDate.toISOString();
        }

        fhirObject.content = hcDocument.attachments ? hcDocument.attachments.map(function (attachment) {
            return { attachment: _hcAttachmentUtils2.default.toFhirObject(attachment) };
        }) : [];

        if (hcDocument.author) {
            fhirObject.contained.push(_hcAuthorUtils2.default.toFhirObject(hcDocument.author, clientId));
        }
        // Information about where the document was created.
        if (hcDocument.author && hcDocument.author.specialty) {
            fhirObject.context = {
                practiceSetting: _hcSpecialtyUtils2.default.toFhirCodeableConcept(hcDocument.author.specialty)
            };
        }

        if (hcDocument.additionalIds) {
            fhirObject.identifier = Object.keys(hcDocument.additionalIds).map(function (key) {
                return {
                    value: hcDocument.additionalIds[key],
                    assigner: {
                        reference: key
                    }
                };
            });
        }

        return fhirObject;
    }
};

exports.default = hcDocumentUtils;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;

var _HCAttachment = __webpack_require__(11);

var _HCAttachment2 = _interopRequireDefault(_HCAttachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = exports.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        type: { type: 'string' }
    },
    required: []
};

var hcAttachmentUtils = {
    fromFhirObject: function fromFhirObject(fhirObject) {
        var attachment = new _HCAttachment2.default({
            title: fhirObject.title,
            type: fhirObject.contentType,
            creationDate: new Date(fhirObject.creation)
        });
        attachment.id = fhirObject.id;
        return attachment;
    },
    toFhirObject: function toFhirObject(hcAttachment) {
        return {
            id: hcAttachment.id,
            title: hcAttachment.title,
            contentType: hcAttachment.type,
            creation: hcAttachment.creationDate.toISOString()
        };
    }
};

exports.default = hcAttachmentUtils;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _HCAuthor = __webpack_require__(28);

var _HCAuthor2 = _interopRequireDefault(_HCAuthor);

var _hcSpecialtyUtils = __webpack_require__(29);

var _hcSpecialtyUtils2 = _interopRequireDefault(_hcSpecialtyUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = exports.schema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        prefix: { type: 'string' },
        suffix: { type: 'string' },
        street: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'string' },
        telephone: { type: 'string' },
        website: { type: 'string' },
        specialty: {
            type: 'string',
            enum: _hcSpecialtyUtils2.default.getSpecialties()
        }
    },
    required: []
};

var getIdentifier = function getIdentifier(authorFhirObject) {
    if (authorFhirObject.identifier && authorFhirObject.identifier[0]) {
        return authorFhirObject.identifier[0].value;
    }
    return undefined;
};

var hasName = function hasName(authorFhirObject) {
    return authorFhirObject.name && authorFhirObject.name[0];
};
var getName = function getName(authorFhirObject) {
    if (hasName(authorFhirObject)) {
        var name = authorFhirObject.name[0];
        return {
            firstName: name.given && name.given[0] ? name.given[0] : undefined,
            lastName: name.family,
            prefix: name.prefix && name.prefix[0] ? name.prefix[0] : undefined,
            suffix: name.suffix && name.suffix[0] ? name.suffix[0] : undefined
        };
    }
    return {};
};
var hasAddress = function hasAddress(authorFhirObject) {
    return authorFhirObject.address && authorFhirObject.address.length > 0;
};
var getAddress = function getAddress(authorFhirObject) {
    if (hasAddress(authorFhirObject)) {
        var address = authorFhirObject.address[0];
        return {
            street: address.line && address.line[0] ? address.line[0] : undefined,
            city: address.city,
            postalCode: address.postalCode
        };
    }
    return {};
};

var getTelecom = function getTelecom(authorFhirObject) {
    if (authorFhirObject.telecom) {
        var phone = authorFhirObject.telecom.find(function (el) {
            return el.system === 'phone';
        });
        var website = authorFhirObject.telecom.find(function (el) {
            return el.system === 'url';
        });
        return {
            telephone: phone ? phone.value : undefined,
            website: website ? website.value : undefined
        };
    }
    return {};
};

var hcAuthorUtils = {
    fromFhirObject: function fromFhirObject(fhirObject) {
        return new _HCAuthor2.default(_extends({
            id: getIdentifier(fhirObject)
        }, getName(fhirObject), getAddress(fhirObject), getTelecom(fhirObject)));
    },
    toFhirObject: function toFhirObject(hcAuthor, clientId) {
        var fhirObject = {
            resourceType: 'Practitioner',
            id: 'contained-author-id',
            identifier: [],
            name: [{
                family: hcAuthor.lastName,
                given: hcAuthor.firstName ? [hcAuthor.firstName] : [],
                prefix: hcAuthor.prefix ? [hcAuthor.prefix] : [],
                suffix: hcAuthor.suffix ? [hcAuthor.suffix] : []
            }],
            address: [{
                line: hcAuthor.street ? [hcAuthor.street] : [],
                city: hcAuthor.city,
                postalCode: hcAuthor.postalCode
            }],
            telecom: []
        };

        if (hcAuthor.id) {
            fhirObject.identifier.push({
                value: hcAuthor.id,
                assigner: {
                    reference: clientId
                }
            });
        }

        if (hcAuthor.telephone) {
            fhirObject.telecom.push({
                system: 'phone',
                value: hcAuthor.telephone
            });
        }

        if (hcAuthor.website) {
            fhirObject.telecom.push({
                system: 'url',
                value: hcAuthor.website
            });
        }
        return fhirObject;
    }
};

exports.default = hcAuthorUtils;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Specialty = {
    AdultMentalIllness: '408467006',
    Anesthetics: '394577000',
    AudiologicalMedicine: '394578005',
    BloodBankingAndTransfusionMedicine: '421661004',
    BurnsCare: '408462000',
    Cardiology: '394579002',
    ClinicalCytogeneticsAndMolecularGenetics: '394804000',
    ClinicalGenetics: '394580004',
    ClinicalHematology: '394803006',
    ClinicalImmunology: '408480009',
    ClinicalMicrobiology: '408454008',
    ClinicalNeuroPhysiology: '394809005',
    ClinicalOncology: '394592004',
    ClinicalPharmacology: '394600006',
    ClinicalPhysiology: '394601005',
    CommunityMedicine: '394581000',
    CriticalCareMedicine: '408478003',
    DentalMedicineSpecialties: '394812008',
    DentalGeneralDentalPractice: '408444009',
    Dermatology: '394582007',
    DiabeticMedicine: '408475000',
    DiveMedicine: '410005002',
    Endocrinology: '394583002',
    FamilyPractice: '419772000',
    Gastroenterology: '394584008',
    GeneralMedicalPractice: '408443003',
    GeneralMedicine: '394802001',
    GeneralPathology: '394915009',
    GeneralPractice: '394814009',
    GenitoUrinaryMedicine: '394808002',
    GeriatricMedicine: '394811001',
    GynecologicalOncology: '408446006',
    Gynecology: '394586005',
    Hematopathology: '394916005',
    Hepatology: '408472002',
    Histopathology: '394597005',
    Immunopathology: '394598000',
    InfectiousDiseases: '394807007',
    InternalMedicine: '419192003',
    LearningDisability: '408468001',
    MedicalOncology: '394593009',
    MedicalOphthalmology: '394813003',
    MilitaryMedicine: '410001006',
    Nephrology: '394589003',
    Neurology: '394591006',
    Neuropathology: '394599008',
    NuclearMedicine: '394649004',
    Obstetrics: '408470005',
    ObstetricsAndGynecology: '394585009',
    OccupationalMedicine: '394821009',
    OphthalmicSurgery: '422191005',
    Ophthalmology: '394594003',
    OsteopathicManipulativeMedicine: '416304004',
    Otolaryngology: '418960008',
    PainManagement: '394882004',
    PalliativeMedicine: '394806003',
    PediatricPsychiatry: '394588006',
    PediatricCardiology: '408459003',
    PediatricDentistry: '394607009',
    PediatricEndocrinology: '419610006',
    PediatricGastroenterology: '418058008',
    PediatricGenetics: '420208008',
    PediatricHematology: '418652005',
    PediatricImmunology: '418535003',
    PediatricInfectiousDiseases: '418862001',
    PediatricNephrology: '419365004',
    PediatricOncology: '418002000',
    PediatricOphthalmology: '419983000',
    PediatricPulmonology: '419170002',
    PediatricRheumatology: '419472004',
    PediatricSurgery: '394539006',
    PediatricSurgeryBoneMarrowTransplantation: '420112009',
    PreventiveMedicine: '409968004',
    Psychiatry: '394587001',
    Psychotherapy: '394913002',
    PublicHealthMedicine: '408440000',
    PulmonaryMedicine: '418112009',
    RadiationOncology: '419815003',
    Radiology: '394914008',
    RadiologyInterventionalRadiology: '408455009',
    Rehabilitation: '394602003',
    RespiteCare: '408447002',
    Rheumatology: '394810000',
    SleepStudies: '408450004',
    SurgeryBoneAndMarrowTransplantation: '408476004',
    SurgeryBreastSurgery: '408469009',
    SurgeryCardiacSurgery: '408466002',
    SurgeryCardiothoracicTransplantation: '408471009',
    SurgeryColorectalSurgery: '408464004',
    SurgeryDentalEndodontics: '408441001',
    SurgeryDentalOralAndMaxillofacialSurgery: '408465003',
    SurgeryDentalOralSurgery: '394605001',
    SurgeryDentalOrthodontics: '394608004',
    SurgeryDentalPeriodontalSurgery: '408461007',
    SurgeryDentalProstheticDentistry: '408460008',
    SurgeryDentalsurgicalProsthodontics: '408460008',
    SurgeryDentistryRestorativeDentistry: '394606000',
    SurgeryDentistrysurgical: '408449004',
    SurgeryDentistrysurgicalOrthodontics: '394608004',
    SurgeryDermatologicSurgery: '418018006',
    SurgeryEarNoseAndThroatSurgery: '394604002',
    Surgerygeneral: '394609007',
    SurgeryHepatobiliaryAndPancreaticSurgery: '408474001',
    SurgeryNeurosurgery: '394610002',
    SurgeryPlasticSurgery: '394611003',
    SurgeryTransplantationSurgery: '408477008',
    SurgeryTraumaAndOrthopedics: '394801008',
    SurgeryVascular: '408463005',
    SurgicalOncology: '419321007',
    SurgicalAccidentAndEmergency: '394576009',
    ThoracicMedicine: '394590007',
    Toxicology: '409967009',
    TropicalMedicine: '408448007',
    UrologicalOncology: '419043006',
    Urology: '394612005',
    MedicalSpecialtyOTHERNOTLISTED: '394733009',
    SurgicalSpecialtyOTHERNOTLISTED: '394732004'
};

exports.default = Specialty;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _superagent = __webpack_require__(14);

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toBool = function toBool(x) {
    return !!x;
};
var noop = function noop() {};
var isNotEmpty = function isNotEmpty(x) {
    return x && x.length > 0;
};

/**
 * onceElse executed the first arg on the first call
 * and executes the second arg on all other calls.
 *
 * @param {function} f - function executed on first call
 * @param {function} h - function executed on every other call
 * @returns {*} what ever f and h are returning
 */
var onceElse = function onceElse(f, h) {
    var notCalled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return function () {
        if (notCalled) {
            notCalled = false;
            return f();
        }

        return h();
    };
};
var pickToken = function pickToken(_ref) {
    var token = _ref.token;
    return token;
};

exports.default = {
    /**
     * Initiates GC.SDK with an access token
     *
     * @param {Object} param - config
     * @param {String} param.clientId - clientId as given by Gesundheitscloud
     * @param {String} param.clientURL - URL of the OAuth endpoint
     * @param {Object} [param.sdk=window.GC.SDK] - reference to GC.SDK
     * @param {Object} [param.globalWindow=window] - reference to the global window object
     *
     * @returns {Promise<String>} id - promise containting current user id
     */
    config: function config(_ref2) {
        var clientId = _ref2.clientId,
            clientURL = _ref2.clientURL,
            environment = _ref2.environment,
            _ref2$sdk = _ref2.sdk,
            sdk = _ref2$sdk === undefined ? window.GC.SDK : _ref2$sdk,
            _ref2$globalWindow = _ref2.globalWindow,
            globalWindow = _ref2$globalWindow === undefined ? window : _ref2$globalWindow;

        var postKeys = function postKeys(_ref3) {
            var privateKey = _ref3.privateKey,
                publicKey = _ref3.publicKey;
            return _superagent2.default.post(clientURL + '/gckeys').send({ private_key: privateKey, public_key: publicKey });
        };

        /**
         * getSession checks /gctoken for private_key and token.
         *
         * @returns {Promise<{ privatKey, token }>} - Promise that contains
         *          the privateKey / token from the session
         */
        var getSession = function getSession() {
            return _superagent2.default.get(clientURL + '/gctoken').then(function (_ref4) {
                var body = _ref4.body,
                    text = _ref4.text;

                var resObj = body || JSON.parse(text);
                resObj.privateKey = resObj.private_key;
                return resObj;
            }).catch(function (err) {
                if (err.status === 404) {
                    return { token: null, err: err };
                }

                throw err;
            });
        };

        var capPromise = sdk.createCAP();
        var setupHC = getSession().then(function (_ref5) {
            var privateKey = _ref5.privateKey,
                token = _ref5.token;

            if (isNotEmpty(token)) {
                var getToken = onceElse(function () {
                    return Promise.resolve(token);
                }, function () {
                    return getSession().then(pickToken);
                });

                return sdk.setup(clientId, environment, privateKey, getToken);
            }

            // returns an empty promise if the setup didn't work out
            return capPromise.then(postKeys).then(noop);
        });

        /**
         * Redirects to OAuth endpoint and triggers the OAuth Athorization Grant Flow
         * https://tools.ietf.org/html/rfc6749#section-4.1
         *
         * @return {undefined}
         */
        this.login = function () {
            capPromise.then(function (_ref6) {
                var publicKey = _ref6.publicKey;

                globalWindow.location.href = clientURL + '/gclogin?public_key=' + publicKey;
            });
        };

        /**
         * Contains true:  if there is a session already established
         * Contains false: if there is no session and sends a privateKey
         *                 to the OAuth Client
         * @type {Promise<Boolean>}
         */
        this.loggedIn = setupHC.then(toBool);

        // forwards setupHCs result
        return setupHC;
    }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=healthcloud_sdk.js.map