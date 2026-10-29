var CrossDomainSessionStorage =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/cross-domain-session-storage.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/cross-domain-session-storage.ts":
/*!*********************************************!*\
  !*** ./src/cross-domain-session-storage.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.CrossDomainSessionStorage = void 0;\r\nvar CrossDomainSessionStorage = /** @class */ (function () {\r\n    function CrossDomainSessionStorage() {\r\n    }\r\n    /** SOURCE CODES **/\r\n    // initialize source session storage\r\n    CrossDomainSessionStorage.prototype.initStorage = function (connectionConfigs) {\r\n        this.connectionConfigs = connectionConfigs;\r\n        this.setupSourceMessageHandler();\r\n    };\r\n    // source end message handler\r\n    CrossDomainSessionStorage.prototype.setupSourceMessageHandler = function () {\r\n        var _this = this;\r\n        window.addEventListener('message', function (event) {\r\n            // validate if requesting domain is allowed\r\n            var allowed = false;\r\n            for (var i = 0; i < _this.connectionConfigs.allowed_domains.length; i++) {\r\n                if (_this.connectionConfigs.allowed_domains[i].origin.test(event.origin) &&\r\n                    _this.connectionConfigs.allowed_domains[i].allow.indexOf(event.data.action) > -1) {\r\n                    allowed = true;\r\n                    break;\r\n                }\r\n            }\r\n            if (!allowed)\r\n                throw ('Origin has no permission to cross domain storage.');\r\n            if (!event.data.session_storage)\r\n                return;\r\n            switch (event.data.action) {\r\n                case 'getItem':\r\n                    top.postMessage({\r\n                        key: event.data.key,\r\n                        response_type: 'getItem',\r\n                        data: sessionStorage.getItem(event.data.key),\r\n                    }, '*');\r\n                    break;\r\n                case 'setItem':\r\n                    sessionStorage.setItem(event.data.key, event.data.value);\r\n                    top.postMessage({\r\n                        key: event.data.key,\r\n                        response_type: 'setItem',\r\n                        data: sessionStorage.getItem(event.data.key),\r\n                    }, '*');\r\n                    break;\r\n                case 'removeItem':\r\n                    sessionStorage.removeItem(event.data.key);\r\n                    top.postMessage({\r\n                        key: event.data.key,\r\n                        response_type: 'removeItem',\r\n                        data: true,\r\n                    }, '*');\r\n                    break;\r\n                case 'clear':\r\n                    sessionStorage.clear();\r\n                    top.postMessage({\r\n                        response_type: 'clear',\r\n                        data: true,\r\n                    }, '*');\r\n                    break;\r\n                case 'test':\r\n                    top.postMessage({\r\n                        response_type: 'test',\r\n                        data: true,\r\n                    }, '*');\r\n                    break;\r\n            }\r\n        });\r\n    };\r\n    /** ACCESS CODES **/\r\n    // open connection with source\r\n    // returns a promise which if returns true means connection has been established\r\n    CrossDomainSessionStorage.prototype.open = function (sourceConfig) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.sourceConfig = sourceConfig;\r\n            if (!_this.sourceConfig.src)\r\n                throw 'Cross domain session storage config requires source domain';\r\n            if (!_this.sourceConfig.timeout)\r\n                _this.sourceConfig.timeout = 5000;\r\n            if (!_this.sourceConfig.retry)\r\n                _this.sourceConfig.retry = 5;\r\n            _this.createIframe();\r\n            if (_this.iframe) {\r\n                _this.iframe.onload = function () {\r\n                    _this.postMessage('test')\r\n                        .then(function (data) {\r\n                        if (data) {\r\n                            resolve(true);\r\n                        }\r\n                        else {\r\n                            reject(false);\r\n                        }\r\n                    })\r\n                        .catch(function (error) {\r\n                        reject(error);\r\n                    });\r\n                };\r\n            }\r\n            else {\r\n                reject('failed to create iframe.');\r\n            }\r\n        });\r\n    };\r\n    // create source iframe\r\n    CrossDomainSessionStorage.prototype.createIframe = function () {\r\n        this.iframe = document.getElementsByName('crossDomainSessionStorage')[0];\r\n        if (!this.iframe) {\r\n            this.iframe = document.createElement('iframe');\r\n            this.iframe.setAttribute('src', this.sourceConfig.src);\r\n            this.iframe.name = 'crossDomainSessionStorage';\r\n            this.iframe.style.display = 'none';\r\n            document.body.appendChild(this.iframe);\r\n        }\r\n    };\r\n    // post message\r\n    CrossDomainSessionStorage.prototype.postMessage = function (responseType, data) {\r\n        var _this = this;\r\n        if (data === void 0) { data = {}; }\r\n        return new Promise(function (resolve, reject) {\r\n            var callbackFullfilled = false;\r\n            var callbackCancelled = false;\r\n            var callbackfunction = function (event) {\r\n                if (event.data.response_type === responseType) {\r\n                    window.removeEventListener('message', callbackfunction);\r\n                    callbackFullfilled = true;\r\n                    resolve(event.data);\r\n                }\r\n            };\r\n            // retry canceller\r\n            var latestRetryCallback;\r\n            /* eslint-disable-next-line prefer-const */\r\n            var retryInterval;\r\n            var retryCount = 0;\r\n            var retryFunction = function () {\r\n                if (!callbackFullfilled) {\r\n                    retryCount++;\r\n                    if (latestRetryCallback) {\r\n                        clearInterval(latestRetryCallback);\r\n                    }\r\n                    if (retryCount > _this.sourceConfig.retry) {\r\n                        callbackFullfilled = true;\r\n                        clearInterval(retryInterval);\r\n                        reject('Cross domain session storage failed to create connection with iframe after ' +\r\n                            _this.sourceConfig.retry + ' retry/ies.');\r\n                        return;\r\n                    }\r\n                    if (!callbackCancelled) {\r\n                        window.removeEventListener('message', callbackfunction);\r\n                        callbackCancelled = true;\r\n                    }\r\n                    var retryCallbackfunction_1 = function (event) {\r\n                        if (event.data.response_type === responseType) {\r\n                            window.removeEventListener('message', retryCallbackfunction_1);\r\n                            clearInterval(retryInterval);\r\n                            callbackFullfilled = true;\r\n                            resolve(event.data);\r\n                        }\r\n                    };\r\n                    console.log('Cross domain session storage failed to create connection with iframe, retrying...');\r\n                    latestRetryCallback = retryCallbackfunction_1;\r\n                    window.addEventListener('message', retryCallbackfunction_1);\r\n                    _this.iframe.contentWindow.postMessage(data, '*');\r\n                }\r\n            };\r\n            retryInterval = setInterval(retryFunction, _this.sourceConfig.timeout / _this.sourceConfig.retry);\r\n            window.addEventListener('message', callbackfunction);\r\n            data.action = responseType;\r\n            data.session_storage = true;\r\n            _this.iframe.contentWindow.postMessage(data, '*');\r\n        });\r\n    };\r\n    // get request dispatched to source\r\n    CrossDomainSessionStorage.prototype.getItem = function (key) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.postMessage('getItem', { key: key })\r\n                .then(function (data) {\r\n                resolve(data);\r\n            })\r\n                .catch(function (error) {\r\n                reject(error);\r\n            });\r\n        });\r\n    };\r\n    // set request dispatched to source\r\n    CrossDomainSessionStorage.prototype.setItem = function (key, value) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.postMessage('setItem', { key: key, value: value })\r\n                .then(function (data) {\r\n                resolve(data);\r\n            })\r\n                .catch(function (error) {\r\n                reject(error);\r\n            });\r\n        });\r\n    };\r\n    // remove request dispatched to source\r\n    CrossDomainSessionStorage.prototype.removeItem = function (key) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.postMessage('removeItem', { key: key })\r\n                .then(function (data) {\r\n                resolve(data);\r\n            })\r\n                .catch(function (error) {\r\n                reject(error);\r\n            });\r\n        });\r\n    };\r\n    // clear request dispatched to source\r\n    CrossDomainSessionStorage.prototype.clear = function () {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.postMessage('clear')\r\n                .then(function (data) {\r\n                resolve(data);\r\n            })\r\n                .catch(function (error) {\r\n                reject(error);\r\n            });\r\n        });\r\n    };\r\n    return CrossDomainSessionStorage;\r\n}());\r\nexports.CrossDomainSessionStorage = CrossDomainSessionStorage;\r\n\n\n//# sourceURL=webpack://CrossDomainSessionStorage/./src/cross-domain-session-storage.ts?");

/***/ })

/******/ });