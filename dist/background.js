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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4__ = __webpack_require__(7);
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const propTypes = {
  NUMERIC: Symbol('Numeric'),
  SYMBOL: Symbol('Symbol')
}

const props = {
  status: {
    name: 'status',
    valueType: propTypes.SYMBOL,
    values: {
      PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
      ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated') // Content script has been loaded, but is deactivated
    },
    defaultValueIndex: 0
  },
  panelStatus: {
    name: 'panelStatus',
    valueType: propTypes.SYMBOL,
    values: {
      OPEN: Symbol.for('Alpheios_Status_PanelOpen'), // Panel is open
      CLOSED: Symbol.for('Alpheios_Status_PanelClosed') // Panel is closed
    },
    defaultValueIndex: 1
  }
}

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

    this.watchers = new Map()
  }

  static get symbolProps () {
    return [props.status.name, props.panelStatus.name]
  }

  /**
   * Only certain features will be stored within a serialized version of a TabScript. This is done
   * to prevent context-specific features (such as local event handlers) to be passed over the network
   * to a different context where they would make no sense. This getter returns a list of such fields.
   * @return {String[]}
   */
  static get dataProps () {
    return TabScript.symbolProps
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
    for (let key of Object.keys(state)) {
      // Build diffs only for data properties
      if (this.tabID !== state.tabID) {
        diff.tabID = state.tabID
        diff['_changedKeys'].push('tabID')
        diff['_changedEntries'].push(['tabID', state.tabID])
      }
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

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
  window.browser = __webpack_require__(16)
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_messaging_message_message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_messaging_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_messaging_request_state_request__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__context_menu_item__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_alpheios_experience__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_alpheios_experience___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_alpheios_experience__);
/* global browser */






// Use a logger that outputs timestamps (but loses line numbers)
// import Logger from '../lib/logger'
// console.log = Logger.log

class BackgroundProcess {
  constructor (browserFeatures) {
    this.browserFeatures = browserFeatures
    this.settings = BackgroundProcess.defaults

    this.tabs = new Map() // A list of tabs that have content script loaded
    this.activeTab = undefined // A tab that is currently active in a browser window

    this.messagingService = new __WEBPACK_IMPORTED_MODULE_1__lib_messaging_service__["a" /* default */]()
  }

  static get defaults () {
    return {
      activateMenuItemId: 'activate-alpheios-content',
      activateMenuItemText: 'Activate',
      deactivateMenuItemId: 'deactivate-alpheios-content',
      deactivateMenuItemText: 'Deactivate',
      openPanelMenuItemId: 'open-alpheios-panel',
      openPanelMenuItemText: 'Open Panel',
      sendExperiencesMenuItemId: 'send-experiences',
      sendExperiencesMenuItemText: 'Send Experiences to a remote server',
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

    this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_0__lib_messaging_message_message__["a" /* default */].types.STATE_MESSAGE, this.stateMessageHandler, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    browser.tabs.onActivated.addListener(this.tabActivationListener.bind(this))
    //browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))
    browser.tabs.onRemoved.addListener(this.tabRemovalListener.bind(this))
    browser.webNavigation.onCompleted.addListener(this.navigationCompletedListener.bind(this))

    this.menuItems = {
      activate: new __WEBPACK_IMPORTED_MODULE_3__context_menu_item__["a" /* default */](BackgroundProcess.defaults.activateMenuItemId, BackgroundProcess.defaults.activateMenuItemText),
      deactivate: new __WEBPACK_IMPORTED_MODULE_3__context_menu_item__["a" /* default */](BackgroundProcess.defaults.deactivateMenuItemId, BackgroundProcess.defaults.deactivateMenuItemText),
      openPanel: new __WEBPACK_IMPORTED_MODULE_3__context_menu_item__["a" /* default */](BackgroundProcess.defaults.openPanelMenuItemId, BackgroundProcess.defaults.openPanelMenuItemText)
    }
    this.menuItems.activate.enable() // This one will be enabled by default

    browser.contextMenus.onClicked.addListener(this.menuListener.bind(this))
    browser.browserAction.onClicked.addListener(this.browserActionListener.bind(this))

    this.transporter = new __WEBPACK_IMPORTED_MODULE_5_alpheios_experience__["Transporter"](__WEBPACK_IMPORTED_MODULE_5_alpheios_experience__["StorageAdapter"], __WEBPACK_IMPORTED_MODULE_5_alpheios_experience__["TestAdapter"],
      BackgroundProcess.defaults.experienceStorageThreshold, BackgroundProcess.defaults.experienceStorageCheckInterval)
  }

  async activateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */].create(this.tabs.get(tabID)).activate().setPanelOpen()
    this.setContentState(tab)
  }

  async deactivateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */].create(this.tabs.get(tabID)).deactivate().setPanelClosed()
    this.setContentState(tab)
  }

  async openPanel (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */].create(this.tabs.get(tabID)).activate().setPanelOpen()
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
    let newTab = new __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */](tabID)
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
    this.messagingService.sendRequestToTab(new __WEBPACK_IMPORTED_MODULE_2__lib_messaging_request_state_request__["a" /* default */](tab), 10000, tab.tabID).then(
      message => {
        let contentState = __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */].readObject(message.body)
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
    let contentState = __WEBPACK_IMPORTED_MODULE_4__lib_content_tab_script__["a" /* default */].readObject(message.body)
    this.updateTabState(contentState.tabID, contentState)
  }

  tabActivationListener (info) {
    this.activeTab = info.tabId
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
    console.log('navigatibrowser.webNavigation.onCompletedonCompletedListener called')
    // make sure this is a tab we know about AND that it's not an iframe event
    if (this.tabs.has(details.tabId) && details.frameId === 0 ) {
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
    } else {
      // If tab is not provided will set menu do an initial state
      this.menuItems.activate.enable()
      this.menuItems.deactivate.disable()
      this.menuItems.openPanel.disable()
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BackgroundProcess;



/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(8);
var bytesToUuid = __webpack_require__(9);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
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

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__response_response_message__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stored_request__ = __webpack_require__(12);
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__request_message__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__content_tab_script__ = __webpack_require__(2);




class StateRequest extends __WEBPACK_IMPORTED_MODULE_1__request_message__["a" /* default */] {
  constructor (tabScriptState) {
    super(__WEBPACK_IMPORTED_MODULE_2__content_tab_script__["a" /* default */].serializable(tabScriptState))
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message_message__["a" /* default */].types.STATE_REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StateRequest;



/***/ }),
/* 14 */
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
/* 15 */
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
/* 16 */
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