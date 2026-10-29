var DriHTTPCookieClient =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/http-cookie-client.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/http-cookie-client.ts":
/*!***********************************!*\
  !*** ./src/http-cookie-client.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n * HTTPCookieClient\r\n * @author Brandon Keith Watanabe <brandonkeith.w@digitalroominc.com>\r\n *\r\n * This class contains common methods for override\r\n * of Cross domain local storage or the cross-storage-client third party library methods\r\n * to use cookie instead of local storage\r\n *\r\n * @constructor\r\n */\r\nvar HTTPCookieClient = /** @class */ (function () {\r\n    function HTTPCookieClient(config) {\r\n        if (config === void 0) { config = {}; }\r\n        var defaults = {\r\n            cookieDomain: null,\r\n            cookieAPI: null,\r\n        };\r\n        // Create model by extending defaults with the passed values in arguments\r\n        if (config && typeof config === \"object\") {\r\n            this.model = this.extendDefaults(defaults, config);\r\n            var date = new Date();\r\n            date.setTime(date.getTime() + 14 * 24 * 60 * 60 * 1000); //2 weeks\r\n            this.cookieExpiryDate = date.toUTCString();\r\n            this.cookieDomain = this.model.cookieDomain;\r\n            this.cookieAPI = this.model.cookieAPI;\r\n        }\r\n    }\r\n    HTTPCookieClient.prototype.onConnect = function (config) {\r\n        return new Promise(function (resolve, reject) {\r\n            return resolve();\r\n        });\r\n    };\r\n    HTTPCookieClient.prototype.set = function (cookie_type, value) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            var Http = new XMLHttpRequest();\r\n            Http.open(\"POST\", _this.cookieAPI);\r\n            Http.setRequestHeader(\"Content-Type\", \"application/json\");\r\n            Http.withCredentials = true;\r\n            Http.onload = function () {\r\n                if (Http.readyState === 4 && Http.status === 200) {\r\n                    resolve(JSON.parse(this.responseText));\r\n                }\r\n                else {\r\n                    reject(Error(Http.statusText));\r\n                }\r\n            };\r\n            // Handle network errors\r\n            Http.onerror = function () {\r\n                reject(Error(\"Network Error\"));\r\n            };\r\n            // Make the request\r\n            Http.send(JSON.stringify({ key: cookie_type, value: value, expiryDate: _this.cookieExpiryDate }));\r\n        });\r\n    };\r\n    HTTPCookieClient.prototype.get = function (cookie_type, value) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            var Http = new XMLHttpRequest();\r\n            Http.open(\"GET\", _this.cookieAPI + \"/\" + cookie_type);\r\n            Http.setRequestHeader(\"Content-Type\", \"application/json\");\r\n            Http.withCredentials = true;\r\n            Http.onload = function () {\r\n                if (Http.readyState === 4 && Http.status === 200) {\r\n                    var value_1 = JSON.parse(Http.response);\r\n                    resolve(value_1[cookie_type]);\r\n                }\r\n                else {\r\n                    reject(Error(Http.statusText));\r\n                }\r\n            };\r\n            // Handle network errors\r\n            Http.onerror = function () {\r\n                reject(Error(\"Network Error\"));\r\n            };\r\n            // Make the request\r\n            Http.send(JSON.stringify({ key: cookie_type }));\r\n        });\r\n    };\r\n    HTTPCookieClient.prototype.del = function (cookie_type, value) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            var Http = new XMLHttpRequest();\r\n            Http.open(\"DELETE\", _this.cookieAPI + \"/\" + cookie_type);\r\n            Http.setRequestHeader(\"Content-Type\", \"application/json\");\r\n            Http.withCredentials = true;\r\n            Http.onload = function () {\r\n                if (Http.readyState === 4 && Http.status === 200) {\r\n                    resolve(JSON.parse(this.responseText));\r\n                }\r\n                else {\r\n                    reject(Error(Http.statusText));\r\n                }\r\n            };\r\n            // Handle network errors\r\n            Http.onerror = function () {\r\n                reject(Error(\"Network Error\"));\r\n            };\r\n            // Make the request\r\n            Http.send(JSON.stringify({ key: cookie_type }));\r\n        });\r\n    };\r\n    HTTPCookieClient.prototype.setExpiration = function (expiration) {\r\n        this.cookieExpiryDate = expiration;\r\n    };\r\n    // Utility method to extend defaults with user passed data\r\n    HTTPCookieClient.prototype.extendDefaults = function (source, properties) {\r\n        var property;\r\n        for (property in properties) {\r\n            if (properties.hasOwnProperty(property)) {\r\n                source[property] = properties[property];\r\n            }\r\n        }\r\n        return source;\r\n    };\r\n    return HTTPCookieClient;\r\n}());\r\nexports.HTTPCookieClient = HTTPCookieClient;\r\n\n\n//# sourceURL=webpack://DriHTTPCookieClient/./src/http-cookie-client.ts?");

/***/ })

/******/ });