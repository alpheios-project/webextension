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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_uuid_v4__);


class Message {
  constructor (body) {
    /** @member {Symbol} requestType - */
    this.role = undefined
    this.type = Message.types.GENERIC_MESSAGE
    this.ID = __WEBPACK_IMPORTED_MODULE_0_uuid_v4___default()()
    this.body = body
  }

  static get types () {
    return {
      GENERIC_MESSAGE: Symbol.for('Alpheios_GenericMessage'),
      STATE_MESSAGE: Symbol.for('Alpheios_StateMessage'),
      STATE_REQUEST: Symbol.for('Alpheios_StateRequest'),
      STATE_RESPONSE: Symbol.for('Alpheios_StateResponse'),
      ACTIVATION_REQUEST: Symbol.for('Alpheios_ActivateRequest'),
      DEACTIVATION_REQUEST: Symbol.for('Alpheios_DeactivateRequest'),
      OPEN_PANEL_REQUEST: Symbol.for('Alpheios_OpenPanelRequest'),
      PANEL_STATUS_CHANGE_REQUEST: Symbol.for('Alpheios_PanelStatusChangeRequest')
    }
  }

  static get roles () {
    return {
      REQUEST: Symbol.for('Alpheios_Request'),
      RESPONSE: Symbol.for('Alpheios_Response')
    }
  }

  static get statuses () {
    return {
      DATA_FOUND: Symbol.for('Alpheios_DataFound'), // Requested word's data has been found
      NO_DATA_FOUND: Symbol.for('Alpheios_NoDataFound'), // Requested word's data has not been found,
      ACTIVE: Symbol.for('Alpheios_Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Alpheios_Deactivated') // Content script has been loaded, but is deactivated
    }
  }

  static statusSym (message) {
    return Symbol.for(message.status)
  }

  static statusSymIs (message, status) {
    return Message.statusSym(message) === status
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Message;



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports.extend = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.hop = hop;

//# sourceMappingURL=utils.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Contains a state of a tab content script.
 * @property {Number} tabID - An ID of a tab where the content script is loaded
 * @property {Symbol} status - A status of a current script (Active, Deactivated, Pending)
 * @property {panelStatus} panelStatus
 */
class TabScript {
  constructor (tabID) {
    this.tabID = tabID
    this.status = undefined
    this.panelStatus = undefined
    this.tab = undefined

    this.watchers = new Map()
  }

  static get propTypes () {
    return {
      NUMERIC: Symbol('Numeric'),
      STRING: Symbol('String'),
      SYMBOL: Symbol('Symbol')
    }
  }

  static get props () {
    return {
      status: {
        name: 'status',
        valueType: TabScript.propTypes.SYMBOL,
        values: {
          PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
          ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
          DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated') // Content script has been loaded, but is deactivated
        },
        defaultValueIndex: 0
      },
      panelStatus: {
        name: 'panelStatus',
        valueType: TabScript.propTypes.SYMBOL,
        values: {
          OPEN: Symbol.for('Alpheios_Status_PanelOpen'), // Panel is open
          CLOSED: Symbol.for('Alpheios_Status_PanelClosed') // Panel is closed
        },
        defaultValueIndex: 1
      },
      tab: {
        name: 'tab',
        valueType: TabScript.propTypes.STRING,
        values: {
          INFO: 'info'
        },
        defaultValueIndex: 0
      }
    }
  }

  static get symbolProps () {
    return [TabScript.props.status.name, TabScript.props.panelStatus.name]
  }

  static get stringProps () {
    return [TabScript.props.tab.name]
  }

  /**
   * Only certain features will be stored within a serialized version of a TabScript. This is done
   * to prevent context-specific features (such as local event handlers) to be passed over the network
   * to a different context where they would make no sense. This getter returns a list of such fields.
   * @return {String[]}
   */
  static get dataProps () {
    return TabScript.symbolProps.concat(TabScript.stringProps)
  }

  /**
   * A copy constructor.
   * @param {TabScript} source - An instance of TabScript object we need to copy.
   * @return {TabScript} A copy of a source object.
   */
  static create (source) {
    let copy = new TabScript()
    for (let key of Object.keys(source)) {
      copy[key] = source[key]
    }
    return copy
  }

  static get defaults () {
    return {
      status: TabScript.statuses.script.ACTIVE,
      panelStatus: TabScript.statuses.panel.OPEN
    }
  }

  static get statuses () {
    return {
      script: {
        PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
        ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
        DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated') // Content script has been loaded, but is deactivated
      },
      panel: {
        OPEN: Symbol.for('Alpheios_Status_PanelOpen'), // Panel is open
        CLOSED: Symbol.for('Alpheios_Status_PanelClosed') // Panel is closed
      }
    }
  }

  /**
   * Sets a watcher function that is called every time a property is changed using a setItem() method.
   * @param {String} property - A name of a property that should be monitored
   * @param {Function} watchFunc - A function that will be called every time a property changes
   * @return {TabScript} Reference to self for chaining
   */
  setWatcher (property, watchFunc) {
    this.watchers.set(property, watchFunc)
    return this
  }

  /**
   * SetItem provides a monitored way to change a TabScript state. If value is assigned to a data property directly
   * there is no way to know if a property was changed. However, if a property was changed using setItem() method,
   * and if there is a watcher function registered for a changed property name,
   * this function will be called on every property change, passing a changed property name as an argument.
   * @param key
   * @param value
   * @return {TabScript}
   */
  setItem (key, value) {
    this[key] = value
    if (this.watchers && this.watchers.has(key)) {
      this.watchers.get(key)(key, this)
    }
    return this
  }

  isPanelOpen () {
    return this.panelStatus === TabScript.statuses.panel.OPEN
  }

  isPanelClosed () {
    return this.panelStatus === TabScript.statuses.panel.CLOSED
  }

  setPanelOpen () {
    this.setItem('panelStatus', TabScript.statuses.panel.OPEN)
    return this
  }

  setPanelClosed () {
    this.setItem('panelStatus', TabScript.statuses.panel.CLOSED)
    return this
  }

  hasSameID (tabID) {
    return this.tabID === tabID
  }

  isActive () {
    return this.status === TabScript.statuses.script.ACTIVE
  }

  isDeactivated () {
    return this.status === TabScript.statuses.script.DEACTIVATED
  }

  activate () {
    this.status = TabScript.statuses.script.ACTIVE
    return this
  }

  deactivate () {
    this.status = TabScript.statuses.script.DEACTIVATED
    return this
  }

  changeTab (tabName) {
    this.setItem(TabScript.props.tab.name, tabName)
    return this
  }

  update (source) {
    for (let key of Object.keys(source)) {
      this[key] = source[key]
    }
    return this
  }

  diff (state) {
    let diff = {
      _changedKeys: [],
      _changedEntries: []
    }

    // Check if there are any differences in tab IDs
    if (this.tabID !== state.tabID) {
      diff.tabID = state.tabID
      diff['_changedKeys'].push('tabID')
      diff['_changedEntries'].push(['tabID', state.tabID])
    }

    for (let key of Object.keys(state)) {
      // Build diffs only for data properties
      if (TabScript.dataProps.includes(key)) {
        if (this.hasOwnProperty(key)) {
          if (this[key] !== state[key]) {
            diff[key] = state[key]
            diff['_changedKeys'].push(key)
            diff['_changedEntries'].push([key, state[key]])
          }
        } else {
          console.warn(`TabScript has no property named "${key}"`)
        }
      }
    }

    diff.keys = function () {
      return diff['_changedKeys']
    }

    diff.entries = function () {
      return diff['_changedEntries']
    }

    diff.has = function (prop) {
      return diff._changedKeys.includes(prop)
    }

    diff.isEmpty = function () {
      return !diff._changedKeys.length
    }
    return diff
  }

  /**
   * Creates a serializable copy of a source object. Firefox uses the structured clone algorithm
   * (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) to serialize objects.
   * Requirements of this algorithm are that a serializable object to have no Function or Error properties,
   * neither any DOM Nodes. That's why an empty serializable object is created and only
   * selected properties are copied into it.
   * @param {TabScript} source - An object to be serialized.
   * @return {Object} A serializable copy of a source.
   */
  static serializable (source) {
    let serializable = {}
    serializable.tabID = source.tabID
    for (let key of Object.keys(source)) {
      if (TabScript.dataProps.includes(key)) {
        /*
        Only certain features will be stored within a serialized version of a TabScript. This is done
        to prevent context-specific features (such as local event handlers) to be passed over the network
        to a different context where they would make no sense.
         */
        let value = source[key]
        serializable[key] = (typeof value === 'symbol') ? Symbol.keyFor(value) : value
      }
    }
    return serializable
  }

  static readObject (jsonObject) {
    let tabScript = new TabScript(jsonObject.tabID)

    for (let prop of TabScript.symbolProps) {
      if (jsonObject.hasOwnProperty(prop)) { tabScript[prop] = Symbol.for(jsonObject[prop]) }
    }

    for (let prop of TabScript.stringProps) {
      if (jsonObject.hasOwnProperty(prop)) { tabScript[prop] = jsonObject[prop] }
    }

    return tabScript
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TabScript;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * A base object class for an Experience object.
 */
class Experience {
  constructor (description) {
    this.description = description;
    this.startTime = undefined;
    this.endTime = undefined;
    this.details = [];
  }

  static readObject (jsonObject) {
    let experience = new Experience(jsonObject.description);
    if (jsonObject.startTime) { experience.startTime = jsonObject.startTime; }
    if (jsonObject.endTime) { experience.endTime = jsonObject.endTime; }
    for (let detailsItem of jsonObject.details) {
      experience.details.push(Experience.readObject(detailsItem));
    }
    return experience
  }

  attach (experience) {
    this.details.push(experience);
  }

  start () {
    this.startTime = new Date().getTime();
    return this
  }

  complete () {
    this.endTime = new Date().getTime();
    return this
  }

  get duration () {
    return this.endTime - this.startTime
  }

  toString () {
    return `"${this.description}" experience duration is ${this.duration} ms`
  }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = commonjsGlobal.crypto || commonjsGlobal.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

var rngBrowser = rng;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rngBrowser)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

/* global browser */

/**
 * Represents an adapter for a local storage where experiences are accumulated before a batch of
 * experiences is sent to a remote server and is removed from a local storage.
 * Currently a `browser.storage.local` local storage is used.
 */
class LocalStorageAdapter {
  /**
   * Returns an adapter default values
   * @return {{prefix: string}}
   */
  static get defaults () {
    return {
      // A prefix used to distinguish experience objects from objects of other types
      prefix: 'experience_'
    }
  }

  /**
   * Stores a single experience to the local storage.
   * @param {Experience} experience - An experience object to be saved.
   */
  static write (experience) {
    // Keys of experience objects has an `experience_` prefix to distinguish them from objects of other types.
    let uuid = `${LocalStorageAdapter.defaults.prefix}${v4_1()}`;

    browser.storage.local.set({[uuid]: experience}).then(
      () => {
        console.log(`Experience has been written to the local storage successfully`);
      },
      (error) => {
        console.error(`Cannot write experience to the local storage because of the following error: ${error}`);
      }
    );
  }

  /**
   * Reads all experiences that are present in a local storage.
   * @return {Promise.<{key: Experience}, Error>} Returns a promise that resolves with an object
   * containing key: value pairs for each experience stored and rejects with an Error object.
   */
  static async readAll () {
    try {
      return await browser.storage.local.get()
    } catch (error) {
      console.error(`Cannot read data from the local storage because of the following error: ${error}`);
      return error
    }
  }

  /**
   * Removes experience objects with specified keys from a local storage.
   * @param {String[]} keys - an array of keys that specifies what Experience objects need to be removed.
   * @return {Promise.<*|{minArgs, maxArgs}>} A Promise that will be fulfilled with no arguments
   * if the operation succeeded. If the operation failed, the promise will be rejected with an error message.
   */
  static async remove (keys) {
    return browser.storage.local.remove(keys)
  }
}

class Monitor {
  constructor (monitoringDataList) {
    this.monitored = new Map();
    if (monitoringDataList) {
      for (let monitoringData of monitoringDataList) {
        this.monitored.set(monitoringData.monitoredFunction, monitoringData);
      }
    }
  }

  static track (object, monitoringDataList) {
    return new Proxy(object, new Monitor(monitoringDataList))
  }

  get (target, property, receiver) {
    if (this.monitored.has(property)) {
      let monitoringData = this.monitored.get(property);
      if (monitoringData.hasOwnProperty('asyncWrapper')) {
        return Monitor.asyncWrapper.call(this, target, property, monitoringData.asyncWrapper, monitoringData)
      } else {
        console.error(`Only async wrappers are supported by monitor`);
      }
    }
    return target[property]
  }

  monitor (functionName, functionConfig) {
    this.monitored.set(functionName, functionConfig);
  }

  static syncWrapper (target, property, experience) {
    console.log(`${property}() sync method has been called`);
    const origMethod = target[property];
    return function (...args) {
      let result = origMethod.apply(this, args);
      console.log(`${property}() sync method has been completed`);
      experience.complete();
      console.log(`${experience}`);
      return result
    }
  }

  /**
   * A wrapper around asynchronous functions that create new experience. A wrapped function is called
   * as a direct result of a user action: use of UI controls, etc.
   * @param target
   * @param property
   * @param actionFunction
   * @param monitoringData
   * @return {Function}
   */
  static asyncWrapper (target, property, actionFunction, monitoringData) {
    console.log(`${property}() async method has been requested`);
    return async function (...args) {
      try {
        return await actionFunction(this, target, property, args, monitoringData, LocalStorageAdapter)
      } catch (error) {
        console.error(`${property}() failed: ${error.value}`);
        throw error
      }
    }
  }

  /**
   * A wrapper around asynchronous functions that create new experience. A wrapped function is called
   * as a direct result of a user action: use of UI controls, and such.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @param monitoringData
   * @param storage
   * @return {Promise.<*>}
   */
  static async recordExperience (monitor, target, property, args, monitoringData, storage) {
    let experience = new Experience(monitoringData.experience);
    console.log(`${property}() async method has been called`);
    // Last item in arguments list is a transaction
    args.push(experience);
    let result = await target[property].apply(monitor, args);
    // resultObject.value is a returned message, experience object is in a `experience` property
    experience = result.state;
    experience.complete();
    console.log(`${property}() completed with success, experience is:`, experience);

    storage.write(experience);
    return result
  }

  /**
   * A wrapper around functions that are indirect result of user actions. Those functions are usually a part of
   * functions that create user experience.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @param monitoringData
   * @return {Promise.<*>}
   */
  static async recordExperienceDetails (monitor, target, property, args, monitoringData) {
    let experience = new Experience(monitoringData.experience);
    console.log(`${property}() async method has been called`);
    let resultObject = await target[property].apply(monitor, args);
    experience.complete();
    resultObject.state.attach(experience);
    console.log(`${property}() completed with success, experience is: ${experience}`);
    return resultObject
  }

  /**
   * This is a wrapper around functions that handle outgoing messages that should have an experience object attached
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @return {Promise.<*>}
   */
  static async attachToMessage (monitor, target, property, args) {
    console.log(`${property}() async method has been called`);
    // First argument is always a request object, last argument is a state (Experience) object
    args[0].experience = args[args.length - 1];
    let result = await target[property].apply(monitor, args);
    console.log(`${property}() completed with success`);
    return result
  }

  /**
   * This is a wrapper around functions that handle incoming messages with an experience object attached.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @return {Promise.<*>}
   */
  static async detachFromMessage (monitor, target, property, args) {
    console.log(`${property}() async method has been called`);
    // First argument is an incoming request object
    if (args[0].experience) {
      args.push(Experience.readObject(args[0].experience));
    } else {
      console.warn(`This message has no experience data attached. Experience data will not be recorded`);
    }
    let result = await target[property].apply(monitor, args);
    console.log(`${property}() completed with success`);
    return result
  }
}

const experienceActions = {
  START: Symbol('Experience start'),
  STOP: Symbol('Experience stop')
};

const eventTypes = {
  CONSTRUCT: Symbol('Construct'),
  GET: Symbol('Get'),
  SET: Symbol('Set')
};

class ObjectMonitor {
  constructor (options = {}) {
    this.experienceDescription = '';
    for (let event of Object.values(ObjectMonitor.events)) {
      this[event] = [];
    }

    if (options) {
      if (options.experience) { this.experienceDescription = options.experience; }
      if (options.actions) {
        for (const action of options.actions) {
          this[action.event].push(action);
        }
      }
    }
  }

  static get actions () {
    return experienceActions
  }

  static get events () {
    return eventTypes
  }

  static track (object, options) {
    return new Proxy(object, new ObjectMonitor(options))
  }

  get (target, property) {
    for (let action of this[ObjectMonitor.events.GET]) {
      if (action.name === property) { this.experienceAction(action); }
    }
    return target[property]
  }

  set (target, property, value) {
    for (let action of this[ObjectMonitor.events.SET]) {
      if (action.name === property) { this.experienceAction(action); }
    }
    target[property] = value;
    return true // Success of a set operation
  }

  experienceAction (action) {
    if (action.action === ObjectMonitor.actions.START) {
      this.experience = new Experience(this.experienceDescription).start();
      console.log(`Experience started`);
    } else if (action.action === ObjectMonitor.actions.STOP) {
      this.experience.complete();
      console.log(`Experience completed:`, this.experience);
      LocalStorageAdapter.write(this.experience);
    }
  }
}

/**
 * Responsible form transporting experiences from one storage to the other. Current implementation
 * sends a batch of experience objects to the remote server once a certain amount of them
 * is accumulated in a local storage.
 */
class Transporter {
  /**
   * Sets a transporter configuration.
   * @param {LocalStorageAdapter} localStorage - Represents local storage where experience objects are
   * accumulated before being sent to a remote server.
   * @param {RemoteStorageAdapter} remoteStorage - Represents a remote server that stores experience objects.
   * @param {number} qtyThreshold - A minimal number of experiences to be sent to a remote storage.
   * @param {number} interval - Interval, in milliseconds, of checking a local storage for changes
   */
  constructor (localStorage, remoteStorage, qtyThreshold, interval) {
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
    this.qtyThreshold = qtyThreshold;
    window.setInterval(this.checkExperienceStorage.bind(this), interval);
  }

  /**
   * Runs at a specified interval and check if any new experience objects has been recorded to the local storage.
   * If number of experience records exceeds a threshold, sends all experiences to the remote server and
   * removes them from local storage.
   * @return {Promise.<void>}
   */
  async checkExperienceStorage () {
    console.log(`Experience storage check`);
    let records = await this.localStorage.readAll();
    let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0);
    if (keys.length > this.qtyThreshold) {
      await this.sendExperiencesToRemote();
    }
  }

  /**
   * If there are any experiences in the local storage, sends all of them to a remote server and, if succeeded,
   * removes them from a local storage.
   * @return {Promise.<*>}
   */
  async sendExperiencesToRemote () {
    try {
      let records = await this.localStorage.readAll();
      let values = Object.values(records);
      let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0);
      if (keys.length > 0) {
        // If there are any records in a local storage
        await this.remoteStorage.write(values);
        await this.localStorage.remove(keys);
      } else {
        console.log(`No data in local experience storage`);
      }
    } catch (error) {
      console.error(`Cannot send experiences to a remote server: ${error}`);
      return error
    }
  }
}

/**
 * Defines an API for storing experiences on a remote server, such as LRS.
 */
class RemoteStorageAdapter {
  /**
   * Stores one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    console.warn(`This method should be implemented within a subclass and should never be called directly.  
      If you see this message then something is probably goes wrong`);
    return new Promise()
  }
}

/**
 * This is a test implementation of a remote experience store adapter. It does not send anything anywhere
 * and just records experiences that are passed to it.
 */
class TestAdapter extends RemoteStorageAdapter {
  /**
   * Imitates storing of one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    return new Promise((resolve, reject) => {
      if (!experiences) {
        reject(new Error(`experience cannot be empty`));
        return
      }
      if (!Array.isArray(experiences)) {
        reject(new Error(`experiences must be an array`));
        return
      }
      console.log('Experience sent to a remote server:');
      for (let experience of experiences) {
        console.log(experience);
      }
      resolve();
    })
  }
}

exports.Experience = Experience;
exports.Monitor = Monitor;
exports.ObjectMonitor = ObjectMonitor;
exports.Transporter = Transporter;
exports.StorageAdapter = LocalStorageAdapter;
exports.TestAdapter = TestAdapter;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_browser__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__background_process__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_alpheios_experience___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_alpheios_experience__);




// Detect browser features
let browserFeatures = new __WEBPACK_IMPORTED_MODULE_0__lib_browser__["a" /* default */]().inspect().getFeatures()
console.log(`Support of a "browser" namespace: ${browserFeatures.browserNamespace}`)
if (!browserFeatures.browserNamespace) {
  console.log('"browser" namespace is not supported, will load a WebExtensions polyfill into the background script')
  window.browser = __webpack_require__(32)
}

let monitoredBackgroundProcess = __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].track(
  new __WEBPACK_IMPORTED_MODULE_1__background_process__["a" /* default */](browserFeatures),
  [
    {
      monitoredFunction: 'getHomonymStatefully',
      experience: 'Get homonym from a morphological analyzer',
      asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].recordExperienceDetails
    },
    {
      monitoredFunction: 'handleWordDataRequestStatefully',
      asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].detachFromMessage
    },
    {
      monitoredFunction: 'sendResponseToTabStatefully',
      asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].attachToMessage
    }
  ]
)
monitoredBackgroundProcess.initialize()


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Browser {
  constructor () {
    this.browserNamespace = undefined
  }

  inspect () {
    this.browserNamespace = !(typeof browser === 'undefined')
    return this
  }

  getFeatures () {
    return {
      browserNamespace: this.browserNamespace
    }
  }

  supportsBrowserNamespace () {
    if (!this.browserNamespace) { this.inspect() }
    return this.browserNamespace
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Browser;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locales_en_us_messages_json__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locales_en_us_messages_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__locales_en_us_messages_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locales_en_gb_messages__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locales_en_gb_messages___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__locales_en_gb_messages__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__locales_locales__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_l10n_l10n__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_messaging_message_message_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_messaging_service_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_messaging_request_state_request_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__context_menu_item_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__context_menu_separator_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_alpheios_experience__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_alpheios_experience___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_alpheios_experience__);
/* global browser */











// Use a logger that outputs timestamps (but loses line numbers)
// import Logger from '../lib/logger'
// console.log = Logger.log

class BackgroundProcess {
  constructor (browserFeatures) {
    this.browserFeatures = browserFeatures
    this.settings = BackgroundProcess.defaults

    this.tabs = new Map() // A list of tabs that have content script loaded
    this.tab = undefined // A tab that is currently active in a browser window

    this.messagingService = new __WEBPACK_IMPORTED_MODULE_5__lib_messaging_service_js__["a" /* default */]()
  }

  static get defaults () {
    let l10n = new __WEBPACK_IMPORTED_MODULE_3__lib_l10n_l10n__["a" /* default */]()
      .addMessages(__WEBPACK_IMPORTED_MODULE_0__locales_en_us_messages_json___default.a, __WEBPACK_IMPORTED_MODULE_2__locales_locales__["a" /* default */].en_US)
      .addMessages(__WEBPACK_IMPORTED_MODULE_1__locales_en_gb_messages___default.a, __WEBPACK_IMPORTED_MODULE_2__locales_locales__["a" /* default */].en_GB)
      .setLocale(__WEBPACK_IMPORTED_MODULE_2__locales_locales__["a" /* default */].en_US)
    return {
      activateMenuItemId: 'activate-alpheios-content',
      activateMenuItemText: l10n.messages.LABEL_CTXTMENU_ACTIVATE,
      deactivateMenuItemId: 'deactivate-alpheios-content',
      deactivateMenuItemText: l10n.messages.LABEL_CTXTMENU_DEACTIVATE,
      openPanelMenuItemId: 'open-alpheios-panel',
      openPanelMenuItemText: l10n.messages.LABEL_CTXTMENU_OPENPANEL,
      infoMenuItemId: 'show-alpheios-panel-info',
      infoMenuItemText: l10n.messages.LABEL_CTXTMENU_INFO,
      separatorOneId: 'separator-one',
      sendExperiencesMenuItemId: 'send-experiences',
      sendExperiencesMenuItemText: l10n.messages.LABEL_CTXTMENU_SENDEXP,
      contentCSSFileName: 'styles/style.min.css',
      contentScriptFileName: 'content.js',
      browserPolyfillName: 'support/webextension-polyfill/browser-polyfill.js',
      experienceStorageCheckInterval: 10000,
      experienceStorageThreshold: 3,
      contentScriptLoaded: false
    }
  }

  initialize () {
    console.log('Background script initialization started ...')

    this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_4__lib_messaging_message_message_js__["a" /* default */].types.STATE_MESSAGE, this.stateMessageHandler, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    browser.tabs.onActivated.addListener(this.tabActivationListener.bind(this))
    // browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))
    browser.tabs.onRemoved.addListener(this.tabRemovalListener.bind(this))
    browser.webNavigation.onCompleted.addListener(this.navigationCompletedListener.bind(this))
    browser.runtime.onUpdateAvailable.addListener(this.updateAvailableListener.bind(this))
    browser.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this))

    this.menuItems = {
      activate: new __WEBPACK_IMPORTED_MODULE_7__context_menu_item_js__["a" /* default */](BackgroundProcess.defaults.activateMenuItemId, BackgroundProcess.defaults.activateMenuItemText),
      deactivate: new __WEBPACK_IMPORTED_MODULE_7__context_menu_item_js__["a" /* default */](BackgroundProcess.defaults.deactivateMenuItemId, BackgroundProcess.defaults.deactivateMenuItemText),
      openPanel: new __WEBPACK_IMPORTED_MODULE_7__context_menu_item_js__["a" /* default */](BackgroundProcess.defaults.openPanelMenuItemId, BackgroundProcess.defaults.openPanelMenuItemText),
      separatorOne: new __WEBPACK_IMPORTED_MODULE_8__context_menu_separator_js__["a" /* default */](BackgroundProcess.defaults.separatorOneId),
      info: new __WEBPACK_IMPORTED_MODULE_7__context_menu_item_js__["a" /* default */](BackgroundProcess.defaults.infoMenuItemId, BackgroundProcess.defaults.infoMenuItemText)
    }
    this.menuItems.activate.enable() // This one will be enabled by default

    browser.contextMenus.onClicked.addListener(this.menuListener.bind(this))
    browser.browserAction.onClicked.addListener(this.browserActionListener.bind(this))

    this.transporter = new __WEBPACK_IMPORTED_MODULE_10_alpheios_experience__["Transporter"](__WEBPACK_IMPORTED_MODULE_10_alpheios_experience__["StorageAdapter"], __WEBPACK_IMPORTED_MODULE_10_alpheios_experience__["TestAdapter"],
      BackgroundProcess.defaults.experienceStorageThreshold, BackgroundProcess.defaults.experienceStorageCheckInterval)
  }

  /**
   * handler for the runtime.onInstalled event
   */
  handleOnInstalled(details) {
    // if this is an update versus a fresh install we need to trigger reloads
    // of the previously loaded content scripts. Only tabs with Alpheios loaded
    // will respond to this event. Messaging between the new background script and the
    // old content scripts is broken so we just send a custom event on the body of
    // the page.
    if (details.previousVersion) {
      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((t) => {
          try {
            browser.tabs.executeScript(t.id, {
              code: "document.body.dispatchEvent(new Event('Alpheios_Reload'))"
            })
          } catch (e) {
            // just quietly fail here
          }
        })
      })
    }

  }

  async activateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].create(this.tabs.get(tabID)).activate().setPanelOpen()
    this.setContentState(tab)
  }

  async deactivateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].create(this.tabs.get(tabID)).deactivate().setPanelClosed()
    this.setContentState(tab)
  }

  async openPanel (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].create(this.tabs.get(tabID)).activate().setPanelOpen()
    this.setContentState(tab)
  }

  async openInfoTab (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].create(this.tabs.get(tabID)).activate().setPanelOpen().changeTab('info')
    this.setContentState(tab)
  }

  loadPolyfill (tabID) {
    if (!this.browserFeatures.browserNamespace) {
      console.log('"browser" namespace is not supported, will load a WebExtension polyfill into a content script')
      return browser.tabs.executeScript(
        tabID,
        {
          file: this.settings.browserPolyfillName
        })
    } else {
      // `browser` object is supported natively, no need to load a polyfill.
      return Promise.resolve()
    }
  }

  loadContentScript (tabID) {
    console.log('Loading content script into a content tab')
    return browser.tabs.executeScript(tabID, {
      file: this.settings.contentScriptFileName
    })
  }

  loadContentCSS (tabID) {
    console.log('Loading CSS into a content tab')
    return browser.tabs.insertCSS(tabID, {
      file: this.settings.contentCSSFileName
    })
  }

  /**
   * Creates a TabScript object and loads content script(s) into a corresponding browser tab
   * @param {Number} tabID - An ID of a tab
   * @return {Promise.<TabScript>} A Promise that is resolved into a newly created TabScript object
   */
  async createTab (tabID) {
    console.log(`Creating a new tab with an ID of ${tabID}`)
    let newTab = new __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */](tabID)
    newTab.tab = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].props.tab.values.INFO // Set active tab to `info` by default
    this.tabs.set(tabID, newTab)
    try {
      await this.loadContentData(newTab)
    } catch (error) {
      console.error(`Cannot load content script for a tab with an ID of ${tabID}`)
    }
    return newTab
  }

  /**
   * Changes state of a tab by sending it a state update request. Content script of a tab returns
   * its actual state after request it fulfilled. A warning will be produced if an actual
   * state does not match desired one.
   * @param {TabScript} tab - A TabScript object that represents a tab and it desired state
   */
  setContentState (tab) {
    this.messagingService.sendRequestToTab(new __WEBPACK_IMPORTED_MODULE_6__lib_messaging_request_state_request_js__["a" /* default */](tab), 10000, tab.tabID).then(
      message => {
        let contentState = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].readObject(message.body)
        /*
        ContentState is an actual state content script is in. It may not match a desired state because
        content script may fail in one or several operations.
         */
        let diff = tab.diff(contentState)
        if (!diff.isEmpty()) {
          console.warn(`Content script was not able to update the following properties:`, diff.keys())
        }
        this.updateTabState(tab.tabID, contentState)
      },
      error => {
        console.log(`No status confirmation from tab ${tab.tabID} on state request: ${error.message}`)
      }
    )
  }

  loadContentData (tabScript) {
    let polyfillScript = this.loadPolyfill(tabScript.tabID)
    let contentScript = this.loadContentScript(tabScript.tabID)
    let contentCSS = this.loadContentCSS(tabScript.tabID)
    return Promise.all([polyfillScript, contentScript, contentCSS])
  }

  stateMessageHandler (message, sender) {
    let contentState = __WEBPACK_IMPORTED_MODULE_9__lib_content_tab_script_js__["a" /* default */].readObject(message.body)
    this.updateTabState(contentState.tabID, contentState)
    console.log(this.tabs.get(contentState.tabID))
  }

  tabActivationListener (info) {
    this.tab = info.tabId
    let tab = this.tabs.has(info.tabId) ? this.tabs.get(info.tabId) : undefined
    this.setMenuForTab(tab)
  }

  /**
   * Called when a page is loaded.
   * Use this to listen on webNavigation.onCompleted rather than tabs.onUpdated
   * because you can't tell from the tabs.onUpdated event whether it's the main
   * browser window or an iframe that has been updated.
   * the webNavigation.onCompleted event is the equivalent of domLoaded and you
   * can distinguish iFrames from the main window in the details
   * @param details
   * @return {Promise.<void>}
   */
  async navigationCompletedListener (details) {
    // make sure this is a tab we know about AND that it's not an iframe event
    if (this.tabs.has(details.tabId) && details.frameId === 0) {
      // If content script was loaded to that tab, restore it to the state it had before
      let tab = this.tabs.get(details.tabId)
      try {
        await this.loadContentData(tab)
        this.setContentState(tab)
      } catch (error) {
        console.error(`Cannot load content script for a tab with an ID of ${details.tabId}`)
      }
    }
  }

  /**
   * Listen to extension updates. Need to define to prevent the browser
   * from applying updates and reloading while the extension is activated
   */
  updateAvailableListener (details) {
    console.log(`Update pending to version ${details.version} pending.`)
  }

  tabRemovalListener (tabID, removeInfo) {
    if (this.tabs.has(tabID)) {
      this.tabs.delete(tabID)
    }
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(tab.id)
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(tab.id)
    } else if (info.menuItemId === this.settings.openPanelMenuItemId) {
      this.openPanel(tab.id)
    } else if (info.menuItemId === this.settings.infoMenuItemId) {
      this.openInfoTab(tab.id)
    }
  }

  async browserActionListener (tab) {
    if (this.tabs.has(tab.id) && this.tabs.get(tab.id).isActive()) {
      this.deactivateContent(tab.id)
    } else {
      this.activateContent(tab.id)
    }
  }

  updateTabState (tabID, newState) {
    let tab = this.tabs.get(tabID).update(newState)

    // Menu state should reflect a status of a content script
    this.setMenuForTab(tab)
  }

  setMenuForTab (tab) {
    // Deactivate all previously activated menu items to keep an order intact
    this.menuItems.activate.disable()
    this.menuItems.deactivate.disable()
    this.menuItems.openPanel.disable()
    this.menuItems.separatorOne.disable()
    this.menuItems.info.disable()

    if (tab) {
      // Menu state should reflect a status of a content script
      if (tab.hasOwnProperty('status')) {
        if (tab.isActive()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.enable()
          this.menuItems.openPanel.enable()
        } else if (tab.isDeactivated()) {
          this.menuItems.deactivate.disable()
          this.menuItems.activate.enable()
          this.menuItems.openPanel.disable()
        }
      }

      if (tab.hasOwnProperty('panelStatus')) {
        if (tab.isActive() && tab.isPanelClosed()) {
          this.menuItems.openPanel.enable()
        } else {
          this.menuItems.openPanel.disable()
        }
      }

      this.menuItems.separatorOne.enable()
      this.menuItems.info.enable()
    } else {
      // If tab is not provided will set menu do an initial state
      this.menuItems.activate.enable()
      this.menuItems.deactivate.disable()
      this.menuItems.openPanel.disable()
      this.menuItems.separatorOne.enable()
      this.menuItems.info.enable()
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BackgroundProcess;



/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "{\n  \"COOKIE_TEST_MESSAGE\": {\n    \"message\": \"This is a test message about a cookie.\",\n    \"description\": \"A test message that is shown in a panel\",\n    \"component\": \"Panel\"\n  },\n  \"NUM_LINES_TEST_MESSAGE\": {\n    \"message\": \"There {numLines, plural, =0 {are no lines} =1 {is one line} other {are # lines}}.\",\n    \"description\": \"A test message that is shown in a panel\",\n    \"component\": \"Panel\",\n    \"params\": [\"numLines\"]\n  },\n  \"TOOLTIP_MOVE_PANEL_LEFT\": {\n    \"message\": \"Move Panel to Left\",\n    \"description\": \"tooltip for moving the panel to the left\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_MOVE_PANEL_RIGHT\": {\n    \"message\": \"Move Panel to Right\",\n    \"description\": \"tooltip for moving the panel to the right\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_CLOSE_PANEL\": {\n    \"message\": \"Close Panel\",\n    \"description\": \"tooltip for closing the panel\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_HELP\": {\n    \"message\": \"Help\",\n    \"description\": \"tooltip for help tab\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_INFLECT\": {\n    \"message\": \"Inflection Tables\",\n    \"description\": \"tooltip for inflections tab\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_DEFINITIONS\": {\n    \"message\": \"Definitions\",\n    \"description\": \"tooltip for definitions tab\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_GRAMMAR\": {\n    \"message\": \"Grammar\",\n    \"description\": \"tooltip for grammar tab\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_OPTIONS\": {\n    \"message\": \"Options\",\n    \"description\": \"tooltip for settings tab\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_STATUS\": {\n    \"message\": \"Status Messages\",\n    \"description\": \"tooltip for status tab\",\n    \"component\": \"Panel\"\n  },\n  \"PLACEHOLDER_DEFINITIONS\":  {\n    \"message\": \"Lookup a word to show definitions...\",\n    \"description\": \"placeholder for definitions panel\",\n    \"component\": \"Panel\"\n  },\n  \"PLACEHOLDER_INFLECT\":  {\n    \"message\": \"Lookup a word to show inflections...\",\n    \"description\": \"placeholder for inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"PLACEHOLDER_INFLECT_UNAVAILABLE\":  {\n    \"message\": \"Inflection data is unavailable\",\n    \"description\": \"placeholder for inflections panel if unavailable\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFLECT_SELECT_POFS\":  {\n    \"message\": \"Part of speech:\",\n    \"description\": \"label for part of speech selector on inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFLECT_SHOWFULL\": {\n    \"message\": \"Full Table\",\n    \"description\": \"label for show full table button on inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFLECT_COLLAPSE\": {\n    \"message\": \"Collapse\",\n    \"description\": \"label for collapse table button on inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFLECT_HIDEEMPTY\": {\n    \"message\": \"Hide empty columns\",\n    \"description\": \"label for hide empty columns button on inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFLECT_SHOWEMPTY\": {\n    \"message\": \"Show empty columns\",\n    \"description\": \"label for show empty columns button on inflections panel\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_GETTINGSTARTED\": {\n    \"message\": \"Getting Started\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_GETTINGSTARTED\": {\n    \"message\": \"Getting Started\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_ACTIVATE\": {\n    \"message\": \"Activate on a page with Latin, Ancient Greek, Arabic or Persian text.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_CLICK\": {\n    \"message\": \"Double-click on a word to retrieve morphology and short definitions.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_LANGDETECT\": {\n    \"message\": \"Alpheios will try to detect the language of the word from the page markup. If it cannot it will use the default language.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"LABEL_INFO_CURRENTLANGUAGE\": {\n    \"message\": \"Current language:\",\n    \"description\": \"label for current language in info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_SETTINGS\": {\n    \"message\": \"Click the Settings wheel to change the default language, default dictionaries or to disable the popup (set UI Type to 'panel').\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_ARROW\": {\n    \"message\": \"Use the arrow at the top of this panel to move it from the right to left of your browser window.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_REOPEN\": {\n    \"message\": \"You can reopen this panel at any time by selecting 'Info' from the Alpheios Reading Tools option in your browser's context menu.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TEXT_INFO_DEACTIVATE\": {\n    \"message\": \"Deactivate Alpheios by clicking the toolbar icon or choosing 'Deactivate' from the Alpheios Reading Tools option in your browser's context menu.\",\n    \"description\": \"info text\",\n    \"component\": \"Panel\"\n  },\n  \"TOOLTIP_POPUP_CLOSE\": {\n    \"message\": \"Close Popup\",\n    \"description\": \"tooltip for closing the popup\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_INFLECT\": {\n    \"message\": \"Inflect\",\n    \"description\": \"label for inflect button on popup\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_OPTIONS\": {\n    \"message\": \"Options\",\n    \"description\": \"label for options button on popup\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_DEFINE\": {\n    \"message\": \"Define\",\n    \"description\": \"label for define button on popup\",\n    \"component\": \"Popup\"\n  },\n  \"PLACEHOLDER_POPUP_DATA\": {\n    \"message\": \"No lexical data is available yet\",\n    \"description\": \"placeholder text for popup data\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_CREDITS\": {\n    \"message\": \"Credits:\",\n    \"description\": \"label for credits on popup\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_SHOWCREDITS\": {\n    \"message\": \"Credits\",\n    \"description\": \"label for show credits link on popup\",\n    \"component\": \"Popup\"\n  },\n  \"LABEL_POPUP_HIDECREDITS\": {\n    \"message\": \"Hide Credits\",\n    \"description\": \"label for hide credits link on popup\",\n    \"component\": \"Popup\"\n  },\n  \"TEXT_NOTICE_CHANGE_LANGUAGE\": {\n    \"message\": \"Language: {languageName}<br>Wrong? Change to:\",\n    \"description\": \"language notification\",\n    \"component\": \"UI\",\n    \"params\": [\"languageName\"]\n  },\n  \"TEXT_NOTICE_LANGUAGE_UNKNOWN\": {\n    \"message\": \"unknown\",\n    \"description\": \"unknown language notification\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_GRAMMAR_NOTFOUND\": {\n    \"message\": \"The requested grammar resource is not currently available\",\n    \"description\": \"grammar not found notification\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_MORPHDATA_READY\": {\n    \"message\": \"Morphological analyzer data is ready\",\n    \"description\": \"morph data ready notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_MORPHDATA_NOTFOUND\": {\n    \"message\": \"Morphological data not found. Definition queries pending.\",\n    \"description\": \"morph data not found notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_INFLDATA_READY\": {\n    \"message\": \"Inflection data is ready\",\n    \"description\": \"inflection data ready notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_DEFSDATA_READY\": {\n    \"message\":\"{requestType} request is completed successfully. Lemma: \\\"{lemma}\\\"\",\n    \"description\": \"definition request success notice\",\n    \"component\": \"UI\",\n    \"params\": [\"requestType\",\"lemma\"]\n  },\n  \"TEXT_NOTICE_DEFSDATA_NOTFOUND\": {\n    \"message\":\"{requestType} request failed. Lemma not found for: \\\"{word}\\\"\",\n    \"description\": \"definition request success notice\",\n    \"component\": \"UI\",\n    \"params\": [\"requestType\",\"word\"]\n  },\n  \"TEXT_NOTICE_LEXQUERY_COMPLETE\": {\n    \"message\": \"All lexical queries complete.\",\n    \"description\": \"lexical queries complete notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_GRAMMAR_READY\": {\n    \"message\": \"Grammar resource retrieved\",\n    \"description\": \"grammar retrieved notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_GRAMMAR_COMPLETE\": {\n    \"message\": \"All grammar resource data retrieved\",\n    \"description\": \"grammar retrieved notice\",\n    \"component\": \"UI\"\n  },\n  \"TEXT_NOTICE_RESQUERY_COMPLETE\": {\n    \"message\": \"All resource data retrieved\",\n    \"description\": \"resource query complete notice\",\n    \"component\": \"UI\"\n  },\n  \"LABEL_CTXTMENU_DEACTIVATE\": {\n    \"message\": \"Deactivate\",\n    \"description\": \"Deactivate context menu label\",\n    \"component\": \"UI\"\n  },\n  \"LABEL_CTXTMENU_ACTIVATE\": {\n    \"message\": \"Activate\",\n    \"description\": \"Activate context menu label\",\n    \"component\": \"UI\"\n  },\n  \"LABEL_CTXTMENU_OPENPANEL\": {\n    \"message\": \"Open Panel\",\n    \"description\": \"Open Panel context menu label\",\n    \"component\": \"UI\"\n  },\n  \"LABEL_CTXTMENU_INFO\": {\n    \"message\": \"Info\",\n    \"description\": \"Info context menu label\",\n    \"component\": \"UI\"\n  },\n  \"LABEL_CTXTMENU_SENDEXP\": {\n    \"message\": \"Send Experiences to remote server\",\n    \"description\": \"send exp data context menu label\",\n    \"component\": \"UI\"\n  }\n}\n"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "{\n  \"COOKIE_TEST_MESSAGE\": {\n    \"message\": \"This is a test message about a biscuit.\",\n    \"description\": \"A test message that is shown in a panel\",\n    \"component\": \"Panel\"\n  },\n  \"NUM_LINES_TEST_MESSAGE\": {\n    \"message\": \"There {numLines, plural, =0 {are no queues} =1 {is one queue} other {are # queues}}.\",\n    \"description\": \"A test message that is shown in a panel\",\n    \"component\": \"Panel\",\n    \"params\": [\"numLines\"]\n  }\n}"

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  en_US: 'en-US',
  en_GB: 'en-GB'
});


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_bundle__ = __webpack_require__(11);


/**
 * Combines several message bundles for different locales.
 */
class L10n {
  constructor () {
    this.locales = []
    this.bundles = new Map()
    this.messages = {}
    return this
  }

  addMessages (messageJSON, locale) {
    let messageBundle = new __WEBPACK_IMPORTED_MODULE_0__message_bundle__["a" /* default */](messageJSON, locale)
    this.addMessageBundle(messageBundle)
    return this
  }

  /**
   * Adds one or several message bundles.
   * This function is chainable.
   * @param {MessageBundle} messageBundle - A message bundle that will be stored within an L10n object.
   * @return {L10n} - Returns self for chaining.
   */
  addMessageBundle (messageBundle) {
    this.locales.push(messageBundle.locale)
    this.bundles.set(messageBundle.locale, messageBundle)
    return this
  }

  setLocale (locale) {
    this.locale = locale
    const bundle = this.bundles.get(this.locale)
    this.messages = bundle.messages
    return this
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = L10n;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_intl_messageformat__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_intl_messageformat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_intl_messageformat__);


/**
 * Combines messages with the same locale code into a single message bundle.
 */
class MessageBundle {
  /**
   * Creates a message bundle (a list of messages) for a locale.
   * @param {String} messagesJSON - Messages for a locale in a JSON format.
   * @param {string} locale - A locale code for a message group. IETF language tag format is recommended.
   */
  constructor (messagesJSON, locale) {
    if (!locale) {
      throw new Error('Locale data is missing')
    }
    if (!messagesJSON) {
      throw new Error('Message data is missing')
    }

    this._locale = locale
    this.messages = {}
    let jsonObject = JSON.parse(messagesJSON)
    for (const [key, message] of Object.entries(jsonObject)) {
      if (!this.hasOwnProperty(key)) {
        this[key] = message
        this[key].formatFunc = new __WEBPACK_IMPORTED_MODULE_0_intl_messageformat___default.a(message.message, this._locale)

        if (message.params && Array.isArray(message.params) && message.params.length > 0) {
          // This message has parameters
          this.messages[key] = {
            format (options) {
              return message.formatFunc.format(options)
            },
            get (...options) {
              let params = {}
              // TODO: Add checks
              for (let [index, param] of message.params.entries()) {
                params[param] = options[index]
              }
              return message.formatFunc.format(params)
            }
          }
        } else {
          // A message without parameters
          Object.defineProperty(this.messages, key, {
            get () {
              return message.formatFunc.format()
            },
            enumerable: true,
            configurable: true // So it can be deleted
          })
        }
      } else {
        console.warn(`A key name "{key} is reserved. It can not be used as a message key and will be ignored"`)
      }
    }
  }

  /**
   * Returns a (formatted) message for a message ID provided.
   * @param messageID - An ID of a message.
   * @param options - Options that can be used for message formatting in the following format:
   * {
   *     paramOneName: paramOneValue,
   *     paramTwoName: paramTwoValue
   * }.
   * @returns {string} A formatted message. If message not found, returns a message that contains an error text.
   */
  get (messageID, options = undefined) {
    if (this[messageID]) {
      return this[messageID].format(options)
    } else {
      // If message with the ID provided is not in translation data, generate a warning.
      return `Not in translation data: "${messageID}"`
    }
  }

  /**
   * Returns a locale of a current message bundle.
   * @return {string} A locale of this message bundle.
   */
  get locale () {
    return this._locale
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MessageBundle;



/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node:true */



var IntlMessageFormat = __webpack_require__(13)['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
__webpack_require__(20);

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jslint esnext: true */


var src$core$$ = __webpack_require__(14), src$en$$ = __webpack_require__(19);

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];

//# sourceMappingURL=main.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(1), src$es5$$ = __webpack_require__(15), src$compiler$$ = __webpack_require__(16), intl$messageformat$parser$$ = __webpack_require__(17);
exports["default"] = MessageFormat;

// -- MessageFormat --------------------------------------------------------

function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
      try {
        return messageFormat._format(pattern, values);
      } catch (e) {
        if (e.variableId) {
          throw new Error(
            'The intl string context variable \'' + e.variableId + '\'' +
            ' was not provided to the string \'' + message + '\''
          );
        } else {
          throw e;
        }
      }
    };
}

// Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.
src$es5$$.defineProperty(MessageFormat, 'formats', {
    enumerable: true,

    value: {
        number: {
            'currency': {
                style: 'currency'
            },

            'percent': {
                style: 'percent'
            }
        },

        date: {
            'short': {
                month: 'numeric',
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
        locale: this._locale
    };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
    return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value, err;

    for (i = 0, len = pattern.length; i < len; i += 1) {
        part = pattern[i];

        // Exist early for string parts.
        if (typeof part === 'string') {
            result += part;
            continue;
        }

        id = part.id;

        // Enforce that all required values are provided by the caller.
        if (!(values && src$utils$$.hop.call(values, id))) {
          err = new Error('A value must be provided for: ' + id);
          err.variableId = id;
          throw err;
        }

        value = values[id];

        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (part.options) {
            result += this._format(part.getOption(value), values);
        } else {
            result += part.format(value);
        }
    }

    return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type, mergedType;

    for (type in defaults) {
        if (!src$utils$$.hop.call(defaults, type)) { continue; }

        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

        if (formats && src$utils$$.hop.call(formats, type)) {
            src$utils$$.extend(mergedType, formats[type]);
        }
    }

    return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

//# sourceMappingURL=core.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(1);

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (src$utils$$.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate;

//# sourceMappingURL=es5.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports["default"] = Compiler;

function Compiler(locales, formats, pluralFn) {
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
        element = elements[i];

        switch (element.type) {
            case 'messageTextElement':
                pattern.push(this.compileMessageText(element));
                break;

            case 'argumentElement':
                pattern.push(this.compileArgument(element));
                break;

            default:
                throw new Error('Message element does not have a valid type');
        }
    }

    return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
        if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
        }

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
        option = options[i];

        // Compile the sub-pattern and save it under the options's selector.
        optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
};

// -- Compiler Helper Classes --------------------------------------------------

function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value && typeof value !== 'number') {
        return '';
    }

    return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};

//# sourceMappingURL=compiler.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(18)['default'];
exports['default'] = exports;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports["default"] = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements,
                    location: location()
                };
            },
        peg$c1 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c2 = function(messageText) {
                return {
                    type : 'messageTextElement',
                    value: messageText,
                    location: location()
                };
            },
        peg$c3 = /^[^ \t\n\r,.+={}#]/,
        peg$c4 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c5 = "{",
        peg$c6 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c7 = ",",
        peg$c8 = { type: "literal", value: ",", description: "\",\"" },
        peg$c9 = "}",
        peg$c10 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c11 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
                    format: format && format[2],
                    location: location()
                };
            },
        peg$c12 = "number",
        peg$c13 = { type: "literal", value: "number", description: "\"number\"" },
        peg$c14 = "date",
        peg$c15 = { type: "literal", value: "date", description: "\"date\"" },
        peg$c16 = "time",
        peg$c17 = { type: "literal", value: "time", description: "\"time\"" },
        peg$c18 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2],
                    location: location()
                };
            },
        peg$c19 = "plural",
        peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c21 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                };
            },
        peg$c22 = "selectordinal",
        peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                }
            },
        peg$c25 = "select",
        peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c27 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options,
                    location: location()
                };
            },
        peg$c28 = "=",
        peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c30 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern,
                    location: location()
                };
            },
        peg$c31 = "offset:",
        peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c33 = function(number) {
                return number;
            },
        peg$c34 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
                    options: options,
                    location: location()
                };
            },
        peg$c35 = { type: "other", description: "whitespace" },
        peg$c36 = /^[ \t\n\r]/,
        peg$c37 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c38 = { type: "other", description: "optionalWhitespace" },
        peg$c39 = /^[0-9]/,
        peg$c40 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c41 = /^[0-9a-f]/i,
        peg$c42 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c43 = "0",
        peg$c44 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c45 = /^[1-9]/,
        peg$c46 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c47 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c50 = "\\\\",
        peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c52 = function() { return '\\'; },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function() { return '\\#'; },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function() { return '\u007B'; },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function() { return '\u007D'; },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c65 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;

      s0 = peg$parsemessageTextElement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemessageText();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;

      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c3.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c3.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c7;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();
                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;

      s0 = peg$parsesimpleFormat();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c7;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c28;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c5;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c9;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c10); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c30(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c31) {
        s1 = peg$c31;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseoffset();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c34(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c36.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c36.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c37); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c39.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c41.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c43;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c45.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c47(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c48.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c52();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c53) {
            s1 = peg$c53;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c56) {
              s1 = peg$c56;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c57); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c62) {
                  s1 = peg$c62;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c63); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$currPos;
                  s4 = peg$parsehexDigit();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsehexDigit();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsehexDigit();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$parsehexDigit();
                        if (s7 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                  if (s3 !== peg$FAILED) {
                    s2 = input.substring(s2, peg$currPos);
                  } else {
                    s2 = s3;
                  }
                  if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c65(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

//# sourceMappingURL=parser.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GENERATED FILE

exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

//# sourceMappingURL=en.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(22);
var bytesToUuid = __webpack_require__(23);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__response_response_message__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stored_request__ = __webpack_require__(26);
/* global browser */



class Service {
  constructor () {
    this.messages = new Map()
    this.listeners = new Map()
  }

  /**
   * Adds a handler function for each particular message type. If thisValue is provided, a handler function
   * will be bound to it.
   * Usually there is no need to add handlers to responses: they will be handled via a promise fulfillment
   * within registerRequest() and SendRequestTo...() logic. Thus, only handlers to incoming requests
   * need to be registered.
   * @param {Message.types} type - A type of a message to listen
   * @param {Function} handlerFunc - A function that will be called when a message of a certain type is received.
   * @param thisValue - An object a listenerFunc will be bound to (optional)
   */
  addHandler (type, handlerFunc, thisValue = undefined) {
    if (thisValue) { handlerFunc = handlerFunc.bind(thisValue) }
    this.listeners.set(type, handlerFunc)
  }

  /**
   * A message dispatcher function
   */
  listener (message, sender) {
    console.log(`New message received:`, message)
    console.log(`From:`, sender)
    if (!message.type) {
      console.error(`Skipping a message of an unknown type`)
      return false
    }

    if (__WEBPACK_IMPORTED_MODULE_0__response_response_message__["a" /* default */].isResponse(message) && this.messages.has(message.requestID)) {
      /*
    If message is a response to a known request, remove it from the map and resolve a promise.
    Response will be handled within a request callback.
    */
      this.fulfillRequest(message)
    } else if (this.listeners.has(Symbol.for(message.type))) {
      // Pass message to a registered handler if there are any
      this.listeners.get(Symbol.for(message.type))(message, sender)
    } else {
      console.log(`Either no listeners has been registered for a message of type "${message.type}" or
      this is a response message with a timeout expired. Ignoring`)
    }

    return false // Indicate that we are not sending any response back
  }

  /**
   * Registers an outgoing request in a request map. Returns a promise that will be fulfilled when when
   * a response will be received or will be rejected when a timeout will expire.
   * @param {RequestMessage} request - An outgoing request.
   * @param {number} timeout - A number of milliseconds we'll wait for a response before rejecting a promise.
   * @return {Promise} - An asynchronous result of an operation.
   */
  registerRequest (request, timeout = undefined) {
    let requestInfo = new __WEBPACK_IMPORTED_MODULE_1__stored_request__["a" /* default */](request)
    console.log(requestInfo)
    this.messages.set(request.ID, requestInfo)
    if (timeout) {
      requestInfo.timeoutID = window.setTimeout((requestID) => {
        let requestInfo = this.messages.get(requestID)
        console.log('Timeout has been expired')
        requestInfo.reject(new Error(`Timeout has been expired`))
        this.messages.delete(requestID) // Remove from map
        console.log(`Map length is ${this.messages.size}`)
      }, timeout, request.ID)
    }
    console.log(`Map length is ${this.messages.size}`)
    return requestInfo.promise
  }

  sendRequestToTab (request, timeout, tabID) {
    let promise = this.registerRequest(request, timeout)
    browser.tabs.sendMessage(tabID, request).then(
      () => { console.log(`Successfully sent a request to a tab`) },
      (error) => {
        console.error(`tabs.sendMessage() failed: ${error.message}`, error)
        this.rejectRequest(request.ID, error)
      }
    )
    return promise
  }

  sendRequestToBg (request, timeout) {
    let promise = this.registerRequest(request, timeout)
    browser.runtime.sendMessage(request).then(
      () => { console.log(`Successfully sent a request to a background`) },
      (error) => {
        console.error(`Sending request to a background failed: ${error.message}`, error)
        this.rejectRequest(request.ID, error)
      }
    )
    return promise
  }

  sendResponseToTab (message, tabID) {
    console.log(`Sending response to a tab ID ${tabID}`)
    return browser.tabs.sendMessage(tabID, message)
  }

  sendResponseToBg (message) {
    return browser.runtime.sendMessage(message)
  }

  fulfillRequest (responseMessage) {
    if (this.messages.has(responseMessage.requestID)) {
      let requestInfo = this.messages.get(responseMessage.requestID)
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      requestInfo.resolve(responseMessage) // Resolve with a response message
      this.messages.delete(responseMessage.requestID) // Remove request from a map
      console.log(`Map length is ${this.messages.size}`)
    }
  }

  rejectRequest (requestID, error) {
    if (requestID && this.messages.has(requestID)) {
      let requestInfo = this.messages.get(requestID)
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      requestInfo.reject(error)
      this.messages.delete(requestID) // Remove request from a map
      console.log(`Map length is ${this.messages.size}`)
    }
  }

  sendMessageToTab (request, tabID) {
    return browser.tabs.sendMessage(tabID, request)
  }

  sendMessageToBg (request) {
    return browser.runtime.sendMessage(request)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Service;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_message__ = __webpack_require__(0);


/**
 * A generic response to a request message
 */
class ResponseMessage extends __WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */] {
  /**
   * @param {RequestMessage} request - A request that resulted in this response
   * @param {Object} body - A response message body
   * @param {Symbol | string} statusCode - A status code for a request that initiated this response
   * (i.e. Success, Failure, etc.)
   */
  constructor (request, body, statusCode = undefined) {
    super(body)
    this.role = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */].roles.RESPONSE)
    this.requestID = request.ID // ID of the request to match request and response
    if (statusCode) {
      if (typeof status === 'symbol') {
        // If status is a symbol, store a symbol key instead of a symbol for serialization
        this.status = Symbol.keyFor(statusCode)
      } else {
        this.status = statusCode
      }
    }
  }

  /**
   * Checks if this message is a response (i.e. follows a response message format)
   * @param message
   */
  static isResponse (message) {
    return message.role &&
    Symbol.for(message.role) === __WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */].roles.RESPONSE && message.requestID
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ResponseMessage;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class StoredRequest {
  constructor () {
    this.resolve = undefined
    this.reject = undefined
    // Promise sets reject and resolve
    this.promise = new Promise(this.executor.bind(this))
  }

  executor (resolve, reject) {
    this.resolve = resolve
    this.reject = reject
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StoredRequest;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__request_message__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__content_tab_script__ = __webpack_require__(2);




class StateRequest extends __WEBPACK_IMPORTED_MODULE_1__request_message__["a" /* default */] {
  constructor (tabScriptState) {
    super(__WEBPACK_IMPORTED_MODULE_2__content_tab_script__["a" /* default */].serializable(tabScriptState))
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */].types.STATE_REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StateRequest;



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_message__ = __webpack_require__(0);


class RequestMessage extends __WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */] {
  constructor (body) {
    super(body)
    this.role = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */].roles.REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RequestMessage;



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* global browser */
class ContentMenuItem {
  constructor (id, title, actionFunc) {
    this.id = id
    this.title = title
    this.actionFunc = actionFunc
    this.isActive = false
  }

  enable () {
    if (!this.isActive) {
      browser.contextMenus.create({
        id: this.id,
        title: this.title
      })
      this.isActive = true
    }
  }

  disable () {
    if (this.isActive) {
      browser.contextMenus.remove(this.id)
      this.isActive = false
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentMenuItem;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* global browser */
class ContentMenuSeparator {
  constructor (id) {
    this.id = id
    this.type = 'separator'
    this.isActive = false
  }

  enable () {
    if (!this.isActive) {
      browser.contextMenus.create({
        id: this.id,
        type: this.type
      })
      this.isActive = true
    }
  }

  disable () {
    if (this.isActive) {
      browser.contextMenus.remove(this.id)
      this.isActive = false
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentMenuSeparator;



/***/ }),
/* 31 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(this, function (module) {
  /* webextension-polyfill - v0.2.1 - Thu Oct 12 2017 12:31:04 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined") {
    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = () => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "export": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "import": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            }
          }
        },
        "downloads": {
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getBrowserInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.rejection
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (chrome.runtime.lastError) {
            promise.reject(chrome.runtime.lastError);
          } else if (metadata.singleCallbackArg || callbackArgs.length === 1) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            target[name](...args, makeCallback({ resolve, reject }, metadata));
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the orginal method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);

        let handlers = {
          has(target, prop) {
            return prop in target || prop in cache;
          },

          get(target, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });

              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(target, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },

          defineProperty(target, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(target, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        return new Proxy(target, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });

      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let result = listener(message, sender);

          if (isThenable(result)) {
            result.then(sendResponse, error => {
              console.error(error);
              sendResponse(error);
            });

            return true;
          } else if (result !== undefined) {
            sendResponse(result);
          }
        };
      });

      const staticWrappers = {
        runtime: {
          onMessage: wrapEvent(onMessageWrappers)
        }
      };

      // Create a new empty object and copy the properties of the original chrome object
      // to prevent a Proxy violation exception for the devtools API getter
      // (which is a read-only non-configurable property on the original target).
      const targetObject = Object.assign({}, chrome);

      return wrapObject(targetObject, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(); // eslint-disable-line no-undef
  } else {
    module.exports = browser; // eslint-disable-line no-undef
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ })
/******/ ]);
//# sourceMappingURL=background.js.map