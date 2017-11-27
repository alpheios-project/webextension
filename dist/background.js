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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4__ = __webpack_require__(14);
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
      WORD_DATA_REQUEST: Symbol.for('Alpheios_WordDataRequest'),
      WORD_DATA_RESPONSE: Symbol.for('Alpheios_WordDataResponse'),
      STATUS_REQUEST: Symbol.for('Alpheios_StatusRequest'),
      STATUS_RESPONSE: Symbol.for('Alpheios_StatusResponse'),
      ACTIVATION_REQUEST: Symbol.for('Alpheios_ActivateRequest'),
      DEACTIVATION_REQUEST: Symbol.for('Alpheios_DeactivateRequest')
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);


class ResponseMessage extends __WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */] {
  constructor (request, body, status = undefined) {
    super(body)
    this.role = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].roles.RESPONSE)
    this.requestID = request.ID // ID of the request to match request and response
    if (status) {
      if (typeof status === 'symbol') {
        // If status is a symbol, store a symbol key instead of a symbol for serialization
        this.status = Symbol.keyFor(status)
      } else {
        this.status = status
      }
    }
  }

  /**
   * Checks if this message is a response (i.e. follows a response message format)
   * @param message
   */
  static isResponse (message) {
    return message.role &&
    Symbol.for(message.role) === __WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].roles.RESPONSE && message.requestID
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ResponseMessage;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);


class RequestMessage extends __WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */] {
  constructor (body) {
    super(body)
    this.role = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].roles.REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RequestMessage;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return dataSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dataSet$1; });
/* unused harmony export languages */
/* unused harmony export LanguageDataset */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LanguageData; });
/* unused harmony export Suffix */
/* unused harmony export Footnote */
/* unused harmony export MatchData */
/* unused harmony export ExtendedLanguageData */
/* unused harmony export ExtendedGreekData */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return WordData; });
/* unused harmony export loadData */
/* unused harmony export SelectedWord */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Presenter; });
/* eslint-disable no-unused-vars */
const LANG_UNIT_WORD = Symbol('word');
const LANG_UNIT_CHAR = Symbol('char');
const LANG_DIR_LTR = Symbol('ltr');
const LANG_DIR_RTL = Symbol('rtl');
const LANG_LATIN = Symbol('latin');
const LANG_GREEK = Symbol('greek');
const LANG_ARABIC = Symbol('arabic');
const LANG_PERSIAN = Symbol('persian');
const STR_LANG_CODE_LAT = 'lat';
const STR_LANG_CODE_LA = 'la';
const STR_LANG_CODE_GRC = 'grc';
const STR_LANG_CODE_ARA = 'ara';
const STR_LANG_CODE_AR = 'ar';
const STR_LANG_CODE_FAR = 'far';
const STR_LANG_CODE_PER = 'per';
// parts of speech
const POFS_ADJECTIVE = 'adjective';
const POFS_ADVERB = 'adverb';
const POFS_ADVERBIAL = 'adverbial';
const POFS_ARTICLE = 'article';
const POFS_CONJUNCTION = 'conjunction';
const POFS_EXCLAMATION = 'exclamation';
const POFS_INTERJECTION = 'interjection';
const POFS_NOUN = 'noun';
const POFS_NUMERAL = 'numeral';
const POFS_PARTICLE = 'particle';
const POFS_PREFIX = 'prefix';
const POFS_PREPOSITION = 'preposition';
const POFS_PRONOUN = 'pronoun';
const POFS_SUFFIX = 'suffix';
const POFS_SUPINE = 'supine';
const POFS_VERB = 'verb';
const POFS_VERB_PARTICIPLE = 'verb participle';
// gender
const GEND_MASCULINE = 'masculine';
const GEND_FEMININE = 'feminine';
const GEND_NEUTER = 'neuter';
const GEND_COMMON = 'common';
const GEND_ANIMATE = 'animate';
const GEND_INANIMATE = 'inanimate';
// Polish gender types
const GEND_PERSONAL_MASCULINE = 'personal masculine';
const GEND_ANIMATE_MASCULINE = 'animate masculine';
const GEND_INANIMATE_MASCULINE = 'inanimate masculine';
// comparative
const COMP_POSITIVE = 'positive';
const COMP_COMPARITIVE = 'comparative';
const COMP_SUPERLATIVE = 'superlative';
// case
const CASE_ABESSIVE = 'abessive';
const CASE_ABLATIVE = 'ablative';
const CASE_ABSOLUTIVE = 'absolutive';
const CASE_ACCUSATIVE = 'accusative';
const CASE_ADDIRECTIVE = 'addirective';
const CASE_ADELATIVE = 'adelative';
const CASE_ADESSIVE = 'adessive';
const CASE_ADVERBIAL = 'adverbial';
const CASE_ALLATIVE = 'allative';
const CASE_ANTESSIVE = 'antessive';
const CASE_APUDESSIVE = 'apudessive';
const CASE_AVERSIVE = 'aversive';
const CASE_BENEFACTIVE = 'benefactive';
const CASE_CARITIVE = 'caritive';
const CASE_CAUSAL = 'causal';
const CASE_CAUSAL_FINAL = 'causal-final';
const CASE_COMITATIVE = 'comitative';
const CASE_DATIVE = 'dative';
const CASE_DELATIVE = 'delative';
const CASE_DIRECT = 'direct';
const CASE_DISTRIBUTIVE = 'distributive';
const CASE_DISTRIBUTIVE_TEMPORAL = 'distributive-temporal';
const CASE_ELATIVE = 'elative';
const CASE_ERGATIVE = 'ergative';
const CASE_ESSIVE = 'essive';
const CASE_ESSIVE_FORMAL = 'essive-formal';
const CASE_ESSIVE_MODAL = 'essive-modal';
const CASE_EQUATIVE = 'equative';
const CASE_EVITATIVE = 'evitative';
const CASE_EXESSIVE = 'exessive';
const CASE_FINAL = 'final';
const CASE_FORMAL = 'formal';
const CASE_GENITIVE = 'genitive';
const CASE_ILLATIVE = 'illative';
const CASE_INELATIVE = 'inelative';
const CASE_INESSIVE = 'inessive';
const CASE_INSTRUCTIVE = 'instructive';
const CASE_INSTRUMENTAL = 'instrumental';
const CASE_INSTRUMENTAL_COMITATIVE = 'instrumental-comitative';
const CASE_INTRANSITIVE = 'intransitive';
const CASE_LATIVE = 'lative';
const CASE_LOCATIVE = 'locative';
const CASE_MODAL = 'modal';
const CASE_MULTIPLICATIVE = 'multiplicative';
const CASE_NOMINATIVE = 'nominative';
const CASE_PARTITIVE = 'partitive';
const CASE_PEGATIVE = 'pegative';
const CASE_PERLATIVE = 'perlative';
const CASE_POSSESSIVE = 'possessive';
const CASE_POSTELATIVE = 'postelative';
const CASE_POSTDIRECTIVE = 'postdirective';
const CASE_POSTESSIVE = 'postessive';
const CASE_POSTPOSITIONAL = 'postpositional';
const CASE_PREPOSITIONAL = 'prepositional';
const CASE_PRIVATIVE = 'privative';
const CASE_PROLATIVE = 'prolative';
const CASE_PROSECUTIVE = 'prosecutive';
const CASE_PROXIMATIVE = 'proximative';
const CASE_SEPARATIVE = 'separative';
const CASE_SOCIATIVE = 'sociative';
const CASE_SUBDIRECTIVE = 'subdirective';
const CASE_SUBESSIVE = 'subessive';
const CASE_SUBELATIVE = 'subelative';
const CASE_SUBLATIVE = 'sublative';
const CASE_SUPERDIRECTIVE = 'superdirective';
const CASE_SUPERESSIVE = 'superessive';
const CASE_SUPERLATIVE = 'superlative';
const CASE_SUPPRESSIVE = 'suppressive';
const CASE_TEMPORAL = 'temporal';
const CASE_TERMINATIVE = 'terminative';
const CASE_TRANSLATIVE = 'translative';
const CASE_VIALIS = 'vialis';
const CASE_VOCATIVE = 'vocative';
const MOOD_ADMIRATIVE = 'admirative';
const MOOD_COHORTATIVE = 'cohortative';
const MOOD_CONDITIONAL = 'conditional';
const MOOD_DECLARATIVE = 'declarative';
const MOOD_DUBITATIVE = 'dubitative';
const MOOD_ENERGETIC = 'energetic';
const MOOD_EVENTIVE = 'eventive';
const MOOD_GENERIC = 'generic';
const MOOD_GERUNDIVE = 'gerundive';
const MOOD_HYPOTHETICAL = 'hypothetical';
const MOOD_IMPERATIVE = 'imperative';
const MOOD_INDICATIVE = 'indicative';
const MOOD_INFERENTIAL = 'inferential';
const MOOD_INFINITIVE = 'infinitive';
const MOOD_INTERROGATIVE = 'interrogative';
const MOOD_JUSSIVE = 'jussive';
const MOOD_NEGATIVE = 'negative';
const MOOD_OPTATIVE = 'optative';
const MOOD_PARTICIPLE = 'participle';
const MOOD_PRESUMPTIVE = 'presumptive';
const MOOD_RENARRATIVE = 'renarrative';
const MOOD_SUBJUNCTIVE = 'subjunctive';
const MOOD_SUPINE = 'supine';
const NUM_SINGULAR = 'singular';
const NUM_PLURAL = 'plural';
const NUM_DUAL = 'dual';
const NUM_TRIAL = 'trial';
const NUM_PAUCAL = 'paucal';
const NUM_SINGULATIVE = 'singulative';
const NUM_COLLECTIVE = 'collective';
const NUM_DISTRIBUTIVE_PLURAL = 'distributive plural';
const NRL_CARDINAL = 'cardinal';
const NRL_ORDINAL = 'ordinal';
const NRL_DISTRIBUTIVE = 'distributive';
const NURL_NUMERAL_ADVERB = 'numeral adverb';
const ORD_1ST = '1st';
const ORD_2ND = '2nd';
const ORD_3RD = '3rd';
const ORD_4TH = '4th';
const ORD_5TH = '5th';
const ORD_6TH = '6th';
const ORD_7TH = '7th';
const ORD_8TH = '8th';
const ORD_9TH = '9th';
const TENSE_AORIST = 'aorist';
const TENSE_FUTURE = 'future';
const TENSE_FUTURE_PERFECT = 'future perfect';
const TENSE_IMPERFECT = 'imperfect';
const TENSE_PAST_ABSOLUTE = 'past absolute';
const TENSE_PERFECT = 'perfect';
const TENSE_PLUPERFECT = 'pluperfect';
const TENSE_PRESENT = 'present';
const VKIND_TO_BE = 'to be';
const VKIND_COMPOUNDS_OF_TO_BE = 'compounds of to be';
const VKIND_TAKING_ABLATIVE = 'taking ablative';
const VKIND_TAKING_DATIVE = 'taking dative';
const VKIND_TAKING_GENITIVE = 'taking genitive';
const VKIND_TRANSITIVE = 'transitive';
const VKIND_INTRANSITIVE = 'intransitive';
const VKIND_IMPERSONAL = 'impersonal';
const VKIND_DEPONENT = 'deponent';
const VKIND_SEMIDEPONENT = 'semideponent';
const VKIND_PERFECT_DEFINITE = 'perfect definite';
const VOICE_ACTIVE = 'active';
const VOICE_PASSIVE = 'passive';
const VOICE_MEDIOPASSIVE = 'mediopassive';
const VOICE_IMPERSONAL_PASSIVE = 'impersonal passive';
const VOICE_MIDDLE = 'middle';
const VOICE_ANTIPASSIVE = 'antipassive';
const VOICE_REFLEXIVE = 'reflexive';
const VOICE_RECIPROCAL = 'reciprocal';
const VOICE_CAUSATIVE = 'causative';
const VOICE_ADJUTATIVE = 'adjutative';
const VOICE_APPLICATIVE = 'applicative';
const VOICE_CIRCUMSTANTIAL = 'circumstantial';
const VOICE_DEPONENT = 'deponent';
const TYPE_IRREGULAR = 'irregular';
const TYPE_REGULAR = 'regular';
/* eslit-enable no-unused-vars */


var constants = Object.freeze({
  LANG_UNIT_WORD: LANG_UNIT_WORD,
  LANG_UNIT_CHAR: LANG_UNIT_CHAR,
  LANG_DIR_LTR: LANG_DIR_LTR,
  LANG_DIR_RTL: LANG_DIR_RTL,
  LANG_LATIN: LANG_LATIN,
  LANG_GREEK: LANG_GREEK,
  LANG_ARABIC: LANG_ARABIC,
  LANG_PERSIAN: LANG_PERSIAN,
  STR_LANG_CODE_LAT: STR_LANG_CODE_LAT,
  STR_LANG_CODE_LA: STR_LANG_CODE_LA,
  STR_LANG_CODE_GRC: STR_LANG_CODE_GRC,
  STR_LANG_CODE_ARA: STR_LANG_CODE_ARA,
  STR_LANG_CODE_AR: STR_LANG_CODE_AR,
  STR_LANG_CODE_FAR: STR_LANG_CODE_FAR,
  STR_LANG_CODE_PER: STR_LANG_CODE_PER,
  POFS_ADJECTIVE: POFS_ADJECTIVE,
  POFS_ADVERB: POFS_ADVERB,
  POFS_ADVERBIAL: POFS_ADVERBIAL,
  POFS_ARTICLE: POFS_ARTICLE,
  POFS_CONJUNCTION: POFS_CONJUNCTION,
  POFS_EXCLAMATION: POFS_EXCLAMATION,
  POFS_INTERJECTION: POFS_INTERJECTION,
  POFS_NOUN: POFS_NOUN,
  POFS_NUMERAL: POFS_NUMERAL,
  POFS_PARTICLE: POFS_PARTICLE,
  POFS_PREFIX: POFS_PREFIX,
  POFS_PREPOSITION: POFS_PREPOSITION,
  POFS_PRONOUN: POFS_PRONOUN,
  POFS_SUFFIX: POFS_SUFFIX,
  POFS_SUPINE: POFS_SUPINE,
  POFS_VERB: POFS_VERB,
  POFS_VERB_PARTICIPLE: POFS_VERB_PARTICIPLE,
  GEND_MASCULINE: GEND_MASCULINE,
  GEND_FEMININE: GEND_FEMININE,
  GEND_NEUTER: GEND_NEUTER,
  GEND_COMMON: GEND_COMMON,
  GEND_ANIMATE: GEND_ANIMATE,
  GEND_INANIMATE: GEND_INANIMATE,
  GEND_PERSONAL_MASCULINE: GEND_PERSONAL_MASCULINE,
  GEND_ANIMATE_MASCULINE: GEND_ANIMATE_MASCULINE,
  GEND_INANIMATE_MASCULINE: GEND_INANIMATE_MASCULINE,
  COMP_POSITIVE: COMP_POSITIVE,
  COMP_COMPARITIVE: COMP_COMPARITIVE,
  COMP_SUPERLATIVE: COMP_SUPERLATIVE,
  CASE_ABESSIVE: CASE_ABESSIVE,
  CASE_ABLATIVE: CASE_ABLATIVE,
  CASE_ABSOLUTIVE: CASE_ABSOLUTIVE,
  CASE_ACCUSATIVE: CASE_ACCUSATIVE,
  CASE_ADDIRECTIVE: CASE_ADDIRECTIVE,
  CASE_ADELATIVE: CASE_ADELATIVE,
  CASE_ADESSIVE: CASE_ADESSIVE,
  CASE_ADVERBIAL: CASE_ADVERBIAL,
  CASE_ALLATIVE: CASE_ALLATIVE,
  CASE_ANTESSIVE: CASE_ANTESSIVE,
  CASE_APUDESSIVE: CASE_APUDESSIVE,
  CASE_AVERSIVE: CASE_AVERSIVE,
  CASE_BENEFACTIVE: CASE_BENEFACTIVE,
  CASE_CARITIVE: CASE_CARITIVE,
  CASE_CAUSAL: CASE_CAUSAL,
  CASE_CAUSAL_FINAL: CASE_CAUSAL_FINAL,
  CASE_COMITATIVE: CASE_COMITATIVE,
  CASE_DATIVE: CASE_DATIVE,
  CASE_DELATIVE: CASE_DELATIVE,
  CASE_DIRECT: CASE_DIRECT,
  CASE_DISTRIBUTIVE: CASE_DISTRIBUTIVE,
  CASE_DISTRIBUTIVE_TEMPORAL: CASE_DISTRIBUTIVE_TEMPORAL,
  CASE_ELATIVE: CASE_ELATIVE,
  CASE_ERGATIVE: CASE_ERGATIVE,
  CASE_ESSIVE: CASE_ESSIVE,
  CASE_ESSIVE_FORMAL: CASE_ESSIVE_FORMAL,
  CASE_ESSIVE_MODAL: CASE_ESSIVE_MODAL,
  CASE_EQUATIVE: CASE_EQUATIVE,
  CASE_EVITATIVE: CASE_EVITATIVE,
  CASE_EXESSIVE: CASE_EXESSIVE,
  CASE_FINAL: CASE_FINAL,
  CASE_FORMAL: CASE_FORMAL,
  CASE_GENITIVE: CASE_GENITIVE,
  CASE_ILLATIVE: CASE_ILLATIVE,
  CASE_INELATIVE: CASE_INELATIVE,
  CASE_INESSIVE: CASE_INESSIVE,
  CASE_INSTRUCTIVE: CASE_INSTRUCTIVE,
  CASE_INSTRUMENTAL: CASE_INSTRUMENTAL,
  CASE_INSTRUMENTAL_COMITATIVE: CASE_INSTRUMENTAL_COMITATIVE,
  CASE_INTRANSITIVE: CASE_INTRANSITIVE,
  CASE_LATIVE: CASE_LATIVE,
  CASE_LOCATIVE: CASE_LOCATIVE,
  CASE_MODAL: CASE_MODAL,
  CASE_MULTIPLICATIVE: CASE_MULTIPLICATIVE,
  CASE_NOMINATIVE: CASE_NOMINATIVE,
  CASE_PARTITIVE: CASE_PARTITIVE,
  CASE_PEGATIVE: CASE_PEGATIVE,
  CASE_PERLATIVE: CASE_PERLATIVE,
  CASE_POSSESSIVE: CASE_POSSESSIVE,
  CASE_POSTELATIVE: CASE_POSTELATIVE,
  CASE_POSTDIRECTIVE: CASE_POSTDIRECTIVE,
  CASE_POSTESSIVE: CASE_POSTESSIVE,
  CASE_POSTPOSITIONAL: CASE_POSTPOSITIONAL,
  CASE_PREPOSITIONAL: CASE_PREPOSITIONAL,
  CASE_PRIVATIVE: CASE_PRIVATIVE,
  CASE_PROLATIVE: CASE_PROLATIVE,
  CASE_PROSECUTIVE: CASE_PROSECUTIVE,
  CASE_PROXIMATIVE: CASE_PROXIMATIVE,
  CASE_SEPARATIVE: CASE_SEPARATIVE,
  CASE_SOCIATIVE: CASE_SOCIATIVE,
  CASE_SUBDIRECTIVE: CASE_SUBDIRECTIVE,
  CASE_SUBESSIVE: CASE_SUBESSIVE,
  CASE_SUBELATIVE: CASE_SUBELATIVE,
  CASE_SUBLATIVE: CASE_SUBLATIVE,
  CASE_SUPERDIRECTIVE: CASE_SUPERDIRECTIVE,
  CASE_SUPERESSIVE: CASE_SUPERESSIVE,
  CASE_SUPERLATIVE: CASE_SUPERLATIVE,
  CASE_SUPPRESSIVE: CASE_SUPPRESSIVE,
  CASE_TEMPORAL: CASE_TEMPORAL,
  CASE_TERMINATIVE: CASE_TERMINATIVE,
  CASE_TRANSLATIVE: CASE_TRANSLATIVE,
  CASE_VIALIS: CASE_VIALIS,
  CASE_VOCATIVE: CASE_VOCATIVE,
  MOOD_ADMIRATIVE: MOOD_ADMIRATIVE,
  MOOD_COHORTATIVE: MOOD_COHORTATIVE,
  MOOD_CONDITIONAL: MOOD_CONDITIONAL,
  MOOD_DECLARATIVE: MOOD_DECLARATIVE,
  MOOD_DUBITATIVE: MOOD_DUBITATIVE,
  MOOD_ENERGETIC: MOOD_ENERGETIC,
  MOOD_EVENTIVE: MOOD_EVENTIVE,
  MOOD_GENERIC: MOOD_GENERIC,
  MOOD_GERUNDIVE: MOOD_GERUNDIVE,
  MOOD_HYPOTHETICAL: MOOD_HYPOTHETICAL,
  MOOD_IMPERATIVE: MOOD_IMPERATIVE,
  MOOD_INDICATIVE: MOOD_INDICATIVE,
  MOOD_INFERENTIAL: MOOD_INFERENTIAL,
  MOOD_INFINITIVE: MOOD_INFINITIVE,
  MOOD_INTERROGATIVE: MOOD_INTERROGATIVE,
  MOOD_JUSSIVE: MOOD_JUSSIVE,
  MOOD_NEGATIVE: MOOD_NEGATIVE,
  MOOD_OPTATIVE: MOOD_OPTATIVE,
  MOOD_PARTICIPLE: MOOD_PARTICIPLE,
  MOOD_PRESUMPTIVE: MOOD_PRESUMPTIVE,
  MOOD_RENARRATIVE: MOOD_RENARRATIVE,
  MOOD_SUBJUNCTIVE: MOOD_SUBJUNCTIVE,
  MOOD_SUPINE: MOOD_SUPINE,
  NUM_SINGULAR: NUM_SINGULAR,
  NUM_PLURAL: NUM_PLURAL,
  NUM_DUAL: NUM_DUAL,
  NUM_TRIAL: NUM_TRIAL,
  NUM_PAUCAL: NUM_PAUCAL,
  NUM_SINGULATIVE: NUM_SINGULATIVE,
  NUM_COLLECTIVE: NUM_COLLECTIVE,
  NUM_DISTRIBUTIVE_PLURAL: NUM_DISTRIBUTIVE_PLURAL,
  NRL_CARDINAL: NRL_CARDINAL,
  NRL_ORDINAL: NRL_ORDINAL,
  NRL_DISTRIBUTIVE: NRL_DISTRIBUTIVE,
  NURL_NUMERAL_ADVERB: NURL_NUMERAL_ADVERB,
  ORD_1ST: ORD_1ST,
  ORD_2ND: ORD_2ND,
  ORD_3RD: ORD_3RD,
  ORD_4TH: ORD_4TH,
  ORD_5TH: ORD_5TH,
  ORD_6TH: ORD_6TH,
  ORD_7TH: ORD_7TH,
  ORD_8TH: ORD_8TH,
  ORD_9TH: ORD_9TH,
  TENSE_AORIST: TENSE_AORIST,
  TENSE_FUTURE: TENSE_FUTURE,
  TENSE_FUTURE_PERFECT: TENSE_FUTURE_PERFECT,
  TENSE_IMPERFECT: TENSE_IMPERFECT,
  TENSE_PAST_ABSOLUTE: TENSE_PAST_ABSOLUTE,
  TENSE_PERFECT: TENSE_PERFECT,
  TENSE_PLUPERFECT: TENSE_PLUPERFECT,
  TENSE_PRESENT: TENSE_PRESENT,
  VKIND_TO_BE: VKIND_TO_BE,
  VKIND_COMPOUNDS_OF_TO_BE: VKIND_COMPOUNDS_OF_TO_BE,
  VKIND_TAKING_ABLATIVE: VKIND_TAKING_ABLATIVE,
  VKIND_TAKING_DATIVE: VKIND_TAKING_DATIVE,
  VKIND_TAKING_GENITIVE: VKIND_TAKING_GENITIVE,
  VKIND_TRANSITIVE: VKIND_TRANSITIVE,
  VKIND_INTRANSITIVE: VKIND_INTRANSITIVE,
  VKIND_IMPERSONAL: VKIND_IMPERSONAL,
  VKIND_DEPONENT: VKIND_DEPONENT,
  VKIND_SEMIDEPONENT: VKIND_SEMIDEPONENT,
  VKIND_PERFECT_DEFINITE: VKIND_PERFECT_DEFINITE,
  VOICE_ACTIVE: VOICE_ACTIVE,
  VOICE_PASSIVE: VOICE_PASSIVE,
  VOICE_MEDIOPASSIVE: VOICE_MEDIOPASSIVE,
  VOICE_IMPERSONAL_PASSIVE: VOICE_IMPERSONAL_PASSIVE,
  VOICE_MIDDLE: VOICE_MIDDLE,
  VOICE_ANTIPASSIVE: VOICE_ANTIPASSIVE,
  VOICE_REFLEXIVE: VOICE_REFLEXIVE,
  VOICE_RECIPROCAL: VOICE_RECIPROCAL,
  VOICE_CAUSATIVE: VOICE_CAUSATIVE,
  VOICE_ADJUTATIVE: VOICE_ADJUTATIVE,
  VOICE_APPLICATIVE: VOICE_APPLICATIVE,
  VOICE_CIRCUMSTANTIAL: VOICE_CIRCUMSTANTIAL,
  VOICE_DEPONENT: VOICE_DEPONENT,
  TYPE_IRREGULAR: TYPE_IRREGULAR,
  TYPE_REGULAR: TYPE_REGULAR
});

/**
 * Wrapper class for a (grammatical, usually) feature, such as part of speech or declension. Keeps both value and type information.
 */
class Feature {
  /**
   * Initializes a Feature object
   * @param {string | string[]} value - A single feature value or, if this feature could have multiple
   * values, an array of values.
   * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
   * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
   */
  constructor (value, type, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!value) {
      throw new Error('Feature should have a non-empty value.')
    }
    if (!type) {
      throw new Error('Feature should have a non-empty type.')
    }
    if (!language) {
      throw new Error('Feature constructor requires a language')
    }
    this.value = value;
    this.type = type;
    this.language = language;
  };

  isEqual (feature) {
    if (Array.isArray(feature.value)) {
      if (!Array.isArray(this.value) || this.value.length !== feature.value.length) {
        return false
      }
      let equal = this.type === feature.type && this.language === feature.language;
      equal = equal && this.value.every(function (element, index) {
        return element === feature.value[index]
      });
      return equal
    } else {
      return this.value === feature.value && this.type === feature.type && this.language === feature.language
    }
  }
}
// Should have no spaces in values in order to be used in HTML templates
Feature.types = {
  word: 'word',
  part: 'part of speech', // Part of speech
  number: 'number',
  grmCase: 'case',
  declension: 'declension',
  gender: 'gender',
  type: 'type',
  conjugation: 'conjugation',
  comparison: 'comparison',
  tense: 'tense',
  voice: 'voice',
  mood: 'mood',
  person: 'person',
  frequency: 'frequency', // How frequent this word is
  meaning: 'meaning', // Meaning of a word
  source: 'source', // Source of word definition
  footnote: 'footnote', // A footnote for a word's ending
  dialect: 'dialect', // a dialect iderntifier
  note: 'note', // a general note
  pronunciation: 'pronunciation',
  area: 'area',
  geo: 'geo', // geographical data
  kind: 'kind', // verb kind informatin
  derivtype: 'derivtype',
  stemtype: 'stemtype',
  morph: 'morph', // general morphological information
  var: 'var', // variance?
  isAllowed (value) {
    let v = `${value}`;
    return Object.values(this).includes(v)
  }
};

class FeatureImporter {
  constructor (defaults = []) {
    this.hash = {};
    for (let value of defaults) {
      this.map(value, value);
    }
    return this
  }

  /**
   * Sets mapping between external imported value and one or more library standard values. If an importedValue
   * is already in a hash table, old libraryValue will be overwritten with the new one.
   * @param {string} importedValue - External value
   * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
   */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue;
    return this
  }

  /**
   * Checks if value is in a map.
   * @param {string} importedValue - A value to test.
   * @returns {boolean} - Tru if value is in a map, false otherwise.
   */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

  /**
   * Returns one or more library standard values that match an external value
   * @param {string} importedValue - External value
   * @returns {Object | string} One or more of library standard values
   */
  get (importedValue) {
    if (this.has(importedValue)) {
      return this.hash[importedValue]
    } else {
      throw new Error('A value "' + importedValue + '" is not found in the importer.')
    }
  }
}

/**
 * Definition class for a (grammatical) feature. Stores type information and (optionally) all possible values of the feature.
 * It serves as a feature generator. If list of possible values is provided, it can generate a Feature object
 * each time a property that corresponds to a feature value is accessed. If no list of possible values provided,
 * a Feature object can be generated with get(value) method.
 *
 * An order of values determines a default sort and grouping order. If two values should have the same order,
 * they should be grouped within an array: value1, [value2, value3], value4. Here 'value2' and 'value3' have
 * the same priority for sorting and grouping.
 */
class FeatureType {
  // TODO: value checking
  /**
   * Creates and initializes a Feature Type object.
   * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
   * @param {string[] | string[][]} values - A list of allowed values for this feature type.
   * If an empty array is provided, there will be no
   * allowed values as well as no ordering (can be used for items that do not need or have a simple order,
   * such as footnotes).
   * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
   */
  constructor (type, values, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!values || !Array.isArray(values)) {
      throw new Error('Values should be an array (or an empty array) of values.')
    }
    if (!language) {
      throw new Error('FeatureType constructor requires a language')
    }

    this.type = type;
    this.language = language;

    /*
     This is a sort order index for a grammatical feature values. It is determined by the order of values in
     a 'values' array.
     */
    this._orderIndex = [];
    this._orderLookup = {};

    for (const [index, value] of values.entries()) {
      this._orderIndex.push(value);
      if (Array.isArray(value)) {
        for (let element of value) {
          this[element] = new Feature(element, this.type, this.language);
          this._orderLookup[element] = index;
        }
      } else {
        this[value] = new Feature(value, this.type, this.language);
        this._orderLookup[value] = index;
      }
    }
  };

  /**
   * Return a Feature with an arbitrary value. This value would not be necessarily present among FeatureType values.
   * This can be especially useful for features that do not set: a list of predefined values, such as footnotes.
   * @param value
   * @returns {Feature}
   */
  get (value) {
    if (value) {
      return new Feature(value, this.type, this.language)
    } else {
      throw new Error('A non-empty value should be provided.')
    }
  }

  getFromImporter (importerName, value) {
    let mapped;
    try {
      mapped = this.importer[importerName].get(value);
    } catch (e) {
      // quietly catch not found and replace with default
      mapped = this.get(value);
    }
    return mapped
  }

  /**
   * Creates and returns a new importer with a specific name. If an importer with this name already exists,
   * an existing Importer object will be returned.
   * @param {string} name - A name of an importer object
   * @returns {Importer} A new or existing Importer object that matches a name provided
   */
  addImporter (name) {
    if (!name) {
      throw new Error('Importer should have a non-empty name.')
    }
    this.importer = this.importer || {};
    this.importer[name] = this.importer[name] || new FeatureImporter();
    return this.importer[name]
  }

  /**
   * Return copies of all feature values as Feature objects in a sorted array, according to feature type's sort order.
   * For a similar function that returns strings instead of Feature objects see orderedValues().
   * @returns {Feature[] | Feature[][]} Array of feature values sorted according to orderIndex.
   * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
   * an array of Feature objects will be returned instead of a single Feature object, as for single feature values.
   */
  get orderedFeatures () {
    return this.orderedValues.map((value) => new Feature(value, this.type, this.language))
  }

  /**
   * Return all feature values as strings in a sorted array, according to feature type's sort order.
   * This is a main method that specifies a sort order of the feature type. orderedFeatures() relies
   * on this method in providing a sorted array of feature values. If you want to create
   * a custom sort order for a particular feature type that will depend on some options that are not type-related,
   * create a wrapper around this function providing it with options arguments so it will be able to decide
   * in what order those features will be based on those arguments.
   * For a similar function that returns Feature objects instead of strings see orderedValues().
   * @returns {string[]} Array of feature values sorted according to orderIndex.
   * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
   * an array of strings will be returned instead of a single strings, as for single feature values.
   */
  get orderedValues () {
    return this._orderIndex
  }

  /**
   * Returns a lookup table for type values as:
   *  {value1: order1, value2: order2}, where order is a sort order of an item. If two items have the same sort order,
   *  their order value will be the same.
   * @returns {object}
   */
  get orderLookup () {
    return this._orderLookup
  }

  /**
   * Sets an order of grammatical feature values for a grammatical feature. Used mostly for sorting, filtering,
   * and displaying.
   *
   * @param {Feature[] | Feature[][]} values - a list of grammatical features that specify their order for
   * sorting and filtering. Some features can be grouped as [[genders.masculine, genders.feminine], LibLatin.genders.neuter].
   * It means that genders.masculine and genders.feminine belong to the same group. They will have the same index
   * and will be stored inside an _orderIndex as an array. genders.masculine and genders.feminine will be grouped together
   * during filtering and will be in the same bin during sorting.
   *
   */
  set order (values) {
    if (!values || (Array.isArray(values) && values.length === 0)) {
      throw new Error('A non-empty list of values should be provided.')
    }

    // If a single value is provided, convert it into an array
    if (!Array.isArray(values)) {
      values = [values];
    }

    for (let value of values) {
      if (Array.isArray(value)) {
        for (let element of value) {
          if (!this.hasOwnProperty(element.value)) {
            throw new Error('Trying to order an element with "' + element.value + '" value that is not stored in a "' + this.type + '" type.')
          }

          if (element.type !== this.type) {
            throw new Error('Trying to order an element with type "' + element.type + '" that is different from "' + this.type + '".')
          }

          if (element.language !== this.language) {
            throw new Error('Trying to order an element with language "' + element.language + '" that is different from "' + this.language + '".')
          }
        }
      } else {
        if (!this.hasOwnProperty(value.value)) {
          throw new Error('Trying to order an element with "' + value.value + '" value that is not stored in a "' + this.type + '" type.')
        }

        if (value.type !== this.type) {
          throw new Error('Trying to order an element with type "' + value.type + '" that is different from "' + this.type + '".')
        }

        if (value.language !== this.language) {
          throw new Error('Trying to order an element with language "' + value.language + '" that is different from "' + this.language + '".')
        }
      }
    }

    // Erase whatever sort order was set previously
    this._orderLookup = {};
    this._orderIndex = [];

    // Define a new sort order
    for (const [index, element] of values.entries()) {
      if (Array.isArray(element)) {
        // If it is an array, all values should have the same order
        let elements = [];
        for (const subElement of element) {
          this._orderLookup[subElement.value] = index;
          elements.push(subElement.value);
        }
        this._orderIndex[index] = elements;
      } else {
        // If is a single value
        this._orderLookup[element.value] = index;
        this._orderIndex[index] = element.value;
      }
    }
  }
}

/**
 * A list of grammatical features that characterizes a language unit. Has some additional service methods,
 * compared with standard storage objects.
 */
class FeatureList {
  /**
   * Initializes a feature list.
   * @param {FeatureType[]} features - Features that build the list (optional, can be set later).
   */
  constructor (features = []) {
    this._features = [];
    this._types = {};
    this.add(features);
  }

  add (features) {
    if (!features || !Array.isArray(features)) {
      throw new Error('Features must be defined and must come in an array.')
    }

    for (let feature of features) {
      this._features.push(feature);
      this._types[feature.type] = feature;
    }
  }

  /**
   * Returns an array of grouping features.
   * @returns {FeatureType[]} - An array of grouping features.
   */
  get items () {
    return this._features
  }

  forEach (callback) {
    this._features.forEach(callback);
  }

  /**
   * Returns a feature of a particular type. If such feature does not exist in a list, returns undefined.
   * @param {string} type - Feature type as defined in `types` object.
   * @return {FeatureType | undefined} A feature if a particular type if contains it. Undefined otherwise.
   */
  ofType (type) {
    if (this.hasType(type)) {
      return this._types[type]
    }
  }

  /**
   * Checks whether a feature list has a feature of a specific type.
   * @param {string} type - Feature type as defined in `types` object.
   * @return {boolean} Whether a feature list has a feature of a particular type.
   */
  hasType (type) {
    return this._types.hasOwnProperty(type)
  }
}

/**
 * @class  LanguageModel is the base class for language-specific behavior
 */
class LanguageModel {
  /**
   */
  constructor () {
    this.sourceLanguage = null;
    this.contextForward = 0;
    this.context_backward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [];
  }

  _initializeFeatures () {
    let features = {};
    let code = this.toCode();
    features[Feature.types.part] = new FeatureType(Feature.types.part,
      [ POFS_ADVERB,
        POFS_ADVERBIAL,
        POFS_ADJECTIVE,
        POFS_ARTICLE,
        POFS_CONJUNCTION,
        POFS_EXCLAMATION,
        POFS_INTERJECTION,
        POFS_NOUN,
        POFS_NUMERAL,
        POFS_PARTICLE,
        POFS_PREFIX,
        POFS_PREPOSITION,
        POFS_PRONOUN,
        POFS_SUFFIX,
        POFS_SUPINE,
        POFS_VERB,
        POFS_VERB_PARTICIPLE ], code);
    features[Feature.types.gender] = new FeatureType(Feature.types.gender,
      [ GEND_MASCULINE, GEND_FEMININE, GEND_NEUTER ], code);
    features[Feature.types.type] = new FeatureType(Feature.types.type,
      [TYPE_REGULAR, TYPE_IRREGULAR], code);
    features[Feature.types.person] = new FeatureType(Feature.types.person,
      [ORD_1ST, ORD_2ND, ORD_3RD], code);
    return features
  }

  /**
   * Handler which can be used as the contextHander.
   * It uses language-specific configuration to identify
   * the elements from the alph-text popup which should produce links
   * to the language-specific grammar.
   * @see #contextHandler
   */
  grammarContext (doc) {
    // used to bind a click handler on the .alph-entry items in the
    // popup which retrieved the context attribute from the clicked
    // term and used that to construct a link and open the grammar
    // at the apporopriate place.
    // var links = this.getGrammarLinks();

    // for (var link_name in links)
    // {
    //   if (links.hasOwnProperty(link_name))
    //    {
    // Alph.$(".alph-entry ." + link_name,a_doc).bind('click',link_name,
    //   function(a_e)
    //    {
    // build target inside grammar
    // var target = a_e.data;
    // var rngContext = Alph.$(this).attr("context");
    // if (rngContext != null)
    // {
    //  target += "-" + rngContext.split(/-/)[0];
    // }
    // myobj.openGrammar(a_e.originaEvent,this,target);
    //   }
    // );
    //   }
    // }
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Check to see if the supplied language code is supported by this tool
   * @param {string} code the language code
   * @returns true if supported false if not
   * @type Boolean
   */
  static supportsLanguage (code) {
    return this.codes.includes[code]
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {string} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toString () {
    return String(this.sourceLanguage)
  }

  isEqual (model) {
    return this.sourceLanguage === model.sourceLanguage
  }

  toCode () {
    return null
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class LatinLanguageModel extends LanguageModel {
  /**
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_LATIN;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [STR_LANG_CODE_LA, STR_LANG_CODE_LAT];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_ABLATIVE,
        CASE_LOCATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD, ORD_4TH, ORD_5TH ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, [VOICE_PASSIVE, VOICE_ACTIVE], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, [MOOD_INDICATIVE, MOOD_SUBJUNCTIVE], code);
    features[Feature.types.conjugation] = new FeatureType(Feature.types.conjugation,
      [ ORD_1ST,
        ORD_2ND,
        ORD_3RD,
        ORD_4TH
      ], code);
    return features
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toCode () {
    return STR_LANG_CODE_LAT
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
  /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_GREEK;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_GRC];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL, NUM_DUAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT,
        TENSE_AORIST
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice,
      [ VOICE_PASSIVE,
        VOICE_ACTIVE,
        VOICE_MEDIOPASSIVE,
        VOICE_MIDDLE
      ], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood,
      [ MOOD_INDICATIVE,
        MOOD_SUBJUNCTIVE,
        MOOD_OPTATIVE,
        MOOD_IMPERATIVE
      ], code);
    // TODO full list of greek dialects
    features[Feature.types.dialect] = new FeatureType(Feature.types.dialect, ['attic', 'epic', 'doric'], code);
    return features
  }

  toCode () {
    return STR_LANG_CODE_GRC
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class ArabicLanguageModel extends LanguageModel {
  /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_ARABIC;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_RTL;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_ARA, STR_LANG_CODE_AR];
    this._initializeFeatures();
  }

  _initializeFeatures () {
    this.features = super._initializeFeatures();
  }

  toCode () {
    return STR_LANG_CODE_ARA
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    // TODO
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

const MODELS = new Map([
  [ STR_LANG_CODE_LA, LatinLanguageModel ],
  [ STR_LANG_CODE_LAT, LatinLanguageModel ],
  [ STR_LANG_CODE_GRC, GreekLanguageModel ],
  [ STR_LANG_CODE_ARA, ArabicLanguageModel ],
  [ STR_LANG_CODE_AR, ArabicLanguageModel ]
]);

class LanguageModelFactory {
  static supportsLanguage (code) {
    return MODELS.has(code)
  }

  static getLanguageForCode (code = null) {
    let Model = MODELS.get(code);
    if (Model) {
      return new Model()
    }
    // for now return a default Model
    // TODO may want to throw an error
    return new LanguageModel()
  }
}

/**
 * Lemma, a canonical form of a word.
 */
class Lemma {
  /**
   * Initializes a Lemma object.
   * @param {string} word - A word.
   * @param {string} language - A language of a word.
   */
  constructor (word, language) {
    if (!word) {
      throw new Error('Word should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    // if (!languages.isAllowed(language)) {
    //    throw new Error('Language "' + language + '" is not supported.');
    // }

    this.word = word;
    this.language = language;
  }

  static readObject (jsonObject) {
    return new Lemma(jsonObject.word, jsonObject.language)
  }
}

/*
 Hierarchical structure of return value of a morphological analyzer:

 Homonym (a group of words that are written the same way, https://en.wikipedia.org/wiki/Homonym)
    Lexeme 1 (a unit of lexical meaning, https://en.wikipedia.org/wiki/Lexeme)
        Have a lemma and one or more inflections
        Lemma (also called a headword, a canonical form of a group of words https://en.wikipedia.org/wiki/Lemma_(morphology) )
        Inflection 1
            Stem
            Suffix (also called ending)
        Inflection 2
            Stem
            Suffix
    Lexeme 2
        Lemma
        Inflection 1
            Stem
            Suffix
 */

/**
 * Represents an inflection of a word
 */
class Inflection {
  /**
   * Initializes an Inflection object.
   * @param {string} stem - A stem of a word.
   * @param {string} language - A word's language.
   */
  constructor (stem, language) {
    if (!stem) {
      throw new Error('Stem should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    if (!LanguageModelFactory.supportsLanguage(language)) {
      throw new Error(`language ${language} not supported.`)
    }

    this.stem = stem;
    this.language = language;

    // Suffix may not be present in every word. If missing, it will set to null.
    this.suffix = null;

    // Prefix may not be present in every word. If missing, it will set to null.
    this.prefix = null;

    // Example may not be provided
    this.example = null;
  }

  static readObject (jsonObject) {
    let inflection = new Inflection(jsonObject.stem, jsonObject.language);
    if (jsonObject.suffix) {
      inflection.suffix = jsonObject.suffix;
    }
    if (jsonObject.prefix) {
      inflection.prefix = jsonObject.prefix;
    }
    if (jsonObject.example) {
      inflection.example = jsonObject.example;
    }
    return inflection
  }

  /**
   * Sets a grammatical feature in an inflection. Some features can have multiple values, In this case
   * an array of Feature objects will be provided.
   * Values are taken from features and stored in a 'feature.type' property as an array of values.
   * @param {Feature | Feature[]} data
   */
  set feature (data) {
    if (!data) {
      throw new Error('Inflection feature data cannot be empty.')
    }
    if (!Array.isArray(data)) {
      data = [data];
    }

    let type = data[0].type;
    this[type] = [];
    for (let element of data) {
      if (!(element instanceof Feature)) {
        throw new Error('Inflection feature data must be a Feature object.')
      }

      if (element.language !== this.language) {
        throw new Error('Language "' + element.language + '" of a feature does not match a language "' +
          this.language + '" of an Inflection object.')
      }

      this[type].push(element.value);
    }
  }
}

/**
 * A basic unit of lexical meaning. Contains a Lemma object and one or more Inflection objects.
 */
class Lexeme {
  /**
   * Initializes a Lexeme object.
   * @param {Lemma} lemma - A lemma object.
   * @param {Inflection[]} inflections - An array of inflections.
   * @param {string} meaning - a short definition
   */
  constructor (lemma, inflections, meaning = '') {
    if (!lemma) {
      throw new Error('Lemma should not be empty.')
    }

    if (!(lemma instanceof Lemma)) {
      throw new Error('Lemma should be of Lemma object type.')
    }

    if (!inflections) {
      throw new Error('Inflections data should not be empty.')
    }

    if (!Array.isArray(inflections)) {
      throw new Error('Inflection data should be provided in an array.')
    }

    for (let inflection of inflections) {
      if (!(inflection instanceof Inflection)) {
        throw new Error('All inflection data should be of Inflection object type.')
      }
    }

    this.lemma = lemma;
    this.inflections = inflections;
    this.meaning = meaning;
  }

  static readObject (jsonObject) {
    let lemma = Lemma.readObject(jsonObject.lemma);
    let inflections = [];
    for (let inflection of jsonObject.inflections) {
      inflections.push(Inflection.readObject(inflection));
    }
    return new Lexeme(lemma, inflections)
  }
}

class Homonym {
  /**
   * Initializes a Homonym object.
   * @param {Lexeme[]} lexemes - An array of Lexeme objects.
   * @param {string} form - the form which produces the homonyms
   */
  constructor (lexemes, form) {
    if (!lexemes) {
      throw new Error('Lexemes data should not be empty.')
    }

    if (!Array.isArray(lexemes)) {
      throw new Error('Lexeme data should be provided in an array.')
    }

    for (let lexeme of lexemes) {
      if (!(lexeme instanceof Lexeme)) {
        throw new Error('All lexeme data should be of Lexeme object type.')
      }
    }

    this.lexemes = lexemes;
    this.targetWord = form;
  }

  static readObject (jsonObject) {
    let lexemes = [];
    if (jsonObject.lexemes) {
      for (let lexeme of jsonObject.lexemes) {
        lexemes.push(Lexeme.readObject(lexeme));
      }
    }
    let homonym = new Homonym(lexemes);
    if (jsonObject.targetWord) {
      homonym.targetWord = jsonObject.targetWord;
    }
    return homonym
  }

  /**
   * Returns language of a homonym.
   * Homonym does not have a language property, only lemmas and inflections do. We assume that all lemmas
   * and inflections within the same homonym will have the same language, and we can determine a language
   * by using language property of the first lemma. We chan change this logic in the future if we'll need to.
   * @returns {string} A language code, as defined in the `languages` object.
   */
  get language () {
    if (this.lexemes && this.lexemes[0] && this.lexemes[0].lemma && this.lexemes[0].lemma.language) {
      return this.lexemes[0].lemma.language
    } else {
      throw new Error('Homonym has not been initialized properly. Unable to obtain language information.')
    }
  }
}

/**
 * Shared data structures and functions
 */

const languages = {
  type: 'language',
  latin: 'lat',
  greek: 'grc',
  isAllowed (language) {
    if (language === this.type) {
      return false
    } else {
      return Object.values(this).includes(language)
    }
  }
};

/**
 * Stores inflection language data
 */
class LanguageDataset {
  /**
   * Initializes a LanguageDataset.
   * @param {string} language - A language of a data set, from an allowed languages list (see 'languages' object).
   */
  constructor (language) {
    if (!language) {
      // Language is not supported
      throw new Error('Language data cannot be empty.')
    }

    if (!languages.isAllowed(language)) {
      // Language is not supported
      throw new Error('Language "' + language + '" is not supported.')
    }
    this.language = language;
    this.suffixes = []; // An array of suffixes.
    this.footnotes = []; // Footnotes
  };

  /**
   * Each grammatical feature can be either a single or an array of Feature objects. The latter is the case when
   * an ending can belong to several grammatical features at once (i.e. belong to both 'masculine' and
   * 'feminine' genders
   *
   * @param {string | null} suffixValue - A text of a suffix. It is either a string or null if there is no suffix.
   * @param {Feature[]} featureValue
   * @return {Suffix} A newly added suffix value (can be used to add more data to the suffix).
   */
  addSuffix (suffixValue, featureValue, extendedLangData) {
    // TODO: implement run-time error checking
    let suffixItem = new Suffix(suffixValue);
    suffixItem.extendedLangData = extendedLangData;

    // Build all possible combinations of features
    let multiValueFeatures = [];

    // Go through all features provided
    for (let feature of featureValue) {
      // If this is a footnote. Footnotes should go in a flat array
      // because we don't need to split by them
      if (feature.type === Feature.types.footnote) {
        suffixItem[Feature.types.footnote] = suffixItem[Feature.types.footnote] || [];
        suffixItem[Feature.types.footnote].push(feature.value);
        continue
      }

      // If this ending has several grammatical feature values then they will be in an array
      if (Array.isArray(feature)) {
        if (feature.length > 0) {
          if (feature[0]) {
            let type = feature[0].type;
            // Store all multi-value features to create a separate copy of a a Suffix object for each of them
            multiValueFeatures.push({type: type, features: feature});
          } else {
            console.log(feature);
          }
        } else {
          // Array is empty
          throw new Error('An empty array is provided as a feature argument to the "addSuffix" method.')
        }
      } else {
        suffixItem.features[feature.type] = feature.value;
      }
    }

    // Create a copy of an Suffix object for each multi-value item
    if (multiValueFeatures.length > 0) {
      for (let featureGroup of multiValueFeatures) {
        let endingItems = suffixItem.split(featureGroup.type, featureGroup.features);
        this.suffixes = this.suffixes.concat(endingItems);
      }
    } else {
      this.suffixes.push(suffixItem);
    }
  };

  /**
   * Stores a footnote item.
   * @param {Feature} partOfSpeech - A part of speech this footnote belongs to
   * @param {number} index - A footnote's index.
   * @param {string} text - A footnote's text.
   */
  addFootnote (partOfSpeech, index, text) {
    if (!index) {
      throw new Error('Footnote index data should not be empty.')
    }

    if (!text) {
      throw new Error('Footnote text data should not be empty.')
    }

    let footnote = new Footnote(index, text, partOfSpeech.value);
    footnote.index = index;

    this.footnotes.push(footnote);
  };

  getSuffixes (homonym) {
    // Add support for languages
    let result = new WordData(homonym);
    let inflections = {};

    // Find partial matches first, and then full among them

    // TODO: do we ever need lemmas?
    for (let lexema of homonym.lexemes) {
      for (let inflection of lexema.inflections) {
        // Group inflections by a part of speech
        let partOfSpeech = inflection[Feature.types.part];
        if (!partOfSpeech) {
          throw new Error('Part of speech data is missing in an inflection.')
        }

        if (!inflections.hasOwnProperty(partOfSpeech)) {
          inflections[partOfSpeech] = [];
        }
        inflections[partOfSpeech].push(inflection);
      }
    }

    // Scan for matches for all parts of speech separately
    for (const partOfSpeech in inflections) {
      if (inflections.hasOwnProperty(partOfSpeech)) {
        let inflectionsGroup = inflections[partOfSpeech];

        result[Feature.types.part].push(partOfSpeech);
        result[partOfSpeech] = {};
        result[partOfSpeech].suffixes = this.suffixes.reduce(this['reducer'].bind(this, inflectionsGroup), []);
        result[partOfSpeech].footnotes = [];

        // Create a set so all footnote indexes be unique
        let footnotesIndex = new Set();
        // Scan all selected suffixes to build a unique set of footnote indexes
        for (let suffix of result[partOfSpeech].suffixes) {
          if (suffix.hasOwnProperty(Feature.types.footnote)) {
            // Footnote indexes are stored in an array
            for (let index of suffix[Feature.types.footnote]) {
              footnotesIndex.add(index);
            }
          }
        }
        // Add footnote indexes and their texts to a result
        for (let index of footnotesIndex) {
          let footnote = this.footnotes.find(footnoteElement =>
            footnoteElement.index === index && footnoteElement[Feature.types.part] === partOfSpeech
          );
          result[partOfSpeech].footnotes.push({index: index, text: footnote.text});
        }
        // Sort footnotes according to their index numbers
        result[partOfSpeech].footnotes.sort((a, b) => parseInt(a.index) - parseInt(b.index));
      }
    }

    return result
  }

  reducer (inflections, accumulator, suffix) {
    let result = this.matcher(inflections, suffix);
    if (result) {
      accumulator.push(result);
    }
    return accumulator
  }
}

/**
 * Stores one or several language datasets, one for each language
 */
class LanguageData {
  /**
   * Combines several language datasets for different languages. Allows to abstract away language data.
   * This function is chainable.
   * @param {LanguageDataset[]} languageData - Language datasets of different languages.
   * @return {LanguageData} Self instance for chaining.
   */
  constructor (languageData) {
    this.supportedLanguages = [];

    if (languageData) {
      for (let dataset of languageData) {
        this[dataset.language] = dataset;
        this.supportedLanguages.push(dataset.language);
      }
    }
    return this
  }

  /**
   * Loads data for all data sets.
   * This function is chainable.
   * @return {LanguageData} Self instance for chaining.
   */
  loadData () {
    for (let language of this.supportedLanguages) {
      try {
        this[language].loadData();
      } catch (e) {
        console.log(e);
      }
    }
    return this
  }

  /**
   * Finds matching suffixes for a homonym.
   * @param {Homonym} homonym - A homonym for which matching suffixes must be found.
   * @return {WordData} A return value of an inflection query.
   */
  getSuffixes (homonym) {
    let language = homonym.language;
    if (this.supportedLanguages.includes(language)) {
      return this[homonym.language].getSuffixes(homonym)
    } else {
      throw new Error(`"${language}" language data is missing. Unable to get suffix data.`)
    }
  }
}

/**
 * Suffix is an ending of a word with none or any grammatical features associated with it.
 * Features are stored in properties whose names are type of a grammatical feature (i.e. case, gender, etc.)
 * Each feature can have a single or multiple values associated with it (i.e. gender can be either 'masculine',
 * a single value, or 'masculine' and 'feminine'. That's why all values are stored in an array.
 */
class Suffix {
  /**
   * Initializes a Suffix object.
   * @param {string | null} suffixValue - A suffix text or null if suffix is empty.
   */
  constructor (suffixValue) {
    if (suffixValue === undefined) {
      throw new Error('Suffix should not be empty.')
    }
    this.value = suffixValue;
    this.features = {};
    this.featureGroups = {};

    /*
    Extended language data stores additional suffix information that is specific for a particular language.
    It uses the following schema:
    {string} language(key): {object} extended language data. This object is specific for each language
    and is defined in a language model.
     */
    this.extendedLangData = {};
    this.match = undefined;
  }

  static readObject (jsonObject) {
    let suffix = new Suffix(jsonObject.value);

    if (jsonObject.features) {
      for (let key in jsonObject.features) {
        if (jsonObject.features.hasOwnProperty(key)) {
          suffix.features[key] = jsonObject.features[key];
        }
      }
    }

    if (jsonObject.featureGroups) {
      for (let key in jsonObject.featureGroups) {
        if (jsonObject.featureGroups.hasOwnProperty(key)) {
          suffix.featureGroups[key] = [];
          for (let value of jsonObject.featureGroups[key]) {
            suffix.featureGroups[key].push(value);
          }
        }
      }
    }

    if (jsonObject[Feature.types.footnote]) {
      suffix[Feature.types.footnote] = [];
      for (let footnote of jsonObject[Feature.types.footnote]) {
        suffix[Feature.types.footnote].push(footnote);
      }
    }

    if (jsonObject.match) {
      suffix.match = MatchData.readObject(jsonObject.match);
    }

    for (const lang in jsonObject.extendedLangData) {
      if (jsonObject.extendedLangData.hasOwnProperty(lang)) {
        suffix.extendedLangData[lang] = ExtendedLanguageData.readObject(jsonObject.extendedLangData[lang]);
      }
    }
    return suffix
  }

  /**
   * Returns a copy of itself. Used in splitting suffixes with multi-value features.
   * @returns {Suffix}
   */
  clone () {
    // TODO: do all-feature two-level cloning
    let clone = new Suffix(this.value);
    for (const key in this.features) {
      if (this.features.hasOwnProperty(key)) {
        clone.features[key] = this.features[key];
      }
    }
    for (const key in this.featureGroups) {
      if (this.featureGroups.hasOwnProperty(key)) {
        clone.featureGroups[key] = this.featureGroups[key];
      }
    }

    if (this.hasOwnProperty(Feature.types.footnote)) {
      clone[Feature.types.footnote] = this[Feature.types.footnote];
    }

    for (const lang in this.extendedLangData) {
      if (this.extendedLangData.hasOwnProperty(lang)) {
        clone.extendedLangData[lang] = this.extendedLangData[lang];
      }
    }
    return clone
  };

  /**
   * Checks if suffix has a feature that is a match to the one provided.
   * @param {string} featureType - Sets a type of a feature we need to match with the ones stored inside the suffix
   * @param {string[]} featureValues - A list of feature values we need to match with the ones stored inside the suffix
   * @returns {string | undefined} - If provided feature is a match, returns a first feature that matched.
   * If no match found, return undefined.
   */
  featureMatch (featureType, featureValues) {
    if (this.features.hasOwnProperty(featureType)) {
      for (let value of featureValues) {
        if (value === this.features[featureType]) {
          return value
        }
      }
    }
    return undefined
  }

  /**
   * Find feature groups in Suffix.featureGroups that are the same between suffixes provided
   * @param suffixes
   */
  static getCommonGroups (suffixes) {
    let features = Object.keys(suffixes[0].featureGroups);

    let commonGroups = features.filter(feature => {
      let result = true;
      for (let i = 1; i < suffixes.length; i++) {
        result = result && suffixes[i].features.hasOwnProperty(feature);
      }
      return result
    });
    return commonGroups
  }

  /**
   * Finds out if an suffix is in the same group with some other suffix. The other suffix is provided as a function argument.
   * Two suffixes are considered to be in the same group if they are:
   * a. Have at least one common group in featureGroups;
   * b. Have the same suffix
   * c. Have values of all features the same except for those that belong to a common group(s)
   * d. Values of the common group features must be complementary. Here is an example:
   * Let's say a 'gender' group can have values such as 'masculine' and 'feminine'. Then suffixes will be combined
   * only if gender value of one suffix is 'masculine' and the other value is 'feminine'. If both suffixes have the same
   * either 'masculine' or 'feminine' value, they sill not be combined as are not being complementary.
   * @param {Suffix} suffix - An other suffix that we compare this suffix with.
   * @returns {boolean} - True if both suffixes are in the same group, false otherwise.
   */
  isInSameGroupWith (suffix) {
    let commonGroups = Suffix.getCommonGroups([this, suffix]);
    if (commonGroups.length < 1) {
      // If elements do not have common groups in Suffix.featureGroups then they are not in the same group
      return false
    }

    let commonValues = {};
    commonGroups.forEach((feature) => { commonValues[feature] = new Set([this.features[feature]]); });

    let result = true;
    result = result && this.value === suffix.value;
    // If suffixes does not match don't check any further
    if (!result) {
      return false
    }

    // Check all features to be a match, except those that are possible group values
    for (let feature of Object.keys(this.features)) {
      if (commonGroups.indexOf(feature) >= 0) {
        commonValues[feature].add(suffix.features[feature]);

        // Do not compare common groups
        continue
      }
      result = result && this.features[feature] === suffix.features[feature];
      // If feature mismatch discovered, do not check any further
      if (!result) {
        return false
      }
    }

    commonGroups.forEach(feature => {
      result = result && commonValues[feature].size === 2;
    });

    return result
  }

  /**
   * Splits a suffix that has multiple values of one or more grammatical features into an array of Suffix objects
   * with each Suffix object having only a single value of those grammatical features. Initial multiple values
   * are stored in a featureGroups[featureType] property as an array of values.
   * @param {string} featureType - A type of a feature
   * @param {Feature[]} featureValues - Multiple grammatical feature values.
   * @returns {Suffix[]} - An array of suffixes.
   */
  split (featureType, featureValues) {
    let copy = this.clone();
    let values = [];
    featureValues.forEach(element => values.push(element.value));
    copy.features[featureType] = featureValues[0].value;
    copy.featureGroups[featureType] = values;
    let suffixItems = [copy];
    for (let i = 1; i < featureValues.length; i++) {
      copy = this.clone();
      copy.features[featureType] = featureValues[i].value;
      copy.featureGroups[featureType] = values;
      suffixItems.push(copy);
    }
    return suffixItems
  };

  /**
   * Combines suffixes that are in the same group together. Suffixes to be combined must have their values listed
   * in an array stored as featureGroups[featureType] property.
   * @param {Suffix[]} suffixes - An array of suffixes to be combined.
   * @param {function} mergeFunction - A function that will merge two suffixes. By default it uses Suffix.merge,
   * but provides a way to supply a presentation specific functions. Please see Suffix.merge for more
   * information on function format.
   * @returns {Suffix[]} An array of suffixes with some items possibly combined together.
   */
  static combine (suffixes, mergeFunction = Suffix.merge) {
    let matchFound = false;
    let matchIdx;

    do {
      matchFound = false;

      /*
      Go through an array of suffixes end compare each suffix with each other (two-way compare) one time. \
      If items are in the same group, merge two suffixes, break out of a loop,
      and remove one matching suffix (the second one) from an array.
      Then repeat on a modified array until no further matches found.
       */
      for (let i = 0; i < suffixes.length; i++) {
        if (matchFound) {
          continue
        }
        for (let j = i + 1; j < suffixes.length; j++) {
          if (suffixes[i].isInSameGroupWith(suffixes[j])) {
            matchIdx = j;
            matchFound = true;
            mergeFunction(suffixes[i], suffixes[j]);
          }
        }
      }

      if (matchFound) {
        suffixes.splice(matchIdx, 1);
      }
    }
    while (matchFound)
    return suffixes
  }

  /**
   * This function provide a logic of to merge data of two suffix object that were previously split together.
   * @param {Suffix} suffixA - A first of two suffixes to merge (to be returned).
   * @param {Suffix} suffixB - A second ending to merge (to be discarded).
   * @returns {Suffix} A modified value of ending A.
   */
  static merge (suffixA, suffixB) {
    let commonGroups = Suffix.getCommonGroups([suffixA, suffixB]);
    for (let type of commonGroups) {
      // Combine values using a comma separator. Can do anything else if we need to.
      suffixA.features[type] = suffixA.features[type] + ', ' + suffixB.features[type];
    }
    return suffixA
  };
}

class Footnote {
  constructor (index, text, partOfSpeech) {
    this.index = index;
    this.text = text;
    this[Feature.types.part] = partOfSpeech;
  }

  static readObject (jsonObject) {
    this.index = jsonObject.index;
    this.text = jsonObject.text;
    this[Feature.types.part] = jsonObject[Feature.types.part];
    return new Footnote(jsonObject.index, jsonObject.text, jsonObject[Feature.types.part])
  }
}

/**
 * Detailed information about a match type.
 */
class MatchData {
  constructor () {
    this.suffixMatch = false; // Whether two suffixes are the same.
    this.fullMatch = false; // Whether two suffixes and all grammatical features, including part of speech, are the same.
    this.matchedFeatures = []; // How many features matches each other.
  }

  static readObject (jsonObject) {
    let matchData = new MatchData();
    matchData.suffixMatch = jsonObject.suffixMatch;
    matchData.fullMatch = jsonObject.fullMatch;
    for (let feature of jsonObject.matchedFeatures) {
      matchData.matchedFeatures.push(feature);
    }
    return matchData
  }
}

class ExtendedLanguageData {
  constructor () {
    this._type = undefined; // This is a base class
  }

  static types () {
    return {
      EXTENDED_GREEK_DATA: 'ExtendedGreekData'
    }
  }

  static readObject (jsonObject) {
    if (!jsonObject._type) {
      throw new Error('Extended language data has no type information. Unable to deserialize.')
    } else if (jsonObject._type === ExtendedLanguageData.types().EXTENDED_GREEK_DATA) {
      return ExtendedGreekData.readObject(jsonObject)
    } else {
      throw new Error(`Unsupported extended language data of type "${jsonObject._type}".`)
    }
  }
}

class ExtendedGreekData extends ExtendedLanguageData {
  constructor () {
    super();
    this._type = ExtendedLanguageData.types().EXTENDED_GREEK_DATA; // For deserialization
    this.primary = false;
  }

  static readObject (jsonObject) {
    let data = new ExtendedGreekData();
    data.primary = jsonObject.primary;
    return data
  }

  merge (extendedGreekData) {
    if (this.primary !== extendedGreekData.primary) {
      console.log('Mismatch', this.primary, extendedGreekData.primary);
    }
    let merged = new ExtendedGreekData();
    merged.primary = this.primary;
    return merged
  }
}

class SelectedWord {
  constructor (language, word) {
    this.language = language;
    this.word = word;
  }

  static readObjects (jsonObject) {
    return new SelectedWord(jsonObject.language, jsonObject.word)
  }
}

/**
 * A return value for inflection queries
 */
class WordData {
  constructor (homonym) {
    this.homonym = homonym;
    this.definition = undefined;
    this[Feature.types.part] = []; // What parts of speech are represented by this object.
  }

  static readObject (jsonObject) {
    let homonym = Homonym.readObject(jsonObject.homonym);

    let wordData = new WordData(homonym);
    wordData.definition = jsonObject.definition;
    wordData[Feature.types.part] = jsonObject[Feature.types.part];

    for (let part of wordData[Feature.types.part]) {
      let partData = jsonObject[part];
      wordData[part] = {};

      if (partData.suffixes) {
        wordData[part].suffixes = [];
        for (let suffix of partData.suffixes) {
          wordData[part].suffixes.push(Suffix.readObject(suffix));
        }
      }

      if (partData.footnotes) {
        wordData[part].footnotes = [];
        for (let footnote of partData.footnotes) {
          wordData[part].footnotes.push(Footnote.readObject(footnote));
        }
      }
    }

    return wordData
  }

  get word () {
    return this.homonym.targetWord
  }

  set word (word) {
    this.homonym.targetWord = word;
  }

  get language () {
    return this.homonym.language
  }
}

/**
 * Load text data form an external fil with an asynchronous XHR request.
 * @param {string} filePath - A path to a file we need to load.
 * @returns {Promise} - A promise that will be resolved with either
 * file content (a string) in case of success of with a status message
 * in case of failure.
 */
let loadData = function loadData (filePath) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', filePath);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  })
};

let messages$1 = {
  Number: 'Number',
  Case: 'Case',
  Declension: 'Declension',
  Gender: 'Gender',
  Type: 'Type',
  Voice: 'Voice',
  'Conjugation Stem': 'Conjugation Stem',
  Mood: 'Mood',
  Person: 'Person'
};

let messages$2 = {
  Number: 'Number (GB)',
  Case: 'Case (GB)',
  Declension: 'Declension (GB)',
  Gender: 'Gender (GB)',
  Type: 'Type (GB)',
  Voice: 'Voice (GB)',
  'Conjugation Stem': 'Conjugation Stem (GB)',
  Mood: 'Mood (GB)',
  Person: 'Person (GB)'
};

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

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

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
  try { return !!Object.defineProperty({}, 'a', {}); }
  catch (e) { return false; }
})();

var defineProperty = realDefineProp ? Object.defineProperty :
  function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
      obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
      obj[name] = desc.value;
    }
  };

var objCreate = Object.create || function (proto, props) {
  var obj, k;

  function F() {}
  F.prototype = proto;
  obj = new F();

  for (k in props) {
    if (hop.call(props, k)) {
      defineProperty(obj, k, props[k]);
    }
  }

  return obj;
};

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

function Compiler$1(locales, formats, pluralFn) {
  this.locales  = locales;
  this.formats  = formats;
  this.pluralFn = pluralFn;
}

Compiler$1.prototype.compile = function (ast) {
  this.pluralStack        = [];
  this.currentPlural      = null;
  this.pluralNumberFormat = null;

  return this.compileMessage(ast);
};

Compiler$1.prototype.compileMessage = function (ast) {
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

Compiler$1.prototype.compileMessageText = function (element) {
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

Compiler$1.prototype.compileArgument = function (element) {
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

Compiler$1.prototype.compileOptions = function (element) {
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

var parser = (function() {
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

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
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

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

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
  defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

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
defineProperty(MessageFormat, 'formats', {
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
defineProperty(MessageFormat, '__localeData__', {value: objCreate(null)});
defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
  if (!(data && data.locale)) {
    throw new Error(
      'Locale data provided to IntlMessageFormat is missing a ' +
      '`locale` property'
    );
  }

  MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
defineProperty(MessageFormat, '__parse', {value: parser.parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
defineProperty(MessageFormat, 'defaultLocale', {
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
  var compiler = new Compiler$1(locales, formats, pluralFn);
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
    if (!(values && hop.call(values, id))) {
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
    if (!hop.call(defaults, type)) { continue; }

    mergedFormats[type] = mergedType = objCreate(defaults[type]);

    if (formats && hop.call(formats, type)) {
      extend(mergedType, formats[type]);
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

// GENERATED FILE
var defaultLocale = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

/* jslint esnext: true */

MessageFormat.__addLocaleData(defaultLocale);
MessageFormat.defaultLocale = 'en';

/**
 * Combines messages with the same locale code.
 */
class MessageBundle {
  /**
   * Creates a message bundle (a list of messages) for a locale.
   * @param {string} locale - A locale code for a message group. IETF language tag format is recommended.
   * @param {Object} messages - Messages for a locale in an object. Object keys are message IDss, strings that
   * are used to reference a message, and key values are message texts in a string format.
   */
  constructor (locale, messages) {
    if (!locale) {
      throw new Error('Locale data is missing')
    }
    if (!messages) {
      throw new Error('Messages data is missing')
    }

    this._locale = locale;

    for (let messageID in messages) {
      if (messages.hasOwnProperty(messageID)) {
        this[messageID] = new MessageFormat(messages[messageID], this._locale);
      }
    }
  }

  /**
   * Returns a (formatted) message for a message ID provided.
   * @param messageID - An ID of a message.
   * @param options - Options that can be used for message formatting.
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

/**
 * Combines several message bundle for different locales.
 */
class L10n {
  /**
   * Creates an object. If an array of message bundle data is provided, initializes an object with this data.
   * This function is chainable.
   * @param {MessageBundle[]} messageData - An array of message bundles to be stored within.
   * @returns {L10n} Returns a reference to self for chaining.
   */
  constructor (messageData) {
    this._locales = {};
    this._localeList = [];

    if (messageData) {
      this.addLocaleData(messageData);
    }
    return this
  }

  /**
   * Adds one or several message bundles.
   * This function is chainable.
   * @param {MessageBundle[]} messageData - An array of message bundles to be stored within.
   * @return {L10n} - Returns self for chaining.
   */
  addLocaleData (messageData) {
    for (let messageBundle of messageData) {
      this._localeList.push(messageBundle.locale);
      this._locales[messageBundle.locale] = messageBundle;
    }
    return this
  }

  /**
   * Returns a message bundle for a locale.
   * @param {string} locale - A locale code for a message bundle. IETF language tag format is recommended.
   * @returns {MessageBundle} A message bundle for a locale.
   */
  messages (locale) {
    if (!this._locales[locale]) {
      throw new Error('Locale "' + locale + '" is not found.')
    }
    return this._locales[locale]
  }

  /**
   * Returns a list of available locale codes.
   * @returns {string[]} Array of local codes.
   */
  get locales () {
    return this._localeList
  }
}

const messages = [
  new MessageBundle('en-US', messages$1),
  new MessageBundle('en-GB', messages$2)
];

var nounSuffixesCSV = "Ending,Number,Case,Declension,Gender,Type,Footnote\na,singular,nominative,1st,feminine,regular,\nē,singular,nominative,1st,feminine,irregular,\nēs,singular,nominative,1st,feminine,irregular,\nā,singular,nominative,1st,feminine,irregular,7\nus,singular,nominative,2nd,masculine feminine,regular,\ner,singular,nominative,2nd,masculine feminine,regular,\nir,singular,nominative,2nd,masculine feminine,regular,\n-,singular,nominative,2nd,masculine feminine,irregular,\nos,singular,nominative,2nd,masculine feminine,irregular,1\nōs,singular,nominative,2nd,masculine feminine,irregular,\nō,singular,nominative,2nd,masculine feminine,irregular,7\num,singular,nominative,2nd,neuter,regular,\nus,singular,nominative,2nd,neuter,irregular,10\non,singular,nominative,2nd,neuter,irregular,7\n-,singular,nominative,3rd,masculine feminine,regular,\nos,singular,nominative,3rd,masculine feminine,irregular,\nōn,singular,nominative,3rd,masculine feminine,irregular,7\n-,singular,nominative,3rd,neuter,regular,\nus,singular,nominative,4th,masculine feminine,regular,\nū,singular,nominative,4th,neuter,regular,\nēs,singular,nominative,5th,feminine,regular,\nae,singular,genitive,1st,feminine,regular,\nāī,singular,genitive,1st,feminine,irregular,1\nās,singular,genitive,1st,feminine,irregular,2\nēs,singular,genitive,1st,feminine,irregular,7\nī,singular,genitive,2nd,masculine feminine,regular,\nō,singular,genitive,2nd,masculine feminine,irregular,7\nī,singular,genitive,2nd,neuter,regular,\nis,singular,genitive,3rd,masculine feminine,regular,\nis,singular,genitive,3rd,neuter,regular,\nūs,singular,genitive,4th,masculine feminine,regular,\nuis,singular,genitive,4th,masculine feminine,irregular,1\nuos,singular,genitive,4th,masculine feminine,irregular,1\nī,singular,genitive,4th,masculine feminine,irregular,15\nūs,singular,genitive,4th,neuter,regular,\nēī,singular,genitive,5th,feminine,regular,\neī,singular,genitive,5th,feminine,regular,\nī,singular,genitive,5th,feminine,irregular,\nē,singular,genitive,5th,feminine,irregular,\nēs,singular,genitive,5th,feminine,irregular,6\nae,singular,dative,1st,feminine,regular,\nāī,singular,dative,1st,feminine,irregular,1\nō,singular,dative,2nd,masculine feminine,regular,\nō,singular,dative,2nd,neuter,regular,\nī,singular,dative,3rd,masculine feminine,regular,\ne,singular,dative,3rd,masculine feminine,irregular,17\nī,singular,dative,3rd,neuter,regular,\nūī,singular,dative,4th,masculine feminine,regular,\nū,singular,dative,4th,masculine feminine,regular,\nū,singular,dative,4th,neuter,regular,\nēī,singular,dative,5th,feminine,regular,\neī,singular,dative,5th,feminine,regular,\nī,singular,dative,5th,feminine,irregular,\nē,singular,dative,5th,feminine,irregular,6\nam,singular,accusative,1st,feminine,regular,\nēn,singular,accusative,1st,feminine,irregular,\nān,singular,accusative,1st,feminine,irregular,7\num,singular,accusative,2nd,masculine feminine,regular,\nom,singular,accusative,2nd,masculine feminine,irregular,1\nōn,singular,accusative,2nd,masculine feminine,irregular,7\num,singular,accusative,2nd,neuter,regular,\nus,singular,accusative,2nd,neuter,irregular,10\non,singular,accusative,2nd,neuter,irregular,7\nem,singular,accusative,3rd,masculine feminine,regular,\nim,singular,accusative,3rd,masculine feminine,irregular,11\na,singular,accusative,3rd,masculine feminine,irregular,7\n-,singular,accusative,3rd,neuter,regular,\num,singular,accusative,4th,masculine feminine,regular,\nū,singular,accusative,4th,neuter,regular,\nem,singular,accusative,5th,feminine,regular,\nā,singular,ablative,1st,feminine,regular,\nād,singular,ablative,1st,feminine,irregular,5\nē,singular,ablative,1st,feminine,irregular,7\nō,singular,ablative,2nd,masculine feminine,regular,\nōd,singular,ablative,2nd,masculine feminine,irregular,1\nō,singular,ablative,2nd,neuter,regular,\ne,singular,ablative,3rd,masculine feminine,regular,\nī,singular,ablative,3rd,masculine feminine,irregular,11\ne,singular,ablative,3rd,neuter,regular,\nī,singular,ablative,3rd,neuter,irregular,11\nū,singular,ablative,4th,masculine feminine,regular,\nūd,singular,ablative,4th,masculine feminine,irregular,1\nū,singular,ablative,4th,neuter,regular,\nē,singular,ablative,5th,feminine,regular,\nae,singular,locative,1st,feminine,regular,\nō,singular,locative,2nd,masculine feminine,regular,\nō,singular,locative,2nd,neuter,regular,\ne,singular,locative,3rd,masculine feminine,regular,\nī,singular,locative,3rd,masculine feminine,regular,\nī,singular,locative,3rd,neuter,regular,\nū,singular,locative,4th,masculine feminine,regular,\nū,singular,locative,4th,neuter,regular,\nē,singular,locative,5th,feminine,regular,\na,singular,vocative,1st,feminine,regular,\nē,singular,vocative,1st,feminine,irregular,\nā,singular,vocative,1st,feminine,irregular,7\ne,singular,vocative,2nd,masculine feminine,regular,\ner,singular,vocative,2nd,masculine feminine,regular,\nir,singular,vocative,2nd,masculine feminine,regular,\n-,singular,vocative,2nd,masculine feminine,irregular,\nī,singular,vocative,2nd,masculine feminine,irregular,8\nōs,singular,vocative,2nd,masculine feminine,irregular,\ne,singular,vocative,2nd,masculine feminine,irregular,7\num,singular,vocative,2nd,neuter,regular,\non,singular,vocative,2nd,neuter,irregular,7\n-,singular,vocative,3rd,masculine feminine,regular,\n-,singular,vocative,3rd,neuter,regular,\nus,singular,vocative,4th,masculine feminine,regular,\nū,singular,vocative,4th,neuter,regular,\nēs,singular,vocative,5th,feminine,regular,\nae,plural,nominative,1st,feminine,regular,\nī,plural,nominative,2nd,masculine feminine,regular,\noe,plural,nominative,2nd,masculine feminine,irregular,7 9\na,plural,nominative,2nd,neuter,regular,\nēs,plural,nominative,3rd,masculine feminine,regular,\nes,plural,nominative,3rd,masculine feminine,irregular,7\na,plural,nominative,3rd,neuter,regular,\nia,plural,nominative,3rd,neuter,irregular,11\nūs,plural,nominative,4th,masculine feminine,regular,\nua,plural,nominative,4th,neuter,regular,\nēs,plural,nominative,5th,feminine,regular,\nārum,plural,genitive,1st,feminine,regular,\num,plural,genitive,1st,feminine,irregular,3\nōrum,plural,genitive,2nd,masculine feminine,regular,\num,plural,genitive,2nd,masculine feminine,irregular,\nom,plural,genitive,2nd,masculine feminine,irregular,8\nōrum,plural,genitive,2nd,neuter,regular,\num,plural,genitive,2nd,neuter,irregular,\num,plural,genitive,3rd,masculine feminine,regular,\nium,plural,genitive,3rd,masculine feminine,irregular,11\nōn,plural,genitive,3rd,masculine feminine,irregular,7\num,plural,genitive,3rd,neuter,regular,\nium,plural,genitive,3rd,neuter,irregular,11\nuum,plural,genitive,4th,masculine feminine,regular,\num,plural,genitive,4th,masculine feminine,irregular,16\nuom,plural,genitive,4th,masculine feminine,irregular,1\nuum,plural,genitive,4th,neuter,regular,\nērum,plural,genitive,5th,feminine,regular,\nīs,plural,dative,1st,feminine,regular,\nābus,plural,dative,1st,feminine,irregular,4\neis,plural,dative,1st,feminine,irregular,6\nīs,plural,dative,2nd,masculine feminine,regular,\nīs,plural,dative,2nd,neuter,regular,\nibus,plural,dative,3rd,masculine feminine,regular,\nibus,plural,dative,3rd,neuter,regular,\nibus,plural,dative,4th,masculine feminine,regular,\nubus,plural,dative,4th,masculine feminine,irregular,14\nibus,plural,dative,4th,neuter,regular,\nēbus,plural,dative,5th,feminine,regular,\nās,plural,accusative,1st,feminine,regular,\nōs,plural,accusative,2nd,masculine feminine,regular,\na,plural,accusative,2nd,neuter,regular,\nēs,plural,accusative,3rd,masculine feminine,regular,\nīs,plural,accusative,3rd,masculine feminine,irregular,11\nas,plural,accusative,3rd,masculine feminine,irregular,7\na,plural,accusative,3rd,neuter,regular,\nia,plural,accusative,3rd,neuter,irregular,11\nūs,plural,accusative,4th,masculine feminine,regular,\nua,plural,accusative,4th,neuter,regular,\nēs,plural,accusative,5th,feminine,regular,\nīs,plural,ablative,1st,feminine,regular,\nābus,plural,ablative,1st,feminine,irregular,4\neis,plural,ablative,1st,feminine,irregular,6\nīs,plural,ablative,2nd,masculine feminine,regular,\nīs,plural,ablative,2nd,neuter,regular,\nibus,plural,ablative,3rd,masculine feminine,regular,\nibus,plural,ablative,3rd,neuter,regular,\nibus,plural,ablative,4th,masculine feminine,regular,\nubus,plural,ablative,4th,masculine feminine,irregular,14\nibus,plural,ablative,4th,neuter,regular,\nēbus,plural,ablative,5th,feminine,regular,\nīs,plural,locative,1st,feminine,regular,\nīs,plural,locative,2nd,masculine feminine,regular,\nīs,plural,locative,2nd,neuter,regular,\nibus,plural,locative,3rd,masculine feminine,regular,\nibus,plural,locative,3rd,neuter,regular,\nibus,plural,locative,4th,masculine feminine,regular,\nibus,plural,locative,4th,neuter,regular,\nēbus,plural,locative,5th,feminine,regular,\nae,plural,vocative,1st,feminine,regular,\nī,plural,vocative,2nd,masculine feminine,regular,\na,plural,vocative,2nd,neuter,regular,\nēs,plural,vocative,3rd,masculine feminine,regular,\na,plural,vocative,3rd,neuter,regular,\nia,plural,vocative,3rd,neuter,irregular,11\nūs,plural,vocative,4th,masculine feminine,regular,\nua,plural,vocative,4th,neuter,regular,\nēs,plural,vocative,5th,feminine,regular,";

var nounFootnotesCSV = "Index,Text\n1,archaic (final s and m of os and om may be omitted in inscriptions)\n2,only in familiās\n3,especially in Greek patronymics and compounds in -gena and -cola.\n4,always in deābus and filiābus; rarely with other words to distinguish the female\n5,archaic\n6,rare\n7,\"may occur in words of Greek origin. The forms of many Greek nouns vary among the first, second and third declensions.\"\n8,proper names in ius and filius and genius\n9,poetic\n10,\"only pelagus, vīrus, and sometimes vulgus\"\n11,may occur with i-stems\n12,several nouns (most commonly domus) show forms of both second and fourth declensions\n13,\"some nouns also have forms from the first declension (eg materia, saevitia) or the third declension (eg requiēs, satiēs, plēbēs, famēs)\"\n14,\"Always in partus and tribus, usually in artus and lacus, sometimes in other words, eg portus and specus\"\n15,Often in names of plants and trees and in nouns ending in -tus\n16,When pronounced as one syllable\n17,early\n18,dies and meridies are masculine";

var adjectiveSuffixesCSV = "Ending,Number,Case,Declension,Gender,Type,Footnote\na,singular,nominative,1st 2nd,feminine,regular,\nus,singular,nominative,1st 2nd,masculine,regular,\num,singular,nominative,1st 2nd,neuter,regular,\nis,singular,nominative,3rd,feminine,regular,\n-,singular,nominative,3rd,feminine,irregular,6\n-,singular,nominative,3rd,masculine,regular,\nis,singular,nominative,3rd,masculine,irregular,5\ne,singular,nominative,3rd,neuter,regular,\n-,singular,nominative,3rd,neuter,irregular,6\nae,singular,genitive,1st 2nd,feminine,regular,\nīus,singular,genitive,1st 2nd,feminine,irregular,3\nī,singular,genitive,1st 2nd,masculine,regular,\nīus,singular,genitive,1st 2nd,masculine,irregular,3\nī,singular,genitive,1st 2nd,neuter,regular,\nīus,singular,genitive,1st 2nd,neuter,irregular,3\nis,singular,genitive,3rd,feminine,regular,\nis,singular,genitive,3rd,masculine,regular,\nis,singular,genitive,3rd,neuter,regular,\nae,singular,dative,1st 2nd,feminine,regular,\nī,singular,dative,1st 2nd,feminine,irregular,3\nō,singular,dative,1st 2nd,masculine,regular,\nī,singular,dative,1st 2nd,masculine,irregular,3\nō,singular,dative,1st 2nd,neuter,regular,\nī,singular,dative,1st 2nd,neuter,irregular,3\nī,singular,dative,3rd,feminine,regular,\nī,singular,dative,3rd,masculine,regular,\nī,singular,dative,3rd,neuter,regular,\nam,singular,accusative,1st 2nd,feminine,regular,\num,singular,accusative,1st 2nd,masculine,regular,\num,singular,accusative,1st 2nd,neuter,regular,\nem,singular,accusative,3rd,feminine,regular,\nem,singular,accusative,3rd,masculine,regular,\ne,singular,accusative,3rd,neuter,regular,\n-,singular,accusative,3rd,neuter,irregular,6\nā,singular,ablative,1st 2nd,feminine,regular,\nō,singular,ablative,1st 2nd,feminine,irregular,4\nō,singular,ablative,1st 2nd,masculine,regular,\nō,singular,ablative,1st 2nd,neuter,regular,\nī,singular,ablative,3rd,feminine,regular,\ne,singular,ablative,3rd,feminine,irregular,7\nī,singular,ablative,3rd,masculine,regular,\ne,singular,ablative,3rd,masculine,irregular,7\nī,singular,ablative,3rd,neuter,regular,\nae,singular,locative,1st 2nd,feminine,regular,\nī,singular,locative,1st 2nd,masculine,regular,\nī,singular,locative,1st 2nd,neuter,regular,\nī,singular,locative,3rd,feminine,regular,\ne,singular,locative,3rd,feminine,irregular,7\nī,singular,locative,3rd,masculine,regular,\nī,singular,locative,3rd,neuter,regular,\na,singular,vocative,1st 2nd,feminine,regular,\ne,singular,vocative,1st 2nd,masculine,regular,\nī,singular,vocative,1st 2nd,masculine,irregular,\num,singular,vocative,1st 2nd,neuter,regular,\nis,singular,vocative,3rd,feminine,regular,\n-,singular,vocative,3rd,masculine,regular,\ne,singular,vocative,3rd,neuter,regular,\n-,singular,vocative,3rd,neuter,irregular,6\nae,plural,nominative,1st 2nd,feminine,regular,\nī,plural,nominative,1st 2nd,masculine,regular,\na,plural,nominative,1st 2nd,neuter,regular,\nēs,plural,nominative,3rd,feminine,regular,\nēs,plural,nominative,3rd,masculine,regular,\nia,plural,nominative,3rd,neuter,regular,\nārum,plural,genitive,1st 2nd,feminine,regular,\nōrum,plural,genitive,1st 2nd,masculine,regular,\nōrum,plural,genitive,1st 2nd,neuter,regular,\nium,plural,genitive,3rd,feminine,regular,\num,plural,genitive,3rd,feminine,irregular,8\nium,plural,genitive,3rd,masculine,regular,\num,plural,genitive,3rd,masculine,irregular,8\nium,plural,genitive,3rd,neuter,regular,\num,plural,genitive,3rd,neuter,irregular,8\nīs,plural,dative,1st 2nd,feminine,regular,\nīs,plural,dative,1st 2nd,masculine,regular,\nīs,plural,dative,1st 2nd,neuter,regular,\nibus,plural,dative,3rd,feminine,regular,\nibus,plural,dative,3rd,masculine,regular,\nibus,plural,dative,3rd,neuter,regular,\nās,plural,accusative,1st 2nd,feminine,regular,\nōs,plural,accusative,1st 2nd,masculine,regular,\na,plural,accusative,1st 2nd,neuter,regular,\nīs,plural,accusative,3rd,feminine,regular,\nēs,plural,accusative,3rd,feminine,irregular,9\nīs,plural,accusative,3rd,masculine,regular,\nēs,plural,accusative,3rd,masculine,irregular,9\nia,plural,accusative,3rd,neuter,regular,\nīs,plural,ablative,1st 2nd,feminine,regular,\nīs,plural,ablative,1st 2nd,masculine,regular,\nīs,plural,ablative,1st 2nd,neuter,regular,\nibus,plural,ablative,3rd,feminine,regular,\nibus,plural,ablative,3rd,masculine,regular,\nibus,plural,ablative,3rd,neuter,regular,\nīs,plural,locative,1st 2nd,feminine,regular,\nīs,plural,locative,1st 2nd,masculine,regular,\nīs,plural,locative,1st 2nd,neuter,regular,\nibus,plural,locative,3rd,feminine,regular,\nibus,plural,locative,3rd,masculine,regular,\nibus,plural,locative,3rd,neuter,regular,\nae,plural,vocative,1st 2nd,feminine,regular,\nī,plural,vocative,1st 2nd,masculine,regular,\na,plural,vocative,1st 2nd,neuter,regular,\nēs,plural,vocative,3rd,feminine,regular,\nēs,plural,vocative,3rd,masculine,regular,\nia,plural,vocative,3rd,neuter,regular,";

var adjectiveFootnotesCSV = "Index,Text\n1,\"Adjectives agree with the noun they modify in gender, number and case.\"\n2,Adjectives are inflected according to either\n3,\"Only nullus, sōlus, alius (alia, aliud), tōtus, ūllus, ūnus, alter, neuter (neutra,\n            neutrum) and uter (utra, utrum).\"\n4,In a few adjectives of Greek origin.\n5,\"The \"\"two-ending\"\" adjectives use \"\"-is\"\", for both masculine and feminine nominative\n            singular.\"\n6,\"The \"\"one-ending\"\" adjectives use the same consonant ending for all three genders in the\n            nominative singular and the neuter accusative and vocative singular.\"\n7,\"An ablative singular in \"\"e\"\" is common in one-ending adjectives, but is usually confined to\n            poetry in three and two-ending adjectives.\"\n8,\"In comparatives, poetry and some one-ending adjectives.\"\n9,Chiefly in comparatives.";

var verbSuffixesCSV = "Ending,Conjugation,Voice,Mood,Tense,Number,Person,Type,Footnote\nō,1st,active,indicative,present,singular,1st,regular,\nās,1st,active,indicative,present,singular,2nd,regular,\nat,1st,active,indicative,present,singular,3rd,regular,\nāmus,1st,active,indicative,present,plural,1st,regular,\nātis,1st,active,indicative,present,plural,2nd,regular,\nant,1st,active,indicative,present,plural,3rd,regular,\nem,1st,active,subjunctive,present,singular,1st,regular,\nēs,1st,active,subjunctive,present,singular,2nd,regular,\net,1st,active,subjunctive,present,singular,3rd,regular,\nēmus,1st,active,subjunctive,present,plural,1st,regular,\nētis,1st,active,subjunctive,present,plural,2nd,regular,\nent,1st,active,subjunctive,present,plural,3rd,regular,\neō,2nd,active,indicative,present,singular,1st,regular,\nēs,2nd,active,indicative,present,singular,2nd,regular,\nēt,2nd,active,indicative,present,singular,3rd,regular,\nēmus,2nd,active,indicative,present,plural,1st,regular,\nētis,2nd,active,indicative,present,plural,2nd,regular,\nent,2nd,active,indicative,present,plural,3rd,regular,\neam,2nd,active,subjunctive,present,singular,1st,regular,\neās,2nd,active,subjunctive,present,singular,2nd,regular,\neat,2nd,active,subjunctive,present,singular,3rd,regular,\neāmus,2nd,active,subjunctive,present,plural,1st,regular,\neātis,2nd,active,subjunctive,present,plural,2nd,regular,\neant,2nd,active,subjunctive,present,plural,3rd,regular,\nō,3rd,active,indicative,present,singular,1st,regular,\nis,3rd,active,indicative,present,singular,2nd,regular,\nit,3rd,active,indicative,present,singular,3rd,regular,\nimus,3rd,active,indicative,present,plural,1st,regular,\nitis,3rd,active,indicative,present,plural,2nd,regular,\nunt,3rd,active,indicative,present,plural,3rd,regular,\nam,3rd,active,subjunctive,present,singular,1st,regular,\nās,3rd,active,subjunctive,present,singular,2nd,regular,\nat,3rd,active,subjunctive,present,singular,3rd,regular,\nāmus,3rd,active,subjunctive,present,plural,1st,regular,\nātis,3rd,active,subjunctive,present,plural,2nd,regular,\nant,3rd,active,subjunctive,present,plural,3rd,regular,\niō,4th,active,indicative,present,singular,1st,regular,\nīs,4th,active,indicative,present,singular,2nd,regular,\nit,4th,active,indicative,present,singular,3rd,regular,\nīmus,4th,active,indicative,present,plural,1st,regular,\nītis,4th,active,indicative,present,plural,2nd,regular,\niunt,4th,active,indicative,present,plural,3rd,regular,\niam,4th,active,subjunctive,present,singular,1st,regular,\niās,4th,active,subjunctive,present,singular,2nd,regular,\niat,4th,active,subjunctive,present,singular,3rd,regular,\niāmus,4th,active,subjunctive,present,plural,1st,regular,\niāatis,4th,active,subjunctive,present,plural,2nd,regular,\niant,4th,active,subjunctive,present,plural,3rd,regular,\nābam,1st,active,indicative,imperfect,singular,1st,regular,\nābas,1st,active,indicative,imperfect,singular,2nd,regular,\nābat,1st,active,indicative,imperfect,singular,3rd,regular,\nābāmus,1st,active,indicative,imperfect,plural,1st,regular,\nābātis,1st,active,indicative,imperfect,plural,2nd,regular,\nābant,1st,active,indicative,imperfect,plural,3rd,regular,\nārem,1st,active,subjunctive,imperfect,singular,1st,regular,\nārēs,1st,active,subjunctive,imperfect,singular,2nd,regular,\nāret,1st,active,subjunctive,imperfect,singular,3rd,regular,\nārēmus,1st,active,subjunctive,imperfect,plural,1st,regular,\nārētis,1st,active,subjunctive,imperfect,plural,2nd,regular,\nārent,1st,active,subjunctive,imperfect,plural,3rd,regular,\nēbam,2nd,active,indicative,imperfect,singular,1st,regular,\nēbās,2nd,active,indicative,imperfect,singular,2nd,regular,\nēbat,2nd,active,indicative,imperfect,singular,3rd,regular,\nēbāmus,2nd,active,indicative,imperfect,plural,1st,regular,\nēbātis,2nd,active,indicative,imperfect,plural,2nd,regular,\nēbant,2nd,active,indicative,imperfect,plural,3rd,regular,\nērem,2nd,active,subjunctive,imperfect,singular,1st,regular,\nērēs,2nd,active,subjunctive,imperfect,singular,2nd,regular,\nēret,2nd,active,subjunctive,imperfect,singular,3rd,regular,\nērēmus,2nd,active,subjunctive,imperfect,plural,1st,regular,\nērētis,2nd,active,subjunctive,imperfect,plural,2nd,regular,\nērēnt,2nd,active,subjunctive,imperfect,plural,3rd,regular,\nēbas,3rd,active,indicative,imperfect,singular,1st,regular,\nēbāt,3rd,active,indicative,imperfect,singular,2nd,regular,\nēbat,3rd,active,indicative,imperfect,singular,3rd,regular,\nēbāmus,3rd,active,indicative,imperfect,plural,1st,regular,\nēbātis,3rd,active,indicative,imperfect,plural,2nd,regular,\nēbant,3rd,active,indicative,imperfect,plural,3rd,regular,\nerem,3rd,active,subjunctive,imperfect,singular,1st,regular,\nerēs,3rd,active,subjunctive,imperfect,singular,2nd,regular,\neret,3rd,active,subjunctive,imperfect,singular,3rd,regular,\nerēmus,3rd,active,subjunctive,imperfect,plural,1st,regular,\nerētis,3rd,active,subjunctive,imperfect,plural,2nd,regular,\nerent,3rd,active,subjunctive,imperfect,plural,3rd,regular,\niēbam,4th,active,indicative,imperfect,singular,1st,regular,\nībam,4th,active,indicative,imperfect,singular,1st,irregular,2\niēbas,4th,active,indicative,imperfect,singular,2nd,regular,\nības,4th,active,indicative,imperfect,singular,2nd,irregular,\niēbat,4th,active,indicative,imperfect,singular,3rd,regular,\nībat,4th,active,indicative,imperfect,singular,3rd,irregular,\niēbāmus,4th,active,indicative,imperfect,plural,1st,regular,\nībāmus,4th,active,indicative,imperfect,plural,1st,irregular,\niēbātis,4th,active,indicative,imperfect,plural,2nd,regular,\nībātis,4th,active,indicative,imperfect,plural,2nd,irregular,\niēbant,4th,active,indicative,imperfect,plural,3rd,regular,\nībant,4th,active,indicative,imperfect,plural,3rd,irregular,\nīrem,4th,active,subjunctive,imperfect,singular,1st,regular,\nīrēs,4th,active,subjunctive,imperfect,singular,2nd,regular,\nīret,4th,active,subjunctive,imperfect,singular,3rd,regular,\nīrēmus,4th,active,subjunctive,imperfect,plural,1st,regular,\nīrētis,4th,active,subjunctive,imperfect,plural,2nd,regular,\nīrēnt,4th,active,subjunctive,imperfect,plural,3rd,regular,\nābo,1st,active,indicative,future,singular,1st,regular,\nābis,1st,active,indicative,future,singular,2nd,regular,\nābit,1st,active,indicative,future,singular,3rd,regular,\nābimus,1st,active,indicative,future,plural,1st,regular,\nābitis,1st,active,indicative,future,plural,2nd,regular,\nābunt,1st,active,indicative,future,plural,3rd,regular,\n,1st,active,subjunctive,future,singular,1st,,\n,1st,active,subjunctive,future,singular,2nd,,\n,1st,active,subjunctive,future,singular,3rd,,\n,1st,active,subjunctive,future,plural,1st,,\n,1st,active,subjunctive,future,plural,2nd,,\n,1st,active,subjunctive,future,plural,3rd,,\nēbō,2nd,active,indicative,future,singular,1st,regular,\nēbis,2nd,active,indicative,future,singular,2nd,regular,\nēbit,2nd,active,indicative,future,singular,3rd,regular,\nēbimus,2nd,active,indicative,future,plural,1st,regular,\nēbitis,2nd,active,indicative,future,plural,2nd,regular,\nēbunt,2nd,active,indicative,future,plural,3rd,regular,\n,2nd,active,subjunctive,future,singular,1st,regular,\n,2nd,active,subjunctive,future,singular,2nd,,\n,2nd,active,subjunctive,future,singular,3rd,,\n,2nd,active,subjunctive,future,plural,1st,,\n,2nd,active,subjunctive,future,plural,2nd,,\n,2nd,active,subjunctive,future,plural,3rd,,\nam,3rd,active,indicative,future,singular,1st,regular,\nēs,3rd,active,indicative,future,singular,2nd,regular,\net,3rd,active,indicative,future,singular,3rd,regular,\nēmus,3rd,active,indicative,future,plural,1st,regular,\nētis,3rd,active,indicative,future,plural,2nd,regular,\nent,3rd,active,indicative,future,plural,3rd,regular,\n,3rd,active,subjunctive,future,singular,1st,,\n,3rd,active,subjunctive,future,singular,2nd,,\n,3rd,active,subjunctive,future,singular,3rd,,\n,3rd,active,subjunctive,future,plural,1st,,\n,3rd,active,subjunctive,future,plural,2nd,,\n,3rd,active,subjunctive,future,plural,3rd,,\niam,4th,active,indicative,future,singular,1st,regular,\nībō,4th,active,indicative,future,singular,1st,irregular,2\niēs,4th,active,indicative,future,singular,2nd,regular,\nībis,4th,active,indicative,future,singular,2nd,irregular,\niet,4th,active,indicative,future,singular,3rd,regular,\nībit,4th,active,indicative,future,singular,3rd,irregular,\niēmus,4th,active,indicative,future,plural,1st,regular,\nībimus,4th,active,indicative,future,plural,1st,irregular,\niētis,4th,active,indicative,future,plural,2nd,regular,\nībitis,4th,active,indicative,future,plural,2nd,irregular,\nient,4th,active,indicative,future,plural,3rd,regular,\nībunt,4th,active,indicative,future,plural,3rd,irregular,\n,4th,active,subjunctive,future,singular,1st,,\n,4th,active,subjunctive,future,singular,2nd,,\n,4th,active,subjunctive,future,singular,3rd,,\n,4th,active,subjunctive,future,plural,1st,,\n,4th,active,subjunctive,future,plural,2nd,,\n,4th,active,subjunctive,future,plural,3rd,,\nāvī,1st,active,indicative,perfect,singular,1st,regular,\nāvistī,1st,active,indicative,perfect,singular,2nd,regular,\nāvit,1st,active,indicative,perfect,singular,3rd,regular,\nāvimus,1st,active,indicative,perfect,plural,1st,regular,\nāvistis,1st,active,indicative,perfect,plural,2nd,regular,\nāvērunt,1st,active,indicative,perfect,plural,3rd,regular,\nāvēre,1st,active,indicative,perfect,plural,3rd,irregular,6\nāverim,1st,active,subjunctive,perfect,singular,1st,regular,\nāveris,1st,active,subjunctive,perfect,singular,2nd,regular,\nāverit,1st,active,subjunctive,perfect,singular,3rd,regular,\nāverimus,1st,active,subjunctive,perfect,plural,1st,regular,\nāveritis,1st,active,subjunctive,perfect,plural,2nd,regular,\nāverint,1st,active,subjunctive,perfect,plural,3rd,regular,\nvī,2nd,active,indicative,perfect,singular,1st,regular,\nvistī,2nd,active,indicative,perfect,singular,2nd,regular,\nvit,2nd,active,indicative,perfect,singular,3rd,regular,\nvimus,2nd,active,indicative,perfect,plural,1st,regular,\nvistis,2nd,active,indicative,perfect,plural,2nd,regular,\nvērunt,2nd,active,indicative,perfect,plural,3rd,regular,\nvēre,2nd,active,indicative,perfect,plural,3rd,irregular,6\nverim,2nd,active,subjunctive,perfect,singular,1st,regular,\nveris,2nd,active,subjunctive,perfect,singular,2nd,regular,\nverit,2nd,active,subjunctive,perfect,singular,3rd,regular,\nverimus,2nd,active,subjunctive,perfect,plural,1st,regular,\nveritis,2nd,active,subjunctive,perfect,plural,2nd,regular,\nverint,2nd,active,subjunctive,perfect,plural,3rd,regular,\nī,3rd,active,indicative,perfect,singular,1st,regular,\nistī,3rd,active,indicative,perfect,singular,2nd,regular,\nit,3rd,active,indicative,perfect,singular,3rd,regular,\nimus,3rd,active,indicative,perfect,plural,1st,regular,\nistis,3rd,active,indicative,perfect,plural,2nd,regular,\nērunt,3rd,active,indicative,perfect,plural,3rd,regular,\nēre,3rd,active,indicative,perfect,plural,3rd,irregular,6\nerim,3rd,active,subjunctive,perfect,singular,1st,regular,\neris,3rd,active,subjunctive,perfect,singular,2nd,regular,\nerit,3rd,active,subjunctive,perfect,singular,3rd,regular,\nerimus,3rd,active,subjunctive,perfect,plural,1st,regular,\neritis,3rd,active,subjunctive,perfect,plural,2nd,regular,\nerint,3rd,active,subjunctive,perfect,plural,3rd,regular,\nīvi,4th,active,indicative,perfect,singular,1st,regular,\nīvistī,4th,active,indicative,perfect,singular,2nd,regular,\nīvit,4th,active,indicative,perfect,singular,3rd,regular,\nīvimus,4th,active,indicative,perfect,plural,1st,regular,\nīvistis,4th,active,indicative,perfect,plural,2nd,regular,\nīvērunt,4th,active,indicative,perfect,plural,3rd,regular,\nīvēre,4th,active,indicative,perfect,plural,3rd,irregular,6\nīverim,4th,active,subjunctive,perfect,singular,1st,regular,\niveris,4th,active,subjunctive,perfect,singular,2nd,regular,\nīverit,4th,active,subjunctive,perfect,singular,3rd,regular,\nīverimus,4th,active,subjunctive,perfect,plural,1st,regular,\nīveritis,4th,active,subjunctive,perfect,plural,2nd,regular,\nīverint,4th,active,subjunctive,perfect,plural,3rd,regular,\nāveram,1st,active,indicative,pluperfect,singular,1st,regular,\nāverās,1st,active,indicative,pluperfect,singular,2nd,regular,\nāverat,1st,active,indicative,pluperfect,singular,3rd,regular,\nāverāmus,1st,active,indicative,pluperfect,plural,1st,regular,\nāverātis,1st,active,indicative,pluperfect,plural,2nd,regular,\nāverant,1st,active,indicative,pluperfect,plural,3rd,regular,\nāvissem,1st,active,subjunctive,pluperfect,singular,1st,regular,\nāvissēs,1st,active,subjunctive,pluperfect,singular,2nd,regular,\nāvisset,1st,active,subjunctive,pluperfect,singular,3rd,regular,\nāvissēm,1st,active,subjunctive,pluperfect,plural,1st,regular,\nāvissēs,1st,active,subjunctive,pluperfect,plural,2nd,regular,\nāvisset,1st,active,subjunctive,pluperfect,plural,3rd,regular,\nveram,2nd,active,indicative,pluperfect,singular,1st,regular,\nverās,2nd,active,indicative,pluperfect,singular,2nd,regular,\nverat,2nd,active,indicative,pluperfect,singular,3rd,regular,\nverāmus,2nd,active,indicative,pluperfect,plural,1st,regular,\nverātis,2nd,active,indicative,pluperfect,plural,2nd,regular,\nverant,2nd,active,indicative,pluperfect,plural,3rd,regular,\nvissem,2nd,active,subjunctive,pluperfect,singular,1st,regular,\nvissēs,2nd,active,subjunctive,pluperfect,singular,2nd,regular,\nvisset,2nd,active,subjunctive,pluperfect,singular,3rd,regular,\nvissēmus,2nd,active,subjunctive,pluperfect,plural,1st,regular,\nvissētis,2nd,active,subjunctive,pluperfect,plural,2nd,regular,\nvissent,2nd,active,subjunctive,pluperfect,plural,3rd,regular,\neram,3rd,active,indicative,pluperfect,singular,1st,regular,\nerās,3rd,active,indicative,pluperfect,singular,2nd,regular,\nerat,3rd,active,indicative,pluperfect,singular,3rd,regular,\nerāmus,3rd,active,indicative,pluperfect,plural,1st,regular,\nerātis,3rd,active,indicative,pluperfect,plural,2nd,regular,\nerant,3rd,active,indicative,pluperfect,plural,3rd,regular,\nissem,3rd,active,subjunctive,pluperfect,singular,1st,regular,\nissēs,3rd,active,subjunctive,pluperfect,singular,2nd,regular,\nisset,3rd,active,subjunctive,pluperfect,singular,3rd,regular,\nissēmus,3rd,active,subjunctive,pluperfect,plural,1st,regular,\nissētis,3rd,active,subjunctive,pluperfect,plural,2nd,regular,\nissent,3rd,active,subjunctive,pluperfect,plural,3rd,regular,\nīveram,4th,active,indicative,pluperfect,singular,1st,regular,\nīverās,4th,active,indicative,pluperfect,singular,2nd,regular,\nīverat,4th,active,indicative,pluperfect,singular,3rd,regular,\nīverāmus,4th,active,indicative,pluperfect,plural,1st,regular,\nīverātis,4th,active,indicative,pluperfect,plural,2nd,regular,\nīverant,4th,active,indicative,pluperfect,plural,3rd,regular,\nīvissem,4th,active,subjunctive,pluperfect,singular,1st,regular,\nīvissēs,4th,active,subjunctive,pluperfect,singular,2nd,regular,\nīvisset,4th,active,subjunctive,pluperfect,singular,3rd,regular,\nīvissēmus,4th,active,subjunctive,pluperfect,plural,1st,regular,\nīvissētis,4th,active,subjunctive,pluperfect,plural,2nd,regular,\nīvissent,4th,active,subjunctive,pluperfect,plural,3rd,regular,\nāverō,1st,active,indicative,future_perfect,singular,1st,regular,\nāveris,1st,active,indicative,future_perfect,singular,2nd,regular,\nāverit,1st,active,indicative,future_perfect,singular,3rd,regular,\nāverimus,1st,active,indicative,future_perfect,plural,1st,regular,\nāveritis,1st,active,indicative,future_perfect,plural,2nd,regular,\nāverint,1st,active,indicative,future_perfect,plural,3rd,regular,\n,1st,active,subjunctive,future_perfect,singular,1st,,\n,1st,active,subjunctive,future_perfect,singular,2nd,,\n,1st,active,subjunctive,future_perfect,singular,3rd,,\n,1st,active,subjunctive,future_perfect,plural,1st,,\n,1st,active,subjunctive,future_perfect,plural,2nd,,\n,1st,active,subjunctive,future_perfect,plural,3rd,,\nverō,2nd,active,indicative,future_perfect,singular,1st,regular,\nvēris,2nd,active,indicative,future_perfect,singular,2nd,regular,\nvērit,2nd,active,indicative,future_perfect,singular,3rd,regular,\nvērimus,2nd,active,indicative,future_perfect,plural,1st,regular,\nvēritis,2nd,active,indicative,future_perfect,plural,2nd,regular,\nvērint,2nd,active,indicative,future_perfect,plural,3rd,regular,\n,2nd,active,subjunctive,future_perfect,singular,1st,,\n,2nd,active,subjunctive,future_perfect,singular,2nd,,\n,2nd,active,subjunctive,future_perfect,singular,3rd,,\n,2nd,active,subjunctive,future_perfect,plural,1st,,\n,2nd,active,subjunctive,future_perfect,plural,2nd,,\n,2nd,active,subjunctive,future_perfect,plural,3rd,,\nerō,3rd,active,indicative,future_perfect,singular,1st,regular,\neris,3rd,active,indicative,future_perfect,singular,2nd,regular,\nerit,3rd,active,indicative,future_perfect,singular,3rd,regular,\nerimus,3rd,active,indicative,future_perfect,plural,1st,regular,\neritis,3rd,active,indicative,future_perfect,plural,2nd,regular,\nerint,3rd,active,indicative,future_perfect,plural,3rd,regular,\n,3rd,active,subjunctive,future_perfect,singular,1st,,\n,3rd,active,subjunctive,future_perfect,singular,2nd,,\n,3rd,active,subjunctive,future_perfect,singular,3rd,,\n,3rd,active,subjunctive,future_perfect,plural,1st,,\n,3rd,active,subjunctive,future_perfect,plural,2nd,,\n,3rd,active,subjunctive,future_perfect,plural,3rd,,\nīverō,4th,active,indicative,future_perfect,singular,1st,regular,\nīveris,4th,active,indicative,future_perfect,singular,2nd,regular,\nīverit,4th,active,indicative,future_perfect,singular,3rd,regular,\nīverimus,4th,active,indicative,future_perfect,plural,1st,regular,\nīveritis,4th,active,indicative,future_perfect,plural,2nd,regular,\nīverint,4th,active,indicative,future_perfect,plural,3rd,regular,\n,4th,active,subjunctive,future_perfect,singular,1st,,\n,4th,active,subjunctive,future_perfect,singular,2nd,,\n,4th,active,subjunctive,future_perfect,singular,3rd,,\n,4th,active,subjunctive,future_perfect,plural,1st,,\n,4th,active,subjunctive,future_perfect,plural,2nd,,\n,4th,active,subjunctive,future_perfect,plural,3rd,,\nor,1st,passive,indicative,present,singular,1st,regular,\nāris,1st,passive,indicative,present,singular,2nd,regular,\nāre,1st,passive,indicative,present,singular,2nd,irregular,5\nātur,1st,passive,indicative,present,singular,3rd,regular,\nāmur,1st,passive,indicative,present,plural,1st,regular,\nāminiī,1st,passive,indicative,present,plural,2nd,regular,\nantur,1st,passive,indicative,present,plural,3rd,regular,\ner,1st,passive,subjunctive,present,singular,1st,regular,\nēris,1st,passive,subjunctive,present,singular,2nd,regular,\nēre,1st,passive,subjunctive,present,singular,2nd,regular,\nētur,1st,passive,subjunctive,present,singular,3rd,regular,\nēmur,1st,passive,subjunctive,present,plural,1st,regular,\nēminī,1st,passive,subjunctive,present,plural,2nd,regular,\nentur,1st,passive,subjunctive,present,plural,3rd,regular,\neor,2nd,passive,indicative,present,singular,1st,regular,\nēris,2nd,passive,indicative,present,singular,2nd,regular,\nēre,2nd,passive,indicative,present,singular,2nd,regular,\nētur,2nd,passive,indicative,present,singular,3rd,regular,\nēmur,2nd,passive,indicative,present,plural,1st,regular,\nēmini,2nd,passive,indicative,present,plural,2nd,regular,\nentur,2nd,passive,indicative,present,plural,3rd,regular,\near,2nd,passive,subjunctive,present,singular,1st,regular,\neāris,2nd,passive,subjunctive,present,singular,2nd,regular,\neāre,2nd,passive,subjunctive,present,singular,2nd,regular,\neātur,2nd,passive,subjunctive,present,singular,3rd,regular,\neāmur,2nd,passive,subjunctive,present,plural,1st,regular,\neāminī,2nd,passive,subjunctive,present,plural,2nd,regular,\neantur,2nd,passive,subjunctive,present,plural,3rd,regular,\nor,3rd,passive,indicative,present,singular,1st,regular,\neris,3rd,passive,indicative,present,singular,2nd,regular,\nere,3rd,passive,indicative,present,singular,2nd,regular,\nitur,3rd,passive,indicative,present,singular,3rd,regular,\nimur,3rd,passive,indicative,present,plural,1st,regular,\niminī,3rd,passive,indicative,present,plural,2nd,regular,\nuntur,3rd,passive,indicative,present,plural,3rd,regular,\nar,3rd,passive,subjunctive,present,singular,1st,regular,\nāris,3rd,passive,subjunctive,present,singular,2nd,regular,\nāre,3rd,passive,subjunctive,present,singular,2nd,regular,\nātur,3rd,passive,subjunctive,present,singular,3rd,regular,\nāmur,3rd,passive,subjunctive,present,plural,1st,regular,\nāminī,3rd,passive,subjunctive,present,plural,2nd,regular,\nantur,3rd,passive,subjunctive,present,plural,3rd,regular,\nior,4th,passive,indicative,present,singular,1st,regular,\nīris,4th,passive,indicative,present,singular,2nd,regular,\nīre,4th,passive,indicative,present,singular,2nd,regular,\nītur,4th,passive,indicative,present,singular,3rd,regular,\nīmur,4th,passive,indicative,present,plural,1st,regular,\nīminī,4th,passive,indicative,present,plural,2nd,regular,\niuntur,4th,passive,indicative,present,plural,3rd,regular,\niar,4th,passive,subjunctive,present,singular,1st,regular,\niāris,4th,passive,subjunctive,present,singular,2nd,regular,\niāre,4th,passive,subjunctive,present,singular,2nd,regular,\niātur,4th,passive,subjunctive,present,singular,3rd,regular,\niāmur,4th,passive,subjunctive,present,plural,1st,regular,\niāminī,4th,passive,subjunctive,present,plural,2nd,regular,\niantur,4th,passive,subjunctive,present,plural,3rd,regular,\nābar,1st,passive,indicative,imperfect,singular,1st,regular,\nābāaris,1st,passive,indicative,imperfect,singular,2nd,regular,\nābāre,1st,passive,indicative,imperfect,singular,2nd,regular,\nābātur,1st,passive,indicative,imperfect,singular,3rd,regular,\nābāmur,1st,passive,indicative,imperfect,plural,1st,regular,\nābāminī,1st,passive,indicative,imperfect,plural,2nd,regular,\nābantur,1st,passive,indicative,imperfect,plural,3rd,regular,\nārer,1st,passive,subjunctive,imperfect,singular,1st,regular,\nārēris,1st,passive,subjunctive,imperfect,singular,2nd,regular,\nārēre,1st,passive,subjunctive,imperfect,singular,2nd,regular,\nārētur,1st,passive,subjunctive,imperfect,singular,3rd,regular,\nārēmur,1st,passive,subjunctive,imperfect,plural,1st,regular,\nārēminī,1st,passive,subjunctive,imperfect,plural,2nd,regular,\nārentur,1st,passive,subjunctive,imperfect,plural,3rd,regular,\nēbar,2nd,passive,indicative,imperfect,singular,1st,regular,\nēbāris,2nd,passive,indicative,imperfect,singular,2nd,regular,\nēbāre,2nd,passive,indicative,imperfect,singular,2nd,regular,\nēbātur,2nd,passive,indicative,imperfect,singular,3rd,regular,\nēbāmur,2nd,passive,indicative,imperfect,plural,1st,regular,\nēbāmini,2nd,passive,indicative,imperfect,plural,2nd,regular,\nēbantur,2nd,passive,indicative,imperfect,plural,3rd,regular,\nērer,2nd,passive,subjunctive,imperfect,singular,1st,regular,\nērēris,2nd,passive,subjunctive,imperfect,singular,2nd,regular,\nērēre,2nd,passive,subjunctive,imperfect,singular,2nd,regular,\nērētur,2nd,passive,subjunctive,imperfect,singular,3rd,regular,\nērēmur,2nd,passive,subjunctive,imperfect,plural,1st,regular,\nērēminī,2nd,passive,subjunctive,imperfect,plural,2nd,regular,\nērentur,2nd,passive,subjunctive,imperfect,plural,3rd,regular,\nēbar,3rd,passive,indicative,imperfect,singular,1st,regular,\nēbāris,3rd,passive,indicative,imperfect,singular,2nd,regular,\nēbāre,3rd,passive,indicative,imperfect,singular,2nd,regular,\nēbatur,3rd,passive,indicative,imperfect,singular,3rd,regular,\nēbāmur,3rd,passive,indicative,imperfect,plural,1st,regular,\nēbāminī,3rd,passive,indicative,imperfect,plural,2nd,regular,\nēbantur,3rd,passive,indicative,imperfect,plural,3rd,regular,\nerer,3rd,passive,subjunctive,imperfect,singular,1st,regular,\nerēris,3rd,passive,subjunctive,imperfect,singular,2nd,regular,\nerēre,3rd,passive,subjunctive,imperfect,singular,2nd,regular,\nerētur,3rd,passive,subjunctive,imperfect,singular,3rd,regular,\nerēmur,3rd,passive,subjunctive,imperfect,plural,1st,regular,\nerēminī,3rd,passive,subjunctive,imperfect,plural,2nd,regular,\nerentur,3rd,passive,subjunctive,imperfect,plural,3rd,regular,\niēbar,4th,passive,indicative,imperfect,singular,1st,regular,\niēbāris,4th,passive,indicative,imperfect,singular,2nd,regular,\niēbāre,4th,passive,indicative,imperfect,singular,2nd,regular,\niēbātur,4th,passive,indicative,imperfect,singular,3rd,regular,\niēbāmur,4th,passive,indicative,imperfect,plural,1st,regular,\niēbāminī,4th,passive,indicative,imperfect,plural,2nd,regular,\niēbantur,4th,passive,indicative,imperfect,plural,3rd,regular,\nīrer,4th,passive,subjunctive,imperfect,singular,1st,regular,\nīrēris,4th,passive,subjunctive,imperfect,singular,2nd,regular,\nīrēre,4th,passive,subjunctive,imperfect,singular,2nd,regular,\nīrētur,4th,passive,subjunctive,imperfect,singular,3rd,regular,\nīrēmur,4th,passive,subjunctive,imperfect,plural,1st,regular,\nīrēminī,4th,passive,subjunctive,imperfect,plural,2nd,regular,\nīrentur,4th,passive,subjunctive,imperfect,plural,3rd,regular,\nābor,1st,passive,indicative,future,singular,1st,regular,\nāberis,1st,passive,indicative,future,singular,2nd,regular,\nābere,1st,passive,indicative,future,singular,2nd,irregular,\nābitur,1st,passive,indicative,future,singular,3rd,regular,\nābimur,1st,passive,indicative,future,plural,1st,regular,\nābiminī,1st,passive,indicative,future,plural,2nd,regular,\nābuntur,1st,passive,indicative,future,plural,3rd,regular,\n,1st,passive,subjunctive,future,singular,1st,,\n,1st,passive,subjunctive,future,singular,2nd,,\n,1st,passive,subjunctive,future,singular,3rd,,\n,1st,passive,subjunctive,future,plural,1st,,\n,1st,passive,subjunctive,future,plural,2nd,,\n,1st,passive,subjunctive,future,plural,3rd,,\nēbor,2nd,passive,indicative,future,singular,1st,regular,\nēberis,2nd,passive,indicative,future,singular,2nd,regular,\nēbere,2nd,passive,indicative,future,singular,2nd,regular,\nēbitur,2nd,passive,indicative,future,singular,3rd,regular,\nēbimur,2nd,passive,indicative,future,plural,1st,regular,\nēbiminī,2nd,passive,indicative,future,plural,2nd,regular,\nēbuntur,2nd,passive,indicative,future,plural,3rd,regular,\n,2nd,passive,subjunctive,future,singular,1st,,\n,2nd,passive,subjunctive,future,singular,2nd,,\n,2nd,passive,subjunctive,future,singular,3rd,,\n,2nd,passive,subjunctive,future,plural,1st,,\n,2nd,passive,subjunctive,future,plural,2nd,,\n,2nd,passive,subjunctive,future,plural,3rd,,\nar,3rd,passive,indicative,future,singular,1st,regular,\nēris,3rd,passive,indicative,future,singular,2nd,regular,\nēre,3rd,passive,indicative,future,singular,2nd,irregular,\nētur,3rd,passive,indicative,future,singular,3rd,regular,\nēmur,3rd,passive,indicative,future,plural,1st,regular,\nēminī,3rd,passive,indicative,future,plural,2nd,regular,\nentur,3rd,passive,indicative,future,plural,3rd,regular,\n,3rd,passive,subjunctive,future,singular,1st,,\n,3rd,passive,subjunctive,future,singular,2nd,,\n,3rd,passive,subjunctive,future,singular,3rd,,\n,3rd,passive,subjunctive,future,plural,1st,,\n,3rd,passive,subjunctive,future,plural,2nd,,\n,3rd,passive,subjunctive,future,plural,3rd,,\niar,4th,passive,indicative,future,singular,1st,regular,\niēris,4th,passive,indicative,future,singular,2nd,regular,\nīēre,4th,passive,indicative,future,singular,2nd,irregular,\niētur,4th,passive,indicative,future,singular,3rd,regular,\niēmur,4th,passive,indicative,future,plural,1st,regular,\niēminī,4th,passive,indicative,future,plural,2nd,regular,\nientur,4th,passive,indicative,future,plural,3rd,regular,\n,4th,passive,subjunctive,future,singular,1st,,\n,4th,passive,subjunctive,future,singular,2nd,,\n,4th,passive,subjunctive,future,singular,3rd,,\n,4th,passive,subjunctive,future,plural,1st,,\n,4th,passive,subjunctive,future,plural,2nd,,\n,4th,passive,subjunctive,future,plural,3rd,,\nātus sum,1st,passive,indicative,perfect,singular,1st,regular,\nātus fui,1st,passive,indicative,perfect,singular,1st,regular,\nātus es,1st,passive,indicative,perfect,singular,2nd,regular,\nātus fuisti,1st,passive,indicative,perfect,singular,2nd,regular,\nātus est,1st,passive,indicative,perfect,singular,3rd,regular,\nātus fuit,1st,passive,indicative,perfect,singular,3rd,regular,\nāti sumus,1st,passive,indicative,perfect,plural,1st,regular,\nāti fuimus,1st,passive,indicative,perfect,plural,1st,irregular,\nāti estis,1st,passive,indicative,perfect,plural,2nd,regular,\nāti fuistis,1st,passive,indicative,perfect,plural,2nd,irregular,\nāti sunt,1st,passive,indicative,perfect,plural,3rd,regular,\nāti fuerunt,1st,passive,indicative,perfect,plural,3rd,irregular,\nātus sim,1st,passive,subjunctive,perfect,singular,1st,regular,\nātus fuerim,1st,passive,subjunctive,perfect,singular,1st,irregular,\nātus sis,1st,passive,subjunctive,perfect,singular,2nd,regular,\nātus fueris,1st,passive,subjunctive,perfect,singular,2nd,irregular,\nātus sit,1st,passive,subjunctive,perfect,singular,3rd,regular,\nātus fuerit,1st,passive,subjunctive,perfect,singular,3rd,regular,\nāti sīmus,1st,passive,subjunctive,perfect,plural,1st,regular,\nāti fuerimus,1st,passive,subjunctive,perfect,plural,1st,irregular,\nāti sītis,1st,passive,subjunctive,perfect,plural,2nd,regular,\nāti fueritis,1st,passive,subjunctive,perfect,plural,2nd,irregular,\nāti sint,1st,passive,subjunctive,perfect,plural,3rd,regular,\nāti fuerint,1st,passive,subjunctive,perfect,plural,3rd,irregular,\nitus sum,2nd,passive,indicative,perfect,singular,1st,regular,\nitus es,2nd,passive,indicative,perfect,singular,2nd,regular,\nitus est,2nd,passive,indicative,perfect,singular,3rd,regular,\nitī sumus,2nd,passive,indicative,perfect,plural,1st,regular,\nitī estis,2nd,passive,indicative,perfect,plural,2nd,regular,\nitī sunt,2nd,passive,indicative,perfect,plural,3rd,regular,\nitus sim,2nd,passive,subjunctive,perfect,singular,1st,regular,\nitus sīs,2nd,passive,subjunctive,perfect,singular,2nd,regular,\nitus sit,2nd,passive,subjunctive,perfect,singular,3rd,regular,\nitī sīmus,2nd,passive,subjunctive,perfect,plural,1st,regular,\nitī sītis,2nd,passive,subjunctive,perfect,plural,2nd,regular,\nitī sint,2nd,passive,subjunctive,perfect,plural,3rd,regular,\nus sum,3rd,passive,indicative,perfect,singular,1st,regular,\nus es,3rd,passive,indicative,perfect,singular,2nd,regular,\nus est,3rd,passive,indicative,perfect,singular,3rd,regular,\nī sumus,3rd,passive,indicative,perfect,plural,1st,regular,\nī estis,3rd,passive,indicative,perfect,plural,2nd,regular,\nī sunt,3rd,passive,indicative,perfect,plural,3rd,regular,\nus sim,3rd,passive,subjunctive,perfect,singular,1st,regular,\nus sīs,3rd,passive,subjunctive,perfect,singular,2nd,regular,\nus sit,3rd,passive,subjunctive,perfect,singular,3rd,regular,\nus sīmus,3rd,passive,subjunctive,perfect,plural,1st,regular,\nus sītis,3rd,passive,subjunctive,perfect,plural,2nd,regular,\nus sint,3rd,passive,subjunctive,perfect,plural,3rd,regular,\nītus sum,4th,passive,indicative,perfect,singular,1st,regular,\nītus es,4th,passive,indicative,perfect,singular,2nd,regular,\nītus est,4th,passive,indicative,perfect,singular,3rd,regular,\nītī sumus,4th,passive,indicative,perfect,plural,1st,regular,\nīti estis,4th,passive,indicative,perfect,plural,2nd,regular,\nīti sunt,4th,passive,indicative,perfect,plural,3rd,regular,\nītus sim,4th,passive,subjunctive,perfect,singular,1st,regular,\nītus sīs,4th,passive,subjunctive,perfect,singular,2nd,regular,\nītus sit,4th,passive,subjunctive,perfect,singular,3rd,regular,\nītī sīmus,4th,passive,subjunctive,perfect,plural,1st,regular,\nīti sītis,4th,passive,subjunctive,perfect,plural,2nd,regular,\nīti sint,4th,passive,subjunctive,perfect,plural,3rd,regular,\nātus eram,1st,passive,indicative,pluperfect,singular,1st,regular,\nātus fueram,1st,passive,indicative,pluperfect,singular,1st,irregular,\nātus eras,1st,passive,indicative,pluperfect,singular,2nd,regular,\nātus fueras,1st,passive,indicative,pluperfect,singular,2nd,irregular,\nātus erat,1st,passive,indicative,pluperfect,singular,3rd,regular,\nātus fuerat,1st,passive,indicative,pluperfect,singular,3rd,irregular,\nātī erāmus,1st,passive,indicative,pluperfect,plural,1st,regular,\nātī fueramus,1st,passive,indicative,pluperfect,plural,1st,irregular,\nātī erātis,1st,passive,indicative,pluperfect,plural,2nd,regular,\nātī fueratis,1st,passive,indicative,pluperfect,plural,2nd,irregular,\nātī erant,1st,passive,indicative,pluperfect,plural,3rd,regular,\nātī fuerant,1st,passive,indicative,pluperfect,plural,3rd,irregular,\nātus essem,1st,passive,subjunctive,pluperfect,singular,1st,regular,\nātus fuissem,1st,passive,subjunctive,pluperfect,singular,1st,irregular,\nātus esses,1st,passive,subjunctive,pluperfect,singular,2nd,regular,\nātus fuissēs,1st,passive,subjunctive,pluperfect,singular,2nd,irregular,\nātus esset,1st,passive,subjunctive,pluperfect,singular,3rd,regular,\nātus fuisset,1st,passive,subjunctive,pluperfect,singular,3rd,irregular,\nāti essēmus,1st,passive,subjunctive,pluperfect,plural,1st,regular,\nāti fuissēmus,1st,passive,subjunctive,pluperfect,plural,1st,irregular,\nāti essētis,1st,passive,subjunctive,pluperfect,plural,2nd,regular,\nāti fuissētis,1st,passive,subjunctive,pluperfect,plural,2nd,regular,\nāti essent,1st,passive,subjunctive,pluperfect,plural,3rd,regular,\nāti fuissent,1st,passive,subjunctive,pluperfect,plural,3rd,regular,\nitus eram,2nd,passive,indicative,pluperfect,singular,1st,regular,\nitus erās,2nd,passive,indicative,pluperfect,singular,2nd,regular,\nitus erat,2nd,passive,indicative,pluperfect,singular,3rd,regular,\nitī erāmus,2nd,passive,indicative,pluperfect,plural,1st,regular,\nitī erātis,2nd,passive,indicative,pluperfect,plural,2nd,regular,\nitī erant,2nd,passive,indicative,pluperfect,plural,3rd,regular,\nitus essem,2nd,passive,subjunctive,pluperfect,singular,1st,regular,\nitus essēs,2nd,passive,subjunctive,pluperfect,singular,2nd,regular,\nitus esset,2nd,passive,subjunctive,pluperfect,singular,3rd,regular,\nitī essēmus,2nd,passive,subjunctive,pluperfect,plural,1st,regular,\nīti essētis,2nd,passive,subjunctive,pluperfect,plural,2nd,regular,\nīti essent,2nd,passive,subjunctive,pluperfect,plural,3rd,regular,\nus eram,3rd,passive,indicative,pluperfect,singular,1st,regular,\nus erās,3rd,passive,indicative,pluperfect,singular,2nd,regular,\nus erat,3rd,passive,indicative,pluperfect,singular,3rd,regular,\nī erāmus,3rd,passive,indicative,pluperfect,plural,1st,regular,\nī erātis,3rd,passive,indicative,pluperfect,plural,2nd,regular,\nī erant,3rd,passive,indicative,pluperfect,plural,3rd,regular,\nus essem,3rd,passive,subjunctive,pluperfect,singular,1st,regular,\nus essēs,3rd,passive,subjunctive,pluperfect,singular,2nd,regular,\nus esset,3rd,passive,subjunctive,pluperfect,singular,3rd,regular,\nī essēmus,3rd,passive,subjunctive,pluperfect,plural,1st,regular,\nī essētis,3rd,passive,subjunctive,pluperfect,plural,2nd,regular,\nī essent,3rd,passive,subjunctive,pluperfect,plural,3rd,regular,\nītus eram,4th,passive,indicative,pluperfect,singular,1st,regular,\nītus erās,4th,passive,indicative,pluperfect,singular,2nd,regular,\nītus erat,4th,passive,indicative,pluperfect,singular,3rd,regular,\nītī erāmus,4th,passive,indicative,pluperfect,plural,1st,regular,\nīti erātis,4th,passive,indicative,pluperfect,plural,2nd,regular,\nītī erant,4th,passive,indicative,pluperfect,plural,3rd,regular,\nītus essem,4th,passive,subjunctive,pluperfect,singular,1st,regular,\nītus essēs,4th,passive,subjunctive,pluperfect,singular,2nd,regular,\nītus esset,4th,passive,subjunctive,pluperfect,singular,3rd,regular,\nītī essēmus,4th,passive,subjunctive,pluperfect,plural,1st,regular,\nīti essētis,4th,passive,subjunctive,pluperfect,plural,2nd,regular,\nīti essent,4th,passive,subjunctive,pluperfect,plural,3rd,regular,\nātus erō,1st,passive,indicative,future_perfect,singular,1st,regular,\nātus eris,1st,passive,indicative,future_perfect,singular,2nd,regular,\nātus erit,1st,passive,indicative,future_perfect,singular,3rd,regular,\nāti erimus,1st,passive,indicative,future_perfect,plural,1st,regular,\nāti eritis,1st,passive,indicative,future_perfect,plural,2nd,regular,\nāti erunt,1st,passive,indicative,future_perfect,plural,3rd,regular,\n,1st,passive,subjunctive,future_perfect,singular,1st,,\n,1st,passive,subjunctive,future_perfect,singular,2nd,,\n,1st,passive,subjunctive,future_perfect,singular,3rd,,\n,1st,passive,subjunctive,future_perfect,plural,1st,,\n,1st,passive,subjunctive,future_perfect,plural,2nd,,\n,1st,passive,subjunctive,future_perfect,plural,3rd,,\nitus erō,2nd,passive,indicative,future_perfect,singular,1st,regular,\nitus eris,2nd,passive,indicative,future_perfect,singular,2nd,regular,\nitus erit,2nd,passive,indicative,future_perfect,singular,3rd,regular,\nitī erimus,2nd,passive,indicative,future_perfect,plural,1st,regular,\nitī eritis,2nd,passive,indicative,future_perfect,plural,2nd,regular,\nitī erunt,2nd,passive,indicative,future_perfect,plural,3rd,regular,\n,2nd,passive,subjunctive,future_perfect,singular,1st,,\n,2nd,passive,subjunctive,future_perfect,singular,2nd,,\n,2nd,passive,subjunctive,future_perfect,singular,3rd,,\n,2nd,passive,subjunctive,future_perfect,plural,1st,,\n,2nd,passive,subjunctive,future_perfect,plural,2nd,,\n,2nd,passive,subjunctive,future_perfect,plural,3rd,,\nus erō,3rd,passive,indicative,future_perfect,singular,1st,regular,\nus eris,3rd,passive,indicative,future_perfect,singular,2nd,regular,\nus erit,3rd,passive,indicative,future_perfect,singular,3rd,regular,\nī erimus,3rd,passive,indicative,future_perfect,plural,1st,regular,\nī eritis,3rd,passive,indicative,future_perfect,plural,2nd,regular,\nī erunt,3rd,passive,indicative,future_perfect,plural,3rd,regular,\n,3rd,passive,subjunctive,future_perfect,singular,1st,,\n,3rd,passive,subjunctive,future_perfect,singular,2nd,,\n,3rd,passive,subjunctive,future_perfect,singular,3rd,,\n,3rd,passive,subjunctive,future_perfect,plural,1st,,\n,3rd,passive,subjunctive,future_perfect,plural,2nd,,\n,3rd,passive,subjunctive,future_perfect,plural,3rd,,\nītus erō,4th,passive,indicative,future_perfect,singular,1st,regular,\nītus eris,4th,passive,indicative,future_perfect,singular,2nd,regular,\nītus erit,4th,passive,indicative,future_perfect,singular,3rd,regular,\nītī erimus,4th,passive,indicative,future_perfect,plural,1st,regular,\nītī eritis,4th,passive,indicative,future_perfect,plural,2nd,regular,\nītī erunt,4th,passive,indicative,future_perfect,plural,3rd,regular,\n,4th,passive,subjunctive,future_perfect,singular,1st,,\n,4th,passive,subjunctive,future_perfect,singular,2nd,,\n,4th,passive,subjunctive,future_perfect,singular,3rd,,\n,4th,passive,subjunctive,future_perfect,plural,1st,,\n,4th,passive,subjunctive,future_perfect,plural,2nd,,\n,4th,passive,subjunctive,future_perfect,plural,3rd,,";

var verbFootnotesCSV = "Index,Text\n2,Chiefly in poetry.\n3,\"In tenses based on the perfect stem (the perfect, pluperfect and future perfect of the Active voice) a v between two vowels is often lost with contraction of the two vowels, thus āvī to ā, ēvī to ē, ōvi to ō. Perfects in īvī often omit the v but rarely contract the vowels, except before ss or st, and sometimes in the third person. In addition to the use of v or u, the Active perfect stem can also be formed in a number of other ways, such as the addition of s to the root (eg carpsi), reduplication of the root (eg cecidi from cado), and simple lengthening of the vowel (eg vidī from video or legī from lego).\"\n4,\"Dic, duc, fac, and fer lack a final vowel in the imperative in classical Latin. The singular imperative of the verb sciō is always scītō, and the plural is usually scītōte.\"\n5,Common in epic poetry.\n6,Present in early Latin but chiefly confined to popular use until Livy and later writers.\n7,The verb fīō is a 4th conjugation verb that is irregular in only two forms: the present infinitive fierī and the imperfect subjunctive fierem.";

function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var papaparse = createCommonjsModule(function (module, exports) {
  /*!
    Papa Parse
    v4.3.6
    https://github.com/mholt/PapaParse
    License: MIT
  */
  (function(root, factory)
  {
    if (false)
    {
      // AMD. Register as an anonymous module.
      undefined([], factory);
    }
    else {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
    }
  }(this, function()
  {
    'use strict';

    var global = (function () {
      // alternative method, similar to `Function('return this')()`
      // but without using `eval` (which is disabled when
      // using Content Security Policy).

      if (typeof self !== 'undefined') { return self; }
      if (typeof window !== 'undefined') { return window; }
      if (typeof global !== 'undefined') { return global; }

      // When running tests none of the above have been defined
      return {};
    })();


    var IS_WORKER = !global.document && !!global.postMessage,
      IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
      LOADED_SYNC = false, AUTO_SCRIPT_PATH;
    var workers = {}, workerIdCounter = 0;

    var Papa = {};

    Papa.parse = CsvToJson;
    Papa.unparse = JsonToCsv;

    Papa.RECORD_SEP = String.fromCharCode(30);
    Papa.UNIT_SEP = String.fromCharCode(31);
    Papa.BYTE_ORDER_MARK = '\ufeff';
    Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
    Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
    Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

    // Configurable chunk sizes for local and remote files, respectively
    Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
    Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
    Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

    // Exposed for testing and development only
    Papa.Parser = Parser;
    Papa.ParserHandle = ParserHandle;
    Papa.NetworkStreamer = NetworkStreamer;
    Papa.FileStreamer = FileStreamer;
    Papa.StringStreamer = StringStreamer;
    Papa.ReadableStreamStreamer = ReadableStreamStreamer;

    if (global.jQuery)
    {
      var $ = global.jQuery;
      $.fn.parse = function(options)
      {
        var config = options.config || {};
        var queue = [];

        this.each(function(idx)
        {
          var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
            && $(this).attr('type').toLowerCase() === 'file'
            && global.FileReader;

          if (!supported || !this.files || this.files.length === 0)
            return true;	// continue to next input element

          for (var i = 0; i < this.files.length; i++)
          {
            queue.push({
              file: this.files[i],
              inputElem: this,
              instanceConfig: $.extend({}, config)
            });
          }
        });

        parseNextFile();	// begin parsing
        return this;		// maintains chainability


        function parseNextFile()
        {
          if (queue.length === 0)
          {
            if (isFunction(options.complete))
              options.complete();
            return;
          }

          var f = queue[0];

          if (isFunction(options.before))
          {
            var returned = options.before(f.file, f.inputElem);

            if (typeof returned === 'object')
            {
              if (returned.action === 'abort')
              {
                error('AbortError', f.file, f.inputElem, returned.reason);
                return;	// Aborts all queued files immediately
              }
              else if (returned.action === 'skip')
              {
                fileComplete();	// parse the next file in the queue, if any
                return;
              }
              else if (typeof returned.config === 'object')
                f.instanceConfig = $.extend(f.instanceConfig, returned.config);
            }
            else if (returned === 'skip')
            {
              fileComplete();	// parse the next file in the queue, if any
              return;
            }
          }

          // Wrap up the user's complete callback, if any, so that ours also gets executed
          var userCompleteFunc = f.instanceConfig.complete;
          f.instanceConfig.complete = function(results)
          {
            if (isFunction(userCompleteFunc))
              userCompleteFunc(results, f.file, f.inputElem);
            fileComplete();
          };

          Papa.parse(f.file, f.instanceConfig);
        }

        function error(name, file, elem, reason)
        {
          if (isFunction(options.error))
            options.error({name: name}, file, elem, reason);
        }

        function fileComplete()
        {
          queue.splice(0, 1);
          parseNextFile();
        }
      };
    }


    if (IS_PAPA_WORKER)
    {
      global.onmessage = workerThreadReceivedMessage;
    }
    else if (Papa.WORKERS_SUPPORTED)
    {
      AUTO_SCRIPT_PATH = getScriptPath();

      // Check if the script was loaded synchronously
      if (!document.body)
      {
        // Body doesn't exist yet, must be synchronous
        LOADED_SYNC = true;
      }
      else
      {
        document.addEventListener('DOMContentLoaded', function () {
          LOADED_SYNC = true;
        }, true);
      }
    }




    function CsvToJson(_input, _config)
    {
      _config = _config || {};
      var dynamicTyping = _config.dynamicTyping || false;
      if (isFunction(dynamicTyping)) {
        _config.dynamicTypingFunction = dynamicTyping;
        // Will be filled on first row call
        dynamicTyping = {};
      }
      _config.dynamicTyping = dynamicTyping;

      if (_config.worker && Papa.WORKERS_SUPPORTED)
      {
        var w = newWorker();

        w.userStep = _config.step;
        w.userChunk = _config.chunk;
        w.userComplete = _config.complete;
        w.userError = _config.error;

        _config.step = isFunction(_config.step);
        _config.chunk = isFunction(_config.chunk);
        _config.complete = isFunction(_config.complete);
        _config.error = isFunction(_config.error);
        delete _config.worker;	// prevent infinite loop

        w.postMessage({
          input: _input,
          config: _config,
          workerId: w.id
        });

        return;
      }

      var streamer = null;
      if (typeof _input === 'string')
      {
        if (_config.download)
          streamer = new NetworkStreamer(_config);
        else
          streamer = new StringStreamer(_config);
      }
      else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
      {
        streamer = new ReadableStreamStreamer(_config);
      }
      else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
        streamer = new FileStreamer(_config);

      return streamer.stream(_input);
    }






    function JsonToCsv(_input, _config)
    {
      var _output = '';
      var _fields = [];

      // Default configuration

      /** whether to surround every datum with quotes */
      var _quotes = false;

      /** whether to write headers */
      var _writeHeader = true;

      /** delimiting character */
      var _delimiter = ',';

      /** newline character(s) */
      var _newline = '\r\n';

      /** quote character */
      var _quoteChar = '"';

      unpackConfig();

      var quoteCharRegex = new RegExp(_quoteChar, 'g');

      if (typeof _input === 'string')
        _input = JSON.parse(_input);

      if (_input instanceof Array)
      {
        if (!_input.length || _input[0] instanceof Array)
          return serialize(null, _input);
        else if (typeof _input[0] === 'object')
          return serialize(objectKeys(_input[0]), _input);
      }
      else if (typeof _input === 'object')
      {
        if (typeof _input.data === 'string')
          _input.data = JSON.parse(_input.data);

        if (_input.data instanceof Array)
        {
          if (!_input.fields)
            _input.fields =  _input.meta && _input.meta.fields;

          if (!_input.fields)
            _input.fields =  _input.data[0] instanceof Array
              ? _input.fields
              : objectKeys(_input.data[0]);

          if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
            _input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
        }

        return serialize(_input.fields || [], _input.data || []);
      }

      // Default (any valid paths should return before this)
      throw 'exception: Unable to serialize unrecognized input';


      function unpackConfig()
      {
        if (typeof _config !== 'object')
          return;

        if (typeof _config.delimiter === 'string'
          && _config.delimiter.length === 1
          && Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
        {
          _delimiter = _config.delimiter;
        }

        if (typeof _config.quotes === 'boolean'
          || _config.quotes instanceof Array)
          _quotes = _config.quotes;

        if (typeof _config.newline === 'string')
          _newline = _config.newline;

        if (typeof _config.quoteChar === 'string')
          _quoteChar = _config.quoteChar;

        if (typeof _config.header === 'boolean')
          _writeHeader = _config.header;
      }


      /** Turns an object's keys into an array */
      function objectKeys(obj)
      {
        if (typeof obj !== 'object')
          return [];
        var keys = [];
        for (var key in obj)
          keys.push(key);
        return keys;
      }

      /** The double for loop that iterates the data and writes out a CSV string including header row */
      function serialize(fields, data)
      {
        var csv = '';

        if (typeof fields === 'string')
          fields = JSON.parse(fields);
        if (typeof data === 'string')
          data = JSON.parse(data);

        var hasHeader = fields instanceof Array && fields.length > 0;
        var dataKeyedByField = !(data[0] instanceof Array);

        // If there a header row, write it first
        if (hasHeader && _writeHeader)
        {
          for (var i = 0; i < fields.length; i++)
          {
            if (i > 0)
              csv += _delimiter;
            csv += safe(fields[i], i);
          }
          if (data.length > 0)
            csv += _newline;
        }

        // Then write out the data
        for (var row = 0; row < data.length; row++)
        {
          var maxCol = hasHeader ? fields.length : data[row].length;

          for (var col = 0; col < maxCol; col++)
          {
            if (col > 0)
              csv += _delimiter;
            var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
            csv += safe(data[row][colIdx], col);
          }

          if (row < data.length - 1)
            csv += _newline;
        }

        return csv;
      }

      /** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
      function safe(str, col)
      {
        if (typeof str === 'undefined' || str === null)
          return '';

        str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

        var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
          || (_quotes instanceof Array && _quotes[col])
          || hasAny(str, Papa.BAD_DELIMITERS)
          || str.indexOf(_delimiter) > -1
          || str.charAt(0) === ' '
          || str.charAt(str.length - 1) === ' ';

        return needsQuotes ? _quoteChar + str + _quoteChar : str;
      }

      function hasAny(str, substrings)
      {
        for (var i = 0; i < substrings.length; i++)
          if (str.indexOf(substrings[i]) > -1)
            return true;
        return false;
      }
    }

    /** ChunkStreamer is the base prototype for various streamer implementations. */
    function ChunkStreamer(config)
    {
      this._handle = null;
      this._paused = false;
      this._finished = false;
      this._input = null;
      this._baseIndex = 0;
      this._partialLine = '';
      this._rowCount = 0;
      this._start = 0;
      this._nextChunk = null;
      this.isFirstChunk = true;
      this._completeResults = {
        data: [],
        errors: [],
        meta: {}
      };
      replaceConfig.call(this, config);

      this.parseChunk = function(chunk)
      {
        // First chunk pre-processing
        if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
        {
          var modifiedChunk = this._config.beforeFirstChunk(chunk);
          if (modifiedChunk !== undefined)
            chunk = modifiedChunk;
        }
        this.isFirstChunk = false;

        // Rejoin the line we likely just split in two by chunking the file
        var aggregate = this._partialLine + chunk;
        this._partialLine = '';

        var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

        if (this._handle.paused() || this._handle.aborted())
          return;

        var lastIndex = results.meta.cursor;

        if (!this._finished)
        {
          this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
          this._baseIndex = lastIndex;
        }

        if (results && results.data)
          this._rowCount += results.data.length;

        var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

        if (IS_PAPA_WORKER)
        {
          global.postMessage({
            results: results,
            workerId: Papa.WORKER_ID,
            finished: finishedIncludingPreview
          });
        }
        else if (isFunction(this._config.chunk))
        {
          this._config.chunk(results, this._handle);
          if (this._paused)
            return;
          results = undefined;
          this._completeResults = undefined;
        }

        if (!this._config.step && !this._config.chunk) {
          this._completeResults.data = this._completeResults.data.concat(results.data);
          this._completeResults.errors = this._completeResults.errors.concat(results.errors);
          this._completeResults.meta = results.meta;
        }

        if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
          this._config.complete(this._completeResults, this._input);

        if (!finishedIncludingPreview && (!results || !results.meta.paused))
          this._nextChunk();

        return results;
      };

      this._sendError = function(error)
      {
        if (isFunction(this._config.error))
          this._config.error(error);
        else if (IS_PAPA_WORKER && this._config.error)
        {
          global.postMessage({
            workerId: Papa.WORKER_ID,
            error: error,
            finished: false
          });
        }
      };

      function replaceConfig(config)
      {
        // Deep-copy the config so we can edit it
        var configCopy = copy(config);
        configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
        if (!config.step && !config.chunk)
          configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
        this._handle = new ParserHandle(configCopy);
        this._handle.streamer = this;
        this._config = configCopy;	// persist the copy to the caller
      }
    }


    function NetworkStreamer(config)
    {
      config = config || {};
      if (!config.chunkSize)
        config.chunkSize = Papa.RemoteChunkSize;
      ChunkStreamer.call(this, config);

      var xhr;

      if (IS_WORKER)
      {
        this._nextChunk = function()
        {
          this._readChunk();
          this._chunkLoaded();
        };
      }
      else
      {
        this._nextChunk = function()
        {
          this._readChunk();
        };
      }

      this.stream = function(url)
      {
        this._input = url;
        this._nextChunk();	// Starts streaming
      };

      this._readChunk = function()
      {
        if (this._finished)
        {
          this._chunkLoaded();
          return;
        }

        xhr = new XMLHttpRequest();

        if (this._config.withCredentials)
        {
          xhr.withCredentials = this._config.withCredentials;
        }

        if (!IS_WORKER)
        {
          xhr.onload = bindFunction(this._chunkLoaded, this);
          xhr.onerror = bindFunction(this._chunkError, this);
        }

        xhr.open('GET', this._input, !IS_WORKER);
        // Headers can only be set when once the request state is OPENED
        if (this._config.downloadRequestHeaders)
        {
          var headers = this._config.downloadRequestHeaders;

          for (var headerName in headers)
          {
            xhr.setRequestHeader(headerName, headers[headerName]);
          }
        }

        if (this._config.chunkSize)
        {
          var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
          xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
          xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
        }

        try {
          xhr.send();
        }
        catch (err) {
          this._chunkError(err.message);
        }

        if (IS_WORKER && xhr.status === 0)
          this._chunkError();
        else
          this._start += this._config.chunkSize;
      };

      this._chunkLoaded = function()
      {
        if (xhr.readyState != 4)
          return;

        if (xhr.status < 200 || xhr.status >= 400)
        {
          this._chunkError();
          return;
        }

        this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
        this.parseChunk(xhr.responseText);
      };

      this._chunkError = function(errorMessage)
      {
        var errorText = xhr.statusText || errorMessage;
        this._sendError(errorText);
      };

      function getFileSize(xhr)
      {
        var contentRange = xhr.getResponseHeader('Content-Range');
        if (contentRange === null) { // no content range, then finish!
          return -1;
        }
        return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
      }
    }
    NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
    NetworkStreamer.prototype.constructor = NetworkStreamer;


    function FileStreamer(config)
    {
      config = config || {};
      if (!config.chunkSize)
        config.chunkSize = Papa.LocalChunkSize;
      ChunkStreamer.call(this, config);

      var reader, slice;

      // FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
      // But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
      var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

      this.stream = function(file)
      {
        this._input = file;
        slice = file.slice || file.webkitSlice || file.mozSlice;

        if (usingAsyncReader)
        {
          reader = new FileReader();		// Preferred method of reading files, even in workers
          reader.onload = bindFunction(this._chunkLoaded, this);
          reader.onerror = bindFunction(this._chunkError, this);
        }
        else
          reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

        this._nextChunk();	// Starts streaming
      };

      this._nextChunk = function()
      {
        if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
          this._readChunk();
      };

      this._readChunk = function()
      {
        var input = this._input;
        if (this._config.chunkSize)
        {
          var end = Math.min(this._start + this._config.chunkSize, this._input.size);
          input = slice.call(input, this._start, end);
        }
        var txt = reader.readAsText(input, this._config.encoding);
        if (!usingAsyncReader)
          this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
      };

      this._chunkLoaded = function(event)
      {
        // Very important to increment start each time before handling results
        this._start += this._config.chunkSize;
        this._finished = !this._config.chunkSize || this._start >= this._input.size;
        this.parseChunk(event.target.result);
      };

      this._chunkError = function()
      {
        this._sendError(reader.error);
      };

    }
    FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
    FileStreamer.prototype.constructor = FileStreamer;


    function StringStreamer(config)
    {
      config = config || {};
      ChunkStreamer.call(this, config);

      var string;
      var remaining;
      this.stream = function(s)
      {
        string = s;
        remaining = s;
        return this._nextChunk();
      };
      this._nextChunk = function()
      {
        if (this._finished) return;
        var size = this._config.chunkSize;
        var chunk = size ? remaining.substr(0, size) : remaining;
        remaining = size ? remaining.substr(size) : '';
        this._finished = !remaining;
        return this.parseChunk(chunk);
      };
    }
    StringStreamer.prototype = Object.create(StringStreamer.prototype);
    StringStreamer.prototype.constructor = StringStreamer;


    function ReadableStreamStreamer(config)
    {
      config = config || {};

      ChunkStreamer.call(this, config);

      var queue = [];
      var parseOnData = true;

      this.stream = function(stream)
      {
        this._input = stream;

        this._input.on('data', this._streamData);
        this._input.on('end', this._streamEnd);
        this._input.on('error', this._streamError);
      };

      this._nextChunk = function()
      {
        if (queue.length)
        {
          this.parseChunk(queue.shift());
        }
        else
        {
          parseOnData = true;
        }
      };

      this._streamData = bindFunction(function(chunk)
      {
        try
        {
          queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

          if (parseOnData)
          {
            parseOnData = false;
            this.parseChunk(queue.shift());
          }
        }
        catch (error)
        {
          this._streamError(error);
        }
      }, this);

      this._streamError = bindFunction(function(error)
      {
        this._streamCleanUp();
        this._sendError(error.message);
      }, this);

      this._streamEnd = bindFunction(function()
      {
        this._streamCleanUp();
        this._finished = true;
        this._streamData('');
      }, this);

      this._streamCleanUp = bindFunction(function()
      {
        this._input.removeListener('data', this._streamData);
        this._input.removeListener('end', this._streamEnd);
        this._input.removeListener('error', this._streamError);
      }, this);
    }
    ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
    ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


    // Use one ParserHandle per entire CSV file or string
    function ParserHandle(_config)
    {
      // One goal is to minimize the use of regular expressions...
      var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

      var self = this;
      var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
      var _input;				// The input being parsed
      var _parser;			// The core parser being used
      var _paused = false;	// Whether we are paused or not
      var _aborted = false;	// Whether the parser has aborted or not
      var _delimiterError;	// Temporary state between delimiter detection and processing results
      var _fields = [];		// Fields are from the header row of the input, if there is one
      var _results = {		// The last results returned from the parser
        data: [],
        errors: [],
        meta: {}
      };

      if (isFunction(_config.step))
      {
        var userStep = _config.step;
        _config.step = function(results)
        {
          _results = results;

          if (needsHeaderRow())
            processResults();
          else	// only call user's step function after header row
          {
            processResults();

            // It's possbile that this line was empty and there's no row here after all
            if (_results.data.length === 0)
              return;

            _stepCounter += results.data.length;
            if (_config.preview && _stepCounter > _config.preview)
              _parser.abort();
            else
              userStep(_results, self);
          }
        };
      }

      /**
       * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
       * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
       * when an input comes in multiple chunks, like from a file.
       */
      this.parse = function(input, baseIndex, ignoreLastRow)
      {
        if (!_config.newline)
          _config.newline = guessLineEndings(input);

        _delimiterError = false;
        if (!_config.delimiter)
        {
          var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines);
          if (delimGuess.successful)
            _config.delimiter = delimGuess.bestDelimiter;
          else
          {
            _delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
            _config.delimiter = Papa.DefaultDelimiter;
          }
          _results.meta.delimiter = _config.delimiter;
        }
        else if(isFunction(_config.delimiter))
        {
          _config.delimiter = _config.delimiter(input);
          _results.meta.delimiter = _config.delimiter;
        }

        var parserConfig = copy(_config);
        if (_config.preview && _config.header)
          parserConfig.preview++;	// to compensate for header row

        _input = input;
        _parser = new Parser(parserConfig);
        _results = _parser.parse(_input, baseIndex, ignoreLastRow);
        processResults();
        return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
      };

      this.paused = function()
      {
        return _paused;
      };

      this.pause = function()
      {
        _paused = true;
        _parser.abort();
        _input = _input.substr(_parser.getCharIndex());
      };

      this.resume = function()
      {
        _paused = false;
        self.streamer.parseChunk(_input);
      };

      this.aborted = function ()
      {
        return _aborted;
      };

      this.abort = function()
      {
        _aborted = true;
        _parser.abort();
        _results.meta.aborted = true;
        if (isFunction(_config.complete))
          _config.complete(_results);
        _input = '';
      };

      function processResults()
      {
        if (_results && _delimiterError)
        {
          addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
          _delimiterError = false;
        }

        if (_config.skipEmptyLines)
        {
          for (var i = 0; i < _results.data.length; i++)
            if (_results.data[i].length === 1 && _results.data[i][0] === '')
              _results.data.splice(i--, 1);
        }

        if (needsHeaderRow())
          fillHeaderFields();

        return applyHeaderAndDynamicTyping();
      }

      function needsHeaderRow()
      {
        return _config.header && _fields.length === 0;
      }

      function fillHeaderFields()
      {
        if (!_results)
          return;
        for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
          for (var j = 0; j < _results.data[i].length; j++)
            _fields.push(_results.data[i][j]);
        _results.data.splice(0, 1);
      }

      function shouldApplyDynamicTyping(field) {
        // Cache function values to avoid calling it for each row
        if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
          _config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
        }
        return (_config.dynamicTyping[field] || _config.dynamicTyping) === true
      }

      function parseDynamic(field, value)
      {
        if (shouldApplyDynamicTyping(field))
        {
          if (value === 'true' || value === 'TRUE')
            return true;
          else if (value === 'false' || value === 'FALSE')
            return false;
          else
            return tryParseFloat(value);
        }
        return value;
      }

      function applyHeaderAndDynamicTyping()
      {
        if (!_results || (!_config.header && !_config.dynamicTyping))
          return _results;

        for (var i = 0; i < _results.data.length; i++)
        {
          var row = _config.header ? {} : [];

          for (var j = 0; j < _results.data[i].length; j++)
          {
            var field = j;
            var value = _results.data[i][j];

            if (_config.header)
              field = j >= _fields.length ? '__parsed_extra' : _fields[j];

            value = parseDynamic(field, value);

            if (field === '__parsed_extra')
            {
              row[field] = row[field] || [];
              row[field].push(value);
            }
            else
              row[field] = value;
          }

          _results.data[i] = row;

          if (_config.header)
          {
            if (j > _fields.length)
              addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
            else if (j < _fields.length)
              addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
          }
        }

        if (_config.header && _results.meta)
          _results.meta.fields = _fields;
        return _results;
      }

      function guessDelimiter(input, newline, skipEmptyLines)
      {
        var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
        var bestDelim, bestDelta, fieldCountPrevRow;

        for (var i = 0; i < delimChoices.length; i++)
        {
          var delim = delimChoices[i];
          var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
          fieldCountPrevRow = undefined;

          var preview = new Parser({
            delimiter: delim,
            newline: newline,
            preview: 10
          }).parse(input);

          for (var j = 0; j < preview.data.length; j++)
          {
            if (skipEmptyLines && preview.data[j].length === 1 && preview.data[j][0].length === 0) {
              emptyLinesCount++;
              continue
            }
            var fieldCount = preview.data[j].length;
            avgFieldCount += fieldCount;

            if (typeof fieldCountPrevRow === 'undefined')
            {
              fieldCountPrevRow = fieldCount;
              continue;
            }
            else if (fieldCount > 1)
            {
              delta += Math.abs(fieldCount - fieldCountPrevRow);
              fieldCountPrevRow = fieldCount;
            }
          }

          if (preview.data.length > 0)
            avgFieldCount /= (preview.data.length - emptyLinesCount);

          if ((typeof bestDelta === 'undefined' || delta < bestDelta)
            && avgFieldCount > 1.99)
          {
            bestDelta = delta;
            bestDelim = delim;
          }
        }

        _config.delimiter = bestDelim;

        return {
          successful: !!bestDelim,
          bestDelimiter: bestDelim
        }
      }

      function guessLineEndings(input)
      {
        input = input.substr(0, 1024*1024);	// max length 1 MB

        var r = input.split('\r');

        var n = input.split('\n');

        var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

        if (r.length === 1 || nAppearsFirst)
          return '\n';

        var numWithN = 0;
        for (var i = 0; i < r.length; i++)
        {
          if (r[i][0] === '\n')
            numWithN++;
        }

        return numWithN >= r.length / 2 ? '\r\n' : '\r';
      }

      function tryParseFloat(val)
      {
        var isNumber = FLOAT.test(val);
        return isNumber ? parseFloat(val) : val;
      }

      function addError(type, code, msg, row)
      {
        _results.errors.push({
          type: type,
          code: code,
          message: msg,
          row: row
        });
      }
    }





    /** The core parser implements speedy and correct CSV parsing */
    function Parser(config)
    {
      // Unpack the config object
      config = config || {};
      var delim = config.delimiter;
      var newline = config.newline;
      var comments = config.comments;
      var step = config.step;
      var preview = config.preview;
      var fastMode = config.fastMode;
      var quoteChar = config.quoteChar || '"';

      // Delimiter must be valid
      if (typeof delim !== 'string'
        || Papa.BAD_DELIMITERS.indexOf(delim) > -1)
        delim = ',';

      // Comment character must be valid
      if (comments === delim)
        throw 'Comment character same as delimiter';
      else if (comments === true)
        comments = '#';
      else if (typeof comments !== 'string'
        || Papa.BAD_DELIMITERS.indexOf(comments) > -1)
        comments = false;

      // Newline must be valid: \r, \n, or \r\n
      if (newline != '\n' && newline != '\r' && newline != '\r\n')
        newline = '\n';

      // We're gonna need these at the Parser scope
      var cursor = 0;
      var aborted = false;

      this.parse = function(input, baseIndex, ignoreLastRow)
      {
        // For some reason, in Chrome, this speeds things up (!?)
        if (typeof input !== 'string')
          throw 'Input must be a string';

        // We don't need to compute some of these every time parse() is called,
        // but having them in a more local scope seems to perform better
        var inputLen = input.length,
          delimLen = delim.length,
          newlineLen = newline.length,
          commentsLen = comments.length;
        var stepIsFunction = isFunction(step);

        // Establish starting state
        cursor = 0;
        var data = [], errors = [], row = [], lastCursor = 0;

        if (!input)
          return returnable();

        if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
        {
          var rows = input.split(newline);
          for (var i = 0; i < rows.length; i++)
          {
            var row = rows[i];
            cursor += row.length;
            if (i !== rows.length - 1)
              cursor += newline.length;
            else if (ignoreLastRow)
              return returnable();
            if (comments && row.substr(0, commentsLen) === comments)
              continue;
            if (stepIsFunction)
            {
              data = [];
              pushRow(row.split(delim));
              doStep();
              if (aborted)
                return returnable();
            }
            else
              pushRow(row.split(delim));
            if (preview && i >= preview)
            {
              data = data.slice(0, preview);
              return returnable(true);
            }
          }
          return returnable();
        }

        var nextDelim = input.indexOf(delim, cursor);
        var nextNewline = input.indexOf(newline, cursor);
        var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

        // Parser loop
        for (;;)
        {
          // Field has opening quote
          if (input[cursor] === quoteChar)
          {
            // Start our search for the closing quote where the cursor is
            var quoteSearch = cursor;

            // Skip the opening quote
            cursor++;

            for (;;)
            {
              // Find closing quote
              var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

              //No other quotes are found - no other delimiters
              if (quoteSearch === -1)
              {
                if (!ignoreLastRow) {
                  // No closing quote... what a pity
                  errors.push({
                    type: 'Quotes',
                    code: 'MissingQuotes',
                    message: 'Quoted field unterminated',
                    row: data.length,	// row has yet to be inserted
                    index: cursor
                  });
                }
                return finish();
              }

              // Closing quote at EOF
              if (quoteSearch === inputLen-1)
              {
                var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
                return finish(value);
              }

              // If this quote is escaped, it's part of the data; skip it
              if (input[quoteSearch+1] === quoteChar)
              {
                quoteSearch++;
                continue;
              }

              // Closing quote followed by delimiter
              if (input[quoteSearch+1] === delim)
              {
                row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                cursor = quoteSearch + 1 + delimLen;
                nextDelim = input.indexOf(delim, cursor);
                nextNewline = input.indexOf(newline, cursor);
                break;
              }

              // Closing quote followed by newline
              if (input.substr(quoteSearch+1, newlineLen) === newline)
              {
                row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                saveRow(quoteSearch + 1 + newlineLen);
                nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

                if (stepIsFunction)
                {
                  doStep();
                  if (aborted)
                    return returnable();
                }

                if (preview && data.length >= preview)
                  return returnable(true);

                break;
              }


              // Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
              errors.push({
                type: 'Quotes',
                code: 'InvalidQuotes',
                message: 'Trailing quote on quoted field is malformed',
                row: data.length,	// row has yet to be inserted
                index: cursor
              });

              quoteSearch++;
              continue;

            }

            continue;
          }

          // Comment found at start of new line
          if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
          {
            if (nextNewline === -1)	// Comment ends at EOF
              return returnable();
            cursor = nextNewline + newlineLen;
            nextNewline = input.indexOf(newline, cursor);
            nextDelim = input.indexOf(delim, cursor);
            continue;
          }

          // Next delimiter comes before next newline, so we've reached end of field
          if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
          {
            row.push(input.substring(cursor, nextDelim));
            cursor = nextDelim + delimLen;
            nextDelim = input.indexOf(delim, cursor);
            continue;
          }

          // End of row
          if (nextNewline !== -1)
          {
            row.push(input.substring(cursor, nextNewline));
            saveRow(nextNewline + newlineLen);

            if (stepIsFunction)
            {
              doStep();
              if (aborted)
                return returnable();
            }

            if (preview && data.length >= preview)
              return returnable(true);

            continue;
          }

          break;
        }


        return finish();


        function pushRow(row)
        {
          data.push(row);
          lastCursor = cursor;
        }

        /**
         * Appends the remaining input from cursor to the end into
         * row, saves the row, calls step, and returns the results.
         */
        function finish(value)
        {
          if (ignoreLastRow)
            return returnable();
          if (typeof value === 'undefined')
            value = input.substr(cursor);
          row.push(value);
          cursor = inputLen;	// important in case parsing is paused
          pushRow(row);
          if (stepIsFunction)
            doStep();
          return returnable();
        }

        /**
         * Appends the current row to the results. It sets the cursor
         * to newCursor and finds the nextNewline. The caller should
         * take care to execute user's step function and check for
         * preview and end parsing if necessary.
         */
        function saveRow(newCursor)
        {
          cursor = newCursor;
          pushRow(row);
          row = [];
          nextNewline = input.indexOf(newline, cursor);
        }

        /** Returns an object with the results, errors, and meta. */
        function returnable(stopped)
        {
          return {
            data: data,
            errors: errors,
            meta: {
              delimiter: delim,
              linebreak: newline,
              aborted: aborted,
              truncated: !!stopped,
              cursor: lastCursor + (baseIndex || 0)
            }
          };
        }

        /** Executes the user's step function and resets data & errors. */
        function doStep()
        {
          step(returnable());
          data = [], errors = [];
        }
      };

      /** Sets the abort flag */
      this.abort = function()
      {
        aborted = true;
      };

      /** Gets the cursor position */
      this.getCharIndex = function()
      {
        return cursor;
      };
    }


    // If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
    // the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
    function getScriptPath()
    {
      var scripts = document.getElementsByTagName('script');
      return scripts.length ? scripts[scripts.length - 1].src : '';
    }

    function newWorker()
    {
      if (!Papa.WORKERS_SUPPORTED)
        return false;
      if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
        throw new Error(
          'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
          'You need to set Papa.SCRIPT_PATH manually.'
        );
      var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
      // Append 'papaworker' to the search string to tell papaparse that this is our worker.
      workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
      var w = new global.Worker(workerUrl);
      w.onmessage = mainThreadReceivedMessage;
      w.id = workerIdCounter++;
      workers[w.id] = w;
      return w;
    }

    /** Callback when main thread receives a message */
    function mainThreadReceivedMessage(e)
    {
      var msg = e.data;
      var worker = workers[msg.workerId];
      var aborted = false;

      if (msg.error)
        worker.userError(msg.error, msg.file);
      else if (msg.results && msg.results.data)
      {
        var abort = function() {
          aborted = true;
          completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
        };

        var handle = {
          abort: abort,
          pause: notImplemented,
          resume: notImplemented
        };

        if (isFunction(worker.userStep))
        {
          for (var i = 0; i < msg.results.data.length; i++)
          {
            worker.userStep({
              data: [msg.results.data[i]],
              errors: msg.results.errors,
              meta: msg.results.meta
            }, handle);
            if (aborted)
              break;
          }
          delete msg.results;	// free memory ASAP
        }
        else if (isFunction(worker.userChunk))
        {
          worker.userChunk(msg.results, handle, msg.file);
          delete msg.results;
        }
      }

      if (msg.finished && !aborted)
        completeWorker(msg.workerId, msg.results);
    }

    function completeWorker(workerId, results) {
      var worker = workers[workerId];
      if (isFunction(worker.userComplete))
        worker.userComplete(results);
      worker.terminate();
      delete workers[workerId];
    }

    function notImplemented() {
      throw 'Not implemented.';
    }

    /** Callback when worker thread receives a message */
    function workerThreadReceivedMessage(e)
    {
      var msg = e.data;

      if (typeof Papa.WORKER_ID === 'undefined' && msg)
        Papa.WORKER_ID = msg.workerId;

      if (typeof msg.input === 'string')
      {
        global.postMessage({
          workerId: Papa.WORKER_ID,
          results: Papa.parse(msg.input, msg.config),
          finished: true
        });
      }
      else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
      {
        var results = Papa.parse(msg.input, msg.config);
        if (results)
          global.postMessage({
            workerId: Papa.WORKER_ID,
            results: results,
            finished: true
          });
      }
    }

    /** Makes a deep copy of an array or object (mostly) */
    function copy(obj)
    {
      if (typeof obj !== 'object')
        return obj;
      var cpy = obj instanceof Array ? [] : {};
      for (var key in obj)
        cpy[key] = copy(obj[key]);
      return cpy;
    }

    function bindFunction(f, self)
    {
      return function() { f.apply(self, arguments); };
    }

    function isFunction(func)
    {
      return typeof func === 'function';
    }

    return Papa;
  }));
});

/*
 * Latin language data module
 */
let languageModel = new LatinLanguageModel();
let types = Feature.types;
// A language of this module
const language = languages.latin;
// Create a language data set that will keep all language-related information
let dataSet = new LanguageDataset(language);

// region Definition of grammatical features
/*
 Define grammatical features of a language. Those grammatical features definitions will also be used by morphological
 analyzer's language modules as well.
 */
const importerName = 'csv';
languageModel.features[types.declension].addImporter(importerName)
  .map('1st 2nd',
    [ languageModel.features[types.declension][constants.ORD_1ST],
      languageModel.features[types.declension][constants.ORD_2ND]
    ]);
languageModel.features[types.gender].addImporter(importerName)
  .map('masculine feminine',
    [ languageModel.features[types.gender][constants.GEND_MASCULINE],
      languageModel.features[types.gender][constants.GEND_FEMININE]
    ]);
languageModel.features[types.tense].addImporter(importerName)
  .map('future_perfect', languageModel.features[types.tense][constants.TENSE_FUTURE_PERFECT]);
const footnotes = new FeatureType(types.footnote, [], language);

// endregion Definition of grammatical features

// For noun and adjectives
dataSet.addSuffixes = function (partOfSpeech, data) {
  // Some suffix values will mean a lack of suffix, they will be mapped to a null
  let noSuffixValue = '-';

  // First row are headers
  for (let i = 1; i < data.length; i++) {
    let suffix = data[i][0];
    // Handle special suffix values
    if (suffix === noSuffixValue) {
      suffix = null;
    }

    let features = [partOfSpeech,
      languageModel.features[types.number].getFromImporter('csv', data[i][1]),
      languageModel.features[types.grmCase].getFromImporter('csv', data[i][2]),
      languageModel.features[types.declension].getFromImporter('csv', data[i][3]),
      languageModel.features[types.gender].getFromImporter('csv', data[i][4]),
      languageModel.features[types.type].getFromImporter('csv', data[i][5])];
    if (data[i][6]) {
      // There can be multiple footnote indexes separated by spaces
      let indexes = data[i][6].split(' ').map(function (index) {
        return footnotes.get(index)
      });
      features.push(...indexes);
    }
    this.addSuffix(suffix, features);
  }
};

// For verbs
dataSet.addVerbSuffixes = function (partOfSpeech, data) {
  // Some suffix values will mean a lack of suffix, they will be mapped to a null
  let noSuffixValue = '-';

  // First row are headers
  for (let i = 1; i < data.length; i++) {
    let suffix = data[i][0];
    // Handle special suffix values
    if (suffix === noSuffixValue) {
      suffix = null;
    }

    let features = [partOfSpeech,
      languageModel.features[types.conjugation].getFromImporter('csv', data[i][1]),
      languageModel.features[types.voice].getFromImporter('csv', data[i][2]),
      languageModel.features[types.mood].getFromImporter('csv', data[i][3]),
      languageModel.features[types.tense].getFromImporter('csv', data[i][4]),
      languageModel.features[types.number].getFromImporter('csv', data[i][5]),
      languageModel.features[types.person].getFromImporter('csv', data[i][6])];

    let grammartype = data[i][7];
    // Type information can be empty if no ending is provided
    if (grammartype) {
      features.push(languageModel.features[types.type].getFromImporter('csv', grammartype));
    }
    // Footnotes
    if (data[i][8]) {
      // There can be multiple footnote indexes separated by spaces
      let indexes = data[i][8].split(' ').map(function (index) {
        return footnotes.get(index)
      });
      features.push(...indexes);
    }
    this.addSuffix(suffix, features);
  }
};

dataSet.addFootnotes = function (partOfSpeech, data) {
  // First row are headers
  for (let i = 1; i < data.length; i++) {
    this.addFootnote(partOfSpeech, data[i][0], data[i][1]);
  }
};

dataSet.loadData = function () {
  // Nouns
  let partOfSpeech = languageModel.features[types.part][constants.POFS_NOUN];
  let suffixes = papaparse.parse(nounSuffixesCSV, {});
  this.addSuffixes(partOfSpeech, suffixes.data);
  let footnotes = papaparse.parse(nounFootnotesCSV, {});
  this.addFootnotes(partOfSpeech, footnotes.data);

  // Adjectives
  partOfSpeech = languageModel.features[types.part][constants.POFS_ADJECTIVE];
  suffixes = papaparse.parse(adjectiveSuffixesCSV, {});
  this.addSuffixes(partOfSpeech, suffixes.data);
  footnotes = papaparse.parse(adjectiveFootnotesCSV, {});
  this.addFootnotes(partOfSpeech, footnotes.data);

  // Verbs
  partOfSpeech = languageModel.features[types.part][constants.POFS_VERB];
  suffixes = papaparse.parse(verbSuffixesCSV, {});
  this.addVerbSuffixes(partOfSpeech, suffixes.data);
  footnotes = papaparse.parse(verbFootnotesCSV, {});
  this.addFootnotes(partOfSpeech, footnotes.data);
};

/**
 * Decides whether a suffix is a match to any of inflections, and if it is, what type of match it is.
 * @param {Inflection[]} inflections - an array of inflection objects to be matched against a suffix.
 * @param {Suffix} suffix - a suffix to be matched with inflections.
 * @returns {Suffix | null} if a match is found, returns a suffix object modified with some
 * additional information about a match. if no matches found, returns null.
 */
dataSet.matcher = function (inflections, suffix) {
  'use strict';
  // All of those features must match between an inflection and an ending
  let obligatoryMatches = [types.part];

  // Any of those features must match between an inflection and an ending
  let optionalMatches = [types.grmCase, types.declension, types.gender, types.number];
  let bestMatchData = null; // information about the best match we would be able to find

  /*
   There can be only one full match between an inflection and a suffix (except when suffix has multiple values?)
   But there could be multiple partial matches. So we should try to find the best match possible and return it.
   a fullFeature match is when one of inflections has all grammatical features fully matching those of a suffix
   */
  for (let inflection of inflections) {
    let matchData = new MatchData(); // Create a match profile

    if (inflection.suffix === suffix.value) {
      matchData.suffixMatch = true;
    }

    // Check obligatory matches
    for (let feature of obligatoryMatches) {
      let featureMatch = suffix.featureMatch(feature, inflection[feature]);
      // matchFound = matchFound && featureMatch;

      if (!featureMatch) {
        // If an obligatory match is not found, there is no reason to check other items
        break
      }
      // Inflection's value of this feature is matching the one of the suffix
      matchData.matchedFeatures.push(feature);
    }

    if (matchData.matchedFeatures.length < obligatoryMatches.length) {
      // Not all obligatory matches are found, this is not a match
      break
    }

    // Check optional matches now
    for (let feature of optionalMatches) {
      let matchedValue = suffix.featureMatch(feature, inflection[feature]);
      if (matchedValue) {
        matchData.matchedFeatures.push(feature);
      }
    }

    if (matchData.suffixMatch && (matchData.matchedFeatures.length === obligatoryMatches.length + optionalMatches.length)) {
      // This is a full match
      matchData.fullMatch = true;

      // There can be only one full match, no need to search any further
      suffix.match = matchData;
      return suffix
    }
    bestMatchData = this.bestMatch(bestMatchData, matchData);
  }
  if (bestMatchData) {
    // There is some match found
    suffix.match = bestMatchData;
    return suffix
  }
  return null
};

/**
 * Decides whether matchA is 'better' (i.e. has more items matched) than matchB or not
 * @param {MatchData} matchA
 * @param {MatchData} matchB
 * @returns {MatchData} A best of two matches
 */
dataSet.bestMatch = function (matchA, matchB) {
  // If one of the arguments is not set, return the other one
  if (!matchA && matchB) {
    return matchB
  }

  if (!matchB && matchA) {
    return matchA
  }

  // Suffix match has a priority
  if (matchA.suffixMatch !== matchB.suffixMatch) {
    if (matchA.suffixMatch > matchB.suffixMatch) {
      return matchA
    } else {
      return matchB
    }
  }

  // If same on suffix matche, compare by how many features matched
  if (matchA.matchedFeatures.length >= matchB.matchedFeatures.length) {
    // Arbitrarily return matchA if matches are the same
    return matchA
  } else {
    return matchB
  }
};

let classNames = {
  cell: 'infl-cell',
  widthPrefix: 'infl-cell--sp',
  fullWidth: 'infl-cell--fw',
  header: 'infl-cell--hdr',
  highlight: 'infl-cell--hl',
  hidden: 'hidden',
  suffix: 'infl-suff',
  suffixMatch: 'infl-suff--suffix-match',
  suffixFullFeatureMatch: 'infl-suff--full-feature-match',
  inflectionTable: 'infl-table',
  wideView: 'infl-table--wide',
  narrowViewsContainer: 'infl-table-narrow-views-cont',
  narrowView: 'infl-table--narrow',
  footnotesContainer: 'infl-footnotes'
};

let wideView = {
  column: {
    width: 1,
    unit: 'fr'
  }
};

let narrowView = {
  column: {
    width: 100,
    unit: 'px'
  }
};

let footnotes$1 = {
  id: 'inlection-table-footer'
};

let pageHeader = {
  html: `
        <button id="hide-empty-columns" class="switch-btn">Hide empty columns</button><button id="show-empty-columns" class="switch-btn hidden">Show empty columns</button>
        <button id="hide-no-suffix-groups" class="switch-btn">Hide top-level groups with no suffix matches</button><button id="show-no-suffix-groups" class="switch-btn hidden">Show top-level groups with no suffix matches</button><br>
        <p>Hover over the suffix to see its grammar features</p>
        `,
  hideEmptyColumnsBtnSel: '#hide-empty-columns',
  showEmptyColumnsBtnSel: '#show-empty-columns',
  hideNoSuffixGroupsBtnSel: '#hide-no-suffix-groups',
  showNoSuffixGroupsBtnSel: '#show-no-suffix-groups'
};

class Cell {
  /**
   * Creates a cell for an inflection table.
   * @param {Suffix[]} suffixes - A list of suffixes that belongs to this cell.
   * @param {Feature[]} features - A list of features this cell corresponds to.
   */
  constructor (suffixes, features) {
    this.suffixes = suffixes;
    if (!this.suffixes) {
      this.suffixes = [];
    }
    this.features = features;
    this.empty = (this.suffixes.length === 0);
    this.suffixMatches = !!this.suffixes.find(element => {
      if (element.match && element.match.suffixMatch) {
        return element.match.suffixMatch
      }
    });

    this.column = undefined; // A column this cell belongs to
    this.row = undefined; // A row this cell belongs to

    this._index = undefined;

    this.render();
  }

  /**
   * Renders an element's HTML representation.
   */
  render () {
    let element = document.createElement('div');
    element.classList.add(classNames.cell);
    for (let [index, suffix] of this.suffixes.entries()) {
      // Render each suffix
      let suffixElement = document.createElement('a');
      suffixElement.classList.add(classNames.suffix);
      if (suffix.match && suffix.match.suffixMatch) {
        suffixElement.classList.add(classNames.suffixMatch);
      }
      if (suffix.match && suffix.match.fullMatch) {
        suffixElement.classList.add(classNames.suffixFullFeatureMatch);
      }
      let suffixValue = suffix.value ? suffix.value : '-';
      if (suffix.footnote && suffix.footnote.length) {
        suffixValue += '[' + suffix.footnote + ']';
      }
      suffixElement.innerHTML = suffixValue;
      element.appendChild(suffixElement);
      if (index < this.suffixes.length - 1) {
        element.appendChild(document.createTextNode(',\u00A0'));
      }
    }
    this.wNode = element;
    this.nNode = element.cloneNode(true);
  }

  /**
   * Returns an HTML element for a wide view.
   * @returns {HTMLElement}
   */
  get wvNode () {
    return this.wNode
  }

  /**
   * Returns an HTML element for a narrow view.
   * @returns {HTMLElement}
   */
  get nvNode () {
    return this.nNode
  }

  /**
   * Sets a unique index of the cell that can be used for cell identification via 'data-index' attribute.
   * @param {number} index - A unique cell index.
   */
  set index (index) {
    this._index = index;
    this.wNode.dataset.index = this._index;
    this.nNode.dataset.index = this._index;
  }

  /**
   * A proxy for adding an event listener for both wide and narrow view HTML elements.
   * @param {string} type - Listener type.
   * @param {EventListener} listener - Event listener function.
   */
  addEventListener (type, listener) {
    this.wNode.addEventListener(type, listener);
    this.nNode.addEventListener(type, listener);
  }

  /**
   * Hides an element.
   */
  hide () {
    if (!this.wNode.classList.contains(classNames.hidden)) {
      this.wNode.classList.add(classNames.hidden);
      this.nNode.classList.add(classNames.hidden);
    }
  }

  /**
   * Shows a previously hidden element.
   */
  show () {
    if (this.wNode.classList.contains(classNames.hidden)) {
      this.wNode.classList.remove(classNames.hidden);
      this.nNode.classList.remove(classNames.hidden);
    }
  }

  /**
   * Highlights a cell with color.
   */
  highlight () {
    if (!this.wNode.classList.contains(classNames.highlight)) {
      this.wNode.classList.add(classNames.highlight);
      this.nNode.classList.add(classNames.highlight);
    }
  }

  /**
   * Removes highlighting from a previously highlighted cell.
   */
  clearHighlighting () {
    if (this.wNode.classList.contains(classNames.highlight)) {
      this.wNode.classList.remove(classNames.highlight);
      this.nNode.classList.remove(classNames.highlight);
    }
  }

  /**
   * Highlights a row and a column this cell belongs to.
   */
  highlightRowAndColumn () {
    if (!this.column) {
      throw new Error('Column is undefined.')
    }
    if (!this.row) {
      throw new Error('Row is undefined.')
    }
    this.column.highlight();
    this.row.highlight();
  }

  /**
   * Removes highlighting form a previously highlighted row and column.
   */
  clearRowAndColumnHighlighting () {
    if (!this.column) {
      throw new Error('Column is undefined.')
    }
    if (!this.row) {
      throw new Error('Row is undefined.')
    }
    this.column.clearHighlighting();
    this.row.clearHighlighting();
  }
}

/**
 * A cell that specifies a title for a row in an inflection table.
 */
class RowTitleCell {
  /**
   * Initializes a row title cell.
   * @param {string} title - A text that will be shown within the cell.
   * @param {GroupFeatureType} groupingFeature - A grouping feature that specifies a row for which a title cell
   * is created.
   * @param {number} nvGroupQty - A number of narrow view groups. Because each group will be shown separately
   * and will have its own title cells, we need to create a copy of a title cell for each such group.
   */
  constructor (title, groupingFeature, nvGroupQty) {
    this.parent = undefined;
    this.title = title;
    this.feature = groupingFeature;
    this.nvGroupQty = nvGroupQty;

    this.render();
  }

  /**
   * Renders an element's HTML representation.
   */
  render () {
    // Generate HTML representation for a wide view node
    this.wNode = document.createElement('div');
    this.wNode.classList.add(classNames.cell);
    if (this.feature.formsColumn) {
      this.wNode.classList.add(classNames.header);
    }
    if (this.feature.hasFullWidthRowTitle) {
      // This cell is taking an entire row
      this.wNode.classList.add(classNames.fullWidth);
    }
    if (this.feature.formsColumn && this.feature.groupFeatureList.titleColumnsQuantity > 1) {
      this.wNode.classList.add(classNames.widthPrefix + this.feature.groupFeatureList.titleColumnsQuantity);
    }
    this.wNode.innerHTML = this.title;

    // Copy HTML representation to all narrow view nodes (each narrow view group has its own node)
    this.nNodes = []; // Narrow nodes, one for each group
    for (let i = 0; i < this.nvGroupQty; i++) {
      this.nNodes.push(this.wNode.cloneNode(true));
    }
  }

  /**
   * Returns an HTML element for a wide view
   * @returns {HTMLElement} HTML element for a wide view's cell.
   */
  get wvNode () {
    return this.wNode
  }

  /**
   * Returns an array HTML element for narrow view groups
   * @returns {HTMLElement[]} Array of HTML elements for narrow view group's cells.
   */
  getNvNode (index) {
    return this.nNodes[index]
  }

  /**
   * Generates an empty cell placeholder of a certain width. Useful for situation when empty title cells need to be
   * inserted into a table structure (i.e. when title cells occupy multiple columns.
   * @param {number} width - A number of columns placeholder cell will occupy.
   * @returns {HTMLElement} HTML element of a placeholder cell.
   */
  static placeholder (width = 1) {
    let placeholder = document.createElement('div');
    placeholder.classList.add(classNames.cell, classNames.widthPrefix + width);
    return placeholder
  }

  /**
   * Some table layouts require multiple title cells to be shown for a row. These could be, for example, a title
   * cell for a parent category that will follow a title cell for a category that defines a row. In such situation a
   * title cell will have a parent, which will represent a parent cell object.
   * This function returns an array of title cells for a row, starting from the topmost parent and moving down
   * tot the current title cell.
   * @returns {RowTitleCell[]} An array of title row cells representing a title cell hierarchy list.
   */
  get hierarchyList () {
    let parentCells = [];
    if (this.parent) {
      parentCells = this.parent.hierarchyList;
    }
    return parentCells.concat(this)
  }

  /**
   * Highlights this row title cell
   */
  highlight () {
    this.wNode.classList.add(classNames.highlight);
    for (let nNode of this.nNodes) {
      nNode.classList.add(classNames.highlight);
    }
  }

  /**
   * Removes highlighting from this row title cell
   */
  clearHighlighting () {
    this.wNode.classList.remove(classNames.highlight);
    for (let nNode of this.nNodes) {
      nNode.classList.remove(classNames.highlight);
    }
  }
}

/**
 * A cell in a header row, a column title cell.
 */
class HeaderCell {
  /**
   * Initializes a header cell.
   * @param {string} title - A title text that will be shown in the header cell.
   * @param {GroupFeatureType} groupingFeature - A feature that defines one or several columns this header forms.
   * @param {number} [span=1] - How many columns in a table this header cell forms.
   */
  constructor (title, groupingFeature, span = 1) {
    this.feature = groupingFeature;
    this.title = title;
    this.span = span;

    this.parent = undefined;
    this.children = [];
    this.columns = [];

    this.render();
  }

  /**
   * Renders an element's HTML representation.
   */
  render () {
    let element = document.createElement('div');
    element.classList.add(classNames.cell, classNames.header, classNames.widthPrefix + this.span);
    element.innerHTML = this.title;
    this.wNode = element;
    this.nNode = element.cloneNode(true);
  }

  /**
   * Returns an HTML element for a wide view
   * @returns {HTMLElement} HTML element for a wide view's cell.
   */
  get wvNode () {
    return this.wNode
  }

  /**
   * Returns an HTML element for a narrow view
   * @returns {HTMLElement} HTML element for a narrow view's cell.
   */
  get nvNode () {
    return this.nNode
  }

  /**
   * Registers a column that's being formed by this header cell. Adds column to itself and to its parent(s).
   * @param {Column} column - A column that is formed by this header cell.
   */
  addColumn (column) {
    this.columns = this.columns.concat([column]);

    if (this.parent) {
      this.parent.addColumn(column);
    }
  }

  /**
   * Temporary changes a width of a header cell. This happens when one or several columns
   * that this header forms are hidden or shown.
   * @param value
   */
  changeSpan (value) {
    let currentWidthClass = classNames.widthPrefix + this.span;
    this.span += value;
    let newWidthClass = classNames.widthPrefix + this.span;
    this.wNode.classList.replace(currentWidthClass, newWidthClass);
    this.nNode.classList.replace(currentWidthClass, newWidthClass);
  }

  /**
   * This function will notify all parents and children of a title column that some columns under this headers cell
   * changed their state (i.e. were hidden or shown). This way parents and children will be able to update their
   * states accordingly.
   */
  columnStateChange () {
    let visibleColumns = 0;
    for (let column of this.columns) {
      if (!column.hidden) {
        visibleColumns++;
      }
    }
    if (this.span !== visibleColumns) {
      // Number of visible columns has been changed
      let change = visibleColumns - this.span;
      this.changeSpan(change);

      // Notify parents and children
      if (this.children.length) {
        for (let child of this.children) {
          child.columnStateChange();
        }
      }
      if (this.parent) {
        this.parent.columnStateChange();
      }
    }
  }

  /**
   * Highlights a header cell, its parent and children
   */
  highlight () {
    if (!this.wNode.classList.contains(classNames.highlight)) {
      this.wNode.classList.add(classNames.highlight);
      this.nNode.classList.add(classNames.highlight);

      if (this.parent) {
        this.parent.highlight();
      }
    }
  }

  /**
   * Removes highlighting from a header cell, its parent and children
   */
  clearHighlighting () {
    if (this.wNode.classList.contains(classNames.highlight)) {
      this.wNode.classList.remove(classNames.highlight);
      this.nNode.classList.remove(classNames.highlight);

      if (this.parent) {
        this.parent.clearHighlighting();
      }
    }
  }
}

/**
 * Represent a column of cells in an inflection table.
 */
class Column {
  /**
   * Initializes column with a provided set of cells.
   * @param {Cell} cells - Cells that are within this column.
   */
  constructor (cells) {
    this.cells = cells;
    if (!cells) {
      this.cells = [];
    }
    this._headerCell = undefined;
    this.hidden = false;
    this.empty = this.cells.every(cell => cell.empty);
    this.suffixMatches = !!this.cells.find(cell => cell.suffixMatches);

    for (let cell of this.cells) {
      cell.column = this;
    }
  }

  /**
   * Assigns a header cell to the column.
   * @param {HeaderCell} headerCell - A header cell of this column.
   */
  set headerCell (headerCell) {
    this._headerCell = headerCell;
    headerCell.addColumn(this);
  }

  /**
   * Returns a number of cells within this column.
   * @returns {Number} A number of cells this column contains.
   */
  get length () {
    return this.cells.length
  }

  /**
   * Hides the column. Notifies a header about a state change.
   */
  hide () {
    if (!this.hidden) {
      this.hidden = true;

      for (let cell of this.cells) {
        cell.hide();
      }
      if (this._headerCell) {
        this._headerCell.columnStateChange();
      }
    }
  }

  /**
   * Shows the column. Notifies a header about a state change.
   */
  show () {
    if (this.hidden) {
      this.hidden = false;

      for (let cell of this.cells) {
        cell.show();
      }
      if (this._headerCell) {
        this._headerCell.columnStateChange();
      }
    }
  }

  /**
   * Highlights a column and its header.
   */
  highlight () {
    for (let cell of this.cells) {
      cell.highlight();
    }
    if (this._headerCell) {
      this._headerCell.highlight();
    }
  }

  /**
   * Removes highlighting from a column and its header.
   */
  clearHighlighting () {
    for (let cell of this.cells) {
      cell.clearHighlighting();
    }
    if (this._headerCell) {
      this._headerCell.clearHighlighting();
    }
  }
}

/**
 * Represents a row of cells
 */
class Row {
  /**
   * Populates row with cells
   * @param {Cell[]} cells - Cells that belong to this row
   */
  constructor (cells) {
    this.cells = cells;
    if (!cells) {
      this.cells = [];
    }
    this.titleCell = undefined;

    for (let cell of this.cells) {
      cell.row = this;
    }
  }

  /**
   * Adds a cell to the row.
   * This is a chainable function.
   * @param {Cell} cell - A cell to be added to the row
   */
  add (cell) {
    cell.row = this;
    this.cells.push(cell);
    return this
  }

  /**
   * Returns a number of cells in a row
   * @returns {Number} A number of cells in a row
   */
  get length () {
    return this.cells.length
  }

  /**
   * Returns a portion of a cells array starting from `from` item and up to, but not including, `upto` element.
   * It does not create new copies of cells to populate a newly created array; this array contains references to
   * the same cells that original Row refers to. It also does not update row reference within Cell objects.
   *
   * This function presents a way to create another structure of existing table's cells.
   * It can be useful for views that have a different structure (i.e. narrow view).
   * @param {number} from
   * @param {number} upto
   */
  slice (from, upto) {
    let slice = new Row();
    if (from < 0 && from > this.cells.length) {
      throw new Error('"from" parameter is out of range.')
    }
    if (upto < 0 && upto > this.cells.length) {
      throw new Error('"upto" parameter is out of range.')
    }
    for (let index = from; index < upto; index++) {
      slice.cells.push(this.cells[index]);
    }
    slice.titleCell = this.titleCell;
    return slice
  }

  /**
   * Highlights all cells in a row, and a title cells
   */
  highlight () {
    for (let cell of this.cells) {
      cell.highlight();
    }
    if (this.titleCell) {
      this.titleCell.highlight();
    }
  }

  /**
   * Removes highlighting from all cells in a row, and from a title cell
   */
  clearHighlighting () {
    for (let cell of this.cells) {
      cell.clearHighlighting();
    }
    if (this.titleCell) {
      this.titleCell.clearHighlighting();
    }
  }
}

/**
 * This is a wrapper around a FeatureType object. When a Table object creates a
 * hierarchical tree of suffixes, it uses grammatical features as tree nodes.
 * GroupFeatureType extends a Feature object so that it'll be able to store additional information
 * that is required for that.
 */
class GroupFeatureType extends FeatureType {
  /**
   * GroupFeatureType extends FeatureType to serve as a grouping feature (i.e. a feature that forms
   * either a column or a row in an inflection table). For that, it adds some additional functionality,
   * such as custom feature orders that will allow to combine suffixes from several grammatical features
   * (i.e. masculine and feminine) into a one column of a table.
   * @param {FeatureType} featureType - A feature that defines a type of this item.
   * @param {string} titleMessageID - A message ID of a title, used to get a formatted title from a
   * language-specific message bundle.
   * @param {Feature[]} order - A custom sort order for this feature that redefines
   * a default one stored in FeatureType object (optional).
   * Use this parameter to redefine a deafult sort order for a type.
   */
  constructor (featureType, titleMessageID, order = featureType.orderedFeatures) {
    super(featureType.type, GroupFeatureType.featuresToValues(order), featureType.language);

    this.groupTitle = titleMessageID;
    this._groupType = undefined;

    this.groupFeatureList = undefined;

    // Properties below are required to store information during tree creation
    this.subgroups = []; // Each value of the feature
    this.cells = []; // All cells within this group and below
    this.parent = undefined;
    this.header = undefined;

    this._formsColumn = false;
    this._formsRow = false;
    this.hasColumnRowTitle = false; // Whether this feature has a title of a suffix row in the left-side column.
    this.hasFullWidthRowTitle = false; // Whether this feature has a title of suffix rows that spans the whole table width.
  }

  /**
   * Converts a list of Feature objects into a list of strings that represent their values. Keeps tha original
   * array structure intact (work with up two two array levels).
   * @param {Feature[] | Feature[][]} features - An array of feature objects.
   * @return {string[] | strings[][]} A matching array of strings with feature values.
   */
  static featuresToValues (features) {
    return features.map((feature) => {
      if (Array.isArray(feature)) {
        return feature.map((feature) => feature.value)
      } else {
        return feature.value
      }
    })
  }

  /**
   * This is a wrapper around orderedFeatures() that allows to set a custom feature order for particular columns.
   * @returns {Feature[] | Feature[][]} A sorted array of feature values.
   */
  getOrderedFeatures (ancestorFeatures) {
    return this.getOrderedValues(ancestorFeatures).map((value) => new Feature(value, this.type, this.language))
  }

  /**
   * This is a wrapper around orderedValues() that allows to set a custom feature order for particular columns.
   * By default it returns features in the same order that is defined in a base FeatureType class.
   * Redefine it to provide a custom grouping and sort order.
   * @returns {string[] | string[][]} A sorted array of feature values.
   */
  getOrderedValues (ancestorFeatures) {
    return this._orderIndex
  }

  /**
   * Whether this feature forms a columns group.
   * @returns {boolean} True if this feature forms a column.
   */
  get formsColumn () {
    return this._formsColumn
  }

  /**
   * Sets that this feature would form a column.
   * @param {boolean} value
   */
  set formsColumn (value) {
    this._formsColumn = value;
    this._formsRow = !value; // Can't do both
  }

  /**
   * Whether this feature forms a row group.
   * @returns {boolean} True if this feature forms a row.
   */
  get formsRow () {
    return this._formsRow
  }

  /**
   * Sets that this feature would form a row.
   * @param {boolean} value
   */
  set formsRow (value) {
    this._formsRow = value;
    this._formsColumn = !value; // Can't do both
  }

  /**
   * How many groups this feature would form.
   * @returns {Number} A number of groupes formed by this feature.
   */
  get size () {
    return this.orderedValues.length
  }

  /**
   * Checks if two grouping features are of the same type.
   * @param {GroupFeatureType} groupingFeature - A grouping feature to compare with the current one.
   * @returns {boolean} True if grouping features are of the same type.
   */
  isSameType (groupingFeature) {
    return this.type === groupingFeature.type
  }

  /**
   * Creates a title cell for a feature from the current group.
   * @param {string} title - A text that will be shown within a cell.
   * @param {number} nvGroupQty - A number of narrow view groups.
   * @returns {RowTitleCell} A created RowTitleCell object.
   */
  createTitleCell (title, nvGroupQty) {
    return new RowTitleCell(title, this, nvGroupQty)
  }
}

/**
 * Holds a list of all grouping features of a table.
 */
class GroupFeatureList extends FeatureList {
  /**
   * Initializes object with an array of grouping feature objects.
   * @param {GroupFeatureType[]} features - An array of features that form a table.
   * An order of features defines in what order a table tree would be built.
   */
  constructor (features) {
    super(features);
    this._columnFeatures = []; // Features that group cells into columns
    this._rowFeatures = []; // Features that group cells into rows

    this.forEach((feature) => { feature.groupFeatureList = this; });
  }

  /**
   * Return a list of all grouping features that form columns.
   * @returns {GroupFeatureType[]} - An array of grouping features.
   */
  get columnFeatures () {
    return this._columnFeatures
  }

  /**
   * Defines what features form columns. An order of items specifies an order in which columns be shown.
   * @param {Feature[] | GroupingFeature[]} features - What features form columns and what order
   * these columns would follow.
   */
  set columns (features) {
    for (let feature of features) {
      let matchingFeature = this.ofType(feature.type);
      if (!matchingFeature) {
        throw new Error(`Feature of ${feature.type} is not found.`)
      }
      matchingFeature.formsColumn = true;
      this._columnFeatures.push(matchingFeature);
    }
  }

  /**
   * Returns a first column feature item.
   * @returns {GroupFeatureType} A fist column feature.
   */
  get firstColumnFeature () {
    if (this._columnFeatures && this._columnFeatures.length) {
      return this._columnFeatures[0]
    }
  }

  /**
   * Returns a last column feature item.
   * @returns {GroupFeatureType} A last column feature.
   */
  get lastColumnFeature () {
    if (this._columnFeatures && this._columnFeatures.length) {
      return this._columnFeatures[this._columnFeatures.length - 1]
    }
  }

  /**
   * Return a list of all grouping features that form rows.
   * @returns {GroupFeatureType[]} - An array of grouping rows.
   */
  get rowFeatures () {
    return this._rowFeatures
  }

  /**
   * Defines what features form rows. An order of items specifies an order in which columns be shown.
   * @param {Feature[] | GroupingFeature[]} features - What features form rows and what order
   * these rows would follow.
   */
  set rows (features) {
    for (let feature of features) {
      let matchingFeature = this.ofType(feature.type);
      if (!matchingFeature) {
        throw new Error(`Feature of ${feature.type} is not found.`)
      }
      matchingFeature.formsRow = true;
      this._rowFeatures.push(matchingFeature);
    }
    return this
  }

  /**
   * Returns a first row feature item.
   * @returns {GroupFeatureType} A fist row feature.
   */
  get firstRowFeature () {
    if (this._rowFeatures && this._rowFeatures.length) {
      return this._rowFeatures[0]
    }
  }

  /**
   * Returns a last row feature item.
   * @returns {GroupFeatureType} A last row feature.
   */
  get lastRowFeature () {
    if (this._rowFeatures && this._rowFeatures.length) {
      return this._rowFeatures[this._rowFeatures.length - 1]
    }
  }

  /**
   * Defines what are the titles of suffix cell rows within a table body.
   * The number of such items defines how many left-side title columns this table would have (default is one).
   * Full width titles (see below) does not need to be specified here.
   * @param {Feature | GroupingFeature} features - What suffix row titles this table would have.
   */
  set columnRowTitles (features) {
    for (let feature of features) {
      let matchingFeature = this.ofType(feature.type);
      if (!matchingFeature) {
        throw new Error(`Feature of ${feature.type} is not found.`)
      }
      matchingFeature.hasColumnRowTitle = true;
    }
  }

  /**
   * In inflection tables, titles of features are usually located in left-side columns. However, some titles that
   * group several rows together may span the whole table width. This setters defines
   * what those features are.
   * @param {Feature | GroupingFeature} features - What feature titles would take a whole row
   */
  set fullWidthRowTitles (features) {
    for (let feature of features) {
      let matchingFeature = this.ofType(feature.type);
      if (!matchingFeature) {
        throw new Error(`Feature of ${feature.type} is not found.`)
      }
      matchingFeature.hasFullWidthRowTitle = true;
    }
  }

  /**
   * Returns a quantity of grouping features.
   * @returns {number} - A number of grouping features.
   */
  get length () {
    return this._features.length
  }

  /**
   * Calculate a number of title columns.
   * @returns {number} A number of title columns.
   */
  get titleColumnsQuantity () {
    let quantity = 0;
    for (let feature of this._features) {
      if (feature.hasColumnRowTitle) {
        quantity++;
      }
    }
    return quantity
  }
}

/**
 * Stores group data during feature tree construction.
 */
class NodeGroup {
  /**
   * Creates feature group data structures.
   */
  constructor () {
    this.subgroups = []; // Each value of the feature
    this.cells = []; // All cells within this group and below
    this.parent = undefined;
    this.header = undefined;

    this.groupFeatureType = undefined; // Defines a feature type that forms a tree level this node is in.
    this.ancestorFeatures = undefined; // Defines feature values of this node's parents.
  }
}

/**
 * A representation of a table that is shown on wide screens (desktops).
 */
class WideView {
  /**
   * Initializes a wide view.
   * @param {Column[]} columns - Table columns.
   * @param {Row[]} rows - Table rows.
   * @param {Row[]} headers - Table headers.
   * @param {number} titleColumnQty - Number of title columns in a table.
   */
  constructor (columns, rows, headers, titleColumnQty) {
    this.columns = columns;
    this.rows = rows;
    this.headers = headers;
    this.titleColumnQty = titleColumnQty;
    this.nodes = document.createElement('div');
    this.nodes.classList.add(classNames.inflectionTable, classNames.wideView);
  }

  /**
   * Calculates a number of visible columns in this view.
   * @returns {number} A number of visible columns.
   */
  get visibleColumnQty () {
    let qty = 0;
    for (let column of this.columns) {
      if (!column.hidden) {
        qty++;
      }
    }
    return qty
  }

  /**
   * Renders an HTML representation of a wide table view.
   * @returns {HTMLElement} A rendered HTML Element.
   */
  render () {
    // Remove any previously inserted nodes
    this.nodes.innerHTML = '';

    for (let row of this.headers) {
      this.nodes.appendChild(row.titleCell.wvNode);
      for (let cell of row.cells) {
        this.nodes.appendChild(cell.wvNode);
      }
    }

    for (let row of this.rows) {
      let titleCells = row.titleCell.hierarchyList;
      if (titleCells.length < this.titleColumnQty) {
        this.nodes.appendChild(RowTitleCell.placeholder(this.titleColumnQty - titleCells.length));
      }
      for (let titleCell of titleCells) {
        this.nodes.appendChild(titleCell.wvNode);
      }

      for (let cell of row.cells) {
        this.nodes.appendChild(cell.wvNode);
      }
    }
    this.nodes.style.gridTemplateColumns = 'repeat(' + (this.visibleColumnQty + this.titleColumnQty) + ', ' +
      wideView.column.width + wideView.column.unit + ')';

    return this.nodes
  }
}

/**
 * A representation of a table that is shown on narrow screens (mobile devices).
 */
class NarrowView {
  /**
   * Initializes a narrow view.
   * @param {number} groupQty - A number of visible groups (sub tables) within a narrow view.
   * @param {Column[]} columns - Table columns.
   * @param {Row[]} rows - Table rows.
   * @param {Row[]} headers - Table headers.
   * @param {number} titleColumnQty - Number of title columns in a table.
   */
  constructor (groupQty, columns, rows, headers, titleColumnQty) {
    this.columns = columns;
    this.rows = rows;
    this.headers = headers;
    this.titleColumnQty = titleColumnQty;
    this.groups = [];
    this.groupQty = groupQty;
    this.groupSize = 0;
    if (groupQty) {
      this.groupSize = this.columns.length / groupQty;
    }

    this.nodes = document.createElement('div');
    this.nodes.classList.add(classNames.narrowViewsContainer);

    for (let [index, headerCell] of this.headers[0].cells.entries()) {
      this.createGroup(index, headerCell);
    }
  }

  /**
   * Creates a group within a table.
   * @returns {NarrowViewGroup} A newly created group.
   */
  createGroup (index, headerCell) {
    let group = new NarrowViewGroup(index, this.headers, this.rows, this.titleColumnQty);
    this.nodes.appendChild(group.nodes);
    this.groups.push(group);
  }

  /**
   * Generates an HTML representation of a view.
   * @returns {HTMLElement} - HTML representation of a view.
   */
  render () {
    for (let group of this.groups) {
      group.render();
    }
    return this.nodes
  }
}

/**
 * Represents a group within a narrow view. A narrow view is split into separate sub tables
 * by values of a first grammatical feature that forms columns. Then each sub table would contain
 * a suffixes that belong to that grammatical feature value only. Each sub table becomes a
 * separated object and can be reflown on devices with narrow screens.
 */
class NarrowViewGroup {
  // TODO: Review constructor parameters

  /**
   * Initializes a narrow view group. Please note that column, rows, and headers are those of a whole table,
   * not of this particular group. NarrowViewGroup constructor will use this data to build
   * the corresponding objects of the group itself.
   * @param {number} index - An index of this group within a groups array, starting from zero.
   * @param {Row[]} headers - Table headers.
   * @param {Row[]} rows - Table rows.
   * @param {number} titleColumnQty - Number of title columns in a table.
   */
  constructor (index, headers, rows, titleColumnQty) {
    this.index = index;
    this.columns = headers[0].cells[index].columns;
    this.groupSize = this.columns.length;
    let columnsStartIndex = this.columns[0].index;
    let columnsEndIndex = this.columns[this.columns.length - 1].index;

    this.rows = [];
    for (let row of rows) {
      this.rows.push(row.slice(columnsStartIndex, columnsEndIndex + 1));
    }
    this.headers = [];
    /**
     * Since we group by the first column feature, there will be a single feature in a first header row,
     * its children in the second row, children of its children in a third row and so on.
     */
    for (let [headerIndex, headerRow] of headers.entries()) {
      let row = new Row();
      row.titleCell = headerRow.titleCell;
      if (headerIndex === 0) {
        row.cells.push(headerRow.cells[index]);
      } else {
        for (let headerCell of this.headers[headerIndex - 1].cells) {
          row.cells = row.cells.concat(headerCell.children);
        }
      }
      this.headers.push(row);
    }
    this.titleColumnQty = titleColumnQty;

    this.nodes = document.createElement('div');
    this.nodes.classList.add(classNames.inflectionTable, classNames.narrowView);
  }

  /**
   * Calculates a number of visible columns in this view.
   * @returns {number} A number of visible columns.
   */
  get visibleColumnQty () {
    let qty = 0;
    for (let column of this.columns) {
      if (!column.hidden) {
        qty++;
      }
    }
    return qty
  }

  /**
   * Renders an HTML representation of a narrow view group.
   */
  render () {
    this.nodes.innerHTML = '';

    if (this.visibleColumnQty) {
      // This group is visible
      for (let headerRow of this.headers) {
        this.nodes.appendChild(headerRow.titleCell.getNvNode(this.index));
        for (let headerCell of headerRow.cells) {
          this.nodes.appendChild(headerCell.nvNode);
        }
      }

      for (let row of this.rows) {
        let titleCells = row.titleCell.hierarchyList;
        if (titleCells.length < this.titleColumnQty) {
          this.nodes.appendChild(RowTitleCell.placeholder(this.titleColumnQty - titleCells.length));
        }
        for (let titleCell of titleCells) {
          this.nodes.appendChild(titleCell.getNvNode(this.index));
        }

        for (let cell of row.cells) {
          this.nodes.appendChild(cell.nvNode);
        }
      }
      this.nodes.classList.remove(classNames.hidden);
      this.nodes.style.gridTemplateColumns = 'repeat(' + (this.visibleColumnQty + this.titleColumnQty) + ', ' +
        narrowView.column.width + narrowView.column.unit + ')';
      this.nodes.style.width = (this.visibleColumnQty + this.titleColumnQty) * narrowView.column.width +
        narrowView.column.unit;
    } else {
      // This group is hidden
      this.nodes.classList.add(classNames.hidden);
    }
  }
}

/**
 * Represents an inflection table.
 */
class Table {
  /**
   * Initializes an inflection table.
   * @param {GroupFeatureType[]} features - An array of grouping features. An order of elements in this array
   */
  constructor (features) {
    this.features = new GroupFeatureList(features);
    this.emptyColumnsHidden = false;
    this.cells = []; // Will be populated by groupByFeature()

    /*
    This is a special filter function that, if defined will do additional filtering of suffixes within a cell.
     */
    this.suffixCellFilter = undefined;
  }

  /**
   * Creates a table tree and other data structures (columns, rows, headers).
   * This function is chainabe.
   * @param {Suffix[]} suffixes - An array of suffixes to build table from.
   * @returns {Table} Reference to self for chaining.
   */
  construct (suffixes) {
    this.suffixes = suffixes;
    this.tree = this.groupByFeature(suffixes);
    this.headers = this.constructHeaders();
    this.columns = this.constructColumns();
    this.rows = this.constructRows();
    this.emptyColumnsHidden = false;
    return this
  }

  /**
   * Builds wide and narrow views of the table.
   * This function is chainabe.
   * @returns {Table} Reference to self for chaining.
   */
  constructViews () {
    this.wideView = new WideView(this.columns, this.rows, this.headers, this.titleColumnQty);
    this.narrowView = new NarrowView(
      this.features.firstColumnFeature.size, this.columns, this.rows, this.headers, this.titleColumnQty);
    return this
  }

  /**
   * Returns a number of columns with suffix cells in a table.
   * @returns {number} A number of columns with suffix cells in a table.
   */
  get suffixColumnQty () {
    if (!this.columns) {
      throw new Error('Columns are not populated yet.')
    }
    return this.columns.length
  }

  /**
   * Returns a number of columns with row titles in a table.
   * @returns {number} A number of columns with row titles.
   */
  get titleColumnQty () {
    if (!this.features) {
      throw new Error('Features are not defined.')
    }
    return this.features.titleColumnsQuantity
  }

  /**
   * Returns a number of rows with suffix cells in a table.
   * @returns {number} A number of rows with suffix cells.
   */
  get suffixRowQty () {
    if (!this.columns) {
      throw new Error('Columns are not populated yet.')
    }
    return this.columns[0].length
  }

  /**
   * Returns true if an ending grammatical feature defined by featureType has a value that is listed in a featureValues array.
   * This function is for use with Array.prototype.filter().
   * @param {string} featureType - a grammatical feature type we need to filter on.
   * @param {string | string[]} featureValues - a list of possible values of a type specified by featureType that
   * this ending should have.
   * @param {Suffix} suffix - an ending we need to filter out.
   * @returns {boolean} True if suffix has a value of a grammatical feature specified.
   */
  static filter (featureType, featureValues, suffix) {
    'use strict';

    // If not an array, convert it to array for uniformity
    if (!Array.isArray(featureValues)) {
      featureValues = [featureValues];
    }
    for (const value of featureValues) {
      if (suffix.features[featureType] === value) {
        return true
      }
    }

    return false
  };

  /**
   * Groups all suffixes into a tree according to their grammatical features. There are several levels in this tree.
   * Each level corresponds to a one grouping feature. The order of items in GroupingFeatures List object
   * defines an order of those levels.
   * Nodes on each level are values of a grammatical feature that forms this level. An order of those values
   * is determined by the order of values within a GroupFeatureType object of each feature.
   * This is a recursive function.
   * @param {Suffix[]} suffixes - Suffixes to be grouped.
   * @param {Feature[]} ancestorFeatures - A list of feature values on levels above the current.
   * @param {number} currentLevel - At what level in a tree we are now. Used to stop recursion.
   * @returns {NodeGroup} A top level group of suffixes that contain subgroups all way down to the last group.
   */
  groupByFeature (suffixes, ancestorFeatures = [], currentLevel = 0) {
    let group = new NodeGroup();
    group.groupFeatureType = this.features.items[currentLevel];
    group.ancestorFeatures = ancestorFeatures.slice();

    // Iterate over each value of the feature
    for (const featureValue of group.groupFeatureType.getOrderedFeatures(ancestorFeatures)) {
      if (ancestorFeatures.length > 0 && ancestorFeatures[ancestorFeatures.length - 1].type === group.groupFeatureType.type) {
        // Remove previously inserted feature of the same type
        ancestorFeatures.pop();
      }
      ancestorFeatures.push(featureValue);

      // Suffixes that are selected for current combination of feature values
      let selectedSuffixes = suffixes.filter(Table.filter.bind(this, group.groupFeatureType.type, featureValue.value));

      if (currentLevel < this.features.length - 1) {
        // Divide to further groups
        let subGroup = this.groupByFeature(selectedSuffixes, ancestorFeatures, currentLevel + 1);
        group.subgroups.push(subGroup);
        group.cells = group.cells.concat(subGroup.cells);
      } else {
        // This is the last level. This represent a cell with suffixes
        // Split result has a list of suffixes in a table cell. We need to combine items with same endings.
        if (selectedSuffixes.length > 0) {
          if (this.suffixCellFilter) {
            selectedSuffixes = selectedSuffixes.filter(this.suffixCellFilter);
          }

          selectedSuffixes = Suffix.combine(selectedSuffixes);
        }

        let cell = new Cell(selectedSuffixes, ancestorFeatures.slice());
        group.subgroups.push(cell);
        group.cells.push(cell);
        this.cells.push(cell);
        cell.index = this.cells.length - 1;
      }
    }
    ancestorFeatures.pop();
    return group
  }

  /**
   * Create columns out of a suffixes organized into a tree.
   * This is a recursive function.
   * @param {NodeGroup} tree - A tree of suffixes.
   * @param {Column[]} columns - An array of columns to be constructed.
   * @param {number} currentLevel - Current recursion level.
   * @returns {Array} An array of columns of suffix cells.
   */
  constructColumns (tree = this.tree, columns = [], currentLevel = 0) {
    let currentFeature = this.features.items[currentLevel];

    let groups = [];
    for (let [index, featureValue] of currentFeature.getOrderedValues(tree.ancestorFeatures).entries()) {
      let cellGroup = tree.subgroups[index];

      // Iterate until it is the last row feature
      if (!currentFeature.isSameType(this.features.lastRowFeature)) {
        let currentResult = this.constructColumns(cellGroup, columns, currentLevel + 1);
        if (currentFeature.formsRow) {
          // TODO: Avoid creating extra cells

          let group = {
            titleText: featureValue,
            groups: currentResult,
            titleCell: currentFeature.createTitleCell(featureValue, this.features.firstColumnFeature.size)
          };
          group.groups[0].titleCell.parent = group.titleCell;
          groups.push(group);
        } else if (currentFeature.isSameType(this.features.lastColumnFeature)) {
          let column = new Column(cellGroup.cells);
          column.groups = currentResult;
          column.header = featureValue;
          column.index = columns.length;
          columns.push(column);
          column.headerCell = this.headers[this.headers.length - 1].cells[columns.length - 1];
        }
      } else {
        // Last level
        cellGroup.titleCell = currentFeature.createTitleCell(featureValue, this.features.firstColumnFeature.size);
        let group = {
          titleText: featureValue,
          cell: cellGroup,
          titleCell: cellGroup.titleCell
        };
        groups.push(group);
      }
    }
    if (currentFeature.formsRow) {
      return groups
    }
    return columns
  }

  /**
   * Creates an array of header cell rows.
   * This is a recursive function.
   * @param {NodeGroup} tree - A tree of suffixes.
   * @param {Row[]} headers - An array of rows with header cells.
   * @param {number} currentLevel - Current recursion level.
   * @returns {Array} A two-dimensional array of header cell rows.
   */
  constructHeaders (tree = this.tree, headers = [], currentLevel = 0) {
    let currentFeature = this.features.columnFeatures[currentLevel];

    let cells = [];
    for (let [index, featureValue] of currentFeature.getOrderedValues(tree.ancestorFeatures).entries()) {
      let cellGroup = tree.subgroups[index];

      // Iterate over all column features (features that form columns)
      if (currentLevel < this.features.columnFeatures.length - 1) {
        let subCells = this.constructHeaders(cellGroup, headers, currentLevel + 1);

        let columnSpan = 0;
        for (let cell of subCells) {
          columnSpan += cell.span;
        }

        let headerCell = new HeaderCell(featureValue, currentFeature, columnSpan);
        headerCell.children = subCells;
        for (let cell of subCells) {
          cell.parent = headerCell;
        }

        if (!headers[currentLevel]) {
          headers[currentLevel] = new Row();
        }
        headers[currentLevel].titleCell = currentFeature.createTitleCell(
          this.messages.get(currentFeature.groupTitle), this.features.firstColumnFeature.size);

        headers[currentLevel].add(headerCell);
        cells.push(headerCell);
      } else {
        // Last level
        let headerCell = new HeaderCell(featureValue, currentFeature);

        if (!headers[currentLevel]) {
          headers[currentLevel] = new Row();
        }

        headers[currentLevel].add(headerCell);
        headers[currentLevel].titleCell = currentFeature.createTitleCell(
          this.messages.get(currentFeature.groupTitle), this.features.firstColumnFeature.size);
        cells.push(headerCell);
      }
    }
    if (currentLevel === 0) {
      return headers
    } else {
      return cells
    }
  }

  /**
   * Creates an array of rows by parsing an array of columns.
   * @returns {Row[]} An array of rows.
   */
  constructRows () {
    let rows = [];
    for (let rowIndex = 0; rowIndex < this.suffixRowQty; rowIndex++) {
      rows[rowIndex] = new Row();
      rows[rowIndex].titleCell = this.columns[0].cells[rowIndex].titleCell;
      for (let columnIndex = 0; columnIndex < this.suffixColumnQty; columnIndex++) {
        rows[rowIndex].add(this.columns[columnIndex].cells[rowIndex]);
      }
    }
    return rows
  }

  /**
   * Adds event listeners to each cell object.
   */
  addEventListeners () {
    for (let cell of this.cells) {
      cell.addEventListener('mouseenter', this.highlightRowAndColumn.bind(this));
      cell.addEventListener('mouseleave', this.clearRowAndColumnHighlighting.bind(this));
    }
  }

  /**
   * Highlights a row and a column this cell is in.
   * @param {Event} event - An event that triggers this function.
   */
  highlightRowAndColumn (event) {
    let index = event.currentTarget.dataset.index;
    this.cells[index].highlightRowAndColumn();
  }

  /**
   * Removes highlighting from row and a column this cell is in.
   * @param {Event} event - An event that triggers this function.
   */
  clearRowAndColumnHighlighting (event) {
    let index = event.currentTarget.dataset.index;
    this.cells[index].clearRowAndColumnHighlighting();
  }

  /**
   * Hides empty columns in a table.
   */
  hideEmptyColumns () {
    for (let column of this.columns) {
      if (column.empty) {
        column.hide();
      }
    }
    this.emptyColumnsHidden = true;
  }

  /**
   * Show all empty columns that were previously hidden.
   */
  showEmptyColumns () {
    for (let column of this.columns) {
      if (column.hidden) {
        column.show();
      }
    }
    this.emptyColumnsHidden = false;
  }

  /**
   * Hide groups that have no suffix matches.
   */
  hideNoSuffixGroups () {
    for (let headerCell of this.headers[0].cells) {
      let matches = !!headerCell.columns.find(column => column.suffixMatches);
      if (!matches) {
        for (let column of headerCell.columns) {
          column.hide();
        }
      }
    }
    this.suffixMatchesHidden = true;
  }

  /**
   * Show groups that have no suffix matches.
   */
  showNoSuffixGroups () {
    for (let column of this.columns) {
      column.show();
    }
    if (this.emptyColumnsHidden) {
      this.hideEmptyColumns();
    }
    this.suffixMatchesHidden = false;
  }
}

/**
 * Represents a list of footnotes.
 */
class Footnotes {
  /**
   * Initialises a Footnotes object.
   * @param {Footnote[]} footnotes - An array of footnote objects.
   */
  constructor (footnotes) {
    this.footnotes = footnotes;

    this.nodes = document.createElement('dl');
    this.nodes.id = footnotes$1.id;
    this.nodes.classList.add(classNames.footnotesContainer);
    for (let footnote of footnotes) {
      let index = document.createElement('dt');
      index.innerHTML = footnote.index;
      this.nodes.appendChild(index);
      let text = document.createElement('dd');
      text.innerHTML = footnote.text;
      this.nodes.appendChild(text);
    }
  }

  /**
   * Returns an HTML representation of a Footnotes object.
   * @returns {HTMLElement} An HTML representation of a Footnotes object.
   */
  get html () {
    return this.nodes
  }
}

/**
 * Represents a single view.
 */
class View {
  /**
   * Initializes a View object with options. There is at least one view per part of speech,
   * but there could be several views for the same part of speech that show different table representation of a view.
   * @param {Object} viewOptions
   */
  constructor () {
    // this.options = viewOptions;
    this.pageHeader = {};

    // An HTML element where this view is rendered
    this.container = undefined;

    // Must be implemented in a descendant
    this.id = 'baseView';
    this.name = 'base view';
    this.title = 'Base View';
    this.language = undefined;
    this.partOfSpeech = undefined;
  }

  /**
   * Converts a WordData, returned from inflection tables library, into an HTML representation of an inflection table
   * and inserts that HTML into a `container` HTML element. `messages` provides a translation for view's texts.
   * @param {HTMLElement} container - An HTML element where this view will be inserted.
   * @param {WordData} wordData - A result set from inflection tables library.
   * @param {MessageBundle} messages - A message bundle with message translations.
   */
  render (container, wordData, messages) {
    'use strict';

    this.messages = messages;
    this.container = container;
    this.wordData = wordData;
    let selection = wordData[this.partOfSpeech];

    this.footnotes = new Footnotes(selection.footnotes);

    // this.table = new Table(selection.suffixes, this.groupingFeatures, messages);
    // this.table = new Table();
    // this.setTableData();
    this.table.messages = messages;
    this.table.construct(selection.suffixes).constructViews();
    this.display();
  }

  /**
   * Renders a view's HTML representation and inserts it into `container` HTML element.
   */
  display () {
    // Clear the container
    this.container.innerHTML = '';

    let word = document.createElement('h2');
    word.innerHTML = this.wordData.homonym.targetWord;
    this.container.appendChild(word);

    let title = document.createElement('h3');
    title.innerHTML = this.title;
    this.container.appendChild(title);

    this.pageHeader = { nodes: document.createElement('div') };
    this.pageHeader.nodes.innerHTML = pageHeader.html;
    this.pageHeader.hideEmptyColumnsBtn = this.pageHeader.nodes.querySelector(pageHeader.hideEmptyColumnsBtnSel);
    this.pageHeader.showEmptyColumnsBtn = this.pageHeader.nodes.querySelector(pageHeader.showEmptyColumnsBtnSel);
    this.pageHeader.hideNoSuffixGroupsBtn = this.pageHeader.nodes.querySelector(pageHeader.hideNoSuffixGroupsBtnSel);
    this.pageHeader.showNoSuffixGroupsBtn = this.pageHeader.nodes.querySelector(pageHeader.showNoSuffixGroupsBtnSel);
    this.container.appendChild(this.pageHeader.nodes);

    // Insert a wide view
    this.container.appendChild(this.table.wideView.render());
    // Insert narrow views
    this.container.appendChild(this.table.narrowView.render());

    this.table.addEventListeners();

    this.container.appendChild(this.footnotes.html);

    this.pageHeader.hideEmptyColumnsBtn.addEventListener('click', this.hideEmptyColumns.bind(this));
    this.pageHeader.showEmptyColumnsBtn.addEventListener('click', this.showEmptyColumns.bind(this));

    this.pageHeader.hideNoSuffixGroupsBtn.addEventListener('click', this.hideNoSuffixGroups.bind(this));
    this.pageHeader.showNoSuffixGroupsBtn.addEventListener('click', this.showNoSuffixGroups.bind(this));
  }

  /**
   * Hides all empty columns of the view.
   */
  hideEmptyColumns () {
    this.table.hideEmptyColumns();
    this.display();
    this.pageHeader.hideEmptyColumnsBtn.classList.add(classNames.hidden);
    this.pageHeader.showEmptyColumnsBtn.classList.remove(classNames.hidden);
  }

  /**
   * Displays all previously hidden columns.
   */
  showEmptyColumns () {
    this.table.showEmptyColumns();
    this.display();
    this.pageHeader.showEmptyColumnsBtn.classList.add(classNames.hidden);
    this.pageHeader.hideEmptyColumnsBtn.classList.remove(classNames.hidden);
  }

  /**
   * Hides groups (formed by first column feature) that have no suffix matches.
   */
  hideNoSuffixGroups () {
    this.table.hideNoSuffixGroups();
    this.display();
    this.pageHeader.hideNoSuffixGroupsBtn.classList.add(classNames.hidden);
    this.pageHeader.showNoSuffixGroupsBtn.classList.remove(classNames.hidden);
  }

  /**
   * Displays previously hidden groups with no suffix matches.
   */
  showNoSuffixGroups () {
    this.table.showNoSuffixGroups();
    this.display();
    this.pageHeader.hideNoSuffixGroupsBtn.classList.add(classNames.hidden);
    this.pageHeader.showNoSuffixGroupsBtn.classList.remove(classNames.hidden);
  }
}

class LatinView extends View {
  constructor () {
    super();
    this.language = languages.latin;
    this.language_features = languageModel.features;

    /*
    Default grammatical features of a view. It child views need to have different feature values, redefine
    those values in child objects.
     */
    this.features = {
      numbers: new GroupFeatureType(this.language_features[Feature.types.number], 'Number'),
      cases: new GroupFeatureType(this.language_features[Feature.types.grmCase], 'Case'),
      declensions: new GroupFeatureType(this.language_features[Feature.types.declension], 'Declension'),
      genders: new GroupFeatureType(this.language_features[Feature.types.gender], 'Gender'),
      types: new GroupFeatureType(this.language_features[Feature.types.type], 'Type')
    };
  }

  /*
  Creates and initializes an inflection table. Redefine this method in child objects in order to create
  an inflection table differently
   */
  createTable () {
    this.table = new Table([this.features.declensions, this.features.genders,
      this.features.types, this.features.numbers, this.features.cases]);
    let features = this.table.features;
    features.columns = [this.language_features[Feature.types.declension], this.language_features[Feature.types.gender], this.language_features[Feature.types.type]];
    features.rows = [this.language_features[Feature.types.number], this.language_features[Feature.types.grmCase]];
    features.columnRowTitles = [this.language_features[Feature.types.grmCase]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.number]];
  }
}

class NounView extends LatinView {
  constructor () {
    super();
    this.id = 'nounDeclension';
    this.name = 'noun declension';
    this.title = 'Noun declension';
    this.partOfSpeech = this.language_features[Feature.types.part][constants.POFS_NOUN].value;

    // Models.Feature that are different from base class values
    this.features.genders = new GroupFeatureType(this.language_features[Feature.types.gender], 'Gender',
      [ this.language_features[Feature.types.gender][constants.GEND_MASCULINE],
        this.language_features[Feature.types.gender][constants.GEND_FEMININE],
        this.language_features[Feature.types.gender][constants.GEND_NEUTER]
      ]);
    this.createTable();
  }
}

class AdjectiveView extends LatinView {
  constructor () {
    super();
    this.id = 'adjectiveDeclension';
    this.name = 'adjective declension';
    this.title = 'Adjective declension';
    this.partOfSpeech = this.language_features[Feature.types.part].adjective.value;

    // Models.Feature that are different from base class values
    this.features.declensions = new GroupFeatureType(this.language_features[Feature.types.declension], 'Declension',
      [ this.language_features[Feature.types.declension][constants.ORD_1ST],
        this.language_features[Feature.types.declension][constants.ORD_2ND],
        this.language_features[Feature.types.declension][constants.ORD_3RD]
      ]);
    this.createTable();
  }
}

class VerbView extends LatinView {
  constructor () {
    super();
    this.partOfSpeech = this.language_features[Feature.types.part][constants.POFS_VERB].value;

    this.features = {
      tenses: new GroupFeatureType(this.language_features[Feature.types.tense], 'Tenses'),
      numbers: new GroupFeatureType(this.language_features[Feature.types.number], 'Number'),
      persons: new GroupFeatureType(this.language_features[Feature.types.person], 'Person'),
      voices: new GroupFeatureType(this.language_features[Feature.types.voice], 'Voice'),
      conjugations: new GroupFeatureType(this.language_features[Feature.types.conjugation], 'Conjugation Stem'),
      moods: new GroupFeatureType(this.language_features[Feature.types.mood], 'Mood')
    };
  }
}

class VoiceConjugationMoodView extends VerbView {
  constructor () {
    super();
    this.id = 'verbVoiceConjugationMood';
    this.name = 'verb voice-conjugation-mood';
    this.title = 'Voice-Conjugation-Mood';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.voices, this.features.conjugations, this.features.moods,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [
      this.language_features[Feature.types.voice],
      this.language_features[Feature.types.conjugation],
      this.language_features[Feature.types.mood]];
    features.rows = [
      this.language_features[Feature.types.tense],
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.columnRowTitles = [
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

class VoiceMoodConjugationView extends VerbView {
  constructor () {
    super();
    this.id = 'verbVoiceMoodConjugation';
    this.name = 'verb voice-mood-conjugation';
    this.title = 'Voice-Mood-Conjugation';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.voices, this.features.moods, this.features.conjugations,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [
      this.language_features[Feature.types.voice],
      this.language_features[Feature.types.mood],
      this.language_features[Feature.types.conjugation]];
    features.rows = [
      this.language_features[Feature.types.tense],
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.columnRowTitles = [
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

class ConjugationVoiceMoodView extends VerbView {
  constructor () {
    super();
    this.id = 'verbConjugationVoiceMood';
    this.name = 'verb conjugation-voice-mood';
    this.title = 'Conjugation-Voice-Mood';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.conjugations, this.features.voices, this.features.moods,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [
      this.language_features[Feature.types.conjugation],
      this.language_features[Feature.types.voice], this.language_features[Feature.types.mood]];
    features.rows = [
      this.language_features[Feature.types.tense],
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.columnRowTitles = [
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

class ConjugationMoodVoiceView extends VerbView {
  constructor () {
    super();
    this.id = 'verbConjugationMoodVoice';
    this.name = 'verb conjugation-mood-voice';
    this.title = 'Conjugation-Mood-Voice';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.conjugations, this.features.moods, this.features.voices,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [
      this.language_features[Feature.types.conjugation],
      this.language_features[Feature.types.mood],
      this.language_features[Feature.types.voice]];
    features.rows = [
      this.language_features[Feature.types.tense],
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.columnRowTitles = [
      this.language_features[Feature.types.number],
      this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

class MoodVoiceConjugationView extends VerbView {
  constructor () {
    super();
    this.id = 'verbMoodVoiceConjugation';
    this.name = 'verb mood-voice-conjugation';
    this.title = 'Mood-Voice-Conjugation';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.moods, this.features.voices, this.features.conjugations,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [this.language_features[Feature.types.mood], this.language_features[Feature.types.voice], this.language_features[Feature.types.conjugation]];
    features.rows = [this.language_features[Feature.types.tense], this.language_features[Feature.types.number], this.language_features[Feature.types.person]];
    features.columnRowTitles = [this.language_features[Feature.types.number], this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

class MoodConjugationVoiceView extends VerbView {
  constructor () {
    super();
    this.id = 'verbMoodConjugationVoice';
    this.name = 'verb mood-conjugation-voice';
    this.title = 'Mood-Conjugation-Voice';

    this.createTable();
  }

  createTable () {
    this.table = new Table([this.features.moods, this.features.conjugations, this.features.voices,
      this.features.tenses, this.features.numbers, this.features.persons]);
    let features = this.table.features;
    features.columns = [this.language_features[Feature.types.mood], this.language_features[Feature.types.conjugation], this.language_features[Feature.types.voice]];
    features.rows = [this.language_features[Feature.types.tense], this.language_features[Feature.types.number], this.language_features[Feature.types.person]];
    features.columnRowTitles = [this.language_features[Feature.types.number], this.language_features[Feature.types.person]];
    features.fullWidthRowTitles = [this.language_features[Feature.types.tense]];
  }
}

var viewsLatin = [new NounView(), new AdjectiveView(),
  // Verbs
  new VoiceConjugationMoodView(), new VoiceMoodConjugationView(), new ConjugationVoiceMoodView(),
  new ConjugationMoodVoiceView(), new MoodVoiceConjugationView(), new MoodConjugationVoiceView()];

var nounSuffixesCSV$1 = "Ending,Number,Case,Declension,Gender,Type,Primary,Footnote\nα,dual,accusative,1st,feminine,regular,primary,\nά,dual,accusative,1st,feminine,regular,,\nᾶ,dual,accusative,1st,feminine,regular,,2\nαιν,dual,dative,1st,feminine,regular,primary,\nαῖν,dual,dative,1st,feminine,regular,,\nαιιν,dual,dative,1st,feminine,irregular,,\nαιν,dual,genitive,1st,feminine,regular,primary,\nαῖν,dual,genitive,1st,feminine,regular,,\nαιιν,dual,genitive,1st,feminine,irregular,,\nα,dual,nominative,1st,feminine,regular,primary,\nά,dual,nominative,1st,feminine,regular,,\nᾶ,dual,nominative,1st,feminine,regular,,2\nα,dual,vocative,1st,feminine,regular,primary,\nά,dual,vocative,1st,feminine,regular,,\nᾶ,dual,vocative,1st,feminine,regular,,2\nα,dual,accusative,1st,masculine,regular,primary,\nά,dual,accusative,1st,masculine,regular,,\nᾶ,dual,accusative,1st,masculine,regular,,2\nαιν,dual,dative,1st,masculine,regular,primary,\nαῖν,dual,dative,1st,masculine,regular,,\nαιιν,dual,dative,1st,masculine,irregular,,\nαιν,dual,genitive,1st,masculine,regular,primary,\nαῖν,dual,genitive,1st,masculine,regular,,\nαιιν,dual,genitive,1st,masculine,irregular,,\nα,dual,nominative,1st,masculine,regular,primary,\nά,dual,nominative,1st,masculine,regular,,\nᾶ,dual,nominative,1st,masculine,regular,,2\nα,dual,vocative,1st,masculine,regular,primary,\nά,dual,vocative,1st,masculine,regular,,\nᾶ,dual,vocative,1st,masculine,regular,,2\nας,plural,accusative,1st,feminine,regular,primary,\nάς,plural,accusative,1st,feminine,regular,,\nᾶς,plural,accusative,1st,feminine,regular,,2\nανς,plural,accusative,1st,feminine,irregular,,\nαις,plural,accusative,1st,feminine,irregular,,\nαις,plural,dative,1st,feminine,regular,primary,\nαῖς,plural,dative,1st,feminine,regular,,\nῃσι,plural,dative,1st,feminine,irregular,,44\nῃσιν,plural,dative,1st,feminine,irregular,,4 44\nῃς,plural,dative,1st,feminine,irregular,,44\nαισι,plural,dative,1st,feminine,irregular,,44\nαισιν,plural,dative,1st,feminine,irregular,,4 44\nῶν,plural,genitive,1st,feminine,regular,primary,\nάων,plural,genitive,1st,feminine,irregular,,\nέων,plural,genitive,1st,feminine,irregular,,\nήων,plural,genitive,1st,feminine,irregular,,\nᾶν,plural,genitive,1st,feminine,irregular,,\nαι,plural,nominative,1st,feminine,regular,primary,\nαί,plural,nominative,1st,feminine,regular,,\nαῖ,plural,nominative,1st,feminine,regular,,2\nαι,plural,vocative,1st,feminine,regular,primary,\nαί,plural,vocative,1st,feminine,regular,,\nαῖ,plural,vocative,1st,feminine,regular,,2\nας,plural,accusative,1st,masculine,regular,primary,\nάς,plural,accusative,1st,masculine,regular,,\nᾶς,plural,accusative,1st,masculine,regular,,3\nανς,plural,accusative,1st,masculine,irregular,,\nαις,plural,accusative,1st,masculine,irregular,,\nαις,plural,dative,1st,masculine,regular,primary,\nαῖς,plural,dative,1st,masculine,regular,,\nῃσι,plural,dative,1st,masculine,irregular,,44\nῃσιν,plural,dative,1st,masculine,irregular,,4 44\nῃς,plural,dative,1st,masculine,irregular,,44\nαισι,plural,dative,1st,masculine,irregular,,44\nαισιν,plural,dative,1st,masculine,irregular,,4 44\nῶν,plural,genitive,1st,masculine,regular,primary,\nάων,plural,genitive,1st,masculine,irregular,,\nέων,plural,genitive,1st,masculine,irregular,,\nήων,plural,genitive,1st,masculine,irregular,,\nᾶν,plural,genitive,1st,masculine,irregular,,\nαι,plural,nominative,1st,masculine,regular,primary,\nαί,plural,nominative,1st,masculine,regular,,\nαῖ,plural,nominative,1st,masculine,regular,,3\nαι,plural,vocative,1st,masculine,regular,primary,\nαί,plural,vocative,1st,masculine,regular,,\nαῖ,plural,vocative,1st,masculine,regular,,3\nαν,singular,accusative,1st,feminine,regular,primary,\nην,singular,accusative,1st,feminine,regular,primary,\nήν,singular,accusative,1st,feminine,regular,,\nᾶν,singular,accusative,1st,feminine,regular,,2\nῆν,singular,accusative,1st,feminine,regular,,2\nάν,singular,accusative,1st,feminine,irregular,,63\nᾳ,singular,dative,1st,feminine,regular,primary,\nῃ,singular,dative,1st,feminine,regular,primary,\nῇ,singular,dative,1st,feminine,regular,,2\nᾷ,singular,dative,1st,feminine,regular,,2\nηφι,singular,dative,1st,feminine,irregular,,45\nηφιν,singular,dative,1st,feminine,irregular,,4 45\nῆφι,singular,dative,1st,feminine,irregular,,45\nῆφιv,singular,dative,1st,feminine,irregular,,4 45\nας,singular,genitive,1st,feminine,regular,primary,\nης,singular,genitive,1st,feminine,regular,primary,\nῆs,singular,genitive,1st,feminine,regular,,\nᾶs,singular,genitive,1st,feminine,regular,,2\nηφι,singular,genitive,1st,feminine,irregular,,45\nηφιν,singular,genitive,1st,feminine,irregular,,4 45\nῆφι,singular,genitive,1st,feminine,irregular,,45\nῆφιv,singular,genitive,1st,feminine,irregular,,4 45\nα,singular,nominative,1st,feminine,regular,primary,\nη,singular,nominative,1st,feminine,regular,primary,1\nή,singular,nominative,1st,feminine,regular,,\nᾶ,singular,nominative,1st,feminine,regular,,2\nῆ,singular,nominative,1st,feminine,regular,,2\nά,singular,nominative,1st,feminine,irregular,,63\nα,singular,vocative,1st,feminine,regular,primary,\nη,singular,vocative,1st,feminine,regular,primary,\nή,singular,vocative,1st,feminine,regular,,\nᾶ,singular,vocative,1st,feminine,regular,,2\nῆ,singular,vocative,1st,feminine,regular,,2\nά,singular,vocative,1st,feminine,irregular,,63\nαν,singular,accusative,1st,masculine,regular,primary,\nην,singular,accusative,1st,masculine,regular,primary,3\nήν,singular,accusative,1st,masculine,regular,,\nᾶν,singular,accusative,1st,masculine,regular,,3\nῆν,singular,accusative,1st,masculine,regular,,3\nεα,singular,accusative,1st,masculine,irregular,,\nᾳ,singular,dative,1st,masculine,regular,primary,\nῃ,singular,dative,1st,masculine,regular,primary,\nῇ,singular,dative,1st,masculine,regular,,\nᾷ,singular,dative,1st,masculine,regular,,3\nῆ,singular,dative,1st,masculine,regular,,3\nηφι,singular,dative,1st,masculine,irregular,,45\nηφιν,singular,dative,1st,masculine,irregular,,4 45\nῆφι,singular,dative,1st,masculine,irregular,,45\nῆφιv,singular,dative,1st,masculine,irregular,,4 45\nου,singular,genitive,1st,masculine,regular,primary,\nοῦ,singular,genitive,1st,masculine,regular,,\nαο,singular,genitive,1st,masculine,irregular,,\nεω,singular,genitive,1st,masculine,irregular,,\nηφι,singular,genitive,1st,masculine,irregular,,45\nηφιν,singular,genitive,1st,masculine,irregular,,4 45\nῆφι,singular,genitive,1st,masculine,irregular,,45\nῆφιv,singular,genitive,1st,masculine,irregular,,4 45\nω,singular,genitive,1st,masculine,irregular,,\nα,singular,genitive,1st,masculine,irregular,,\nας,singular,nominative,1st,masculine,regular,primary,\nης,singular,nominative,1st,masculine,regular,primary,\nής,singular,nominative,1st,masculine,regular,,\nᾶs,singular,nominative,1st,masculine,regular,,3\nῆs,singular,nominative,1st,masculine,regular,,3\nα,singular,vocative,1st,masculine,regular,primary,\nη,singular,vocative,1st,masculine,regular,primary,\nά,singular,vocative,1st,masculine,regular,,\nᾶ,singular,vocative,1st,masculine,regular,,3\nῆ,singular,vocative,1st,masculine,regular,,3\nω,dual,accusative,2nd,masculine feminine,regular,primary,\nώ,dual,accusative,2nd,masculine feminine,regular,,5\nοιν,dual,dative,2nd,masculine feminine,regular,primary,\nοῖν,dual,dative,2nd,masculine feminine,regular,,5\nοιιν,dual,dative,2nd,masculine feminine,irregular,,\nῴν,dual,dative,2nd,masculine feminine,irregular,,7\nοιν,dual,genitive,2nd,masculine feminine,regular,primary,\nοῖν,dual,genitive,2nd,masculine feminine,regular,,5\nοιιν,dual,genitive,2nd,masculine feminine,irregular,,\nῴν,dual,genitive,2nd,masculine feminine,irregular,,7\nω,dual,nominative,2nd,masculine feminine,regular,primary,60\nώ,dual,nominative,2nd,masculine feminine,regular,,60\nω,dual,vocative,2nd,masculine feminine,regular,primary,\nώ,dual,vocative,2nd,masculine feminine,regular,,5\nω,dual,accusative,2nd,neuter,regular,primary,\nώ,dual,accusative,2nd,neuter,regular,,6\nοιν,dual,dative,2nd,neuter,regular,primary,\nοῖν,dual,dative,2nd,neuter,regular,,6\nοιιν,dual,dative,2nd,neuter,irregular,,\nοιν,dual,genitive,2nd,neuter,regular,primary,\nοῖν,dual,genitive,2nd,neuter,regular,,6\nοιιν,dual,genitive,2nd,neuter,irregular,,\nω,dual,nominative,2nd,neuter,regular,primary,\nώ,dual,nominative,2nd,neuter,regular,,6\nω,dual,vocative,2nd,neuter,regular,primary,\nώ,dual,vocative,2nd,neuter,regular,,6\nους,plural,accusative,2nd,masculine feminine,regular,primary,\nούς,plural,accusative,2nd,masculine feminine,regular,,41\nοῦς,plural,accusative,2nd,masculine feminine,regular,,5\nονς,plural,accusative,2nd,masculine feminine,irregular,,\nος,plural,accusative,2nd,masculine feminine,irregular,,\nως,plural,accusative,2nd,masculine feminine,irregular,,\nοις,plural,accusative,2nd,masculine feminine,irregular,,\nώς,plural,accusative,2nd,masculine feminine,irregular,,7\nοις,plural,dative,2nd,masculine feminine,regular,primary,\nοῖς,plural,dative,2nd,masculine feminine,regular,,5\nοισι,plural,dative,2nd,masculine feminine,irregular,,\nοισιν,plural,dative,2nd,masculine feminine,irregular,,4\nῴς,plural,dative,2nd,masculine feminine,irregular,,7\nόφι,plural,dative,2nd,masculine feminine,irregular,,45\nόφιv,plural,dative,2nd,masculine feminine,irregular,,4 45\nων,plural,genitive,2nd,masculine feminine,regular,primary,\nῶν,plural,genitive,2nd,masculine feminine,regular,,5\nών,plural,genitive,2nd,masculine feminine,irregular,,7\nόφι,plural,genitive,2nd,masculine feminine,irregular,,45\nόφιv,plural,genitive,2nd,masculine feminine,irregular,,4 45\nοι,plural,nominative,2nd,masculine feminine,regular,primary,\nοί,plural,nominative,2nd,masculine feminine,regular,,41\nοῖ,plural,nominative,2nd,masculine feminine,regular,,5\nῴ,plural,nominative,2nd,masculine feminine,irregular,,7\nοι,plural,vocative,2nd,masculine feminine,regular,primary,\nοί,plural,vocative,2nd,masculine feminine,regular,,41\nοῖ,plural,vocative,2nd,masculine feminine,regular,,5\nα,plural,accusative,2nd,neuter,regular,primary,\nᾶ,plural,accusative,2nd,neuter,regular,,6\nοις,plural,dative,2nd,neuter,regular,primary,\nοῖς,plural,dative,2nd,neuter,regular,,6\nοισι,plural,dative,2nd,neuter,irregular,,\nοισιν,plural,dative,2nd,neuter,irregular,,4\nόφι,plural,dative,2nd,neuter,irregular,,45\nόφιv,plural,dative,2nd,neuter,irregular,,4 45\nων,plural,genitive,2nd,neuter,regular,primary,\nῶν,plural,genitive,2nd,neuter,regular,,6\nόφι,plural,genitive,2nd,neuter,irregular,,45\nόφιv,plural,genitive,2nd,neuter,irregular,,4 45\nα,plural,nominative,2nd,neuter,regular,primary,\nᾶ,plural,nominative,2nd,neuter,regular,,6\nα,plural,vocative,2nd,neuter,regular,primary,\nᾶ,plural,vocative,2nd,neuter,regular,,6\nον,singular,accusative,2nd,masculine feminine,regular,primary,\nόν,singular,accusative,2nd,masculine feminine,regular,primary,41\nουν,singular,accusative,2nd,masculine feminine,regular,,5\nοῦν,singular,accusative,2nd,masculine feminine,regular,,5\nω,singular,accusative,2nd,masculine feminine,irregular,,7 5\nωv,singular,accusative,2nd,masculine feminine,irregular,,7 59\nώ,singular,accusative,2nd,masculine feminine,irregular,,7 42 59\nών,singular,accusative,2nd,masculine feminine,irregular,,7 59\nῳ,singular,dative,2nd,masculine feminine,regular,primary,\nῷ,singular,dative,2nd,masculine feminine,regular,,5\nῴ,singular,dative,2nd,masculine feminine,irregular,,7\nόφι,singular,dative,2nd,masculine feminine,irregular,,45\nόφιv,singular,dative,2nd,masculine feminine,irregular,,4 45\nου,singular,genitive,2nd,masculine feminine,regular,primary,\nοῦ,singular,genitive,2nd,masculine feminine,regular,,5\nοιο,singular,genitive,2nd,masculine feminine,irregular,,\nοο,singular,genitive,2nd,masculine feminine,irregular,,\nω,singular,genitive,2nd,masculine feminine,irregular,,\nώ,singular,genitive,2nd,masculine feminine,irregular,,7\nόφι,singular,genitive,2nd,masculine feminine,irregular,,45\nόφιv,singular,genitive,2nd,masculine feminine,irregular,,4 45\nος,singular,nominative,2nd,masculine feminine,regular,primary,\nους,singular,nominative,2nd,masculine feminine,regular,,5\noῦς,singular,nominative,2nd,masculine feminine,regular,,5\nός,singular,nominative,2nd,masculine feminine,regular,,\nώς,singular,nominative,2nd,masculine feminine,irregular,,7 42\nως,singular,nominative,2nd,masculine feminine,irregular,,\nε,singular,vocative,2nd,masculine feminine,regular,primary,\nέ,singular,vocative,2nd,masculine feminine,regular,,\nοu,singular,vocative,2nd,masculine feminine,regular,,5\nοῦ,singular,vocative,2nd,masculine feminine,regular,,42\nός,singular,vocative,2nd,masculine feminine,irregular,,57\nον,singular,accusative,2nd,neuter,regular,primary,\nοῦν,singular,accusative,2nd,neuter,regular,,6\nῳ,singular,dative,2nd,neuter,regular,primary,\nῷ,singular,dative,2nd,neuter,regular,,6\nόφι,singular,dative,2nd,neuter,irregular,,45\nόφιv,singular,dative,2nd,neuter,irregular,,4 45\nου,singular,genitive,2nd,neuter,regular,primary,\nοῦ,singular,genitive,2nd,neuter,regular,,6\nοο,singular,genitive,2nd,neuter,irregular,,\nοιο,singular,genitive,2nd,neuter,irregular,,\nω,singular,genitive,2nd,neuter,irregular,,\nόφι,singular,genitive,2nd,neuter,irregular,,45\nόφιv,singular,genitive,2nd,neuter,irregular,,4 45\nον,singular,nominative,2nd,neuter,regular,primary,\nοῦν,singular,nominative,2nd,neuter,regular,,6\nον,singular,vocative,2nd,neuter,regular,primary,\nοῦν,singular,vocative,2nd,neuter,regular,,6\nε,dual,accusative,3rd,masculine feminine,regular,primary,\nει,dual,accusative,3rd,masculine feminine,regular,,\nῆ,dual,accusative,3rd,masculine feminine,regular,,18\nω,dual,accusative,3rd,masculine feminine,irregular,,32\nῖ,dual,accusative,3rd,masculine feminine,irregular,,33\nεε,dual,accusative,3rd,masculine feminine,irregular,,16 55 61\nοιν,dual,dative,3rd,masculine feminine,regular,primary,\nοῖν,dual,dative,3rd,masculine feminine,regular,,\nοιιν,dual,dative,3rd,masculine feminine,irregular,,54\nσι,dual,dative,3rd,masculine feminine,irregular,,33 37\nεσσι,dual,dative,3rd,masculine feminine,irregular,,33\nεσι,dual,dative,3rd,masculine feminine,irregular,,33\nέοιν,dual,dative,3rd,masculine feminine,irregular,,16 61\nῳν,dual,dative,3rd,masculine feminine,irregular,,49\nοιν,dual,genitive,3rd,masculine feminine,regular,primary,\nοῖν,dual,genitive,3rd,masculine feminine,regular,,\nοιιν,dual,genitive,3rd,masculine feminine,irregular,,54\nέοιν,dual,genitive,3rd,masculine feminine,irregular,,16 61\nῳν,dual,genitive,3rd,masculine feminine,irregular,,49\nε,dual,nominative,3rd,masculine feminine,regular,primary,\nει,dual,nominative,3rd,masculine feminine,regular,,\nῆ,dual,nominative,3rd,masculine feminine,regular,,18\nω,dual,nominative,3rd,masculine feminine,irregular,,32\nῖ,dual,nominative,3rd,masculine feminine,irregular,,33\nεε,dual,nominative,3rd,masculine feminine,irregular,,16 55 61\nε,dual,vocative,3rd,masculine feminine,regular,primary,\nει,dual,vocative,3rd,masculine feminine,regular,,\nῆ,dual,vocative,3rd,masculine feminine,regular,,18\nω,dual,vocative,3rd,masculine feminine,irregular,,32\nῖ,dual,vocative,3rd,masculine feminine,irregular,,33\nεε,dual,vocative,3rd,masculine feminine,irregular,,16 55 61\nε,dual,accusative,3rd,neuter,regular,primary,\nει,dual,accusative,3rd,neuter,regular,,\nα,dual,accusative,3rd,neuter,regular,,\nεε,dual,accusative,3rd,neuter,irregular,,16 61\nαε,dual,accusative,3rd,neuter,irregular,,16 61\nοιν,dual,dative,3rd,neuter,regular,primary,\nῷν,dual,dative,3rd,neuter,regular,,\nοις,dual,dative,3rd,neuter,irregular,,33 38\nοισι,dual,dative,3rd,neuter,irregular,,33 38\nοισι(ν),dual,dative,3rd,neuter,irregular,,4 33 38\nοιιν,dual,dative,3rd,neuter,irregular,,\nέοιν,dual,dative,3rd,neuter,irregular,,16 61\nάοιν,dual,dative,3rd,neuter,irregular,,16 61\nοιν,dual,genitive,3rd,neuter,regular,primary,\nῷν,dual,genitive,3rd,neuter,regular,,\nων,dual,genitive,3rd,neuter,irregular,,33 38\nοιιν,dual,genitive,3rd,neuter,irregular,,\nέοιν,dual,genitive,3rd,neuter,irregular,,16 61\nάοιν,dual,genitive,3rd,neuter,irregular,,16 61\nε,dual,nominative,3rd,neuter,regular,primary,\nει,dual,nominative,3rd,neuter,regular,,\nα,dual,nominative,3rd,neuter,regular,,\nεε,dual,nominative,3rd,neuter,irregular,,16 61\nαε,dual,nominative,3rd,neuter,irregular,,16 61\nε,dual,vocative,3rd,neuter,regular,primary,\nει,dual,vocative,3rd,neuter,regular,,\nα,dual,vocative,3rd,neuter,regular,,\nεε,dual,vocative,3rd,neuter,irregular,,16 61\nαε,dual,vocative,3rd,neuter,irregular,,16 61\nας,plural,accusative,3rd,masculine feminine,regular,primary,\nεις,plural,accusative,3rd,masculine feminine,regular,,17 41\nες,plural,accusative,3rd,masculine feminine,regular,,\nς,plural,accusative,3rd,masculine feminine,regular,,\nῦς,plural,accusative,3rd,masculine feminine,regular,,17 18 48\nως,plural,accusative,3rd,masculine feminine,regular,,30\nῆς,plural,accusative,3rd,masculine feminine,irregular,,56\nέας,plural,accusative,3rd,masculine feminine,irregular,,\nέος,plural,accusative,3rd,masculine feminine,irregular,,\nῆος,plural,accusative,3rd,masculine feminine,irregular,,\nῆες,plural,accusative,3rd,masculine feminine,irregular,,\nῆας,plural,accusative,3rd,masculine feminine,irregular,,\nους,plural,accusative,3rd,masculine feminine,irregular,,32\nούς,plural,accusative,3rd,masculine feminine,irregular,,32\nεῖς,plural,accusative,3rd,masculine feminine,irregular,,31 41\nεες,plural,accusative,3rd,masculine feminine,irregular,,55 61\nις,plural,accusative,3rd,masculine feminine,irregular,,\nινς,plural,accusative,3rd,masculine feminine,irregular,,\nῶς,plural,accusative,3rd,masculine feminine,irregular,,48\nσι,plural,dative,3rd,masculine feminine,regular,primary,\nσιν,plural,dative,3rd,masculine feminine,regular,primary,4\nσί,plural,dative,3rd,masculine feminine,regular,,41\nσίν,plural,dative,3rd,masculine feminine,regular,,4 41\nεσι,plural,dative,3rd,masculine feminine,regular,,41\nεσιν,plural,dative,3rd,masculine feminine,regular,,4 41\nέσι,plural,dative,3rd,masculine feminine,regular,,\nέσιν,plural,dative,3rd,masculine feminine,regular,,4\nψι,plural,dative,3rd,masculine feminine,regular,,\nψιν,plural,dative,3rd,masculine feminine,regular,,4\nψί,plural,dative,3rd,masculine feminine,regular,,\nψίν,plural,dative,3rd,masculine feminine,regular,,4\nξι,plural,dative,3rd,masculine feminine,regular,,\nξιν,plural,dative,3rd,masculine feminine,regular,,4\nξί,plural,dative,3rd,masculine feminine,regular,,\nξίν,plural,dative,3rd,masculine feminine,regular,,4\nφι,plural,dative,3rd,masculine feminine,irregular,,45\nφιν,plural,dative,3rd,masculine feminine,irregular,,4 45\nηφι,plural,dative,3rd,masculine feminine,irregular,,45\nηφιv,plural,dative,3rd,masculine feminine,irregular,,4 45\nῆφι,plural,dative,3rd,masculine feminine,irregular,,45\nῆφιν,plural,dative,3rd,masculine feminine,irregular,,4 45\nόφι,plural,dative,3rd,masculine feminine,irregular,,45\nόφιν,plural,dative,3rd,masculine feminine,irregular,,4 45\nαις,plural,dative,3rd,masculine feminine,irregular,,33 41\nοῖσι,plural,dative,3rd,masculine feminine,irregular,,33\nοῖσιv,plural,dative,3rd,masculine feminine,irregular,,4 33\nεσσι,plural,dative,3rd,masculine feminine,irregular,,16 61\nεσσιv,plural,dative,3rd,masculine feminine,irregular,,4 16 61\nυσσι,plural,dative,3rd,masculine feminine,irregular,,54\nυσσιv,plural,dative,3rd,masculine feminine,irregular,,4 54\nσσί,plural,dative,3rd,masculine feminine,irregular,,54\nσσίv,plural,dative,3rd,masculine feminine,irregular,,4 54\nων,plural,genitive,3rd,masculine feminine,regular,primary,\nῶν,plural,genitive,3rd,masculine feminine,regular,,\n-,plural,genitive,3rd,masculine feminine,irregular,,41\nφι,plural,genitive,3rd,masculine feminine,irregular,,45\nφιν,plural,genitive,3rd,masculine feminine,irregular,,4 45\nηφι,plural,genitive,3rd,masculine feminine,irregular,,45\nηφιv,plural,genitive,3rd,masculine feminine,irregular,,4 45\nῆφι,plural,genitive,3rd,masculine feminine,irregular,,45\nῆφιν,plural,genitive,3rd,masculine feminine,irregular,,4 45\nόφι,plural,genitive,3rd,masculine feminine,irregular,,45\nόφιν,plural,genitive,3rd,masculine feminine,irregular,,4 45\nέων,plural,genitive,3rd,masculine feminine,irregular,,16 61\nες,plural,nominative,3rd,masculine feminine,regular,primary,\nως,plural,nominative,3rd,masculine feminine,regular,,30\nεις,plural,nominative,3rd,masculine feminine,regular,,17\nεῖς,plural,nominative,3rd,masculine feminine,regular,,18\nοί,plural,nominative,3rd,masculine feminine,irregular,,32\nαί,plural,nominative,3rd,masculine feminine,irregular,,33\nῆς,plural,nominative,3rd,masculine feminine,irregular,,18\nῄς,plural,nominative,3rd,masculine feminine,irregular,,31 41\nεες,plural,nominative,3rd,masculine feminine,irregular,,16 55 61\nοι,plural,nominative,3rd,masculine feminine,irregular,,33\nες,plural,vocative,3rd,masculine feminine,regular,primary,\nεις,plural,vocative,3rd,masculine feminine,regular,,17\nεῖς,plural,vocative,3rd,masculine feminine,regular,,18\nῆς,plural,vocative,3rd,masculine feminine,regular,,18\nως,plural,vocative,3rd,masculine feminine,regular,,30\nεες,plural,vocative,3rd,masculine feminine,irregular,,16 55 61\nα,plural,accusative,3rd,neuter,regular,primary,\nη,plural,accusative,3rd,neuter,regular,,\nς,plural,accusative,3rd,neuter,regular,,\nά,plural,accusative,3rd,neuter,irregular,,33\nαα,plural,accusative,3rd,neuter,irregular,,16 61\nεα,plural,accusative,3rd,neuter,irregular,,16 61\nσι,plural,dative,3rd,neuter,regular,primary,\nσιν,plural,dative,3rd,neuter,regular,primary,4\nσί,plural,dative,3rd,neuter,regular,,\nσίv,plural,dative,3rd,neuter,regular,,4\nασι,plural,dative,3rd,neuter,regular,,\nασιν,plural,dative,3rd,neuter,regular,,4\nεσι,plural,dative,3rd,neuter,regular,,\nεσιν,plural,dative,3rd,neuter,regular,,4\nέσι,plural,dative,3rd,neuter,regular,,\nέσιv,plural,dative,3rd,neuter,regular,,4\nεσσι,plural,dative,3rd,neuter,irregular,,54\nεσσιν,plural,dative,3rd,neuter,irregular,,4 54\nσσί,plural,dative,3rd,neuter,irregular,,54\nσσίv,plural,dative,3rd,neuter,irregular,,4 54\nασσι,plural,dative,3rd,neuter,irregular,,54\nασσιν,plural,dative,3rd,neuter,irregular,,4 54\nφι,plural,dative,3rd,neuter,irregular,,45\nφιν,plural,dative,3rd,neuter,irregular,,4 45\nηφι,plural,dative,3rd,neuter,irregular,,45\nηφιv,plural,dative,3rd,neuter,irregular,,4 45\nῆφι,plural,dative,3rd,neuter,irregular,,45\nῆφιν,plural,dative,3rd,neuter,irregular,,4 45\nόφι,plural,dative,3rd,neuter,irregular,,45\nόφιν,plural,dative,3rd,neuter,irregular,,4 45\nων,plural,genitive,3rd,neuter,regular,primary,\nῶν,plural,genitive,3rd,neuter,regular,primary,\nφι,plural,genitive,3rd,neuter,irregular,,\nφιν,plural,genitive,3rd,neuter,irregular,,4 45\nηφι,plural,genitive,3rd,neuter,irregular,,45\nηφιv,plural,genitive,3rd,neuter,irregular,,4 45\nῆφι,plural,genitive,3rd,neuter,irregular,,45\nῆφιν,plural,genitive,3rd,neuter,irregular,,4 45\nόφι,plural,genitive,3rd,neuter,irregular,,45\nόφιν,plural,genitive,3rd,neuter,irregular,,4 45\nέων,plural,genitive,3rd,neuter,irregular,,16 61\nάων,plural,genitive,3rd,neuter,irregular,,16 61\nα,plural,nominative,3rd,neuter,regular,primary,\nη,plural,nominative,3rd,neuter,regular,,\nες,plural,nominative,3rd,neuter,regular,,\nά,plural,nominative,3rd,neuter,irregular,,33\nεα,plural,nominative,3rd,neuter,irregular,,16 61\nαα,plural,nominative,3rd,neuter,irregular,,16 61\nα,plural,vocative,3rd,neuter,regular,primary,\nη,plural,vocative,3rd,neuter,regular,,\nες,plural,vocative,3rd,neuter,regular,,\nαα,plural,vocative,3rd,neuter,irregular,,16 61\nεα,plural,vocative,3rd,neuter,irregular,,16 61\nα,singular,accusative,3rd,masculine feminine,regular,primary,\nη,singular,accusative,3rd,masculine feminine,regular,,16\nν,singular,accusative,3rd,masculine feminine,regular,,\nιν,singular,accusative,3rd,masculine feminine,regular,,41\nῦν,singular,accusative,3rd,masculine feminine,regular,,18\nῶ,singular,accusative,3rd,masculine feminine,regular,,23\nυν,singular,accusative,3rd,masculine feminine,regular,,\nῦν,singular,accusative,3rd,masculine feminine,regular,,17\nύν,singular,accusative,3rd,masculine feminine,regular,,17\nέα,singular,accusative,3rd,masculine feminine,regular,,20\nην,singular,accusative,3rd,masculine feminine,regular,,24\nώ,singular,accusative,3rd,masculine feminine,regular,,19 41\nω,singular,accusative,3rd,masculine feminine,regular,,23\nεῖν,singular,accusative,3rd,masculine feminine,irregular,,31 41\nων,singular,accusative,3rd,masculine feminine,irregular,,33 41 49\nαν,singular,accusative,3rd,masculine feminine,irregular,,33 41\nον,singular,accusative,3rd,masculine feminine,irregular,,39\nῖς,singular,accusative,3rd,masculine feminine,irregular,,33\nεα,singular,accusative,3rd,masculine feminine,irregular,,61\nι,singular,dative,3rd,masculine feminine,regular,primary,\nί,singular,dative,3rd,masculine feminine,regular,,\nϊ,singular,dative,3rd,masculine feminine,regular,,17\nΐ,singular,dative,3rd,masculine feminine,regular,,40\nει,singular,dative,3rd,masculine feminine,regular,,16 17\nεῖ,singular,dative,3rd,masculine feminine,regular,,18\nαι,singular,dative,3rd,masculine feminine,regular,,\noῖ,singular,dative,3rd,masculine feminine,regular,,28 41\nῖ,singular,dative,3rd,masculine feminine,irregular,,33 46\nῆι,singular,dative,3rd,masculine feminine,irregular,,18\nᾳ,singular,dative,3rd,masculine feminine,irregular,,25\nῳ,singular,dative,3rd,masculine feminine,irregular,,33 34\nῷ,singular,dative,3rd,masculine feminine,irregular,,33\nιί,singular,dative,3rd,masculine feminine,irregular,,62\nυί,singular,dative,3rd,masculine feminine,irregular,,62\nέϊ,singular,dative,3rd,masculine feminine,irregular,,18 61\nος,singular,genitive,3rd,masculine feminine,regular,primary,\nός,singular,genitive,3rd,masculine feminine,regular,,\nους,singular,genitive,3rd,masculine feminine,regular,,16\nοῦς,singular,genitive,3rd,masculine feminine,regular,,19 46\nως,singular,genitive,3rd,masculine feminine,regular,,17 18\nώς,singular,genitive,3rd,masculine feminine,regular,,17 18 41\nῶς,singular,genitive,3rd,masculine feminine,regular,,47\nεως,singular,genitive,3rd,masculine feminine,regular,,17\nέως,singular,genitive,3rd,masculine feminine,regular,,\nεώς,singular,genitive,3rd,masculine feminine,regular,,\nέους,singular,genitive,3rd,masculine feminine,regular,,20\nω,singular,genitive,3rd,masculine feminine,irregular,,\nεος,singular,genitive,3rd,masculine feminine,irregular,,61\nΰς,singular,genitive,3rd,masculine feminine,irregular,,41 48\nῦς,singular,genitive,3rd,masculine feminine,irregular,,48\nνος,singular,genitive,3rd,masculine feminine,irregular,,22\nοῦ,singular,genitive,3rd,masculine feminine,irregular,,33\nηος,singular,genitive,3rd,masculine feminine,irregular,,55\nιός,singular,genitive,3rd,masculine feminine,irregular,,62\nuός,singular,genitive,3rd,masculine feminine,irregular,,62\nς,singular,nominative,3rd,masculine feminine,regular,primary,\n-,singular,nominative,3rd,masculine feminine,regular,primary,\nηρ,singular,nominative,3rd,masculine feminine,regular,,41\nις,singular,nominative,3rd,masculine feminine,regular,,\nϊς,singular,nominative,3rd,masculine feminine,regular,,\nώ,singular,nominative,3rd,masculine feminine,regular,,41\nψ,singular,nominative,3rd,masculine feminine,regular,,\nξ,singular,nominative,3rd,masculine feminine,regular,,\nρ,singular,nominative,3rd,masculine feminine,regular,,\nήρ,singular,nominative,3rd,masculine feminine,regular,,\nήν,singular,nominative,3rd,masculine feminine,regular,,50\nν,singular,nominative,3rd,masculine feminine,regular,,\nωρ,singular,nominative,3rd,masculine feminine,regular,,\nων,singular,nominative,3rd,masculine feminine,regular,,\nών,singular,nominative,3rd,masculine feminine,regular,,\nης,singular,nominative,3rd,masculine feminine,regular,,\nῆς,singular,nominative,3rd,masculine feminine,regular,,\nυς,singular,nominative,3rd,masculine feminine,regular,,\nῦς,singular,nominative,3rd,masculine feminine,regular,,\nεῦς,singular,nominative,3rd,masculine feminine,regular,,\nύς,singular,nominative,3rd,masculine feminine,regular,,\nής,singular,nominative,3rd,masculine feminine,regular,,33\nας,singular,nominative,3rd,masculine feminine,irregular,,\nῴ,singular,nominative,3rd,masculine feminine,irregular,,29 41\nώς,singular,nominative,3rd,masculine feminine,irregular,,27 41\nϋς,singular,nominative,3rd,masculine feminine,irregular,,41\nῄς,singular,nominative,3rd,masculine feminine,irregular,,31 41\nῖς,singular,nominative,3rd,masculine feminine,irregular,,\nεῖς,singular,nominative,3rd,masculine feminine,irregular,,31 41\nῶς,singular,nominative,3rd,masculine feminine,irregular,,48\nος,singular,nominative,3rd,masculine feminine,irregular,,33\n-,singular,vocative,3rd,masculine feminine,regular,primary,52\nς,singular,vocative,3rd,masculine feminine,regular,,30\nι,singular,vocative,3rd,masculine feminine,regular,,41\nῦ,singular,vocative,3rd,masculine feminine,regular,,15 17 18\nοῖ,singular,vocative,3rd,masculine feminine,regular,,19 41\nψ,singular,vocative,3rd,masculine feminine,regular,,\nξ,singular,vocative,3rd,masculine feminine,regular,,\nν,singular,vocative,3rd,masculine feminine,regular,,\nρ,singular,vocative,3rd,masculine feminine,regular,,\nων,singular,vocative,3rd,masculine feminine,regular,,50\nών,singular,vocative,3rd,masculine feminine,regular,,\nήν,singular,vocative,3rd,masculine feminine,regular,,\nερ,singular,vocative,3rd,masculine feminine,regular,,\nες,singular,vocative,3rd,masculine feminine,regular,,\nί,singular,vocative,3rd,masculine feminine,regular,,\nως,singular,vocative,3rd,masculine feminine,regular,,\nἶ,singular,vocative,3rd,masculine feminine,regular,,\nούς,singular,vocative,3rd,masculine feminine,regular,,51\nύ,singular,vocative,3rd,masculine feminine,regular,,15\nυ,singular,vocative,3rd,masculine feminine,regular,,51\nεις,singular,vocative,3rd,masculine feminine,regular,,20\nαν,singular,vocative,3rd,masculine feminine,regular,,\nώς,singular,vocative,3rd,masculine feminine,irregular,,27 41 46\nον,singular,vocative,3rd,masculine feminine,irregular,,\nυς,singular,vocative,3rd,masculine feminine,irregular,,33\nα,singular,accusative,3rd,neuter,regular,primary,15\n-,singular,accusative,3rd,neuter,regular,,33\nος,singular,accusative,3rd,neuter,regular,,\nας,singular,accusative,3rd,neuter,regular,,\nαρ,singular,accusative,3rd,neuter,regular,,21\nυ,singular,accusative,3rd,neuter,regular,,\nι,singular,dative,3rd,neuter,regular,primary,\nει,singular,dative,3rd,neuter,regular,,16\nαι,singular,dative,3rd,neuter,regular,,16 21\nϊ,singular,dative,3rd,neuter,irregular,,17\nᾳ,singular,dative,3rd,neuter,irregular,,25 33\nυϊ,singular,dative,3rd,neuter,irregular,,17\nαϊ,singular,dative,3rd,neuter,irregular,,21 61\nος,singular,genitive,3rd,neuter,regular,primary,\nους,singular,genitive,3rd,neuter,regular,,16\nως,singular,genitive,3rd,neuter,regular,,16\nεως,singular,genitive,3rd,neuter,regular,,17\nυς,singular,genitive,3rd,neuter,irregular,,26\nου,singular,genitive,3rd,neuter,irregular,,33\nαος,singular,genitive,3rd,neuter,irregular,,21 61\nα,singular,nominative,3rd,neuter,regular,primary,\n-,singular,nominative,3rd,neuter,regular,,33\nος,singular,nominative,3rd,neuter,regular,,\nαρ,singular,nominative,3rd,neuter,regular,,\nας,singular,nominative,3rd,neuter,regular,,16 21\nυ,singular,nominative,3rd,neuter,regular,,\nον,singular,nominative,3rd,neuter,irregular,,33\nα,singular,vocative,3rd,neuter,regular,primary,15\n-,singular,vocative,3rd,neuter,regular,,\nος,singular,vocative,3rd,neuter,regular,,\nας,singular,vocative,3rd,neuter,regular,,\nαρ,singular,vocative,3rd,neuter,regular,,21\nυ,singular,vocative,3rd,neuter,regular,,";

var nounFootnotesCSV$1 = "Index,Text\n1,See  for Rules of variance within regular endings\n2,See  for Table of α- and ε- stem feminine 1st declension contracts\n3,See  for Table of α- and ε- stem masculine 1st declension contracts\n4,\"Previous, with (ν)\"\n5,See  for Table of o- and ε- stem masculine  2nd declension contracts\n6,See  for Table of o- and ε- stem neuter 2nd declension contracts\n7,(Attic) contracts of o-stems preceded by a long vowel\n15,\"This is not actually an “ending,” but the last letter of the “pure stem”. See\"\n16,\"See  &  for Table of Sigma (ες,ας,ος) stem contracts\"\n17,See  for Table of  ι and υ - stem contracts\n18,\"See  for Table of  ευ,αυ,and ου - stem contracts\"\n19,See  for stems in οι feminine 3rd declension contracts\n20,See  for Table of 3rd declension contracts of stems in -εσ- preceded by ε\n21,See  for Table of stems in τ and ατ neuter 3rd declension contracts\n22,\"On stem ending in ν, ν doubled in gen. Sing Aeolic (e.g. μῆνς,μῆννος...)\"\n23,Also in inscriptions and expressions of swearing\n24,(Borrowed from 1st decl) Sometimes in proper names whose nominative ends in -ης\n25,From -ας-stems (properly αι)\n26,(ε)υς instead of (ε)ος or ους (gen) for (3rd decl) words whose nominative ends in -ος\n27,In 3rd decl. Only in the words αἰδώς (Attic) and ἠώς (Homer and Ionic)\n28,Contraction of a stem in οι  and an ι-ending\n29,Stronger form of Ionic contractions of οι-stems (in the nominative)\n30,See  for Table of ω - stem contracts (masculine only)\n31,Nominative plural contraction of  -ειδ+ες  after dropping the δ (used for accusative too). See .a\n32,\"Plurals & duals occur rarely (and w/ 2nd decl endings) for 3rd decl οι-stem nouns. See .D.a,b,c\"\n33,See  for description and examples of Irreg. Decl involving 3rd decl endings\n34,(Homer)  for Attic  (ῳτ)ι\n35,(Homer) for Cretan ινς\n36,Also an irregular ending for other stem(s)\n37,In inscriptions\n38,\"Plural endings for otherwise dual noun,οσσε (eyes)\"\n39,\"“Poetical” (acc for ἔρως). See ,11\"\n40,\"Poetic for χρωτι,dat. of ὁ χρως\"\n41,No Masculine of this Form\n42,No Feminine of this Form\n44,See  D.9 and #215 regarding dialectic alternate forms of the Dative Plural\n45,\"Surviving in Homer (See ) Not truly genitive or dative, but instrumental/locative/ablative, associated with the remaining oblique cases (genitive & dative) only after being lost as cases themselves in Greek\"\n46,See Smyth # 266 for only surviving ος-stem in Attic (fem. singular of αἰδως)\n47,See  for Substantives in -εύς preceded by a vowel.\n48,\"See Smyth,  #275 D.1,2,3\"\n49,\"See , List of Principal Irregular Substantives\"\n50,\"See  for Table of stems in a Liquid (λ,ρ) or a Nasal (ν), and Note #259D for variants including Κρονίων...\"\n51,\"See  for Table of stems in a Dental (τ,δ,θ) or a Nasal (ν), and its notes including Ν.κόρυς (Voc. Κόρυ) & ὀδούς\"\n52,See  for general rule re 3rd Declension Masc/Fem Singular Vocative\n54,See  D\n55,See\n56,\"See  for other forms of endings for contracts of ευ,αυ,and ου - stems\"\n57,Nominative form used as Vocative. See\n58,\"See ,b\"\n59,\"See ,d\"\n60,This (Feminine or Masculine) Form only Masculine when derived from ε- or ο- contraction\n61,See Smyth Note 264 D.1 regarding Homer's use of Open Forms\n62,See Smyth Note 269 for alternate i-stem and u-stem endings\n63,See  D.2\n64,See  D.1";

/*
 * Latin language data module
 */
/* import adjectiveSuffixesCSV from './data/adjective/suffixes.csv';
import adjectiveFootnotesCSV from './data/adjective/footnotes.csv';
import verbSuffixesCSV from './data/verb/suffixes.csv';
import verbFootnotesCSV from './data/verb/footnotes.csv'; */
// A language of this module
const language$1 = languages.greek;
// Create a language data set that will keep all language-related information
let dataSet$1 = new LanguageDataset(language$1);

// region Definition of grammatical features
/*
 Define grammatical features of a language. Those grammatical features definitions will also be used by morphological
 analyzer's language modules as well.
 */
const importerName$1 = 'csv';
const parts = new FeatureType(Feature.types.part, ['noun', 'adjective', 'verb'], language$1);
const numbers = new FeatureType(Feature.types.number, ['singular', 'dual', 'plural'], language$1);
numbers.addImporter(importerName$1)
  .map('singular', numbers.singular)
  .map('dual', numbers.dual)
  .map('plural', numbers.plural);
const cases = new FeatureType(Feature.types.grmCase, ['nominative', 'genitive', 'dative', 'accusative', 'vocative'], language$1);
cases.addImporter(importerName$1)
  .map('nominative', cases.nominative)
  .map('genitive', cases.genitive)
  .map('dative', cases.dative)
  .map('accusative', cases.accusative)
  .map('vocative', cases.vocative);
const declensions = new FeatureType(Feature.types.declension, ['first', 'second', 'third'], language$1);
declensions.addImporter(importerName$1)
  .map('1st', declensions.first)
  .map('2nd', declensions.second)
  .map('3rd', declensions.third);
const genders = new FeatureType(Feature.types.gender, ['masculine', 'feminine', 'neuter'], language$1);
genders.addImporter(importerName$1)
  .map('masculine', genders.masculine)
  .map('feminine', genders.feminine)
  .map('neuter', genders.neuter)
  .map('masculine feminine', [genders.masculine, genders.feminine]);
const types$1 = new FeatureType(Feature.types.type, ['regular', 'irregular'], language$1);
types$1.addImporter(importerName$1)
  .map('regular', types$1.regular)
  .map('irregular', types$1.irregular);
/*
const conjugations = new Models.FeatureType(Lib.types.conjugation, ['first', 'second', 'third', 'fourth']);
conjugations.addImporter(importerName)
    .map('1st', conjugations.first)
    .map('2nd', conjugations.second)
    .map('3rd', conjugations.third)
    .map('4th', conjugations.fourth);
const tenses = new Models.FeatureType(Lib.types.tense, ['present', 'imperfect', 'future', 'perfect', 'pluperfect', 'future perfect']);
tenses.addImporter(importerName)
    .map('present', tenses.present)
    .map('imperfect', tenses.imperfect)
    .map('future', tenses.future)
    .map('perfect', tenses.perfect)
    .map('pluperfect', tenses.pluperfect)
    .map('future_perfect', tenses['future perfect']);
const voices = new Models.FeatureType(Lib.types.voice, ['passive', 'active'],language);
voices.addImporter(importerName)
    .map('passive', voices.passive)
    .map('active', voices.active);
const moods = new Models.FeatureType(Lib.types.mood, ['indicative', 'subjunctive']);
moods.addImporter(importerName)
    .map('indicative', moods.indicative)
    .map('subjunctive', moods.subjunctive);
const persons = new Models.FeatureType(Lib.types.person, ['first', 'second', 'third']);
persons.addImporter(importerName)
    .map('1st', persons.first)
    .map('2nd', persons.second)
    .map('3rd', persons.third); */
const footnotes$2 = new FeatureType(Feature.types.footnote, [], {});

// endregion Definition of grammatical features

// For noun and adjectives
dataSet$1.addSuffixes = function (partOfSpeech, data) {
  // Some suffix values will mean a lack of suffix, they will be mapped to a null
  let noSuffixValue = '-';

  // First row are headers
  for (let i = 1; i < data.length; i++) {
    let dataItem = data[i];
    let suffixValue = dataItem[0];
    // Handle special suffix values
    if (suffixValue === noSuffixValue) {
      suffixValue = null;
    }

    let primary = false;
    let features = [partOfSpeech,
      numbers.importer.csv.get(dataItem[1]),
      cases.importer.csv.get(dataItem[2]),
      declensions.importer.csv.get(dataItem[3]),
      genders.importer.csv.get(dataItem[4]),
      types$1.importer.csv.get(dataItem[5])];
    if (dataItem[6] === 'primary') {
      primary = true;
    }
    if (dataItem[7]) {
      // There can be multiple footnote indexes separated by spaces
      let indexes = dataItem[7].split(' ').map(function (index) {
        return footnotes$2.get(index)
      });
      features.push(...indexes);
    }
    let extendedGreekData = new ExtendedGreekData();
    extendedGreekData.primary = primary;
    let extendedLangData = {
      [languages.greek]: extendedGreekData
    };
    this.addSuffix(suffixValue, features, extendedLangData);
  }
};

// For verbs
dataSet$1.addVerbSuffixes = function (partOfSpeech, data) {
  // Some suffix values will mean a lack of suffix, they will be mapped to a null
  let noSuffixValue = '-';

  // First row are headers
  for (let i = 1; i < data.length; i++) {
    let suffix = data[i][0];
    // Handle special suffix values
    if (suffix === noSuffixValue) {
      suffix = null;
    }

    let features = [partOfSpeech
      /*
      conjugations.importer.csv.get(data[i][1]),
      voices.importer.csv.get(data[i][2]),
      moods.importer.csv.get(data[i][3]),
      tenses.importer.csv.get(data[i][4]),
      numbers.importer.csv.get(data[i][5]),
      persons.importer.csv.get(data[i][6]) */
    ];

    let grammarType = data[i][7];
    // Type information can be empty if no ending is provided
    if (grammarType) {
      features.push(types$1.importer.csv.get(grammarType));
    }
    // Footnotes
    if (data[i][8]) {
      // There can be multiple footnote indexes separated by spaces
      let indexes = data[i][8].split(' ').map(function (index) {
        return footnotes$2.get(index)
      });
      features.push(...indexes);
    }
    this.addSuffix(suffix, features);
  }
};

dataSet$1.addFootnotes = function (partOfSpeech, data) {
  // First row are headers
  for (let i = 1; i < data.length; i++) {
    this.addFootnote(partOfSpeech, data[i][0], data[i][1]);
  }
};

dataSet$1.loadData = function () {
  // Nouns
  let partOfSpeech = parts.noun;
  let suffixes = papaparse.parse(nounSuffixesCSV$1, {});
  this.addSuffixes(partOfSpeech, suffixes.data);
  let footnotes = papaparse.parse(nounFootnotesCSV$1, {});
  this.addFootnotes(partOfSpeech, footnotes.data);

  // Adjectives
  /* partOfSpeech = parts.adjective;
  suffixes = papaparse.parse(adjectiveSuffixesCSV, {});
  this.addSuffixes(partOfSpeech, suffixes.data);
  footnotes = papaparse.parse(adjectiveFootnotesCSV, {});
  this.addFootnotes(partOfSpeech, footnotes.data); */

  // Verbs
  /* partOfSpeech = parts.verb;
  suffixes = papaparse.parse(verbSuffixesCSV, {});
  this.addVerbSuffixes(partOfSpeech, suffixes.data);
  footnotes = papaparse.parse(verbFootnotesCSV, {});
  this.addFootnotes(partOfSpeech, footnotes.data); */
};

/**
 * Decides whether a suffix is a match to any of inflections, and if it is, what type of match it is.
 * @param {Inflection[]} inflections - An array of Inflection objects to be matched against a suffix.
 * @param {Suffix} suffix - A suffix to be matched with inflections.
 * @returns {Suffix | null} If a match is found, returns a Suffix object modified with some
 * additional information about a match. If no matches found, returns null.
 */
dataSet$1.matcher = function (inflections, suffix) {
  'use strict';
  // All of those features must match between an inflection and an ending
  let obligatoryMatches = [Feature.types.part];

  // Any of those features must match between an inflection and an ending
  let optionalMatches = [Feature.types.grmCase, Feature.types.declension, Feature.types.gender, Feature.types.number];
  let bestMatchData = null; // Information about the best match we would be able to find

  /*
   There can be only one full match between an inflection and a suffix (except when suffix has multiple values?)
   But there could be multiple partial matches. So we should try to find the best match possible and return it.
   A fullFeature match is when one of inflections has all grammatical features fully matching those of a suffix
   */
  for (let inflection of inflections) {
    let matchData = new MatchData(); // Create a match profile

    if (inflection.suffix === suffix.value) {
      matchData.suffixMatch = true;
    }

    // Check obligatory matches
    for (let feature of obligatoryMatches) {
      let featureMatch = suffix.featureMatch(feature, inflection[feature]);
      // matchFound = matchFound && featureMatch;

      if (!featureMatch) {
        // If an obligatory match is not found, there is no reason to check other items
        break
      }
      // Inflection's value of this feature is matching the one of the suffix
      matchData.matchedFeatures.push(feature);
    }

    if (matchData.matchedFeatures.length < obligatoryMatches.length) {
      // Not all obligatory matches are found, this is not a match
      break
    }

    // Check optional matches now
    for (let feature of optionalMatches) {
      let matchedValue = suffix.featureMatch(feature, inflection[feature]);
      if (matchedValue) {
        matchData.matchedFeatures.push(feature);
      }
    }

    if (matchData.suffixMatch && (matchData.matchedFeatures.length === obligatoryMatches.length + optionalMatches.length)) {
      // This is a full match
      matchData.fullMatch = true;

      // There can be only one full match, no need to search any further
      suffix.match = matchData;
      return suffix
    }
    bestMatchData = this.bestMatch(bestMatchData, matchData);
  }
  if (bestMatchData) {
    // There is some match found
    suffix.match = bestMatchData;
    return suffix
  }
  return null
};

/**
 * Decides whether matchA is 'better' (i.e. has more items matched) than matchB or not
 * @param {MatchData} matchA
 * @param {MatchData} matchB
 * @returns {MatchData} A best of two matches
 */
dataSet$1.bestMatch = function (matchA, matchB) {
  // If one of the arguments is not set, return the other one
  if (!matchA && matchB) {
    return matchB
  }

  if (!matchB && matchA) {
    return matchA
  }

  // Suffix match has a priority
  if (matchA.suffixMatch !== matchB.suffixMatch) {
    if (matchA.suffixMatch > matchB.suffixMatch) {
      return matchA
    } else {
      return matchB
    }
  }

  // If same on suffix matche, compare by how many features matched
  if (matchA.matchedFeatures.length >= matchB.matchedFeatures.length) {
    // Arbitrarily return matchA if matches are the same
    return matchA
  } else {
    return matchB
  }
};

class GreekView extends View {
  constructor () {
    super();
    this.language = languages.greek;

    /*
    Default grammatical features of a view. It child views need to have different feature values, redefine
    those values in child objects.
     */
    this.features = {
      numbers: new GroupFeatureType(numbers, 'Number'),
      cases: new GroupFeatureType(cases, 'Case'),
      declensions: new GroupFeatureType(declensions, 'Declension'),
      genders: new GroupFeatureType(genders, 'Gender'),
      types: new GroupFeatureType(types$1, 'Type')
    };
  }

  /**
   * Creates and initializes an inflection table. Redefine this method in child objects in order to create
   * an inflection table differently.
   */
  createTable () {
    this.table = new Table([this.features.declensions, this.features.genders,
      this.features.types, this.features.numbers, this.features.cases]);
    let features = this.table.features;
    features.columns = [declensions, genders, types$1];
    features.rows = [numbers, cases];
    features.columnRowTitles = [cases];
    features.fullWidthRowTitles = [numbers];
  }
}

class NounView$1 extends GreekView {
  constructor () {
    super();
    this.id = 'nounDeclension';
    this.name = 'noun declension';
    this.title = 'Noun declension';
    this.partOfSpeech = parts.noun.value;

    this.features.genders.getOrderedValues = function getOrderedValues (ancestorFeatures) {
      if (ancestorFeatures) {
        if (ancestorFeatures[0].value === declensions.second.value ||
          ancestorFeatures[0].value === declensions.third.value) {
          return [[genders.masculine.value, genders.feminine.value], genders.neuter.value]
        }
      }
      return [genders.masculine.value, genders.feminine.value, genders.neuter.value]
    };

    this.createTable();
  }
}

class NounViewSimplified extends NounView$1 {
  constructor () {
    super();
    this.id = 'nounDeclensionSimplified';
    this.name = 'noun declension simplified';
    this.title = 'Noun declension (simplified)';
    this.partOfSpeech = parts.noun.value;

    this.features.genders.getOrderedValues = function getOrderedValues (ancestorFeatures) {
      if (ancestorFeatures) {
        if (ancestorFeatures[0].value === declensions.second.value) {
          return [[genders.masculine.value, genders.feminine.value], genders.neuter.value]
        }
        if (ancestorFeatures[0].value === declensions.third.value) {
          return [[genders.masculine.value, genders.feminine.value, genders.neuter.value]]
        }
      }
      return [genders.masculine.value, genders.feminine.value, genders.neuter.value]
    };

    this.createTable();

    this.table.suffixCellFilter = NounViewSimplified.suffixCellFilter;
  }

  static suffixCellFilter (suffix) {
    return suffix.extendedLangData[languages.greek].primary
  }
}

var viewsGreek = [new NounView$1(), new NounViewSimplified()];

/**
 * This module is responsible for displaying different views of an inflection table. Each view is located in a separate
 * directory under /presenter/views/view-name
 */
class Presenter {
  constructor (viewContainer, viewSelectorContainer, localeSelectorContainer, wordData, locale = 'en-US') {
    this.viewContainer = viewContainer;
    this.viewSelectorContainer = viewSelectorContainer;
    this.localeSelectorContainer = localeSelectorContainer;
    this.wordData = wordData;

    // All views registered by the Presenter
    this.views = [];
    this.viewIndex = {};

    for (let view of viewsLatin) {
      this.addView(view);
    }
    for (let view of viewsGreek) {
      this.addView(view);
    }

    // Views available for parts of speech that are present in a Result Set
    this.availableViews = this.getViews(this.wordData);

    this.defaultView = this.availableViews[0];
    this.activeView = undefined;

    this.locale = locale; // This is a default locale
    this.l10n = new L10n(messages);

    return this
  }

  addView (view) {
    // let view =  new View.View(viewOptions);
    this.views.push(view);
    this.viewIndex[view.id] = view;
  }

  setLocale (locale) {
    this.locale = locale;
    this.activeView.render(this.viewContainer, this.wordData, this.l10n.messages(this.locale));
  }

  render () {
    // Show a default view
    if (this.defaultView) {
      this.defaultView.render(this.viewContainer, this.wordData, this.l10n.messages(this.locale));
      this.activeView = this.defaultView;

      this.appendViewSelector(this.viewSelectorContainer);
      // this.appendLocaleSelector(this.localeSelectorContainer);
    }
    return this
  }

  appendViewSelector (targetContainer) {
    targetContainer.innerHTML = '';
    if (this.availableViews.length > 1) {
      let id = 'view-selector-list';
      let viewLabel = document.createElement('label');
      viewLabel.setAttribute('for', id);
      viewLabel.innerHTML = 'View:&nbsp;';
      let viewList = document.createElement('select');
      viewList.classList.add('alpheios-ui-form-control');
      for (const view of this.availableViews) {
        let option = document.createElement('option');
        option.value = view.id;
        option.text = view.name;
        viewList.appendChild(option);
      }
      viewList.addEventListener('change', this.viewSelectorEventListener.bind(this));
      targetContainer.appendChild(viewLabel);
      targetContainer.appendChild(viewList);
    }
    return this
  }

  viewSelectorEventListener (event) {
    let viewID = event.target.value;
    let view = this.viewIndex[viewID];
    view.render(this.viewContainer, this.wordData, this.l10n.messages(this.locale));
    this.activeView = view;
  }

  appendLocaleSelector (targetContainer) {
    let id = 'locale-selector-list';
    targetContainer.innerHTML = ''; // Erase whatever was there
    let localeLabel = document.createElement('label');
    localeLabel.setAttribute('for', id);
    localeLabel.innerHTML = 'Locale:&nbsp;';
    let localeList = document.createElement('select');
    localeList.classList.add('alpheios-ui-form-control');
    localeList.id = id;
    for (let locale of this.l10n.locales) {
      let option = document.createElement('option');
      option.value = locale;
      option.text = locale;
      localeList.appendChild(option);
    }
    localeList.addEventListener('change', this.localeSelectorEventListener.bind(this));
    targetContainer.appendChild(localeLabel);
    targetContainer.appendChild(localeList);
    return this
  }

  localeSelectorEventListener () {
    let locale = window.event.target.value;
    this.setLocale(locale);
  }

  getViews (wordData) {
    // First view in a returned array will be a default one
    let views = [];
    for (let view of this.views) {
      if (wordData.language === view.language && wordData[Feature.types.part].includes(view.partOfSpeech)) {
        views.push(view);
      }
    }
    return views
  }
}


//# sourceMappingURL=inflection-tables.js.map


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__response_response_message__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stored_request__ = __webpack_require__(17);
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
        console.error(`tabs.sendMessage() failed: ${error}`)
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
        console.error(`Sending request to a background failed: ${error}`)
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Service;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class State {
  constructor (state, value = undefined) {
    this.state = state
    this.value = value
  }
  static value (state, value = undefined) {
    return new State(state, value)
  }

  static emptyValue (state) {
    return new State(state)
  }

  static getValue (state) {
    if (!(state instanceof State)) {
      // The object passed is of a different type, will return this object as a value
      return state
    }
    if (!state.hasOwnProperty('value')) { return undefined }
    return state.value
  }

  static getState (state) {
    if (!state.hasOwnProperty('state')) { return undefined }
    return state.state
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = State;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return constants; });
/* unused harmony export Definition */
/* unused harmony export Feature */
/* unused harmony export FeatureType */
/* unused harmony export FeatureList */
/* unused harmony export FeatureImporter */
/* unused harmony export Inflection */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LanguageModelFactory; });
/* unused harmony export Homonym */
/* unused harmony export Lexeme */
/* unused harmony export Lemma */
/* unused harmony export LatinLanguageModel */
/* unused harmony export GreekLanguageModel */
/* unused harmony export ArabicLanguageModel */
/* unused harmony export ResourceProvider */
/* eslint-disable no-unused-vars */
const LANG_UNIT_WORD = Symbol('word');
const LANG_UNIT_CHAR = Symbol('char');
const LANG_DIR_LTR = Symbol('ltr');
const LANG_DIR_RTL = Symbol('rtl');
const LANG_LATIN = Symbol('latin');
const LANG_GREEK = Symbol('greek');
const LANG_ARABIC = Symbol('arabic');
const LANG_PERSIAN = Symbol('persian');
const STR_LANG_CODE_LAT = 'lat';
const STR_LANG_CODE_LA = 'la';
const STR_LANG_CODE_GRC = 'grc';
const STR_LANG_CODE_ARA = 'ara';
const STR_LANG_CODE_AR = 'ar';
const STR_LANG_CODE_FAR = 'far';
const STR_LANG_CODE_PER = 'per';
// parts of speech
const POFS_ADJECTIVE = 'adjective';
const POFS_ADVERB = 'adverb';
const POFS_ADVERBIAL = 'adverbial';
const POFS_ARTICLE = 'article';
const POFS_CONJUNCTION = 'conjunction';
const POFS_EXCLAMATION = 'exclamation';
const POFS_INTERJECTION = 'interjection';
const POFS_NOUN = 'noun';
const POFS_NUMERAL = 'numeral';
const POFS_PARTICLE = 'particle';
const POFS_PREFIX = 'prefix';
const POFS_PREPOSITION = 'preposition';
const POFS_PRONOUN = 'pronoun';
const POFS_SUFFIX = 'suffix';
const POFS_SUPINE = 'supine';
const POFS_VERB = 'verb';
const POFS_VERB_PARTICIPLE = 'verb participle';
// gender
const GEND_MASCULINE = 'masculine';
const GEND_FEMININE = 'feminine';
const GEND_NEUTER = 'neuter';
const GEND_COMMON = 'common';
const GEND_ANIMATE = 'animate';
const GEND_INANIMATE = 'inanimate';
// Polish gender types
const GEND_PERSONAL_MASCULINE = 'personal masculine';
const GEND_ANIMATE_MASCULINE = 'animate masculine';
const GEND_INANIMATE_MASCULINE = 'inanimate masculine';
// comparative
const COMP_POSITIVE = 'positive';
const COMP_COMPARITIVE = 'comparative';
const COMP_SUPERLATIVE = 'superlative';
// case
const CASE_ABESSIVE = 'abessive';
const CASE_ABLATIVE = 'ablative';
const CASE_ABSOLUTIVE = 'absolutive';
const CASE_ACCUSATIVE = 'accusative';
const CASE_ADDIRECTIVE = 'addirective';
const CASE_ADELATIVE = 'adelative';
const CASE_ADESSIVE = 'adessive';
const CASE_ADVERBIAL = 'adverbial';
const CASE_ALLATIVE = 'allative';
const CASE_ANTESSIVE = 'antessive';
const CASE_APUDESSIVE = 'apudessive';
const CASE_AVERSIVE = 'aversive';
const CASE_BENEFACTIVE = 'benefactive';
const CASE_CARITIVE = 'caritive';
const CASE_CAUSAL = 'causal';
const CASE_CAUSAL_FINAL = 'causal-final';
const CASE_COMITATIVE = 'comitative';
const CASE_DATIVE = 'dative';
const CASE_DELATIVE = 'delative';
const CASE_DIRECT = 'direct';
const CASE_DISTRIBUTIVE = 'distributive';
const CASE_DISTRIBUTIVE_TEMPORAL = 'distributive-temporal';
const CASE_ELATIVE = 'elative';
const CASE_ERGATIVE = 'ergative';
const CASE_ESSIVE = 'essive';
const CASE_ESSIVE_FORMAL = 'essive-formal';
const CASE_ESSIVE_MODAL = 'essive-modal';
const CASE_EQUATIVE = 'equative';
const CASE_EVITATIVE = 'evitative';
const CASE_EXESSIVE = 'exessive';
const CASE_FINAL = 'final';
const CASE_FORMAL = 'formal';
const CASE_GENITIVE = 'genitive';
const CASE_ILLATIVE = 'illative';
const CASE_INELATIVE = 'inelative';
const CASE_INESSIVE = 'inessive';
const CASE_INSTRUCTIVE = 'instructive';
const CASE_INSTRUMENTAL = 'instrumental';
const CASE_INSTRUMENTAL_COMITATIVE = 'instrumental-comitative';
const CASE_INTRANSITIVE = 'intransitive';
const CASE_LATIVE = 'lative';
const CASE_LOCATIVE = 'locative';
const CASE_MODAL = 'modal';
const CASE_MULTIPLICATIVE = 'multiplicative';
const CASE_NOMINATIVE = 'nominative';
const CASE_PARTITIVE = 'partitive';
const CASE_PEGATIVE = 'pegative';
const CASE_PERLATIVE = 'perlative';
const CASE_POSSESSIVE = 'possessive';
const CASE_POSTELATIVE = 'postelative';
const CASE_POSTDIRECTIVE = 'postdirective';
const CASE_POSTESSIVE = 'postessive';
const CASE_POSTPOSITIONAL = 'postpositional';
const CASE_PREPOSITIONAL = 'prepositional';
const CASE_PRIVATIVE = 'privative';
const CASE_PROLATIVE = 'prolative';
const CASE_PROSECUTIVE = 'prosecutive';
const CASE_PROXIMATIVE = 'proximative';
const CASE_SEPARATIVE = 'separative';
const CASE_SOCIATIVE = 'sociative';
const CASE_SUBDIRECTIVE = 'subdirective';
const CASE_SUBESSIVE = 'subessive';
const CASE_SUBELATIVE = 'subelative';
const CASE_SUBLATIVE = 'sublative';
const CASE_SUPERDIRECTIVE = 'superdirective';
const CASE_SUPERESSIVE = 'superessive';
const CASE_SUPERLATIVE = 'superlative';
const CASE_SUPPRESSIVE = 'suppressive';
const CASE_TEMPORAL = 'temporal';
const CASE_TERMINATIVE = 'terminative';
const CASE_TRANSLATIVE = 'translative';
const CASE_VIALIS = 'vialis';
const CASE_VOCATIVE = 'vocative';
const MOOD_ADMIRATIVE = 'admirative';
const MOOD_COHORTATIVE = 'cohortative';
const MOOD_CONDITIONAL = 'conditional';
const MOOD_DECLARATIVE = 'declarative';
const MOOD_DUBITATIVE = 'dubitative';
const MOOD_ENERGETIC = 'energetic';
const MOOD_EVENTIVE = 'eventive';
const MOOD_GENERIC = 'generic';
const MOOD_GERUNDIVE = 'gerundive';
const MOOD_HYPOTHETICAL = 'hypothetical';
const MOOD_IMPERATIVE = 'imperative';
const MOOD_INDICATIVE = 'indicative';
const MOOD_INFERENTIAL = 'inferential';
const MOOD_INFINITIVE = 'infinitive';
const MOOD_INTERROGATIVE = 'interrogative';
const MOOD_JUSSIVE = 'jussive';
const MOOD_NEGATIVE = 'negative';
const MOOD_OPTATIVE = 'optative';
const MOOD_PARTICIPLE = 'participle';
const MOOD_PRESUMPTIVE = 'presumptive';
const MOOD_RENARRATIVE = 'renarrative';
const MOOD_SUBJUNCTIVE = 'subjunctive';
const MOOD_SUPINE = 'supine';
const NUM_SINGULAR = 'singular';
const NUM_PLURAL = 'plural';
const NUM_DUAL = 'dual';
const NUM_TRIAL = 'trial';
const NUM_PAUCAL = 'paucal';
const NUM_SINGULATIVE = 'singulative';
const NUM_COLLECTIVE = 'collective';
const NUM_DISTRIBUTIVE_PLURAL = 'distributive plural';
const NRL_CARDINAL = 'cardinal';
const NRL_ORDINAL = 'ordinal';
const NRL_DISTRIBUTIVE = 'distributive';
const NURL_NUMERAL_ADVERB = 'numeral adverb';
const ORD_1ST = '1st';
const ORD_2ND = '2nd';
const ORD_3RD = '3rd';
const ORD_4TH = '4th';
const ORD_5TH = '5th';
const ORD_6TH = '6th';
const ORD_7TH = '7th';
const ORD_8TH = '8th';
const ORD_9TH = '9th';
const TENSE_AORIST = 'aorist';
const TENSE_FUTURE = 'future';
const TENSE_FUTURE_PERFECT = 'future perfect';
const TENSE_IMPERFECT = 'imperfect';
const TENSE_PAST_ABSOLUTE = 'past absolute';
const TENSE_PERFECT = 'perfect';
const TENSE_PLUPERFECT = 'pluperfect';
const TENSE_PRESENT = 'present';
const VKIND_TO_BE = 'to be';
const VKIND_COMPOUNDS_OF_TO_BE = 'compounds of to be';
const VKIND_TAKING_ABLATIVE = 'taking ablative';
const VKIND_TAKING_DATIVE = 'taking dative';
const VKIND_TAKING_GENITIVE = 'taking genitive';
const VKIND_TRANSITIVE = 'transitive';
const VKIND_INTRANSITIVE = 'intransitive';
const VKIND_IMPERSONAL = 'impersonal';
const VKIND_DEPONENT = 'deponent';
const VKIND_SEMIDEPONENT = 'semideponent';
const VKIND_PERFECT_DEFINITE = 'perfect definite';
const VOICE_ACTIVE = 'active';
const VOICE_PASSIVE = 'passive';
const VOICE_MEDIOPASSIVE = 'mediopassive';
const VOICE_IMPERSONAL_PASSIVE = 'impersonal passive';
const VOICE_MIDDLE = 'middle';
const VOICE_ANTIPASSIVE = 'antipassive';
const VOICE_REFLEXIVE = 'reflexive';
const VOICE_RECIPROCAL = 'reciprocal';
const VOICE_CAUSATIVE = 'causative';
const VOICE_ADJUTATIVE = 'adjutative';
const VOICE_APPLICATIVE = 'applicative';
const VOICE_CIRCUMSTANTIAL = 'circumstantial';
const VOICE_DEPONENT = 'deponent';
const TYPE_IRREGULAR = 'irregular';
const TYPE_REGULAR = 'regular';
/* eslit-enable no-unused-vars */


var constants = Object.freeze({
	LANG_UNIT_WORD: LANG_UNIT_WORD,
	LANG_UNIT_CHAR: LANG_UNIT_CHAR,
	LANG_DIR_LTR: LANG_DIR_LTR,
	LANG_DIR_RTL: LANG_DIR_RTL,
	LANG_LATIN: LANG_LATIN,
	LANG_GREEK: LANG_GREEK,
	LANG_ARABIC: LANG_ARABIC,
	LANG_PERSIAN: LANG_PERSIAN,
	STR_LANG_CODE_LAT: STR_LANG_CODE_LAT,
	STR_LANG_CODE_LA: STR_LANG_CODE_LA,
	STR_LANG_CODE_GRC: STR_LANG_CODE_GRC,
	STR_LANG_CODE_ARA: STR_LANG_CODE_ARA,
	STR_LANG_CODE_AR: STR_LANG_CODE_AR,
	STR_LANG_CODE_FAR: STR_LANG_CODE_FAR,
	STR_LANG_CODE_PER: STR_LANG_CODE_PER,
	POFS_ADJECTIVE: POFS_ADJECTIVE,
	POFS_ADVERB: POFS_ADVERB,
	POFS_ADVERBIAL: POFS_ADVERBIAL,
	POFS_ARTICLE: POFS_ARTICLE,
	POFS_CONJUNCTION: POFS_CONJUNCTION,
	POFS_EXCLAMATION: POFS_EXCLAMATION,
	POFS_INTERJECTION: POFS_INTERJECTION,
	POFS_NOUN: POFS_NOUN,
	POFS_NUMERAL: POFS_NUMERAL,
	POFS_PARTICLE: POFS_PARTICLE,
	POFS_PREFIX: POFS_PREFIX,
	POFS_PREPOSITION: POFS_PREPOSITION,
	POFS_PRONOUN: POFS_PRONOUN,
	POFS_SUFFIX: POFS_SUFFIX,
	POFS_SUPINE: POFS_SUPINE,
	POFS_VERB: POFS_VERB,
	POFS_VERB_PARTICIPLE: POFS_VERB_PARTICIPLE,
	GEND_MASCULINE: GEND_MASCULINE,
	GEND_FEMININE: GEND_FEMININE,
	GEND_NEUTER: GEND_NEUTER,
	GEND_COMMON: GEND_COMMON,
	GEND_ANIMATE: GEND_ANIMATE,
	GEND_INANIMATE: GEND_INANIMATE,
	GEND_PERSONAL_MASCULINE: GEND_PERSONAL_MASCULINE,
	GEND_ANIMATE_MASCULINE: GEND_ANIMATE_MASCULINE,
	GEND_INANIMATE_MASCULINE: GEND_INANIMATE_MASCULINE,
	COMP_POSITIVE: COMP_POSITIVE,
	COMP_COMPARITIVE: COMP_COMPARITIVE,
	COMP_SUPERLATIVE: COMP_SUPERLATIVE,
	CASE_ABESSIVE: CASE_ABESSIVE,
	CASE_ABLATIVE: CASE_ABLATIVE,
	CASE_ABSOLUTIVE: CASE_ABSOLUTIVE,
	CASE_ACCUSATIVE: CASE_ACCUSATIVE,
	CASE_ADDIRECTIVE: CASE_ADDIRECTIVE,
	CASE_ADELATIVE: CASE_ADELATIVE,
	CASE_ADESSIVE: CASE_ADESSIVE,
	CASE_ADVERBIAL: CASE_ADVERBIAL,
	CASE_ALLATIVE: CASE_ALLATIVE,
	CASE_ANTESSIVE: CASE_ANTESSIVE,
	CASE_APUDESSIVE: CASE_APUDESSIVE,
	CASE_AVERSIVE: CASE_AVERSIVE,
	CASE_BENEFACTIVE: CASE_BENEFACTIVE,
	CASE_CARITIVE: CASE_CARITIVE,
	CASE_CAUSAL: CASE_CAUSAL,
	CASE_CAUSAL_FINAL: CASE_CAUSAL_FINAL,
	CASE_COMITATIVE: CASE_COMITATIVE,
	CASE_DATIVE: CASE_DATIVE,
	CASE_DELATIVE: CASE_DELATIVE,
	CASE_DIRECT: CASE_DIRECT,
	CASE_DISTRIBUTIVE: CASE_DISTRIBUTIVE,
	CASE_DISTRIBUTIVE_TEMPORAL: CASE_DISTRIBUTIVE_TEMPORAL,
	CASE_ELATIVE: CASE_ELATIVE,
	CASE_ERGATIVE: CASE_ERGATIVE,
	CASE_ESSIVE: CASE_ESSIVE,
	CASE_ESSIVE_FORMAL: CASE_ESSIVE_FORMAL,
	CASE_ESSIVE_MODAL: CASE_ESSIVE_MODAL,
	CASE_EQUATIVE: CASE_EQUATIVE,
	CASE_EVITATIVE: CASE_EVITATIVE,
	CASE_EXESSIVE: CASE_EXESSIVE,
	CASE_FINAL: CASE_FINAL,
	CASE_FORMAL: CASE_FORMAL,
	CASE_GENITIVE: CASE_GENITIVE,
	CASE_ILLATIVE: CASE_ILLATIVE,
	CASE_INELATIVE: CASE_INELATIVE,
	CASE_INESSIVE: CASE_INESSIVE,
	CASE_INSTRUCTIVE: CASE_INSTRUCTIVE,
	CASE_INSTRUMENTAL: CASE_INSTRUMENTAL,
	CASE_INSTRUMENTAL_COMITATIVE: CASE_INSTRUMENTAL_COMITATIVE,
	CASE_INTRANSITIVE: CASE_INTRANSITIVE,
	CASE_LATIVE: CASE_LATIVE,
	CASE_LOCATIVE: CASE_LOCATIVE,
	CASE_MODAL: CASE_MODAL,
	CASE_MULTIPLICATIVE: CASE_MULTIPLICATIVE,
	CASE_NOMINATIVE: CASE_NOMINATIVE,
	CASE_PARTITIVE: CASE_PARTITIVE,
	CASE_PEGATIVE: CASE_PEGATIVE,
	CASE_PERLATIVE: CASE_PERLATIVE,
	CASE_POSSESSIVE: CASE_POSSESSIVE,
	CASE_POSTELATIVE: CASE_POSTELATIVE,
	CASE_POSTDIRECTIVE: CASE_POSTDIRECTIVE,
	CASE_POSTESSIVE: CASE_POSTESSIVE,
	CASE_POSTPOSITIONAL: CASE_POSTPOSITIONAL,
	CASE_PREPOSITIONAL: CASE_PREPOSITIONAL,
	CASE_PRIVATIVE: CASE_PRIVATIVE,
	CASE_PROLATIVE: CASE_PROLATIVE,
	CASE_PROSECUTIVE: CASE_PROSECUTIVE,
	CASE_PROXIMATIVE: CASE_PROXIMATIVE,
	CASE_SEPARATIVE: CASE_SEPARATIVE,
	CASE_SOCIATIVE: CASE_SOCIATIVE,
	CASE_SUBDIRECTIVE: CASE_SUBDIRECTIVE,
	CASE_SUBESSIVE: CASE_SUBESSIVE,
	CASE_SUBELATIVE: CASE_SUBELATIVE,
	CASE_SUBLATIVE: CASE_SUBLATIVE,
	CASE_SUPERDIRECTIVE: CASE_SUPERDIRECTIVE,
	CASE_SUPERESSIVE: CASE_SUPERESSIVE,
	CASE_SUPERLATIVE: CASE_SUPERLATIVE,
	CASE_SUPPRESSIVE: CASE_SUPPRESSIVE,
	CASE_TEMPORAL: CASE_TEMPORAL,
	CASE_TERMINATIVE: CASE_TERMINATIVE,
	CASE_TRANSLATIVE: CASE_TRANSLATIVE,
	CASE_VIALIS: CASE_VIALIS,
	CASE_VOCATIVE: CASE_VOCATIVE,
	MOOD_ADMIRATIVE: MOOD_ADMIRATIVE,
	MOOD_COHORTATIVE: MOOD_COHORTATIVE,
	MOOD_CONDITIONAL: MOOD_CONDITIONAL,
	MOOD_DECLARATIVE: MOOD_DECLARATIVE,
	MOOD_DUBITATIVE: MOOD_DUBITATIVE,
	MOOD_ENERGETIC: MOOD_ENERGETIC,
	MOOD_EVENTIVE: MOOD_EVENTIVE,
	MOOD_GENERIC: MOOD_GENERIC,
	MOOD_GERUNDIVE: MOOD_GERUNDIVE,
	MOOD_HYPOTHETICAL: MOOD_HYPOTHETICAL,
	MOOD_IMPERATIVE: MOOD_IMPERATIVE,
	MOOD_INDICATIVE: MOOD_INDICATIVE,
	MOOD_INFERENTIAL: MOOD_INFERENTIAL,
	MOOD_INFINITIVE: MOOD_INFINITIVE,
	MOOD_INTERROGATIVE: MOOD_INTERROGATIVE,
	MOOD_JUSSIVE: MOOD_JUSSIVE,
	MOOD_NEGATIVE: MOOD_NEGATIVE,
	MOOD_OPTATIVE: MOOD_OPTATIVE,
	MOOD_PARTICIPLE: MOOD_PARTICIPLE,
	MOOD_PRESUMPTIVE: MOOD_PRESUMPTIVE,
	MOOD_RENARRATIVE: MOOD_RENARRATIVE,
	MOOD_SUBJUNCTIVE: MOOD_SUBJUNCTIVE,
	MOOD_SUPINE: MOOD_SUPINE,
	NUM_SINGULAR: NUM_SINGULAR,
	NUM_PLURAL: NUM_PLURAL,
	NUM_DUAL: NUM_DUAL,
	NUM_TRIAL: NUM_TRIAL,
	NUM_PAUCAL: NUM_PAUCAL,
	NUM_SINGULATIVE: NUM_SINGULATIVE,
	NUM_COLLECTIVE: NUM_COLLECTIVE,
	NUM_DISTRIBUTIVE_PLURAL: NUM_DISTRIBUTIVE_PLURAL,
	NRL_CARDINAL: NRL_CARDINAL,
	NRL_ORDINAL: NRL_ORDINAL,
	NRL_DISTRIBUTIVE: NRL_DISTRIBUTIVE,
	NURL_NUMERAL_ADVERB: NURL_NUMERAL_ADVERB,
	ORD_1ST: ORD_1ST,
	ORD_2ND: ORD_2ND,
	ORD_3RD: ORD_3RD,
	ORD_4TH: ORD_4TH,
	ORD_5TH: ORD_5TH,
	ORD_6TH: ORD_6TH,
	ORD_7TH: ORD_7TH,
	ORD_8TH: ORD_8TH,
	ORD_9TH: ORD_9TH,
	TENSE_AORIST: TENSE_AORIST,
	TENSE_FUTURE: TENSE_FUTURE,
	TENSE_FUTURE_PERFECT: TENSE_FUTURE_PERFECT,
	TENSE_IMPERFECT: TENSE_IMPERFECT,
	TENSE_PAST_ABSOLUTE: TENSE_PAST_ABSOLUTE,
	TENSE_PERFECT: TENSE_PERFECT,
	TENSE_PLUPERFECT: TENSE_PLUPERFECT,
	TENSE_PRESENT: TENSE_PRESENT,
	VKIND_TO_BE: VKIND_TO_BE,
	VKIND_COMPOUNDS_OF_TO_BE: VKIND_COMPOUNDS_OF_TO_BE,
	VKIND_TAKING_ABLATIVE: VKIND_TAKING_ABLATIVE,
	VKIND_TAKING_DATIVE: VKIND_TAKING_DATIVE,
	VKIND_TAKING_GENITIVE: VKIND_TAKING_GENITIVE,
	VKIND_TRANSITIVE: VKIND_TRANSITIVE,
	VKIND_INTRANSITIVE: VKIND_INTRANSITIVE,
	VKIND_IMPERSONAL: VKIND_IMPERSONAL,
	VKIND_DEPONENT: VKIND_DEPONENT,
	VKIND_SEMIDEPONENT: VKIND_SEMIDEPONENT,
	VKIND_PERFECT_DEFINITE: VKIND_PERFECT_DEFINITE,
	VOICE_ACTIVE: VOICE_ACTIVE,
	VOICE_PASSIVE: VOICE_PASSIVE,
	VOICE_MEDIOPASSIVE: VOICE_MEDIOPASSIVE,
	VOICE_IMPERSONAL_PASSIVE: VOICE_IMPERSONAL_PASSIVE,
	VOICE_MIDDLE: VOICE_MIDDLE,
	VOICE_ANTIPASSIVE: VOICE_ANTIPASSIVE,
	VOICE_REFLEXIVE: VOICE_REFLEXIVE,
	VOICE_RECIPROCAL: VOICE_RECIPROCAL,
	VOICE_CAUSATIVE: VOICE_CAUSATIVE,
	VOICE_ADJUTATIVE: VOICE_ADJUTATIVE,
	VOICE_APPLICATIVE: VOICE_APPLICATIVE,
	VOICE_CIRCUMSTANTIAL: VOICE_CIRCUMSTANTIAL,
	VOICE_DEPONENT: VOICE_DEPONENT,
	TYPE_IRREGULAR: TYPE_IRREGULAR,
	TYPE_REGULAR: TYPE_REGULAR
});

class Definition {
  constructor (text, language, format) {
    this.text = text;
    this.language = language;
    this.format = format;
  }
}

/**
 * Wrapper class for a (grammatical, usually) feature, such as part of speech or declension. Keeps both value and type information.
 */
class Feature {
    /**
     * Initializes a Feature object
     * @param {string | string[]} value - A single feature value or, if this feature could have multiple
     * values, an array of values.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (value, type, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!value) {
      throw new Error('Feature should have a non-empty value.')
    }
    if (!type) {
      throw new Error('Feature should have a non-empty type.')
    }
    if (!language) {
      throw new Error('Feature constructor requires a language')
    }
    this.value = value;
    this.type = type;
    this.language = language;
  };

  isEqual (feature) {
    if (Array.isArray(feature.value)) {
      if (!Array.isArray(this.value) || this.value.length !== feature.value.length) {
        return false
      }
      let equal = this.type === feature.type && this.language === feature.language;
      equal = equal && this.value.every(function (element, index) {
        return element === feature.value[index]
      });
      return equal
    } else {
      return this.value === feature.value && this.type === feature.type && this.language === feature.language
    }
  }
}
// Should have no spaces in values in order to be used in HTML templates
Feature.types = {
  word: 'word',
  part: 'part of speech', // Part of speech
  number: 'number',
  grmCase: 'case',
  declension: 'declension',
  gender: 'gender',
  type: 'type',
  conjugation: 'conjugation',
  comparison: 'comparison',
  tense: 'tense',
  voice: 'voice',
  mood: 'mood',
  person: 'person',
  frequency: 'frequency', // How frequent this word is
  meaning: 'meaning', // Meaning of a word
  source: 'source', // Source of word definition
  footnote: 'footnote', // A footnote for a word's ending
  dialect: 'dialect', // a dialect iderntifier
  note: 'note', // a general note
  pronunciation: 'pronunciation',
  area: 'area',
  geo: 'geo', // geographical data
  kind: 'kind', // verb kind informatin
  derivtype: 'derivtype',
  stemtype: 'stemtype',
  morph: 'morph', // general morphological information
  var: 'var', // variance?
  isAllowed (value) {
    let v = `${value}`;
    return Object.values(this).includes(v)
  }
};

class FeatureImporter {
  constructor (defaults = []) {
    this.hash = {};
    for (let value of defaults) {
      this.map(value, value);
    }
    return this
  }

    /**
     * Sets mapping between external imported value and one or more library standard values. If an importedValue
     * is already in a hash table, old libraryValue will be overwritten with the new one.
     * @param {string} importedValue - External value
     * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
     */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue;
    return this
  }

    /**
     * Checks if value is in a map.
     * @param {string} importedValue - A value to test.
     * @returns {boolean} - Tru if value is in a map, false otherwise.
     */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

    /**
     * Returns one or more library standard values that match an external value
     * @param {string} importedValue - External value
     * @returns {Object | string} One or more of library standard values
     */
  get (importedValue) {
    if (this.has(importedValue)) {
      return this.hash[importedValue]
    } else {
      throw new Error('A value "' + importedValue + '" is not found in the importer.')
    }
  }
}

/**
 * Definition class for a (grammatical) feature. Stores type information and (optionally) all possible values of the feature.
 * It serves as a feature generator. If list of possible values is provided, it can generate a Feature object
 * each time a property that corresponds to a feature value is accessed. If no list of possible values provided,
 * a Feature object can be generated with get(value) method.
 *
 * An order of values determines a default sort and grouping order. If two values should have the same order,
 * they should be grouped within an array: value1, [value2, value3], value4. Here 'value2' and 'value3' have
 * the same priority for sorting and grouping.
 */
class FeatureType {
    // TODO: value checking
    /**
     * Creates and initializes a Feature Type object.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string[] | string[][]} values - A list of allowed values for this feature type.
     * If an empty array is provided, there will be no
     * allowed values as well as no ordering (can be used for items that do not need or have a simple order,
     * such as footnotes).
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (type, values, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!values || !Array.isArray(values)) {
      throw new Error('Values should be an array (or an empty array) of values.')
    }
    if (!language) {
      throw new Error('FeatureType constructor requires a language')
    }

    this.type = type;
    this.language = language;

        /*
         This is a sort order index for a grammatical feature values. It is determined by the order of values in
         a 'values' array.
         */
    this._orderIndex = [];
    this._orderLookup = {};

    for (const [index, value] of values.entries()) {
      this._orderIndex.push(value);
      if (Array.isArray(value)) {
        for (let element of value) {
          this[element] = new Feature(element, this.type, this.language);
          this._orderLookup[element] = index;
        }
      } else {
        this[value] = new Feature(value, this.type, this.language);
        this._orderLookup[value] = index;
      }
    }
  };

    /**
     * Return a Feature with an arbitrary value. This value would not be necessarily present among FeatureType values.
     * This can be especially useful for features that do not set: a list of predefined values, such as footnotes.
     * @param value
     * @returns {Feature}
     */
  get (value) {
    if (value) {
      return new Feature(value, this.type, this.language)
    } else {
      throw new Error('A non-empty value should be provided.')
    }
  }

  getFromImporter (importerName, value) {
    let mapped;
    try {
      mapped = this.importer[importerName].get(value);
    } catch (e) {
      // quietly catch not found and replace with default
      mapped = this.get(value);
    }
    return mapped
  }

    /**
     * Creates and returns a new importer with a specific name. If an importer with this name already exists,
     * an existing Importer object will be returned.
     * @param {string} name - A name of an importer object
     * @returns {Importer} A new or existing Importer object that matches a name provided
     */
  addImporter (name) {
    if (!name) {
      throw new Error('Importer should have a non-empty name.')
    }
    this.importer = this.importer || {};
    this.importer[name] = this.importer[name] || new FeatureImporter();
    return this.importer[name]
  }

    /**
     * Return copies of all feature values as Feature objects in a sorted array, according to feature type's sort order.
     * For a similar function that returns strings instead of Feature objects see orderedValues().
     * @returns {Feature[] | Feature[][]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of Feature objects will be returned instead of a single Feature object, as for single feature values.
     */
  get orderedFeatures () {
    return this.orderedValues.map((value) => new Feature(value, this.type, this.language))
  }

    /**
     * Return all feature values as strings in a sorted array, according to feature type's sort order.
     * This is a main method that specifies a sort order of the feature type. orderedFeatures() relies
     * on this method in providing a sorted array of feature values. If you want to create
     * a custom sort order for a particular feature type that will depend on some options that are not type-related,
     * create a wrapper around this function providing it with options arguments so it will be able to decide
     * in what order those features will be based on those arguments.
     * For a similar function that returns Feature objects instead of strings see orderedValues().
     * @returns {string[]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of strings will be returned instead of a single strings, as for single feature values.
     */
  get orderedValues () {
    return this._orderIndex
  }

    /**
     * Returns a lookup table for type values as:
     *  {value1: order1, value2: order2}, where order is a sort order of an item. If two items have the same sort order,
     *  their order value will be the same.
     * @returns {object}
     */
  get orderLookup () {
    return this._orderLookup
  }

    /**
     * Sets an order of grammatical feature values for a grammatical feature. Used mostly for sorting, filtering,
     * and displaying.
     *
     * @param {Feature[] | Feature[][]} values - a list of grammatical features that specify their order for
     * sorting and filtering. Some features can be grouped as [[genders.masculine, genders.feminine], LibLatin.genders.neuter].
     * It means that genders.masculine and genders.feminine belong to the same group. They will have the same index
     * and will be stored inside an _orderIndex as an array. genders.masculine and genders.feminine will be grouped together
     * during filtering and will be in the same bin during sorting.
     *
     */
  set order (values) {
    if (!values || (Array.isArray(values) && values.length === 0)) {
      throw new Error('A non-empty list of values should be provided.')
    }

        // If a single value is provided, convert it into an array
    if (!Array.isArray(values)) {
      values = [values];
    }

    for (let value of values) {
      if (Array.isArray(value)) {
        for (let element of value) {
          if (!this.hasOwnProperty(element.value)) {
            throw new Error('Trying to order an element with "' + element.value + '" value that is not stored in a "' + this.type + '" type.')
          }

          if (element.type !== this.type) {
            throw new Error('Trying to order an element with type "' + element.type + '" that is different from "' + this.type + '".')
          }

          if (element.language !== this.language) {
            throw new Error('Trying to order an element with language "' + element.language + '" that is different from "' + this.language + '".')
          }
        }
      } else {
        if (!this.hasOwnProperty(value.value)) {
          throw new Error('Trying to order an element with "' + value.value + '" value that is not stored in a "' + this.type + '" type.')
        }

        if (value.type !== this.type) {
          throw new Error('Trying to order an element with type "' + value.type + '" that is different from "' + this.type + '".')
        }

        if (value.language !== this.language) {
          throw new Error('Trying to order an element with language "' + value.language + '" that is different from "' + this.language + '".')
        }
      }
    }

        // Erase whatever sort order was set previously
    this._orderLookup = {};
    this._orderIndex = [];

        // Define a new sort order
    for (const [index, element] of values.entries()) {
      if (Array.isArray(element)) {
                // If it is an array, all values should have the same order
        let elements = [];
        for (const subElement of element) {
          this._orderLookup[subElement.value] = index;
          elements.push(subElement.value);
        }
        this._orderIndex[index] = elements;
      } else {
                // If is a single value
        this._orderLookup[element.value] = index;
        this._orderIndex[index] = element.value;
      }
    }
  }
}

/**
 * A list of grammatical features that characterizes a language unit. Has some additional service methods,
 * compared with standard storage objects.
 */
class FeatureList {
    /**
     * Initializes a feature list.
     * @param {FeatureType[]} features - Features that build the list (optional, can be set later).
     */
  constructor (features = []) {
    this._features = [];
    this._types = {};
    this.add(features);
  }

  add (features) {
    if (!features || !Array.isArray(features)) {
      throw new Error('Features must be defined and must come in an array.')
    }

    for (let feature of features) {
      this._features.push(feature);
      this._types[feature.type] = feature;
    }
  }

    /**
     * Returns an array of grouping features.
     * @returns {FeatureType[]} - An array of grouping features.
     */
  get items () {
    return this._features
  }

  forEach (callback) {
    this._features.forEach(callback);
  }

    /**
     * Returns a feature of a particular type. If such feature does not exist in a list, returns undefined.
     * @param {string} type - Feature type as defined in `types` object.
     * @return {FeatureType | undefined} A feature if a particular type if contains it. Undefined otherwise.
     */
  ofType (type) {
    if (this.hasType(type)) {
      return this._types[type]
    }
  }

    /**
     * Checks whether a feature list has a feature of a specific type.
     * @param {string} type - Feature type as defined in `types` object.
     * @return {boolean} Whether a feature list has a feature of a particular type.
     */
  hasType (type) {
    return this._types.hasOwnProperty(type)
  }
}

/**
 * @class  LanguageModel is the base class for language-specific behavior
 */
class LanguageModel {
   /**
   */
  constructor () {
    this.sourceLanguage = null;
    this.contextForward = 0;
    this.context_backward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [];
  }

  _initializeFeatures () {
    let features = {};
    let code = this.toCode();
    features[Feature.types.part] = new FeatureType(Feature.types.part,
      [ POFS_ADVERB,
        POFS_ADVERBIAL,
        POFS_ADJECTIVE,
        POFS_ARTICLE,
        POFS_CONJUNCTION,
        POFS_EXCLAMATION,
        POFS_INTERJECTION,
        POFS_NOUN,
        POFS_NUMERAL,
        POFS_PARTICLE,
        POFS_PREFIX,
        POFS_PREPOSITION,
        POFS_PRONOUN,
        POFS_SUFFIX,
        POFS_SUPINE,
        POFS_VERB,
        POFS_VERB_PARTICIPLE ], code);
    features[Feature.types.gender] = new FeatureType(Feature.types.gender,
      [ GEND_MASCULINE, GEND_FEMININE, GEND_NEUTER ], code);
    features[Feature.types.type] = new FeatureType(Feature.types.type,
      [TYPE_REGULAR, TYPE_IRREGULAR], code);
    features[Feature.types.person] = new FeatureType(Feature.types.person,
      [ORD_1ST, ORD_2ND, ORD_3RD], code);
    return features
  }

  /**
   * Handler which can be used as the contextHander.
   * It uses language-specific configuration to identify
   * the elements from the alph-text popup which should produce links
   * to the language-specific grammar.
   * @see #contextHandler
   */
  grammarContext (doc) {
      // used to bind a click handler on the .alph-entry items in the
      // popup which retrieved the context attribute from the clicked
      // term and used that to construct a link and open the grammar
      // at the apporopriate place.
      // var links = this.getGrammarLinks();

      // for (var link_name in links)
      // {
      //   if (links.hasOwnProperty(link_name))
      //    {
              // Alph.$(".alph-entry ." + link_name,a_doc).bind('click',link_name,
              //   function(a_e)
              //    {
                        // build target inside grammar
                        // var target = a_e.data;
                        // var rngContext = Alph.$(this).attr("context");
                        // if (rngContext != null)
                        // {
                        //  target += "-" + rngContext.split(/-/)[0];
                        // }
                        // myobj.openGrammar(a_e.originaEvent,this,target);
               //   }
              // );
       //   }
      // }
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Check to see if the supplied language code is supported by this tool
   * @param {string} code the language code
   * @returns true if supported false if not
   * @type Boolean
   */
  static supportsLanguage (code) {
    return this.codes.includes[code]
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {string} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toString () {
    return String(this.sourceLanguage)
  }

  isEqual (model) {
    return this.sourceLanguage === model.sourceLanguage
  }

  toCode () {
    return null
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class LatinLanguageModel extends LanguageModel {
   /**
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_LATIN;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [STR_LANG_CODE_LA, STR_LANG_CODE_LAT];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_ABLATIVE,
        CASE_LOCATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD, ORD_4TH, ORD_5TH ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, [VOICE_PASSIVE, VOICE_ACTIVE], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, [MOOD_INDICATIVE, MOOD_SUBJUNCTIVE], code);
    features[Feature.types.conjugation] = new FeatureType(Feature.types.conjugation,
      [ ORD_1ST,
        ORD_2ND,
        ORD_3RD,
        ORD_4TH
      ], code);
    return features
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toCode () {
    return STR_LANG_CODE_LAT
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_GREEK;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_GRC];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL, NUM_DUAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT,
        TENSE_AORIST
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice,
      [ VOICE_PASSIVE,
        VOICE_ACTIVE,
        VOICE_MEDIOPASSIVE,
        VOICE_MIDDLE
      ], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood,
      [ MOOD_INDICATIVE,
        MOOD_SUBJUNCTIVE,
        MOOD_OPTATIVE,
        MOOD_IMPERATIVE
      ], code);
    // TODO full list of greek dialects
    features[Feature.types.dialect] = new FeatureType(Feature.types.dialect, ['attic', 'epic', 'doric'], code);
    return features
  }

  toCode () {
    return STR_LANG_CODE_GRC
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class ArabicLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_ARABIC;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_RTL;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_ARA, STR_LANG_CODE_AR];
    this._initializeFeatures();
  }

  _initializeFeatures () {
    this.features = super._initializeFeatures();
  }

  toCode () {
    return STR_LANG_CODE_ARA
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    // TODO
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

const MODELS = new Map([
  [ STR_LANG_CODE_LA, LatinLanguageModel ],
  [ STR_LANG_CODE_LAT, LatinLanguageModel ],
  [ STR_LANG_CODE_GRC, GreekLanguageModel ],
  [ STR_LANG_CODE_ARA, ArabicLanguageModel ],
  [ STR_LANG_CODE_AR, ArabicLanguageModel ]
]);

class LanguageModelFactory {
  static supportsLanguage (code) {
    return MODELS.has(code)
  }

  static getLanguageForCode (code = null) {
    let Model = MODELS.get(code);
    if (Model) {
      return new Model()
    }
    // for now return a default Model
    // TODO may want to throw an error
    return new LanguageModel()
  }
}

/**
 * Lemma, a canonical form of a word.
 */
class Lemma {
    /**
     * Initializes a Lemma object.
     * @param {string} word - A word.
     * @param {string} language - A language of a word.
     * @param {Array[string]} principalParts - the principalParts of a lemma
     */
  constructor (word, language, principalParts = []) {
    if (!word) {
      throw new Error('Word should not be empty.')
    }

    if (!language) {
      throw new Error('Language should not be empty.')
    }

        // if (!languages.isAllowed(language)) {
        //    throw new Error('Language "' + language + '" is not supported.');
        // }

    this.word = word;
    this.language = language;
    this.principalParts = principalParts;
  }

  static readObject (jsonObject) {
    return new Lemma(jsonObject.word, jsonObject.language)
  }
}

/*
 Hierarchical structure of return value of a morphological analyzer:

 Homonym (a group of words that are written the same way, https://en.wikipedia.org/wiki/Homonym)
    Lexeme 1 (a unit of lexical meaning, https://en.wikipedia.org/wiki/Lexeme)
        Have a lemma and one or more inflections
        Lemma (also called a headword, a canonical form of a group of words https://en.wikipedia.org/wiki/Lemma_(morphology) )
        Inflection 1
            Stem
            Suffix (also called ending)
        Inflection 2
            Stem
            Suffix
    Lexeme 2
        Lemma
        Inflection 1
            Stem
            Suffix
 */

/**
 * Represents an inflection of a word
 */
class Inflection {
    /**
     * Initializes an Inflection object.
     * @param {string} stem - A stem of a word.
     * @param {string} language - A word's language.
     */
  constructor (stem, language) {
    if (!stem) {
      throw new Error('Stem should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    if (!LanguageModelFactory.supportsLanguage(language)) {
      throw new Error(`language ${language} not supported.`)
    }

    this.stem = stem;
    this.language = language;

    // Suffix may not be present in every word. If missing, it will set to null.
    this.suffix = null;

    // Prefix may not be present in every word. If missing, it will set to null.
    this.prefix = null;

    // Example may not be provided
    this.example = null;
  }

  static readObject (jsonObject) {
    let inflection = new Inflection(jsonObject.stem, jsonObject.language);
    if (jsonObject.suffix) {
      inflection.suffix = jsonObject.suffix;
    }
    if (jsonObject.prefix) {
      inflection.prefix = jsonObject.prefix;
    }
    if (jsonObject.example) {
      inflection.example = jsonObject.example;
    }
    return inflection
  }

    /**
     * Sets a grammatical feature in an inflection. Some features can have multiple values, In this case
     * an array of Feature objects will be provided.
     * Values are taken from features and stored in a 'feature.type' property as an array of values.
     * @param {Feature | Feature[]} data
     */
  set feature (data) {
    if (!data) {
      throw new Error('Inflection feature data cannot be empty.')
    }
    if (!Array.isArray(data)) {
      data = [data];
    }

    let type = data[0].type;
    this[type] = [];
    for (let element of data) {
      if (!(element instanceof Feature)) {
        throw new Error('Inflection feature data must be a Feature object.')
      }

      if (element.language !== this.language) {
        throw new Error('Language "' + element.language + '" of a feature does not match a language "' +
                this.language + '" of an Inflection object.')
      }

      this[type].push(element.value);
    }
  }
}

/**
 * A basic unit of lexical meaning. Contains a primary Lemma object, one or more Inflection objects
 * and optional alternate Lemmas
 */
class Lexeme {
    /**
     * Initializes a Lexeme object.
     * @param {Lemma} lemma - A lemma object.
     * @param {Inflection[]} inflections - An array of inflections.
     * @param {Definition} meaning - a short definition
     */
  constructor (lemma, inflections, meaning = null) {
    if (!lemma) {
      throw new Error('Lemma should not be empty.')
    }

    if (!(lemma instanceof Lemma)) {
      throw new Error('Lemma should be of Lemma object type.')
    }

    if (!inflections) {
      throw new Error('Inflections data should not be empty.')
    }

    if (!Array.isArray(inflections)) {
      throw new Error('Inflection data should be provided in an array.')
    }

    for (let inflection of inflections) {
      if (!(inflection instanceof Inflection)) {
        throw new Error('All inflection data should be of Inflection object type.')
      }
    }

    this.lemma = lemma;
    this.inflections = inflections;
    this.meaning = meaning;
  }

  static readObject (jsonObject) {
    let lemma = Lemma.readObject(jsonObject.lemma);
    let inflections = [];
    for (let inflection of jsonObject.inflections) {
      inflections.push(Inflection.readObject(inflection));
    }
    return new Lexeme(lemma, inflections)
  }
}

class Homonym {
    /**
     * Initializes a Homonym object.
     * @param {Lexeme[]} lexemes - An array of Lexeme objects.
     * @param {string} form - the form which produces the homonyms
     */
  constructor (lexemes, form) {
    if (!lexemes) {
      throw new Error('Lexemes data should not be empty.')
    }

    if (!Array.isArray(lexemes)) {
      throw new Error('Lexeme data should be provided in an array.')
    }

    for (let lexeme of lexemes) {
      if (!(lexeme instanceof Lexeme)) {
        throw new Error('All lexeme data should be of Lexeme object type.')
      }
    }

    this.lexemes = lexemes;
    this.targetWord = form;
  }

  static readObject (jsonObject) {
    let lexemes = [];
    if (jsonObject.lexemes) {
      for (let lexeme of jsonObject.lexemes) {
        lexemes.push(Lexeme.readObject(lexeme));
      }
    }
    let homonym = new Homonym(lexemes);
    if (jsonObject.targetWord) {
      homonym.targetWord = jsonObject.targetWord;
    }
    return homonym
  }

    /**
     * Returns language of a homonym.
     * Homonym does not have a language property, only lemmas and inflections do. We assume that all lemmas
     * and inflections within the same homonym will have the same language, and we can determine a language
     * by using language property of the first lemma. We chan change this logic in the future if we'll need to.
     * @returns {string} A language code, as defined in the `languages` object.
     */
  get language () {
    if (this.lexemes && this.lexemes[0] && this.lexemes[0].lemma && this.lexemes[0].lemma.language) {
      return this.lexemes[0].lemma.language
    } else {
      throw new Error('Homonym has not been initialized properly. Unable to obtain language information.')
    }
  }
}

/**
 * An abstraction of an Alpheios resource provider
 */
class ResourceProvider {
  /**
   * @constructor
   * @param {string} uri - a unique resource identifier for this provider
   * @param {string} rights - rights text
   * @param {Map} rightsTranslations - optional map of translated rights text - keys should be language of text, values the text
   */
  constructor (uri = '', rights = '', rightsTranslations = new Map([['default', rights]])) {
    this.uri = uri;
    this.rights = rightsTranslations;
    if (!this.rights.has('default')) {
      this.rights.set('default', rights);
    }
  }

  /**
   * @return a string representation of the resource provider, in the default language
   */
  toString () {
    return this.rights.get('default')
  }

  /**
   * Produce a string representation of the resource provider, in the requested locale if available
   * @param {string} languageCode
   * @return a string representation of the resource provider, in the requested locale if available
   */
  toLocaleString (languageCode) {
    return this.rights.get(languageCode) || this.rights.get('default')
  }

  static getProxy (provider = null, target = {}) {
    return new Proxy(target, {
      get: function (target, name) {
        return name === 'provider' ? provider : target[name]
      }
    })
  }
}


//# sourceMappingURL=alpheios-data-models.js.map


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__w3c_text_quote_selector__ = __webpack_require__(32);


/**
 * This is a general-purpose, media abstract selector that
 * @property {string} selectedText - Selected text (usually a single word)
 * @property {string] normalizedSelectedText - Selected text after normalization
 * @property {string} languageCode - A language code of a selection
 */
class TextSelector {
  constructor () {
    this.selectedText = ''
    this.normalizedSelectedText = ''
    this.languageCode = ''

    this.start = 0
    this.end = 0
    this.context = null
    this.position = 0
  }

  static readObject (jsonObject) {
    let textSelector = new TextSelector()
    textSelector.selectedText = jsonObject.selectedText
    textSelector.normalizedSelectedText = jsonObject.normalizedSelectedText
    textSelector.languageCode = jsonObject.languageCode
    return textSelector
  }

  get textQuoteSelector () {
    return new __WEBPACK_IMPORTED_MODULE_0__w3c_text_quote_selector__["a" /* default */]()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextSelector;



/***/ }),
/* 9 */
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
    this.startTime = new Date().getTime();
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

  complete () {
    this.endTime = new Date().getTime();
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
        // If it's an error, there will be no state and value objects. Should fix that.
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
    let resultObject = await target[property].apply(monitor, args);
    // resultObject.value is a returned message, experience object is in a `experience` property
    experience = Experience.readObject(resultObject.value.experience);
    experience.complete();
    console.log(`${property}() completed with success, experience is:`, experience);

    storage.write(experience);
    return resultObject
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
    args.push(Experience.readObject(args[0].experience));
    let result = await target[property].apply(monitor, args);
    console.log(`${property}() completed with success`);
    return result
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
exports.Transporter = Transporter;
exports.StorageAdapter = LocalStorageAdapter;
exports.TestAdapter = TestAdapter;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_browser__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__background_process__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_alpheios_experience___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_alpheios_experience__);




// Detect browser features
var browserFeatures = new __WEBPACK_IMPORTED_MODULE_0__lib_browser__["a" /* default */]().inspect().getFeatures();
console.log('Support of a "browser" namespace: ' + browserFeatures.browserNamespace);
if (!browserFeatures.browserNamespace) {
  console.log('"browser" namespace is not supported, will load a WebExtensions polyfill into the background script');
  window.browser = __webpack_require__(41);
}

var monitoredBackgroundProcess = __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].track(new __WEBPACK_IMPORTED_MODULE_1__background_process__["a" /* default */](browserFeatures), [{
  monitoredFunction: 'getHomonymStatefully',
  experience: 'Get homonym from a morphological analyzer',
  asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].recordExperienceDetails
}, {
  monitoredFunction: 'handleWordDataRequestStatefully',
  asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].detachFromMessage
}, {
  monitoredFunction: 'sendResponseToTabStatefully',
  asyncWrapper: __WEBPACK_IMPORTED_MODULE_2_alpheios_experience__["Monitor"].attachToMessage
}]);
monitoredBackgroundProcess.initialize();

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_alpheios_tufts_adapter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_messaging_service__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_messaging_request_activation_request__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_messaging_request_deactivation_request__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_messaging_response_word_data_response__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__content_content_process__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__content_tab__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__lib_state__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__lib_selection_text_selector__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__test_stubs_definitions_test__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_alpheios_experience__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_alpheios_experience___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_alpheios_experience__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global browser */














var BackgroundProcess = function () {
  function BackgroundProcess(browserFeatures) {
    _classCallCheck(this, BackgroundProcess);

    this.browserFeatures = browserFeatures;
    this.settings = BackgroundProcess.defaults;

    var adapterArgs = {
      engine: { lat: 'whitakerLat' },
      url: 'http://morph.alpheios.net/api/v1/analysis/word?word=r_WORD&engine=r_ENGINE&lang=r_LANG'
    };
    this.maAdapter = new __WEBPACK_IMPORTED_MODULE_1_alpheios_tufts_adapter__["a" /* default */](adapterArgs); // Morphological analyzer adapter
    this.maAdapter.fetch = this.maAdapter.fetchTestData; // Switch adapter to a test mode

    this.tabs = new Map(); // A list of tabs that have content script loaded

    this.messagingService = new __WEBPACK_IMPORTED_MODULE_3__lib_messaging_service__["a" /* default */]();
  }

  _createClass(BackgroundProcess, [{
    key: 'initialize',
    value: function initialize() {
      console.log('initialize');

      this.langData = new __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__["b" /* LanguageData */]([__WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__["c" /* LatinDataSet */], __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__["a" /* GreekDataSet */]]).loadData();

      this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__["a" /* default */].types.WORD_DATA_REQUEST, this.handleWordDataRequestStatefully, this);
      browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService));

      BackgroundProcess.createMenuItem();

      browser.contextMenus.onClicked.addListener(this.menuListener.bind(this));
      browser.browserAction.onClicked.addListener(this.browserActionListener.bind(this));

      this.transporter = new __WEBPACK_IMPORTED_MODULE_12_alpheios_experience__["Transporter"](__WEBPACK_IMPORTED_MODULE_12_alpheios_experience__["StorageAdapter"], __WEBPACK_IMPORTED_MODULE_12_alpheios_experience__["TestAdapter"], BackgroundProcess.defaults.experienceStorageThreshold, BackgroundProcess.defaults.experienceStorageCheckInterval);
    }
  }, {
    key: 'isContentLoaded',
    value: function isContentLoaded(tabID) {
      return this.tabs.has(tabID);
    }
  }, {
    key: 'isContentActive',
    value: function isContentActive(tabID) {
      return this.isContentLoaded(tabID) && this.tabs.get(tabID).status === __WEBPACK_IMPORTED_MODULE_7__content_content_process__["a" /* default */].statuses.ACTIVE;
    }
  }, {
    key: 'activateContent',
    value: function activateContent(tabID) {
      var _this = this;

      if (!this.isContentLoaded(tabID)) {
        // This tab has no content loaded
        this.loadContent(tabID);
      } else {
        if (!this.isContentActive(tabID)) {
          this.messagingService.sendRequestToTab(new __WEBPACK_IMPORTED_MODULE_4__lib_messaging_request_activation_request__["a" /* default */](), 10000, tabID).then(function (message) {
            console.log('Status update, new status is "' + message.status + '"');
            _this.tabs.get(tabID).status = __WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__["a" /* default */].statusSym(message);
          }, function (error) {
            console.log('No status confirmation from tab {tabID} on activation request: ' + error);
          });
        }
      }
    }
  }, {
    key: 'deactivateContent',
    value: function deactivateContent(tabID) {
      var _this2 = this;

      if (this.isContentActive(tabID)) {
        this.messagingService.sendRequestToTab(new __WEBPACK_IMPORTED_MODULE_5__lib_messaging_request_deactivation_request__["a" /* default */](), 10000, tabID).then(function (message) {
          console.log('Status update, new status is "' + message.status + '"');
          _this2.tabs.get(tabID).status = __WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__["a" /* default */].statusSym(message);
        }, function (error) {
          console.log('No status confirmation from tab {tabID} on deactivation request: ' + error);
        });
      }
    }
  }, {
    key: 'loadPolyfill',
    value: function loadPolyfill(tabID) {
      if (!this.browserFeatures.browserNamespace) {
        console.log('"browser" namespace is not supported, will load a WebExtension polyfill into a content script');
        return browser.tabs.executeScript(tabID, {
          file: this.settings.browserPolyfillName
        });
      } else {
        // `browser` object is supported natively, no need to load a polyfill.
        return Promise.resolve();
      }
    }
  }, {
    key: 'loadContentScript',
    value: function loadContentScript(tabID) {
      console.log('Loading content script into a content tab');
      return browser.tabs.executeScript(tabID, {
        file: this.settings.contentScriptFileName
      });
    }
  }, {
    key: 'loadContentCSS',
    value: function loadContentCSS(tabID) {
      console.log('Loading CSS into a content tab');
      return browser.tabs.insertCSS(tabID, {
        file: this.settings.contentCSSFileName
      });
    }
  }, {
    key: 'loadContent',
    value: function loadContent(tabID) {
      var _this3 = this;

      var polyfillScript = this.loadPolyfill(tabID);
      var contentScript = this.loadContentScript(tabID);
      var contentCSS = this.loadContentCSS(tabID);
      Promise.all([polyfillScript, contentScript, contentCSS]).then(function () {
        console.log('Content script(s) has been loaded successfully or already present');
        _this3.tabs.set(tabID, new __WEBPACK_IMPORTED_MODULE_8__content_tab__["a" /* default */](tabID, __WEBPACK_IMPORTED_MODULE_7__content_content_process__["a" /* default */].statuses.ACTIVE));
        BackgroundProcess.defaults.contentScriptLoaded = true;
      }, function (error) {
        throw new Error('Content script loading failed', error);
      });
    }
  }, {
    key: 'sendResponseToTabStatefully',
    value: function sendResponseToTabStatefully(request, tabID) {
      var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      return __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].value(state, this.messagingService.sendResponseToTab(request, tabID));
    }
  }, {
    key: 'getHomonymStatefully',
    value: async function getHomonymStatefully(language, word, state) {
      try {
        var result = await this.maAdapter.getHomonym(language, word, state);
        // If no valid homonym data found should always throw an error to be caught in a calling function
        return __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].value(state, result);
      } catch (error) {
        /*
        getHomonym is non-statefull function. If it throws an error, we should catch it here, attach state
        information, and rethrow
        */
        throw __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].value(state, error);
      }
    }
  }, {
    key: 'handleWordDataRequestStatefully',
    value: async function handleWordDataRequestStatefully(request, sender) {
      var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var textSelector = __WEBPACK_IMPORTED_MODULE_10__lib_selection_text_selector__["a" /* default */].readObject(request.body);
      console.log('Request for a "' + textSelector.normalizedSelectedText + '" word');
      var tabID = sender.tab.id;

      try {
        // homonymObject is a state object, where a 'value' property stores a homonym, and 'state' property - a state
        var homonym = void 0,
            wordData = void 0;

        var _ref = await this.getHomonymStatefully(textSelector.languageCode, textSelector.normalizedSelectedText, state);

        homonym = _ref.value;
        state = _ref.state;

        if (!homonym) {
          throw __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].value(state, new Error('Homonym data is empty'));
        }

        wordData = this.langData.getSuffixes(homonym, state);
        wordData.definition = await __WEBPACK_IMPORTED_MODULE_11__test_stubs_definitions_test__["a" /* default */].getDefinition(textSelector.language, textSelector.word);
        wordData.definition = encodeURIComponent(wordData.definition);
        console.log(wordData);

        var returnObject = this.sendResponseToTabStatefully(new __WEBPACK_IMPORTED_MODULE_6__lib_messaging_response_word_data_response__["a" /* default */](request, wordData, __WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__["a" /* default */].statuses.DATA_FOUND), tabID, state);
        return __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].emptyValue(returnObject.state);
      } catch (error) {
        var errorValue = __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].getValue(error); // In a mixed environment, both statefull and stateless error messages can be thrown
        console.error('Word data retrieval failed: ' + errorValue);
        var _returnObject = this.sendResponseToTabStatefully(new __WEBPACK_IMPORTED_MODULE_6__lib_messaging_response_word_data_response__["a" /* default */](request, undefined, __WEBPACK_IMPORTED_MODULE_2__lib_messaging_message__["a" /* default */].statuses.NO_DATA_FOUND), tabID, __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].getState(error));
        return __WEBPACK_IMPORTED_MODULE_9__lib_state__["a" /* default */].emptyValue(_returnObject.state);
      }
    }
  }, {
    key: 'newExperienceInStorageEvent',
    value: function newExperienceInStorageEvent() {
      console.log('A new experience has been saved to a local storage:');
    }
  }, {
    key: 'menuListener',
    value: async function menuListener(info, tab) {
      if (info.menuItemId === this.settings.activateMenuItemId) {
        this.activateContent(tab.id);
      } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
        this.deactivateContent(tab.id);
      }
    }
  }, {
    key: 'browserActionListener',
    value: async function browserActionListener(tab) {
      this.activateContent(tab.id);
    }
  }], [{
    key: 'getActiveTabID',
    value: async function getActiveTabID() {
      var tabs = await browser.tabs.query({ active: true });
      console.log('Active tab ID is ' + tabs[0].id);
      return tabs[0].id;
    }
  }, {
    key: 'createMenuItem',
    value: function createMenuItem() {
      browser.contextMenus.create({
        id: BackgroundProcess.defaults.activateMenuItemId,
        title: BackgroundProcess.defaults.activateMenuItemText
      });
      browser.contextMenus.create({
        id: BackgroundProcess.defaults.deactivateMenuItemId,
        title: BackgroundProcess.defaults.deactivateMenuItemText
      });
    }
  }, {
    key: 'defaults',
    get: function get() {
      return {
        activateMenuItemId: 'activate-alpheios-content',
        activateMenuItemText: 'Activate',
        deactivateMenuItemId: 'deactivate-alpheios-content',
        deactivateMenuItemText: 'Deactivate',
        sendExperiencesMenuItemId: 'send-experiences',
        sendExperiencesMenuItemText: 'Send Experiences to a remote server',
        contentCSSFileName: 'styles/style.css',
        contentScriptFileName: 'content.js',
        browserPolyfillName: 'support/webextension-polyfill/browser-polyfill.js',
        experienceStorageCheckInterval: 10000,
        experienceStorageThreshold: 3,
        contentScriptLoaded: false
      };
    }
  }]);

  return BackgroundProcess;
}();

/* harmony default export */ __webpack_exports__["a"] = (BackgroundProcess);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Base Adapter Class for a Morphology Service Client
 */
class BaseAdapter {
  /**
   * Method which is used to prepare a lookup request according
   * to the adapter specific logic
   * @param {string} lang - the language code
   * @param {string} word - the word to lookup
   * @returns {string} the url for the request
   */
  prepareRequestUrl (lang, word) {
      /** must be overridden in the adapter implementation class **/
    return null
  }

  /**
   * Fetch response from a remote URL
   * @param {string} lang - the language code
   * @param {string} word - the word to lookup
   * @returns {Promise} a promse which if successful resolves to json response object
   *                    with the results of the analysis
   */
  fetch (lang, word) {
    let url = this.prepareRequestUrl(lang, word);
    return new Promise((resolve, reject) => {
      window.fetch(url).then(
          function (response) {
            let json = response.json();
            resolve(json);
          }
        ).catch((error) => {
          reject(error);
        }
        );
    })
  }

  /**
   * Fetch test data to test the adapter
   * @param {string} lang - the language code
   * @param {string} word - the word to lookup
   * @returns {Promise} a promse which if successful resolves to json response object
   *                    with the test data
   */
  fetchTestData (lang, word) {
    return new Promise((resolve, reject) => {
      try {
        let data = {};
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * A function that maps a morphological service's specific data types and values into an inflection library standard.
   * @param {object} jsonObj - A JSON data from the fetch request
   * @param {object} targetWord - the original target word of the analysis
   * @returns {Homonym} A library standard Homonym object.
   */
  transform (jsonObj, targetWord) {
    return {}
  }
}

/* eslint-disable no-unused-vars */
const LANG_UNIT_WORD = Symbol('word');
const LANG_UNIT_CHAR = Symbol('char');
const LANG_DIR_LTR = Symbol('ltr');
const LANG_DIR_RTL = Symbol('rtl');
const LANG_LATIN = Symbol('latin');
const LANG_GREEK = Symbol('greek');
const LANG_ARABIC = Symbol('arabic');
const LANG_PERSIAN = Symbol('persian');
const STR_LANG_CODE_LAT = 'lat';
const STR_LANG_CODE_LA = 'la';
const STR_LANG_CODE_GRC = 'grc';
const STR_LANG_CODE_ARA = 'ara';
const STR_LANG_CODE_AR = 'ar';
const STR_LANG_CODE_FAR = 'far';
const STR_LANG_CODE_PER = 'per';
// parts of speech
const POFS_ADJECTIVE = 'adjective';
const POFS_ADVERB = 'adverb';
const POFS_ADVERBIAL = 'adverbial';
const POFS_ARTICLE = 'article';
const POFS_CONJUNCTION = 'conjunction';
const POFS_EXCLAMATION = 'exclamation';
const POFS_INTERJECTION = 'interjection';
const POFS_NOUN = 'noun';
const POFS_NUMERAL = 'numeral';
const POFS_PARTICLE = 'particle';
const POFS_PREFIX = 'prefix';
const POFS_PREPOSITION = 'preposition';
const POFS_PRONOUN = 'pronoun';
const POFS_SUFFIX = 'suffix';
const POFS_SUPINE = 'supine';
const POFS_VERB = 'verb';
const POFS_VERB_PARTICIPLE = 'verb participle';
// gender
const GEND_MASCULINE = 'masculine';
const GEND_FEMININE = 'feminine';
const GEND_NEUTER = 'neuter';
const GEND_COMMON = 'common';
const GEND_ANIMATE = 'animate';
const GEND_INANIMATE = 'inanimate';
// Polish gender types
const GEND_PERSONAL_MASCULINE = 'personal masculine';
const GEND_ANIMATE_MASCULINE = 'animate masculine';
const GEND_INANIMATE_MASCULINE = 'inanimate masculine';
// comparative
const COMP_POSITIVE = 'positive';
const COMP_COMPARITIVE = 'comparative';
const COMP_SUPERLATIVE = 'superlative';
// case
const CASE_ABESSIVE = 'abessive';
const CASE_ABLATIVE = 'ablative';
const CASE_ABSOLUTIVE = 'absolutive';
const CASE_ACCUSATIVE = 'accusative';
const CASE_ADDIRECTIVE = 'addirective';
const CASE_ADELATIVE = 'adelative';
const CASE_ADESSIVE = 'adessive';
const CASE_ADVERBIAL = 'adverbial';
const CASE_ALLATIVE = 'allative';
const CASE_ANTESSIVE = 'antessive';
const CASE_APUDESSIVE = 'apudessive';
const CASE_AVERSIVE = 'aversive';
const CASE_BENEFACTIVE = 'benefactive';
const CASE_CARITIVE = 'caritive';
const CASE_CAUSAL = 'causal';
const CASE_CAUSAL_FINAL = 'causal-final';
const CASE_COMITATIVE = 'comitative';
const CASE_DATIVE = 'dative';
const CASE_DELATIVE = 'delative';
const CASE_DIRECT = 'direct';
const CASE_DISTRIBUTIVE = 'distributive';
const CASE_DISTRIBUTIVE_TEMPORAL = 'distributive-temporal';
const CASE_ELATIVE = 'elative';
const CASE_ERGATIVE = 'ergative';
const CASE_ESSIVE = 'essive';
const CASE_ESSIVE_FORMAL = 'essive-formal';
const CASE_ESSIVE_MODAL = 'essive-modal';
const CASE_EQUATIVE = 'equative';
const CASE_EVITATIVE = 'evitative';
const CASE_EXESSIVE = 'exessive';
const CASE_FINAL = 'final';
const CASE_FORMAL = 'formal';
const CASE_GENITIVE = 'genitive';
const CASE_ILLATIVE = 'illative';
const CASE_INELATIVE = 'inelative';
const CASE_INESSIVE = 'inessive';
const CASE_INSTRUCTIVE = 'instructive';
const CASE_INSTRUMENTAL = 'instrumental';
const CASE_INSTRUMENTAL_COMITATIVE = 'instrumental-comitative';
const CASE_INTRANSITIVE = 'intransitive';
const CASE_LATIVE = 'lative';
const CASE_LOCATIVE = 'locative';
const CASE_MODAL = 'modal';
const CASE_MULTIPLICATIVE = 'multiplicative';
const CASE_NOMINATIVE = 'nominative';
const CASE_PARTITIVE = 'partitive';
const CASE_PEGATIVE = 'pegative';
const CASE_PERLATIVE = 'perlative';
const CASE_POSSESSIVE = 'possessive';
const CASE_POSTELATIVE = 'postelative';
const CASE_POSTDIRECTIVE = 'postdirective';
const CASE_POSTESSIVE = 'postessive';
const CASE_POSTPOSITIONAL = 'postpositional';
const CASE_PREPOSITIONAL = 'prepositional';
const CASE_PRIVATIVE = 'privative';
const CASE_PROLATIVE = 'prolative';
const CASE_PROSECUTIVE = 'prosecutive';
const CASE_PROXIMATIVE = 'proximative';
const CASE_SEPARATIVE = 'separative';
const CASE_SOCIATIVE = 'sociative';
const CASE_SUBDIRECTIVE = 'subdirective';
const CASE_SUBESSIVE = 'subessive';
const CASE_SUBELATIVE = 'subelative';
const CASE_SUBLATIVE = 'sublative';
const CASE_SUPERDIRECTIVE = 'superdirective';
const CASE_SUPERESSIVE = 'superessive';
const CASE_SUPERLATIVE = 'superlative';
const CASE_SUPPRESSIVE = 'suppressive';
const CASE_TEMPORAL = 'temporal';
const CASE_TERMINATIVE = 'terminative';
const CASE_TRANSLATIVE = 'translative';
const CASE_VIALIS = 'vialis';
const CASE_VOCATIVE = 'vocative';
const MOOD_ADMIRATIVE = 'admirative';
const MOOD_COHORTATIVE = 'cohortative';
const MOOD_CONDITIONAL = 'conditional';
const MOOD_DECLARATIVE = 'declarative';
const MOOD_DUBITATIVE = 'dubitative';
const MOOD_ENERGETIC = 'energetic';
const MOOD_EVENTIVE = 'eventive';
const MOOD_GENERIC = 'generic';
const MOOD_GERUNDIVE = 'gerundive';
const MOOD_HYPOTHETICAL = 'hypothetical';
const MOOD_IMPERATIVE = 'imperative';
const MOOD_INDICATIVE = 'indicative';
const MOOD_INFERENTIAL = 'inferential';
const MOOD_INFINITIVE = 'infinitive';
const MOOD_INTERROGATIVE = 'interrogative';
const MOOD_JUSSIVE = 'jussive';
const MOOD_NEGATIVE = 'negative';
const MOOD_OPTATIVE = 'optative';
const MOOD_PARTICIPLE = 'participle';
const MOOD_PRESUMPTIVE = 'presumptive';
const MOOD_RENARRATIVE = 'renarrative';
const MOOD_SUBJUNCTIVE = 'subjunctive';
const MOOD_SUPINE = 'supine';
const NUM_SINGULAR = 'singular';
const NUM_PLURAL = 'plural';
const NUM_DUAL = 'dual';
const NUM_TRIAL = 'trial';
const NUM_PAUCAL = 'paucal';
const NUM_SINGULATIVE = 'singulative';
const NUM_COLLECTIVE = 'collective';
const NUM_DISTRIBUTIVE_PLURAL = 'distributive plural';
const NRL_CARDINAL = 'cardinal';
const NRL_ORDINAL = 'ordinal';
const NRL_DISTRIBUTIVE = 'distributive';
const NURL_NUMERAL_ADVERB = 'numeral adverb';
const ORD_1ST = '1st';
const ORD_2ND = '2nd';
const ORD_3RD = '3rd';
const ORD_4TH = '4th';
const ORD_5TH = '5th';
const ORD_6TH = '6th';
const ORD_7TH = '7th';
const ORD_8TH = '8th';
const ORD_9TH = '9th';
const TENSE_AORIST = 'aorist';
const TENSE_FUTURE = 'future';
const TENSE_FUTURE_PERFECT = 'future perfect';
const TENSE_IMPERFECT = 'imperfect';
const TENSE_PAST_ABSOLUTE = 'past absolute';
const TENSE_PERFECT = 'perfect';
const TENSE_PLUPERFECT = 'pluperfect';
const TENSE_PRESENT = 'present';
const VKIND_TO_BE = 'to be';
const VKIND_COMPOUNDS_OF_TO_BE = 'compounds of to be';
const VKIND_TAKING_ABLATIVE = 'taking ablative';
const VKIND_TAKING_DATIVE = 'taking dative';
const VKIND_TAKING_GENITIVE = 'taking genitive';
const VKIND_TRANSITIVE = 'transitive';
const VKIND_INTRANSITIVE = 'intransitive';
const VKIND_IMPERSONAL = 'impersonal';
const VKIND_DEPONENT = 'deponent';
const VKIND_SEMIDEPONENT = 'semideponent';
const VKIND_PERFECT_DEFINITE = 'perfect definite';
const VOICE_ACTIVE = 'active';
const VOICE_PASSIVE = 'passive';
const VOICE_MEDIOPASSIVE = 'mediopassive';
const VOICE_IMPERSONAL_PASSIVE = 'impersonal passive';
const VOICE_MIDDLE = 'middle';
const VOICE_ANTIPASSIVE = 'antipassive';
const VOICE_REFLEXIVE = 'reflexive';
const VOICE_RECIPROCAL = 'reciprocal';
const VOICE_CAUSATIVE = 'causative';
const VOICE_ADJUTATIVE = 'adjutative';
const VOICE_APPLICATIVE = 'applicative';
const VOICE_CIRCUMSTANTIAL = 'circumstantial';
const VOICE_DEPONENT = 'deponent';
const TYPE_IRREGULAR = 'irregular';
const TYPE_REGULAR = 'regular';
/* eslit-enable no-unused-vars */


var constants = Object.freeze({
	LANG_UNIT_WORD: LANG_UNIT_WORD,
	LANG_UNIT_CHAR: LANG_UNIT_CHAR,
	LANG_DIR_LTR: LANG_DIR_LTR,
	LANG_DIR_RTL: LANG_DIR_RTL,
	LANG_LATIN: LANG_LATIN,
	LANG_GREEK: LANG_GREEK,
	LANG_ARABIC: LANG_ARABIC,
	LANG_PERSIAN: LANG_PERSIAN,
	STR_LANG_CODE_LAT: STR_LANG_CODE_LAT,
	STR_LANG_CODE_LA: STR_LANG_CODE_LA,
	STR_LANG_CODE_GRC: STR_LANG_CODE_GRC,
	STR_LANG_CODE_ARA: STR_LANG_CODE_ARA,
	STR_LANG_CODE_AR: STR_LANG_CODE_AR,
	STR_LANG_CODE_FAR: STR_LANG_CODE_FAR,
	STR_LANG_CODE_PER: STR_LANG_CODE_PER,
	POFS_ADJECTIVE: POFS_ADJECTIVE,
	POFS_ADVERB: POFS_ADVERB,
	POFS_ADVERBIAL: POFS_ADVERBIAL,
	POFS_ARTICLE: POFS_ARTICLE,
	POFS_CONJUNCTION: POFS_CONJUNCTION,
	POFS_EXCLAMATION: POFS_EXCLAMATION,
	POFS_INTERJECTION: POFS_INTERJECTION,
	POFS_NOUN: POFS_NOUN,
	POFS_NUMERAL: POFS_NUMERAL,
	POFS_PARTICLE: POFS_PARTICLE,
	POFS_PREFIX: POFS_PREFIX,
	POFS_PREPOSITION: POFS_PREPOSITION,
	POFS_PRONOUN: POFS_PRONOUN,
	POFS_SUFFIX: POFS_SUFFIX,
	POFS_SUPINE: POFS_SUPINE,
	POFS_VERB: POFS_VERB,
	POFS_VERB_PARTICIPLE: POFS_VERB_PARTICIPLE,
	GEND_MASCULINE: GEND_MASCULINE,
	GEND_FEMININE: GEND_FEMININE,
	GEND_NEUTER: GEND_NEUTER,
	GEND_COMMON: GEND_COMMON,
	GEND_ANIMATE: GEND_ANIMATE,
	GEND_INANIMATE: GEND_INANIMATE,
	GEND_PERSONAL_MASCULINE: GEND_PERSONAL_MASCULINE,
	GEND_ANIMATE_MASCULINE: GEND_ANIMATE_MASCULINE,
	GEND_INANIMATE_MASCULINE: GEND_INANIMATE_MASCULINE,
	COMP_POSITIVE: COMP_POSITIVE,
	COMP_COMPARITIVE: COMP_COMPARITIVE,
	COMP_SUPERLATIVE: COMP_SUPERLATIVE,
	CASE_ABESSIVE: CASE_ABESSIVE,
	CASE_ABLATIVE: CASE_ABLATIVE,
	CASE_ABSOLUTIVE: CASE_ABSOLUTIVE,
	CASE_ACCUSATIVE: CASE_ACCUSATIVE,
	CASE_ADDIRECTIVE: CASE_ADDIRECTIVE,
	CASE_ADELATIVE: CASE_ADELATIVE,
	CASE_ADESSIVE: CASE_ADESSIVE,
	CASE_ADVERBIAL: CASE_ADVERBIAL,
	CASE_ALLATIVE: CASE_ALLATIVE,
	CASE_ANTESSIVE: CASE_ANTESSIVE,
	CASE_APUDESSIVE: CASE_APUDESSIVE,
	CASE_AVERSIVE: CASE_AVERSIVE,
	CASE_BENEFACTIVE: CASE_BENEFACTIVE,
	CASE_CARITIVE: CASE_CARITIVE,
	CASE_CAUSAL: CASE_CAUSAL,
	CASE_CAUSAL_FINAL: CASE_CAUSAL_FINAL,
	CASE_COMITATIVE: CASE_COMITATIVE,
	CASE_DATIVE: CASE_DATIVE,
	CASE_DELATIVE: CASE_DELATIVE,
	CASE_DIRECT: CASE_DIRECT,
	CASE_DISTRIBUTIVE: CASE_DISTRIBUTIVE,
	CASE_DISTRIBUTIVE_TEMPORAL: CASE_DISTRIBUTIVE_TEMPORAL,
	CASE_ELATIVE: CASE_ELATIVE,
	CASE_ERGATIVE: CASE_ERGATIVE,
	CASE_ESSIVE: CASE_ESSIVE,
	CASE_ESSIVE_FORMAL: CASE_ESSIVE_FORMAL,
	CASE_ESSIVE_MODAL: CASE_ESSIVE_MODAL,
	CASE_EQUATIVE: CASE_EQUATIVE,
	CASE_EVITATIVE: CASE_EVITATIVE,
	CASE_EXESSIVE: CASE_EXESSIVE,
	CASE_FINAL: CASE_FINAL,
	CASE_FORMAL: CASE_FORMAL,
	CASE_GENITIVE: CASE_GENITIVE,
	CASE_ILLATIVE: CASE_ILLATIVE,
	CASE_INELATIVE: CASE_INELATIVE,
	CASE_INESSIVE: CASE_INESSIVE,
	CASE_INSTRUCTIVE: CASE_INSTRUCTIVE,
	CASE_INSTRUMENTAL: CASE_INSTRUMENTAL,
	CASE_INSTRUMENTAL_COMITATIVE: CASE_INSTRUMENTAL_COMITATIVE,
	CASE_INTRANSITIVE: CASE_INTRANSITIVE,
	CASE_LATIVE: CASE_LATIVE,
	CASE_LOCATIVE: CASE_LOCATIVE,
	CASE_MODAL: CASE_MODAL,
	CASE_MULTIPLICATIVE: CASE_MULTIPLICATIVE,
	CASE_NOMINATIVE: CASE_NOMINATIVE,
	CASE_PARTITIVE: CASE_PARTITIVE,
	CASE_PEGATIVE: CASE_PEGATIVE,
	CASE_PERLATIVE: CASE_PERLATIVE,
	CASE_POSSESSIVE: CASE_POSSESSIVE,
	CASE_POSTELATIVE: CASE_POSTELATIVE,
	CASE_POSTDIRECTIVE: CASE_POSTDIRECTIVE,
	CASE_POSTESSIVE: CASE_POSTESSIVE,
	CASE_POSTPOSITIONAL: CASE_POSTPOSITIONAL,
	CASE_PREPOSITIONAL: CASE_PREPOSITIONAL,
	CASE_PRIVATIVE: CASE_PRIVATIVE,
	CASE_PROLATIVE: CASE_PROLATIVE,
	CASE_PROSECUTIVE: CASE_PROSECUTIVE,
	CASE_PROXIMATIVE: CASE_PROXIMATIVE,
	CASE_SEPARATIVE: CASE_SEPARATIVE,
	CASE_SOCIATIVE: CASE_SOCIATIVE,
	CASE_SUBDIRECTIVE: CASE_SUBDIRECTIVE,
	CASE_SUBESSIVE: CASE_SUBESSIVE,
	CASE_SUBELATIVE: CASE_SUBELATIVE,
	CASE_SUBLATIVE: CASE_SUBLATIVE,
	CASE_SUPERDIRECTIVE: CASE_SUPERDIRECTIVE,
	CASE_SUPERESSIVE: CASE_SUPERESSIVE,
	CASE_SUPERLATIVE: CASE_SUPERLATIVE,
	CASE_SUPPRESSIVE: CASE_SUPPRESSIVE,
	CASE_TEMPORAL: CASE_TEMPORAL,
	CASE_TERMINATIVE: CASE_TERMINATIVE,
	CASE_TRANSLATIVE: CASE_TRANSLATIVE,
	CASE_VIALIS: CASE_VIALIS,
	CASE_VOCATIVE: CASE_VOCATIVE,
	MOOD_ADMIRATIVE: MOOD_ADMIRATIVE,
	MOOD_COHORTATIVE: MOOD_COHORTATIVE,
	MOOD_CONDITIONAL: MOOD_CONDITIONAL,
	MOOD_DECLARATIVE: MOOD_DECLARATIVE,
	MOOD_DUBITATIVE: MOOD_DUBITATIVE,
	MOOD_ENERGETIC: MOOD_ENERGETIC,
	MOOD_EVENTIVE: MOOD_EVENTIVE,
	MOOD_GENERIC: MOOD_GENERIC,
	MOOD_GERUNDIVE: MOOD_GERUNDIVE,
	MOOD_HYPOTHETICAL: MOOD_HYPOTHETICAL,
	MOOD_IMPERATIVE: MOOD_IMPERATIVE,
	MOOD_INDICATIVE: MOOD_INDICATIVE,
	MOOD_INFERENTIAL: MOOD_INFERENTIAL,
	MOOD_INFINITIVE: MOOD_INFINITIVE,
	MOOD_INTERROGATIVE: MOOD_INTERROGATIVE,
	MOOD_JUSSIVE: MOOD_JUSSIVE,
	MOOD_NEGATIVE: MOOD_NEGATIVE,
	MOOD_OPTATIVE: MOOD_OPTATIVE,
	MOOD_PARTICIPLE: MOOD_PARTICIPLE,
	MOOD_PRESUMPTIVE: MOOD_PRESUMPTIVE,
	MOOD_RENARRATIVE: MOOD_RENARRATIVE,
	MOOD_SUBJUNCTIVE: MOOD_SUBJUNCTIVE,
	MOOD_SUPINE: MOOD_SUPINE,
	NUM_SINGULAR: NUM_SINGULAR,
	NUM_PLURAL: NUM_PLURAL,
	NUM_DUAL: NUM_DUAL,
	NUM_TRIAL: NUM_TRIAL,
	NUM_PAUCAL: NUM_PAUCAL,
	NUM_SINGULATIVE: NUM_SINGULATIVE,
	NUM_COLLECTIVE: NUM_COLLECTIVE,
	NUM_DISTRIBUTIVE_PLURAL: NUM_DISTRIBUTIVE_PLURAL,
	NRL_CARDINAL: NRL_CARDINAL,
	NRL_ORDINAL: NRL_ORDINAL,
	NRL_DISTRIBUTIVE: NRL_DISTRIBUTIVE,
	NURL_NUMERAL_ADVERB: NURL_NUMERAL_ADVERB,
	ORD_1ST: ORD_1ST,
	ORD_2ND: ORD_2ND,
	ORD_3RD: ORD_3RD,
	ORD_4TH: ORD_4TH,
	ORD_5TH: ORD_5TH,
	ORD_6TH: ORD_6TH,
	ORD_7TH: ORD_7TH,
	ORD_8TH: ORD_8TH,
	ORD_9TH: ORD_9TH,
	TENSE_AORIST: TENSE_AORIST,
	TENSE_FUTURE: TENSE_FUTURE,
	TENSE_FUTURE_PERFECT: TENSE_FUTURE_PERFECT,
	TENSE_IMPERFECT: TENSE_IMPERFECT,
	TENSE_PAST_ABSOLUTE: TENSE_PAST_ABSOLUTE,
	TENSE_PERFECT: TENSE_PERFECT,
	TENSE_PLUPERFECT: TENSE_PLUPERFECT,
	TENSE_PRESENT: TENSE_PRESENT,
	VKIND_TO_BE: VKIND_TO_BE,
	VKIND_COMPOUNDS_OF_TO_BE: VKIND_COMPOUNDS_OF_TO_BE,
	VKIND_TAKING_ABLATIVE: VKIND_TAKING_ABLATIVE,
	VKIND_TAKING_DATIVE: VKIND_TAKING_DATIVE,
	VKIND_TAKING_GENITIVE: VKIND_TAKING_GENITIVE,
	VKIND_TRANSITIVE: VKIND_TRANSITIVE,
	VKIND_INTRANSITIVE: VKIND_INTRANSITIVE,
	VKIND_IMPERSONAL: VKIND_IMPERSONAL,
	VKIND_DEPONENT: VKIND_DEPONENT,
	VKIND_SEMIDEPONENT: VKIND_SEMIDEPONENT,
	VKIND_PERFECT_DEFINITE: VKIND_PERFECT_DEFINITE,
	VOICE_ACTIVE: VOICE_ACTIVE,
	VOICE_PASSIVE: VOICE_PASSIVE,
	VOICE_MEDIOPASSIVE: VOICE_MEDIOPASSIVE,
	VOICE_IMPERSONAL_PASSIVE: VOICE_IMPERSONAL_PASSIVE,
	VOICE_MIDDLE: VOICE_MIDDLE,
	VOICE_ANTIPASSIVE: VOICE_ANTIPASSIVE,
	VOICE_REFLEXIVE: VOICE_REFLEXIVE,
	VOICE_RECIPROCAL: VOICE_RECIPROCAL,
	VOICE_CAUSATIVE: VOICE_CAUSATIVE,
	VOICE_ADJUTATIVE: VOICE_ADJUTATIVE,
	VOICE_APPLICATIVE: VOICE_APPLICATIVE,
	VOICE_CIRCUMSTANTIAL: VOICE_CIRCUMSTANTIAL,
	VOICE_DEPONENT: VOICE_DEPONENT,
	TYPE_IRREGULAR: TYPE_IRREGULAR,
	TYPE_REGULAR: TYPE_REGULAR
});

class Definition {
  constructor (text, language, format) {
    this.text = text;
    this.language = language;
    this.format = format;
  }
}

/**
 * Wrapper class for a (grammatical, usually) feature, such as part of speech or declension. Keeps both value and type information.
 */
class Feature {
    /**
     * Initializes a Feature object
     * @param {string | string[]} value - A single feature value or, if this feature could have multiple
     * values, an array of values.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (value, type, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!value) {
      throw new Error('Feature should have a non-empty value.')
    }
    if (!type) {
      throw new Error('Feature should have a non-empty type.')
    }
    if (!language) {
      throw new Error('Feature constructor requires a language')
    }
    this.value = value;
    this.type = type;
    this.language = language;
  };

  isEqual (feature) {
    if (Array.isArray(feature.value)) {
      if (!Array.isArray(this.value) || this.value.length !== feature.value.length) {
        return false
      }
      let equal = this.type === feature.type && this.language === feature.language;
      equal = equal && this.value.every(function (element, index) {
        return element === feature.value[index]
      });
      return equal
    } else {
      return this.value === feature.value && this.type === feature.type && this.language === feature.language
    }
  }
}
// Should have no spaces in values in order to be used in HTML templates
Feature.types = {
  word: 'word',
  part: 'part of speech', // Part of speech
  number: 'number',
  grmCase: 'case',
  declension: 'declension',
  gender: 'gender',
  type: 'type',
  conjugation: 'conjugation',
  comparison: 'comparison',
  tense: 'tense',
  voice: 'voice',
  mood: 'mood',
  person: 'person',
  frequency: 'frequency', // How frequent this word is
  meaning: 'meaning', // Meaning of a word
  source: 'source', // Source of word definition
  footnote: 'footnote', // A footnote for a word's ending
  dialect: 'dialect', // a dialect iderntifier
  note: 'note', // a general note
  pronunciation: 'pronunciation',
  area: 'area',
  geo: 'geo', // geographical data
  kind: 'kind', // verb kind informatin
  derivtype: 'derivtype',
  stemtype: 'stemtype',
  morph: 'morph', // general morphological information
  var: 'var', // variance?
  isAllowed (value) {
    let v = `${value}`;
    return Object.values(this).includes(v)
  }
};

class FeatureImporter {
  constructor (defaults = []) {
    this.hash = {};
    for (let value of defaults) {
      this.map(value, value);
    }
    return this
  }

    /**
     * Sets mapping between external imported value and one or more library standard values. If an importedValue
     * is already in a hash table, old libraryValue will be overwritten with the new one.
     * @param {string} importedValue - External value
     * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
     */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue;
    return this
  }

    /**
     * Checks if value is in a map.
     * @param {string} importedValue - A value to test.
     * @returns {boolean} - Tru if value is in a map, false otherwise.
     */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

    /**
     * Returns one or more library standard values that match an external value
     * @param {string} importedValue - External value
     * @returns {Object | string} One or more of library standard values
     */
  get (importedValue) {
    if (this.has(importedValue)) {
      return this.hash[importedValue]
    } else {
      throw new Error('A value "' + importedValue + '" is not found in the importer.')
    }
  }
}

/**
 * Definition class for a (grammatical) feature. Stores type information and (optionally) all possible values of the feature.
 * It serves as a feature generator. If list of possible values is provided, it can generate a Feature object
 * each time a property that corresponds to a feature value is accessed. If no list of possible values provided,
 * a Feature object can be generated with get(value) method.
 *
 * An order of values determines a default sort and grouping order. If two values should have the same order,
 * they should be grouped within an array: value1, [value2, value3], value4. Here 'value2' and 'value3' have
 * the same priority for sorting and grouping.
 */
class FeatureType {
    // TODO: value checking
    /**
     * Creates and initializes a Feature Type object.
     * @param {string} type - A type of the feature, allowed values are specified in 'types' object.
     * @param {string[] | string[][]} values - A list of allowed values for this feature type.
     * If an empty array is provided, there will be no
     * allowed values as well as no ordering (can be used for items that do not need or have a simple order,
     * such as footnotes).
     * @param {string} language - A language of a feature, allowed values are specified in 'languages' object.
     */
  constructor (type, values, language) {
    if (!Feature.types.isAllowed(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!values || !Array.isArray(values)) {
      throw new Error('Values should be an array (or an empty array) of values.')
    }
    if (!language) {
      throw new Error('FeatureType constructor requires a language')
    }

    this.type = type;
    this.language = language;

        /*
         This is a sort order index for a grammatical feature values. It is determined by the order of values in
         a 'values' array.
         */
    this._orderIndex = [];
    this._orderLookup = {};

    for (const [index, value] of values.entries()) {
      this._orderIndex.push(value);
      if (Array.isArray(value)) {
        for (let element of value) {
          this[element] = new Feature(element, this.type, this.language);
          this._orderLookup[element] = index;
        }
      } else {
        this[value] = new Feature(value, this.type, this.language);
        this._orderLookup[value] = index;
      }
    }
  };

    /**
     * Return a Feature with an arbitrary value. This value would not be necessarily present among FeatureType values.
     * This can be especially useful for features that do not set: a list of predefined values, such as footnotes.
     * @param value
     * @returns {Feature}
     */
  get (value) {
    if (value) {
      return new Feature(value, this.type, this.language)
    } else {
      throw new Error('A non-empty value should be provided.')
    }
  }

  getFromImporter (importerName, value) {
    let mapped;
    try {
      mapped = this.importer[importerName].get(value);
    } catch (e) {
      // quietly catch not found and replace with default
      mapped = this.get(value);
    }
    return mapped
  }

    /**
     * Creates and returns a new importer with a specific name. If an importer with this name already exists,
     * an existing Importer object will be returned.
     * @param {string} name - A name of an importer object
     * @returns {Importer} A new or existing Importer object that matches a name provided
     */
  addImporter (name) {
    if (!name) {
      throw new Error('Importer should have a non-empty name.')
    }
    this.importer = this.importer || {};
    this.importer[name] = this.importer[name] || new FeatureImporter();
    return this.importer[name]
  }

    /**
     * Return copies of all feature values as Feature objects in a sorted array, according to feature type's sort order.
     * For a similar function that returns strings instead of Feature objects see orderedValues().
     * @returns {Feature[] | Feature[][]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of Feature objects will be returned instead of a single Feature object, as for single feature values.
     */
  get orderedFeatures () {
    return this.orderedValues.map((value) => new Feature(value, this.type, this.language))
  }

    /**
     * Return all feature values as strings in a sorted array, according to feature type's sort order.
     * This is a main method that specifies a sort order of the feature type. orderedFeatures() relies
     * on this method in providing a sorted array of feature values. If you want to create
     * a custom sort order for a particular feature type that will depend on some options that are not type-related,
     * create a wrapper around this function providing it with options arguments so it will be able to decide
     * in what order those features will be based on those arguments.
     * For a similar function that returns Feature objects instead of strings see orderedValues().
     * @returns {string[]} Array of feature values sorted according to orderIndex.
     * If particular feature contains multiple feature values (i.e. `masculine` and `feminine` values combined),
     * an array of strings will be returned instead of a single strings, as for single feature values.
     */
  get orderedValues () {
    return this._orderIndex
  }

    /**
     * Returns a lookup table for type values as:
     *  {value1: order1, value2: order2}, where order is a sort order of an item. If two items have the same sort order,
     *  their order value will be the same.
     * @returns {object}
     */
  get orderLookup () {
    return this._orderLookup
  }

    /**
     * Sets an order of grammatical feature values for a grammatical feature. Used mostly for sorting, filtering,
     * and displaying.
     *
     * @param {Feature[] | Feature[][]} values - a list of grammatical features that specify their order for
     * sorting and filtering. Some features can be grouped as [[genders.masculine, genders.feminine], LibLatin.genders.neuter].
     * It means that genders.masculine and genders.feminine belong to the same group. They will have the same index
     * and will be stored inside an _orderIndex as an array. genders.masculine and genders.feminine will be grouped together
     * during filtering and will be in the same bin during sorting.
     *
     */
  set order (values) {
    if (!values || (Array.isArray(values) && values.length === 0)) {
      throw new Error('A non-empty list of values should be provided.')
    }

        // If a single value is provided, convert it into an array
    if (!Array.isArray(values)) {
      values = [values];
    }

    for (let value of values) {
      if (Array.isArray(value)) {
        for (let element of value) {
          if (!this.hasOwnProperty(element.value)) {
            throw new Error('Trying to order an element with "' + element.value + '" value that is not stored in a "' + this.type + '" type.')
          }

          if (element.type !== this.type) {
            throw new Error('Trying to order an element with type "' + element.type + '" that is different from "' + this.type + '".')
          }

          if (element.language !== this.language) {
            throw new Error('Trying to order an element with language "' + element.language + '" that is different from "' + this.language + '".')
          }
        }
      } else {
        if (!this.hasOwnProperty(value.value)) {
          throw new Error('Trying to order an element with "' + value.value + '" value that is not stored in a "' + this.type + '" type.')
        }

        if (value.type !== this.type) {
          throw new Error('Trying to order an element with type "' + value.type + '" that is different from "' + this.type + '".')
        }

        if (value.language !== this.language) {
          throw new Error('Trying to order an element with language "' + value.language + '" that is different from "' + this.language + '".')
        }
      }
    }

        // Erase whatever sort order was set previously
    this._orderLookup = {};
    this._orderIndex = [];

        // Define a new sort order
    for (const [index, element] of values.entries()) {
      if (Array.isArray(element)) {
                // If it is an array, all values should have the same order
        let elements = [];
        for (const subElement of element) {
          this._orderLookup[subElement.value] = index;
          elements.push(subElement.value);
        }
        this._orderIndex[index] = elements;
      } else {
                // If is a single value
        this._orderLookup[element.value] = index;
        this._orderIndex[index] = element.value;
      }
    }
  }
}

/**
 * @class  LanguageModel is the base class for language-specific behavior
 */
class LanguageModel {
   /**
   */
  constructor () {
    this.sourceLanguage = null;
    this.contextForward = 0;
    this.context_backward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [];
  }

  _initializeFeatures () {
    let features = {};
    let code = this.toCode();
    features[Feature.types.part] = new FeatureType(Feature.types.part,
      [ POFS_ADVERB,
        POFS_ADVERBIAL,
        POFS_ADJECTIVE,
        POFS_ARTICLE,
        POFS_CONJUNCTION,
        POFS_EXCLAMATION,
        POFS_INTERJECTION,
        POFS_NOUN,
        POFS_NUMERAL,
        POFS_PARTICLE,
        POFS_PREFIX,
        POFS_PREPOSITION,
        POFS_PRONOUN,
        POFS_SUFFIX,
        POFS_SUPINE,
        POFS_VERB,
        POFS_VERB_PARTICIPLE ], code);
    features[Feature.types.gender] = new FeatureType(Feature.types.gender,
      [ GEND_MASCULINE, GEND_FEMININE, GEND_NEUTER ], code);
    features[Feature.types.type] = new FeatureType(Feature.types.type,
      [TYPE_REGULAR, TYPE_IRREGULAR], code);
    features[Feature.types.person] = new FeatureType(Feature.types.person,
      [ORD_1ST, ORD_2ND, ORD_3RD], code);
    return features
  }

  /**
   * Handler which can be used as the contextHander.
   * It uses language-specific configuration to identify
   * the elements from the alph-text popup which should produce links
   * to the language-specific grammar.
   * @see #contextHandler
   */
  grammarContext (doc) {
      // used to bind a click handler on the .alph-entry items in the
      // popup which retrieved the context attribute from the clicked
      // term and used that to construct a link and open the grammar
      // at the apporopriate place.
      // var links = this.getGrammarLinks();

      // for (var link_name in links)
      // {
      //   if (links.hasOwnProperty(link_name))
      //    {
              // Alph.$(".alph-entry ." + link_name,a_doc).bind('click',link_name,
              //   function(a_e)
              //    {
                        // build target inside grammar
                        // var target = a_e.data;
                        // var rngContext = Alph.$(this).attr("context");
                        // if (rngContext != null)
                        // {
                        //  target += "-" + rngContext.split(/-/)[0];
                        // }
                        // myobj.openGrammar(a_e.originaEvent,this,target);
               //   }
              // );
       //   }
      // }
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Check to see if the supplied language code is supported by this tool
   * @param {string} code the language code
   * @returns true if supported false if not
   * @type Boolean
   */
  static supportsLanguage (code) {
    return this.codes.includes[code]
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {string} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toString () {
    return String(this.sourceLanguage)
  }

  isEqual (model) {
    return this.sourceLanguage === model.sourceLanguage
  }

  toCode () {
    return null
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class LatinLanguageModel extends LanguageModel {
   /**
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_LATIN;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.codes = [STR_LANG_CODE_LA, STR_LANG_CODE_LAT];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_ABLATIVE,
        CASE_LOCATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD, ORD_4TH, ORD_5TH ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice, [VOICE_PASSIVE, VOICE_ACTIVE], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood, [MOOD_INDICATIVE, MOOD_SUBJUNCTIVE], code);
    features[Feature.types.conjugation] = new FeatureType(Feature.types.conjugation,
      [ ORD_1ST,
        ORD_2ND,
        ORD_3RD,
        ORD_4TH
      ], code);
    return features
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }

  toCode () {
    return STR_LANG_CODE_LAT
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_GREEK;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_LTR;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_GRC];
    this.features = this._initializeFeatures();
  }

  _initializeFeatures () {
    let features = super._initializeFeatures();
    let code = this.toCode();
    features[Feature.types.number] = new FeatureType(Feature.types.number, [NUM_SINGULAR, NUM_PLURAL, NUM_DUAL], code);
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [ CASE_NOMINATIVE,
        CASE_GENITIVE,
        CASE_DATIVE,
        CASE_ACCUSATIVE,
        CASE_VOCATIVE
      ], code);
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [ ORD_1ST, ORD_2ND, ORD_3RD ], code);
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [ TENSE_PRESENT,
        TENSE_IMPERFECT,
        TENSE_FUTURE,
        TENSE_PERFECT,
        TENSE_PLUPERFECT,
        TENSE_FUTURE_PERFECT,
        TENSE_AORIST
      ], code);
    features[Feature.types.voice] = new FeatureType(Feature.types.voice,
      [ VOICE_PASSIVE,
        VOICE_ACTIVE,
        VOICE_MEDIOPASSIVE,
        VOICE_MIDDLE
      ], code);
    features[Feature.types.mood] = new FeatureType(Feature.types.mood,
      [ MOOD_INDICATIVE,
        MOOD_SUBJUNCTIVE,
        MOOD_OPTATIVE,
        MOOD_IMPERATIVE
      ], code);
    // TODO full list of greek dialects
    features[Feature.types.dialect] = new FeatureType(Feature.types.dialect, ['attic', 'epic', 'doric'], code);
    return features
  }

  toCode () {
    return STR_LANG_CODE_GRC
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return true
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class ArabicLanguageModel extends LanguageModel {
   /**
   * @constructor
   */
  constructor () {
    super();
    this.sourceLanguage = LANG_ARABIC;
    this.contextForward = 0;
    this.contextBackward = 0;
    this.direction = LANG_DIR_RTL;
    this.baseUnit = LANG_UNIT_WORD;
    this.languageCodes = [STR_LANG_CODE_ARA, STR_LANG_CODE_AR];
    this._initializeFeatures();
  }

  _initializeFeatures () {
    this.features = super._initializeFeatures();
  }

  toCode () {
    return STR_LANG_CODE_ARA
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {String} word the source word
   * @returns the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type String
   */
  normalizeWord (word) {
    // TODO
    return word
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return ".,;:!?'\"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r"
  }
}

const MODELS = new Map([
  [ STR_LANG_CODE_LA, LatinLanguageModel ],
  [ STR_LANG_CODE_LAT, LatinLanguageModel ],
  [ STR_LANG_CODE_GRC, GreekLanguageModel ],
  [ STR_LANG_CODE_ARA, ArabicLanguageModel ],
  [ STR_LANG_CODE_AR, ArabicLanguageModel ]
]);

class LanguageModelFactory {
  static supportsLanguage (code) {
    return MODELS.has(code)
  }

  static getLanguageForCode (code = null) {
    let Model = MODELS.get(code);
    if (Model) {
      return new Model()
    }
    // for now return a default Model
    // TODO may want to throw an error
    return new LanguageModel()
  }
}

/**
 * Lemma, a canonical form of a word.
 */
class Lemma {
    /**
     * Initializes a Lemma object.
     * @param {string} word - A word.
     * @param {string} language - A language of a word.
     * @param {Array[string]} principalParts - the principalParts of a lemma
     */
  constructor (word, language, principalParts = []) {
    if (!word) {
      throw new Error('Word should not be empty.')
    }

    if (!language) {
      throw new Error('Language should not be empty.')
    }

        // if (!languages.isAllowed(language)) {
        //    throw new Error('Language "' + language + '" is not supported.');
        // }

    this.word = word;
    this.language = language;
    this.principalParts = principalParts;
  }

  static readObject (jsonObject) {
    return new Lemma(jsonObject.word, jsonObject.language)
  }
}

/*
 Hierarchical structure of return value of a morphological analyzer:

 Homonym (a group of words that are written the same way, https://en.wikipedia.org/wiki/Homonym)
    Lexeme 1 (a unit of lexical meaning, https://en.wikipedia.org/wiki/Lexeme)
        Have a lemma and one or more inflections
        Lemma (also called a headword, a canonical form of a group of words https://en.wikipedia.org/wiki/Lemma_(morphology) )
        Inflection 1
            Stem
            Suffix (also called ending)
        Inflection 2
            Stem
            Suffix
    Lexeme 2
        Lemma
        Inflection 1
            Stem
            Suffix
 */

/**
 * Represents an inflection of a word
 */
class Inflection {
    /**
     * Initializes an Inflection object.
     * @param {string} stem - A stem of a word.
     * @param {string} language - A word's language.
     */
  constructor (stem, language) {
    if (!stem) {
      throw new Error('Stem should not be empty.')
    }

    if (!language) {
      throw new Error('Langauge should not be empty.')
    }

    if (!LanguageModelFactory.supportsLanguage(language)) {
      throw new Error(`language ${language} not supported.`)
    }

    this.stem = stem;
    this.language = language;

    // Suffix may not be present in every word. If missing, it will set to null.
    this.suffix = null;

    // Prefix may not be present in every word. If missing, it will set to null.
    this.prefix = null;

    // Example may not be provided
    this.example = null;
  }

  static readObject (jsonObject) {
    let inflection = new Inflection(jsonObject.stem, jsonObject.language);
    if (jsonObject.suffix) {
      inflection.suffix = jsonObject.suffix;
    }
    if (jsonObject.prefix) {
      inflection.prefix = jsonObject.prefix;
    }
    if (jsonObject.example) {
      inflection.example = jsonObject.example;
    }
    return inflection
  }

    /**
     * Sets a grammatical feature in an inflection. Some features can have multiple values, In this case
     * an array of Feature objects will be provided.
     * Values are taken from features and stored in a 'feature.type' property as an array of values.
     * @param {Feature | Feature[]} data
     */
  set feature (data) {
    if (!data) {
      throw new Error('Inflection feature data cannot be empty.')
    }
    if (!Array.isArray(data)) {
      data = [data];
    }

    let type = data[0].type;
    this[type] = [];
    for (let element of data) {
      if (!(element instanceof Feature)) {
        throw new Error('Inflection feature data must be a Feature object.')
      }

      if (element.language !== this.language) {
        throw new Error('Language "' + element.language + '" of a feature does not match a language "' +
                this.language + '" of an Inflection object.')
      }

      this[type].push(element.value);
    }
  }
}

/**
 * A basic unit of lexical meaning. Contains a primary Lemma object, one or more Inflection objects
 * and optional alternate Lemmas
 */
class Lexeme {
    /**
     * Initializes a Lexeme object.
     * @param {Lemma} lemma - A lemma object.
     * @param {Inflection[]} inflections - An array of inflections.
     * @param {Definition} meaning - a short definition
     */
  constructor (lemma, inflections, meaning = null) {
    if (!lemma) {
      throw new Error('Lemma should not be empty.')
    }

    if (!(lemma instanceof Lemma)) {
      throw new Error('Lemma should be of Lemma object type.')
    }

    if (!inflections) {
      throw new Error('Inflections data should not be empty.')
    }

    if (!Array.isArray(inflections)) {
      throw new Error('Inflection data should be provided in an array.')
    }

    for (let inflection of inflections) {
      if (!(inflection instanceof Inflection)) {
        throw new Error('All inflection data should be of Inflection object type.')
      }
    }

    this.lemma = lemma;
    this.inflections = inflections;
    this.meaning = meaning;
  }

  static readObject (jsonObject) {
    let lemma = Lemma.readObject(jsonObject.lemma);
    let inflections = [];
    for (let inflection of jsonObject.inflections) {
      inflections.push(Inflection.readObject(inflection));
    }
    return new Lexeme(lemma, inflections)
  }
}

class Homonym {
    /**
     * Initializes a Homonym object.
     * @param {Lexeme[]} lexemes - An array of Lexeme objects.
     * @param {string} form - the form which produces the homonyms
     */
  constructor (lexemes, form) {
    if (!lexemes) {
      throw new Error('Lexemes data should not be empty.')
    }

    if (!Array.isArray(lexemes)) {
      throw new Error('Lexeme data should be provided in an array.')
    }

    for (let lexeme of lexemes) {
      if (!(lexeme instanceof Lexeme)) {
        throw new Error('All lexeme data should be of Lexeme object type.')
      }
    }

    this.lexemes = lexemes;
    this.targetWord = form;
  }

  static readObject (jsonObject) {
    let lexemes = [];
    if (jsonObject.lexemes) {
      for (let lexeme of jsonObject.lexemes) {
        lexemes.push(Lexeme.readObject(lexeme));
      }
    }
    let homonym = new Homonym(lexemes);
    if (jsonObject.targetWord) {
      homonym.targetWord = jsonObject.targetWord;
    }
    return homonym
  }

    /**
     * Returns language of a homonym.
     * Homonym does not have a language property, only lemmas and inflections do. We assume that all lemmas
     * and inflections within the same homonym will have the same language, and we can determine a language
     * by using language property of the first lemma. We chan change this logic in the future if we'll need to.
     * @returns {string} A language code, as defined in the `languages` object.
     */
  get language () {
    if (this.lexemes && this.lexemes[0] && this.lexemes[0].lemma && this.lexemes[0].lemma.language) {
      return this.lexemes[0].lemma.language
    } else {
      throw new Error('Homonym has not been initialized properly. Unable to obtain language information.')
    }
  }
}

/**
 * An abstraction of an Alpheios resource provider
 */
class ResourceProvider {
  /**
   * @constructor
   * @param {string} uri - a unique resource identifier for this provider
   * @param {string} rights - rights text
   * @param {Map} rightsTranslations - optional map of translated rights text - keys should be language of text, values the text
   */
  constructor (uri = '', rights = '', rightsTranslations = new Map([['default', rights]])) {
    this.uri = uri;
    this.rights = rightsTranslations;
    if (!this.rights.has('default')) {
      this.rights.set('default', rights);
    }
  }

  /**
   * @return a string representation of the resource provider, in the default language
   */
  toString () {
    return this.rights.get('default')
  }

  /**
   * Produce a string representation of the resource provider, in the requested locale if available
   * @param {string} languageCode
   * @return a string representation of the resource provider, in the requested locale if available
   */
  toLocaleString (languageCode) {
    return this.rights.get(languageCode) || this.rights.get('default')
  }

  static getProxy (provider = null, target = {}) {
    return new Proxy(target, {
      get: function (target, name) {
        return name === 'provider' ? provider : target[name]
      }
    })
  }
}

/*
Objects of a morphology analyzer's library
 */
/**
 * Holds all information required to transform from morphological analyzer's grammatical feature values to the
 * library standards. There is one ImportData object per language.
 */
class ImportData {
    /**
     * Creates an InmportData object for the language provided.
     * @param {Models.LanguageModel} language - A language of the import data.
     */
  constructor (language, engine) {
    'use strict';
    this.language = language;
    this.engine = engine;
    // add all the features that the language supports so that we
    // can return the default values if we don't need to import a mapping
    for (let featureName of Object.keys(language.features)) {
      this.addFeature(featureName);
    }
    // may be overridden by specific engine use via setLemmaParser
    this.parseLemma = function (lemma) { return new Lemma(lemma, this.language.toCode()) };
  }

    /**
     * Adds a grammatical feature whose values to be mapped.
     * @param {string} featureName - A name of a grammatical feature (i.e. declension, number, etc.)
     * @return {Object} An object that represent a newly created grammatical feature.
     */
  addFeature (featureName) {
    this[featureName] = {};
    let language = this.language;

    this[featureName].add = function add (providerValue, alpheiosValue) {
      'use strict';
      this[providerValue] = alpheiosValue;
      return this
    };

    this[featureName].get = function get (providerValue) {
      'use strict';
      if (!this.importer.has(providerValue)) {
        // if the providerValue matches the model value return that
        if (language.features[featureName][providerValue]) {
          return language.features[featureName][providerValue]
        } else {
          throw new Error("Skipping an unknown value '" +
                    providerValue + "' of a grammatical feature '" + featureName + "' of " + language + ' language.')
        }
      } else {
        return this.importer.get(providerValue)
      }
    };

    this[featureName].importer = new FeatureImporter();

    return this[featureName]
  }

  /**
   * Add an engine-specific lemma parser
   */
  setLemmaParser (callback) {
    this.parseLemma = callback;
  }
}

let data = new ImportData(new LatinLanguageModel(), 'whitakerLat');
let types = Feature.types;

/*
Below are value conversion maps for each grammatical feature to be parsed.
Format:
data.addFeature(typeName).add(providerValueName, LibValueName);
(functions are chainable)
Types and values that are unknown (undefined) will be skipped during parsing.
 */

 // TODO  - per inflections.xsd
 // Whitakers Words uses packon and tackon in POFS, not sure how

data.addFeature(Feature.types.gender).importer
    .map('common',
  [ data.language.features[types.gender][constants.GEND_MASCULINE],
    data.language.features[types.gender][constants.GEND_FEMININE]
  ])
    .map('all',
  [ data.language.features[types.gender][constants.GEND_MASCULINE],
    data.language.features[types.gender][constants.GEND_FEMININE],
    data.language.features[types.gender][constants.GEND_NEUTER]
  ]);

data.addFeature(Feature.types.tense).importer
    .map('future_perfect', data.language.features[types.tense][constants.TENSE_FUTURE_PERFECT]);

data.setLemmaParser(function (lemma) {
  // Whitaker's Words returns principal parts for some words
  // and sometimes has a space separted stem and suffix
  let parsed, primary;
  let parts = [];
  let lemmas = lemma.split(', ');
  for (let [index, l] of lemmas.entries()) {
    let normalized = l.split(' ')[0];
    if (index === 0) {
      primary = normalized;
    }
    parts.push(normalized);
  }
  if (primary) {
    parsed = new Lemma(primary, this.language.toCode(), parts);
  }

  return parsed
});

let data$1 = new ImportData(new GreekLanguageModel(), 'morpheusgrc');
let types$1 = Feature.types;

/*
Below are value conversion maps for each grammatical feature to be parsed.
Format:
data.addFeature(typeName).add(providerValueName, LibValueName);
(functions are chainable)
Types and values that are unknown (undefined) will be skipped during parsing.
 */

data$1.addFeature(Feature.types.gender).importer
    .map('masculine feminine',
  [ data$1.language.features[types$1.gender][constants.GEND_MASCULINE],
    data$1.language.features[types$1.gender][constants.GEND_FEMININE]
  ]);

data$1.addFeature(Feature.types.declension).importer
    .map('1st & 2nd',
  [ data$1.language.features[types$1.declension][constants.ORD_1ST],
    data$1.language.features[types$1.declension][constants.ORD_2ND]
  ]);

let data$2 = new ImportData(new ArabicLanguageModel(), 'aramorph');
let types$2 = Feature.types;

data$2.addFeature(Feature.types.part).importer
    .map('proper noun', [data$2.language.features[types$2.part][constants.POFS_NOUN]]);

var Cupidinibus = "{\n  \"RDF\": {\n    \"Annotation\": {\n      \"about\": \"urn:TuftsMorphologyService:cupidinibus:whitakerLat\",\n      \"creator\": {\n        \"Agent\": {\n          \"about\": \"net.alpheios:tools:wordsxml.v1\"\n        }\n      },\n      \"created\": {\n        \"$\": \"2017-08-10T23:15:29.185581\"\n      },\n      \"hasTarget\": {\n        \"Description\": {\n          \"about\": \"urn:word:cupidinibus\"\n        }\n      },\n      \"title\": {},\n      \"hasBody\": [\n        {\n          \"resource\": \"urn:uuid:idm140578094883136\"\n        },\n        {\n          \"resource\": \"urn:uuid:idm140578158026160\"\n        }\n      ],\n      \"Body\": [\n        {\n          \"about\": \"urn:uuid:idm140578094883136\",\n          \"type\": {\n            \"resource\": \"cnt:ContentAsXML\"\n          },\n          \"rest\": {\n            \"entry\": {\n              \"infl\": [\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 2,\n                    \"$\": \"locative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"masculine\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 5,\n                    \"$\": \"dative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"masculine\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"masculine\"\n                  }\n                }\n              ],\n              \"dict\": {\n                \"hdwd\": {\n                  \"lang\": \"lat\",\n                  \"$\": \"Cupido, Cupidinis\"\n                },\n                \"pofs\": {\n                  \"order\": 5,\n                  \"$\": \"noun\"\n                },\n                \"decl\": {\n                  \"$\": \"3rd\"\n                },\n                \"gend\": {\n                  \"$\": \"masculine\"\n                },\n                \"area\": {\n                  \"$\": \"religion\"\n                },\n                \"freq\": {\n                  \"order\": 4,\n                  \"$\": \"common\"\n                },\n                \"src\": {\n                  \"$\": \"Ox.Lat.Dict.\"\n                }\n              },\n              \"mean\": {\n                \"$\": \"Cupid, son of Venus; personification of carnal desire;\"\n              }\n            }\n          }\n        },\n        {\n          \"about\": \"urn:uuid:idm140578158026160\",\n          \"type\": {\n            \"resource\": \"cnt:ContentAsXML\"\n          },\n          \"rest\": {\n            \"entry\": {\n              \"infl\": [\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 2,\n                    \"$\": \"locative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"common\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 5,\n                    \"$\": \"dative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"common\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"cupidin\"\n                    },\n                    \"suff\": {\n                      \"$\": \"ibus\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 5,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"var\": {\n                    \"$\": \"1st\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"num\": {\n                    \"$\": \"plural\"\n                  },\n                  \"gend\": {\n                    \"$\": \"common\"\n                  }\n                }\n              ],\n              \"dict\": {\n                \"hdwd\": {\n                  \"lang\": \"lat\",\n                  \"$\": \"cupido, cupidinis\"\n                },\n                \"pofs\": {\n                  \"order\": 5,\n                  \"$\": \"noun\"\n                },\n                \"decl\": {\n                  \"$\": \"3rd\"\n                },\n                \"gend\": {\n                  \"$\": \"common\"\n                },\n                \"freq\": {\n                  \"order\": 5,\n                  \"$\": \"frequent\"\n                },\n                \"src\": {\n                  \"$\": \"Ox.Lat.Dict.\"\n                }\n              },\n              \"mean\": {\n                \"$\": \"desire/love/wish/longing (passionate); lust; greed, appetite; desire for gain;\"\n              }\n            }\n          }\n        }\n      ]\n    }\n  }\n}\n";

var Mare = "{\n  \"RDF\": {\n    \"Annotation\": {\n      \"about\": \"urn:TuftsMorphologyService:mare:morpheuslat\",\n      \"creator\": {\n        \"Agent\": {\n          \"about\": \"org.perseus:tools:morpheus.v1\"\n        }\n      },\n      \"created\": {\n        \"$\": \"2017-09-08T06:59:48.639180\"\n      },\n      \"hasTarget\": {\n        \"Description\": {\n          \"about\": \"urn:word:mare\"\n        }\n      },\n      \"title\": {},\n      \"hasBody\": [\n        {\n          \"resource\": \"urn:uuid:idm140446402389888\"\n        },\n        {\n          \"resource\": \"urn:uuid:idm140446402332400\"\n        },\n        {\n          \"resource\": \"urn:uuid:idm140446402303648\"\n        }\n      ],\n      \"Body\": [\n        {\n          \"about\": \"urn:uuid:idm140446402389888\",\n          \"type\": {\n            \"resource\": \"cnt:ContentAsXML\"\n          },\n          \"rest\": {\n            \"entry\": {\n              \"uri\": \"http://data.perseus.org/collections/urn:cite:perseus:latlexent.lex34070.1\",\n              \"dict\": {\n                \"hdwd\": {\n                  \"lang\": \"lat\",\n                  \"$\": \"mare\"\n                },\n                \"pofs\": {\n                  \"order\": 3,\n                  \"$\": \"noun\"\n                },\n                \"decl\": {\n                  \"$\": \"3rd\"\n                },\n                \"gend\": {\n                  \"$\": \"neuter\"\n                }\n              },\n              \"infl\": [\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mar\"\n                    },\n                    \"suff\": {\n                      \"$\": \"e\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 3,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"neuter\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"is_is\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mar\"\n                    },\n                    \"suff\": {\n                      \"$\": \"e\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 3,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 7,\n                    \"$\": \"nominative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"neuter\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"is_is\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mar\"\n                    },\n                    \"suff\": {\n                      \"$\": \"e\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 3,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 1,\n                    \"$\": \"vocative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"neuter\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"is_is\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mar\"\n                    },\n                    \"suff\": {\n                      \"$\": \"e\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 3,\n                    \"$\": \"noun\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 4,\n                    \"$\": \"accusative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"neuter\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"is_is\"\n                  }\n                }\n              ],\n              \"mean\": {\n                \"$\": \"the sea\"\n              }\n            }\n          }\n        },\n        {\n          \"about\": \"urn:uuid:idm140446402332400\",\n          \"type\": {\n            \"resource\": \"cnt:ContentAsXML\"\n          },\n          \"rest\": {\n            \"entry\": {\n              \"uri\": \"http://data.perseus.org/collections/urn:cite:perseus:latlexent.lex34118.1\",\n              \"dict\": {\n                \"hdwd\": {\n                  \"lang\": \"lat\",\n                  \"$\": \"marum\"\n                },\n                \"pofs\": {\n                  \"order\": 3,\n                  \"$\": \"noun\"\n                },\n                \"decl\": {\n                  \"$\": \"2nd\"\n                },\n                \"gend\": {\n                  \"$\": \"neuter\"\n                }\n              },\n              \"infl\": {\n                \"term\": {\n                  \"lang\": \"lat\",\n                  \"stem\": {\n                    \"$\": \"mar\"\n                  },\n                  \"suff\": {\n                    \"$\": \"e\"\n                  }\n                },\n                \"pofs\": {\n                  \"order\": 3,\n                  \"$\": \"noun\"\n                },\n                \"decl\": {\n                  \"$\": \"2nd\"\n                },\n                \"case\": {\n                  \"order\": 1,\n                  \"$\": \"vocative\"\n                },\n                \"gend\": {\n                  \"$\": \"neuter\"\n                },\n                \"num\": {\n                  \"$\": \"singular\"\n                },\n                \"stemtype\": {\n                  \"$\": \"us_i\"\n                }\n              }\n            }\n          }\n        },\n        {\n          \"about\": \"urn:uuid:idm140446402303648\",\n          \"type\": {\n            \"resource\": \"cnt:ContentAsXML\"\n          },\n          \"rest\": {\n            \"entry\": {\n              \"uri\": \"http://data.perseus.org/collections/urn:cite:perseus:latlexent.lex34119.1\",\n              \"dict\": {\n                \"hdwd\": {\n                  \"lang\": \"lat\",\n                  \"$\": \"mas\"\n                },\n                \"pofs\": {\n                  \"order\": 2,\n                  \"$\": \"adjective\"\n                },\n                \"decl\": {\n                  \"$\": \"3rd\"\n                }\n              },\n              \"infl\": [\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mare\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 2,\n                    \"$\": \"adjective\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"masculine\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"irreg_adj3\"\n                  },\n                  \"morph\": {\n                    \"$\": \"indeclform\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mare\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 2,\n                    \"$\": \"adjective\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"feminine\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"irreg_adj3\"\n                  },\n                  \"morph\": {\n                    \"$\": \"indeclform\"\n                  }\n                },\n                {\n                  \"term\": {\n                    \"lang\": \"lat\",\n                    \"stem\": {\n                      \"$\": \"mare\"\n                    }\n                  },\n                  \"pofs\": {\n                    \"order\": 2,\n                    \"$\": \"adjective\"\n                  },\n                  \"decl\": {\n                    \"$\": \"3rd\"\n                  },\n                  \"case\": {\n                    \"order\": 3,\n                    \"$\": \"ablative\"\n                  },\n                  \"gend\": {\n                    \"$\": \"neuter\"\n                  },\n                  \"num\": {\n                    \"$\": \"singular\"\n                  },\n                  \"stemtype\": {\n                    \"$\": \"irreg_adj3\"\n                  },\n                  \"morph\": {\n                    \"$\": \"indeclform\"\n                  }\n                }\n              ]\n            }\n          }\n        }\n      ]\n    }\n  }\n}\n";

var Cepit = "{\n  \"RDF\": {\n    \"Annotation\": {\n      \"about\": \"urn:TuftsMorphologyService:cepit:whitakerLat\",\n      \"creator\": {\n        \"Agent\": {\n          \"about\": \"net.alpheios:tools:wordsxml.v1\"\n        }\n      },\n      \"created\": {\n        \"$\": \"2017-08-10T23:16:53.672068\"\n      },\n      \"hasTarget\": {\n        \"Description\": {\n          \"about\": \"urn:word:cepit\"\n        }\n      },\n      \"title\": {},\n      \"hasBody\": {\n        \"resource\": \"urn:uuid:idm140578133848416\"\n      },\n      \"Body\": {\n        \"about\": \"urn:uuid:idm140578133848416\",\n        \"type\": {\n          \"resource\": \"cnt:ContentAsXML\"\n        },\n        \"rest\": {\n          \"entry\": {\n            \"infl\": {\n              \"term\": {\n                \"lang\": \"lat\",\n                \"stem\": {\n                  \"$\": \"cep\"\n                },\n                \"suff\": {\n                  \"$\": \"it\"\n                }\n              },\n              \"pofs\": {\n                \"order\": 3,\n                \"$\": \"verb\"\n              },\n              \"conj\": {\n                \"$\": \"3rd\"\n              },\n              \"var\": {\n                \"$\": \"1st\"\n              },\n              \"tense\": {\n                \"$\": \"perfect\"\n              },\n              \"voice\": {\n                \"$\": \"active\"\n              },\n              \"mood\": {\n                \"$\": \"indicative\"\n              },\n              \"pers\": {\n                \"$\": \"3rd\"\n              },\n              \"num\": {\n                \"$\": \"singular\"\n              }\n            },\n            \"dict\": {\n              \"hdwd\": {\n                \"lang\": \"lat\",\n                \"$\": \"capio, capere, cepi, captus\"\n              },\n              \"pofs\": {\n                \"order\": 3,\n                \"$\": \"verb\"\n              },\n              \"conj\": {\n                \"$\": \"3rd\"\n              },\n              \"kind\": {\n                \"$\": \"transitive\"\n              },\n              \"freq\": {\n                \"order\": 6,\n                \"$\": \"very frequent\"\n              },\n              \"src\": {\n                \"$\": \"Ox.Lat.Dict.\"\n              }\n            },\n            \"mean\": {\n              \"$\": \"take hold, seize; grasp; take bribe; arrest/capture; put on; occupy; captivate;\"\n            }\n          }\n        }\n      }\n    }\n  }\n}\n";

var Pilsopo = "{\n  \"RDF\": {\n    \"Annotation\": {\n      \"about\": \"urn:TuftsMorphologyService:φιλόσοφος:morpheuslat\",\n      \"creator\": {\n        \"Agent\": {\n          \"about\": \"org.perseus:tools:morpheus.v1\"\n        }\n      },\n      \"created\": {\n        \"$\": \"2017-10-15T14:06:40.522369\"\n      },\n      \"hasTarget\": {\n        \"Description\": {\n          \"about\": \"urn:word:φιλόσοφος\"\n        }\n      },\n      \"title\": {},\n      \"hasBody\": {\n        \"resource\": \"urn:uuid:idm140446394225264\"\n      },\n      \"Body\": {\n        \"about\": \"urn:uuid:idm140446394225264\",\n        \"type\": {\n          \"resource\": \"cnt:ContentAsXML\"\n        },\n        \"rest\": {\n          \"entry\": {\n            \"uri\": \"http://data.perseus.org/collections/urn:cite:perseus:grclexent.lex78378.1\",\n            \"dict\": {\n              \"hdwd\": {\n                \"lang\": \"grc\",\n                \"$\": \"φιλόσοφος\"\n              },\n              \"pofs\": {\n                \"order\": 3,\n                \"$\": \"noun\"\n              },\n              \"decl\": {\n                \"$\": \"2nd\"\n              },\n              \"gend\": {\n                \"$\": \"masculine\"\n              }\n            },\n            \"infl\": {\n              \"term\": {\n                \"lang\": \"grc\",\n                \"stem\": {\n                  \"$\": \"φιλοσοφ\"\n                },\n                \"suff\": {\n                  \"$\": \"ος\"\n                }\n              },\n              \"pofs\": {\n                \"order\": 3,\n                \"$\": \"noun\"\n              },\n              \"decl\": {\n                \"$\": \"2nd\"\n              },\n              \"case\": {\n                \"order\": 7,\n                \"$\": \"nominative\"\n              },\n              \"gend\": {\n                \"$\": \"masculine\"\n              },\n              \"num\": {\n                \"$\": \"singular\"\n              },\n              \"stemtype\": {\n                \"$\": \"os_ou\"\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}";

class WordTestData {
  constructor () {
    this._words = {
      'cupidinibus': Cupidinibus,
      'mare': Mare,
      'cepit': Cepit,
      'φιλόσοφος': Pilsopo
    };
  }

  get (word) {
    if (this._words.hasOwnProperty(word)) {
      return this._words[word]
    }
    throw new Error(`Word "${word}" does not exist in test data`)
  }
}

var DefaultConfig = "{\n  \"engine\": {\n    \"lat\": [\"whitakerLat\"],\n    \"grc\": [\"morpheusgrc\"],\n    \"ara\": [\"aramorph\"]\n  },\n  \"url\": \"http://morph.alpheios.net/api/v1/analysis/word?word=r_WORD&engine=r_ENGINE&lang=r_LANG\"\n}\n";

class TuftsAdapter extends BaseAdapter {
  /**
   * A Morph Client Adapter for the Tufts Morphology Service
   * @constructor
   * @param {object} engine an object which maps language code to desired engine code
                            for that language. E.g. { lat : whitakerLat, grc: morpheusgrc }
   */
  constructor (config = null) {
    super();
    if (config == null) {
      try {
        this.config = JSON.parse(DefaultConfig);
      } catch (e) {
        this.config = DefaultConfig;
      }
    } else {
      this.config = config;
    }
    this.engineMap = new Map(([ data, data$1, data$2 ]).map((e) => { return [ e.engine, e ] }));
  }

  getEngineLanguageMap (lang) {
    return this.engineMap.get(this.config.engine[lang])
  }

  prepareRequestUrl (lang, word) {
    let engine = this.getEngineLanguageMap(lang).engine;
    let url = this.config.url.replace('r_WORD', word).replace('r_ENGINE', engine).replace('r_LANG', lang);
    return url
  }

  fetchTestData (lang, word) {
    return new Promise((resolve, reject) => {
      try {
        let wordData = new WordTestData().get(word);
        let json = JSON.parse(wordData);
        resolve(json);
      } catch (error) {
                // Word is not found in test data
        reject(error);
      }
    })
  }

  /**
   * A function that maps a morphological service's specific data types and values into an inflection library standard.
   * @param {object} jsonObj - A JSON data from a Morphological Analyzer.
   * @param {object} targetWord - the target of the analysis
   * @returns {Homonym} A library standard Homonym object.
   */
  transform (jsonObj, targetWord) {
    'use strict';
    let lexemes = [];
    let annotationBody = jsonObj.RDF.Annotation.Body;
    if (!Array.isArray(annotationBody)) {
            /*
            If only one lexeme is returned, Annotation Body will not be an array but rather a single object.
            Let's convert it to an array so we can work with it in the same way no matter what format it is.
             */
      annotationBody = [annotationBody];
    }
    let provider;
    for (let lexeme of annotationBody) {
            // Get importer based on the language
      let language = lexeme.rest.entry.dict.hdwd.lang;
      let mappingData = this.getEngineLanguageMap(language);
      let lemma = mappingData.parseLemma(lexeme.rest.entry.dict.hdwd.$, language);
      if (!provider) {
        let providerUri = jsonObj.RDF.Annotation.about;
        let providerRights = '';
        if (jsonObj.RDF.Annotation.rights) {
          providerRights = jsonObj.RDF.Annotation.rights.$;
        }
        provider = new ResourceProvider(providerUri, providerRights);
      }
      let meaning = lexeme.rest.entry.mean;
      let shortdef;
      if (meaning) {
        let lang = meaning.lang ? meaning.lang : 'eng';
        shortdef = new Definition(meaning.$, lang, 'text/plain');
      }
      let inflections = [];
      let inflectionsJSON = lexeme.rest.entry.infl;
      if (!Array.isArray(inflectionsJSON)) {
                // If only one inflection returned, it is a single object, not an array of objects. Convert it to an array for uniformity.
        inflectionsJSON = [inflectionsJSON];
      }
      for (let inflectionJSON of inflectionsJSON) {
        let inflection = new Inflection(inflectionJSON.term.stem.$, mappingData.language.toCode());
        if (inflectionJSON.term.suff) {
                    // Set suffix if provided by a morphological analyzer
          inflection.suffix = inflectionJSON.term.suff.$;
        }

        if (inflectionJSON.xmpl) {
          inflection.example = inflectionJSON.xmpl.$;
        }
                // Parse whatever grammatical features we're interested in
        if (inflectionJSON.pofs) {
          inflection.feature = mappingData[Feature.types.part].get(inflectionJSON.pofs.$);
        }

        if (inflectionJSON.case) {
          inflection.feature = mappingData[Feature.types.grmCase].get(inflectionJSON.case.$);
        }

        if (inflectionJSON.decl) {
          inflection.feature = mappingData[Feature.types.declension].get(inflectionJSON.decl.$);
        }

        if (inflectionJSON.num) {
          inflection.feature = mappingData[Feature.types.number].get(inflectionJSON.num.$);
        }

        if (inflectionJSON.gend) {
          inflection.feature = mappingData[Feature.types.gender].get(inflectionJSON.gend.$);
        }

        if (inflectionJSON.conj) {
          inflection.feature = mappingData[Feature.types.conjugation].get(inflectionJSON.conj.$);
        }

        if (inflectionJSON.tense) {
          inflection.feature = mappingData[Feature.types.tense].get(inflectionJSON.tense.$);
        }

        if (inflectionJSON.voice) {
          inflection.feature = mappingData[Feature.types.voice].get(inflectionJSON.voice.$);
        }

        if (inflectionJSON.mood) {
          inflection.feature = mappingData[Feature.types.mood].get(inflectionJSON.mood.$);
        }

        if (inflectionJSON.pers) {
          inflection.feature = mappingData[Feature.types.person].get(inflectionJSON.pers.$);
        }

        inflections.push(inflection);
      }

      let lexmodel = new Lexeme(lemma, inflections, shortdef);
      let providedLexeme = ResourceProvider.getProxy(provider, lexmodel);
      lexemes.push(providedLexeme);
    }
    return new Homonym(lexemes, targetWord)
  }

  async getHomonym (lang, word) {
    let jsonObj = await this.fetch(lang, word);
    if (jsonObj) {
      let homonym = this.transform(jsonObj, word);
      return homonym
    } else {
        // No data found for this word
      return undefined
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (TuftsAdapter);
//# sourceMappingURL=alpheios-tufts-adapter.js.map


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(15);
var bytesToUuid = __webpack_require__(16);

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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__request_message__ = __webpack_require__(3);



class ActivationRequest extends __WEBPACK_IMPORTED_MODULE_1__request_message__["a" /* default */] {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].types.ACTIVATION_REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActivationRequest;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__request_message__ = __webpack_require__(3);



class DeactivationRequest extends __WEBPACK_IMPORTED_MODULE_1__request_message__["a" /* default */] {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].types.DEACTIVATION_REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DeactivationRequest;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__response_message__ = __webpack_require__(2);



class WordDataResponse extends __WEBPACK_IMPORTED_MODULE_1__response_message__["a" /* default */] {
  constructor (request, wordData, status) {
    super(request, wordData, status)
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].types.WORD_DATA_RESPONSE)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WordDataResponse;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_messaging_service__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_messaging_request_word_data_request__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_messaging_response_status_response__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__panel__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_options__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__lib_state__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__templates_symbols_htmlf__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__templates_symbols_htmlf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__templates_symbols_htmlf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__templates_page_controls_htmlf__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__templates_page_controls_htmlf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__templates_page_controls_htmlf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__templates_panel_htmlf__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__templates_panel_htmlf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__templates_panel_htmlf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__templates_options_htmlf__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__templates_options_htmlf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__templates_options_htmlf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__lib_selection_media_html_selector__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_vue_dist_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_vue_dist_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_vue_dist_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_vue_js_modal__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_vue_js_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_vue_js_modal__);
/* global browser */













 // Vue in a runtime + compiler configuration

// import Popup from './vue-components/popup.vue' TODO: This does not work - why?

class ContentProcess {
  constructor () {
    this.status = ContentProcess.statuses.PENDING
    this.settings = ContentProcess.settingValues
    this.options = new __WEBPACK_IMPORTED_MODULE_6__lib_options__["a" /* default */]()
    this.vueInstance = undefined

    this.modal = undefined

    this.messagingService = new __WEBPACK_IMPORTED_MODULE_2__lib_messaging_service__["a" /* default */]()
  }

  static get settingValues () {
    return {
      hiddenClassName: 'hidden',
      pageControlSel: '#alpheios-panel-toggle',
      requestTimeout: 4000,
      uiTypePanel: 'panel',
      uiTypePopup: 'popup'
    }
  }

  static get statuses () {
    return {
      PENDING: Symbol.for('Pending'), // Content script has not been fully initialized yet
      ACTIVE: Symbol.for('Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Deactivated') // Content script has been loaded, but is deactivated
    }
  }

  /**
   * Loads any asynchronous data that there might be.
   * @return {Promise}
   */
  async loadData () {
    return this.options.loadStoredData()
  }

  createVueInstance (components) {
    // Register a modal plugin
    __WEBPACK_IMPORTED_MODULE_13_vue_dist_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_14_vue_js_modal___default.a, {
      dialog: false
    })

    let options = {
      el: '#popup',
      // template: '<app/>',
      components: components,
      data: {
        popupTitle: '',
        popupContent: '',
        panel: undefined
      },
      mounted: function () {
        console.log('Root instance is mounted')
      }
    }

    this.vueInstance = new __WEBPACK_IMPORTED_MODULE_13_vue_dist_vue___default.a(options)
    this.modal = this.vueInstance.$modal
  }

  get isActive () {
    return this.status === ContentProcess.statuses.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.panel.close()
    this.pageControl.classList.add(this.settings.hiddenClassName)
    this.status = ContentProcess.statuses.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.pageControl.classList.remove(this.settings.hiddenClassName)
    this.status = ContentProcess.statuses.ACTIVE
  }

  async initialize () {
    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    ContentProcess.loadPanel()
    ContentProcess.loadPageControls()
    ContentProcess.loadSymbols()

    this.panel = new __WEBPACK_IMPORTED_MODULE_5__panel__["a" /* default */](this.options)
    this.panelToggleBtn = document.querySelector('#alpheios-panel-toggle')
    this.renderOptions()

    this.pageControl = document.querySelector(this.settings.pageControlSel)

    // Add a message listener
    this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].types.STATUS_REQUEST, this.handleStatusRequest, this)
    this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].types.ACTIVATION_REQUEST, this.handleActivationRequest, this)
    this.messagingService.addHandler(__WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].types.DEACTIVATION_REQUEST, this.handleDeactivationRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    this.panelToggleBtn.addEventListener('click', this.togglePanel.bind(this))
    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
  }

  static loadSymbols () {
    ContentProcess.loadHTMLFragment(__WEBPACK_IMPORTED_MODULE_8__templates_symbols_htmlf___default.a)
  }

  static loadPageControls () {
    ContentProcess.loadHTMLFragment(__WEBPACK_IMPORTED_MODULE_9__templates_page_controls_htmlf___default.a)
  }

  static loadPanel () {
    ContentProcess.loadHTMLFragment(__WEBPACK_IMPORTED_MODULE_10__templates_panel_htmlf___default.a)
  }

  static loadHTMLFragment (html) {
    let container = document.createElement('div')
    container.innerHTML = html
    document.body.insertBefore(container.firstChild, document.body.firstChild)
  }

  showMessage (messageHTML) {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.clear()
      this.panel.definitionContainer.innerHTML = messageHTML
      this.panel.open().changeActiveTabTo(this.panel.tabs[0])
    } else {
      this.vueInstance.panel = this.panel
      this.vueInstance.popupTitle = ''
      this.vueInstance.popupContent = messageHTML
      this.vueInstance.$modal.show('popup')
    }
  }

  async sendRequestToBgStatefully (request, timeout, state = undefined) {
    try {
      let result = await this.messagingService.sendRequestToBg(request, timeout)
      return __WEBPACK_IMPORTED_MODULE_7__lib_state__["a" /* default */].value(state, result)
    } catch (error) {
      // Wrap error te same way we wrap value
      console.log(`Statefull request to a background failed: ${error}`)
      throw __WEBPACK_IMPORTED_MODULE_7__lib_state__["a" /* default */].value(state, error)
    }
  }

  async getWordDataStatefully (textSelector, state = undefined) {
    try {
      let messageObject = await this.sendRequestToBgStatefully(
        new __WEBPACK_IMPORTED_MODULE_3__lib_messaging_request_word_data_request__["a" /* default */](textSelector),
        this.settings.requestTimeout,
        state
      )
      let message = messageObject.value

      if (__WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].statusSymIs(message, __WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].statuses.DATA_FOUND)) {
        let wordData = __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__["e" /* WordData */].readObject(message.body)
        console.log('Word data is: ', wordData)

        // Populate a panel
        this.panel.clear()
        this.updateDefinition(wordData)
        this.updateInflectionTable(wordData)

        // Pouplate a popup
        this.vueInstance.panel = this.panel
        this.vueInstance.popupTitle = `${wordData.homonym.targetWord}`
        this.vueInstance.popupContent = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum purus egestas libero ornare venenatis.
                Maecenas pharetra tortor eu tortor imperdiet, a faucibus quam finibus. Nulla id lacinia quam.
                Praesent imperdiet sed magna non finibus. Aenean blandit, mauris vitae lacinia rutrum,
                nunc mi scelerisque sem, in laoreet sem lectus ut orci. Ut egestas nulla in vehicula feugiat.
                Vivamus tincidunt nisi vel risus dictum suscipit. Nulla id blandit mi, vulputate aliquam enim.</p>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum purus egestas libero ornare venenatis.
                Maecenas pharetra tortor eu tortor imperdiet, a faucibus quam finibus. Nulla id lacinia quam.
                Praesent imperdiet sed magna non finibus. Aenean blandit, mauris vitae lacinia rutrum,
                nunc mi scelerisque sem, in laoreet sem lectus ut orci. Ut egestas nulla in vehicula feugiat.
                Vivamus tincidunt nisi vel risus dictum suscipit. Nulla id blandit mi, vulputate aliquam enim.</p>`

        if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
          this.panel.open()
        } else {
          this.vueInstance.$modal.show('popup')
        }
      } else if (__WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].statusSymIs(message, __WEBPACK_IMPORTED_MODULE_1__lib_messaging_message__["a" /* default */].statuses.NO_DATA_FOUND)) {
        this.showMessage('<p>Sorry, the word you requested was not found.</p>')
      }
      return messageObject
    } catch (error) {
      console.error(`Word data request failed: ${error.value}`)
      this.showMessage(`<p>Sorry, your word you requested failed:<br><strong>${error.value}</strong></p>`)
    }
  }

  handleStatusRequest (request, sender) {
    // Send a status response
    console.log(`Status request received. Sending a response back.`)
    this.messagingService.sendResponseToBg(new __WEBPACK_IMPORTED_MODULE_4__lib_messaging_response_status_response__["a" /* default */](request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleActivationRequest (request, sender) {
    // Send a status response
    console.log(`Activate request received. Sending a response back.`)
    if (!this.isActive) {
      this.reactivate()
    }
    this.messagingService.sendResponseToBg(new __WEBPACK_IMPORTED_MODULE_4__lib_messaging_response_status_response__["a" /* default */](request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleDeactivationRequest (request, sender) {
    // Send a status response
    console.log(`Deactivate request received. Sending a response back.`)
    if (this.isActive) {
      this.deactivate()
    }
    this.messagingService.sendResponseToBg(new __WEBPACK_IMPORTED_MODULE_4__lib_messaging_response_status_response__["a" /* default */](request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  togglePanel () {
    this.panel.toggle()
  }

  updateDefinition (wordData) {
    this.panel.definitionContainer.innerHTML = decodeURIComponent(wordData.definition)
  }

  updateInflectionTable (wordData) {
    this.presenter = new __WEBPACK_IMPORTED_MODULE_0_alpheios_inflection_tables__["d" /* Presenter */](this.panel.inflTableContainer, this.panel.viewSelectorContainer,
      this.panel.localeSwitcherContainer, wordData, this.options.items.locale.currentValue).render()
  }

  renderOptions () {
    this.panel.optionsPage = __WEBPACK_IMPORTED_MODULE_11__templates_options_htmlf___default.a
    let optionEntries = Object.entries(this.options.items)
    for (let [optionName, option] of optionEntries) {
      let localeSelector = this.panel.optionsPage.querySelector(option.inputSelector)
      for (let optionValue of option.values) {
        let optionElement = document.createElement('option')
        optionElement.value = optionValue.value
        optionElement.text = optionValue.text
        if (optionValue.value === option.currentValue) {
          optionElement.setAttribute('selected', 'selected')
        }
        localeSelector.appendChild(optionElement)
      }
      localeSelector.addEventListener('change', this.optionChangeListener.bind(this, optionName))
    }
  }

  optionChangeListener (option, event) {
    this.options.update(option, event.target.value)
    if (option === 'locale' && this.presenter) {
      this.presenter.setLocale(event.target.value)
    }
    if (option === 'panelPosition') {
      if (event.target.value === 'right') {
        this.panel.setPoistionToRight()
      } else {
        this.panel.setPoistionToLeft()
      }
    }
  }

  getSelectedText (event) {
    if (this.isActive) {
      let selection = __WEBPACK_IMPORTED_MODULE_12__lib_selection_media_html_selector__["a" /* default */].getSelector(event.target, 'grc')
      // HTMLSelector.getExtendedTextQuoteSelector()
      if (selection.selectedText) {
        this.getWordDataStatefully(selection)
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentProcess;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__request_message__ = __webpack_require__(3);



class WordDataRequest extends __WEBPACK_IMPORTED_MODULE_1__request_message__["a" /* default */] {
  constructor (textSelector) {
    super(textSelector)
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].types.WORD_DATA_REQUEST)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WordDataRequest;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__response_message__ = __webpack_require__(2);



class StatusResponse extends __WEBPACK_IMPORTED_MODULE_1__response_message__["a" /* default */] {
  /**
   * Status response initialization.
   * @param {RequestMessage} request - A request we're responding to.
   * @param {Message.statuses} status - A current status of a party requested.
   */
  constructor (request, status) {
    super(request, undefined, status)
    this.type = Symbol.keyFor(__WEBPACK_IMPORTED_MODULE_0__message__["a" /* default */].types.STATUS_RESPONSE)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StatusResponse;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Panel {
  constructor (options) {
    this.options = options

    this.pageBody = document.body
    this.body = document.querySelector('#alpheios-panel')
    this.definitionContainer = document.querySelector('#alpheios-panel-content-definition')
    this.inflTableContainer = document.querySelector('#alpheios-panel-content-infl-table-body')
    this.viewSelectorContainer = document.querySelector('#alpheios-panel-content-infl-table-view-selector')
    this.localeSwitcherContainer = document.querySelector('#alpheios-panel-content-infl-table-locale-switcher')
    this.optionsContainer = document.querySelector('#alpheios-panel-content-options')

    this.showOpenBtn = document.querySelector('#alpheios-panel-show-open')
    this.showFWBtn = document.querySelector('#alpheios-panel-show-fw')
    this.hideBtn = document.querySelector('#alpheios-panel-hide')

    this.tabs = document.querySelectorAll('#alpheios-panel__nav .alpheios-panel__nav-btn')
    this.activeTab = document.querySelector('#alpheios-panel__nav .alpheios-panel__nav-btn')
    this.activeClassName = 'active'

    this.panelOpenClassName = 'open'
    this.hiddenClassName = 'hidden'
    this.panelOpenFWClassName = 'open-fw'
    this.bodyOpenClassName = 'alpheios-panel-open'
    this.bodyPositionClassName = Panel.positions.left
    if (this.options.items.panelPosition.currentValue === 'right') {
      this.bodyPositionClassName = Panel.positions.right
    }

    this.isOpen = false
    this.isOpenFW = false

    this.pageBody.classList.add(this.bodyPositionClassName)

    this.showOpenBtn.addEventListener('click', this.open.bind(this))
    this.showFWBtn.addEventListener('click', this.openFullWidth.bind(this))
    this.hideBtn.addEventListener('click', this.close.bind(this))

    for (let tab of this.tabs) {
      let target = tab.dataset.target
      document.getElementById(target).classList.add(this.hiddenClassName)
      tab.addEventListener('click', this.switchTab.bind(this))
    }
    this.changeActiveTabTo(this.tabs[0])
  }

  static get positions () {
    return {
      left: 'alpheios-panel-left',
      right: 'alpheios-panel-right'
    }
  }

  setPoistionToLeft () {
    if (this.bodyPositionClassName !== Panel.positions.left) {
      this.pageBody.classList.replace(this.bodyPositionClassName, Panel.positions.left)
      this.bodyPositionClassName = Panel.positions.left
    }
  }

  setPoistionToRight () {
    if (this.bodyPositionClassName !== Panel.positions.right) {
      this.pageBody.classList.replace(this.bodyPositionClassName, Panel.positions.right)
      this.bodyPositionClassName = Panel.positions.right
    }
  }

  open () {
    if (this.isOpenFW) {
      this.body.classList.remove(this.panelOpenFWClassName)
      this.isOpenFW = false
    }
    if (!this.isOpen) {
      this.body.classList.add(this.panelOpenClassName)
      this.pageBody.classList.add(this.bodyOpenClassName)
      this.isOpen = true
    }
    this.showOpenBtn.classList.add(this.hiddenClassName)
    return this
  }

  openFullWidth () {
    if (this.isOpen) {
      this.body.classList.remove(this.panelOpenClassName)
      this.pageBody.classList.remove(this.bodyOpenClassName)
      this.isOpen = false
    }
    if (!this.isOpenFW) {
      this.body.classList.add(this.panelOpenFWClassName)
      this.isOpenFW = true
    }
    this.showOpenBtn.classList.remove(this.hiddenClassName)
    return this
  }

  close () {
    if (this.isOpen) {
      this.body.classList.remove(this.panelOpenClassName)
      this.pageBody.classList.remove(this.bodyOpenClassName)
      this.isOpen = false
    }
    if (this.isOpenFW) {
      this.body.classList.remove(this.panelOpenFWClassName)
      this.isOpenFW = false
    }
    return this
  }

  toggle () {
    if (this.isOpen || this.isOpenFW) {
      this.close()
    } else {
      this.open()
    }
    return this
  }

  clear () {
    this.definitionContainer.innerHTML = ''
    this.inflTableContainer.innerHTML = ''
    this.viewSelectorContainer.innerHTML = ''
    this.localeSwitcherContainer.innerHTML = ''
    return this
  }

  switchTab (event) {
    this.changeActiveTabTo(event.currentTarget)
    return this
  }

  changeActiveTabTo (activeTab) {
    if (this.activeTab) {
      let target = this.activeTab.dataset.target
      document.getElementById(target).classList.add(this.hiddenClassName)
      this.activeTab.classList.remove(this.activeClassName)
    }

    activeTab.classList.add(this.activeClassName)
    let target = activeTab.dataset.target
    document.getElementById(target).classList.remove(this.hiddenClassName)
    this.activeTab = activeTab
    return this
  }

  get optionsPage () {
    return this.optionsContainer
  }

  set optionsPage (htmlContent) {
    this.optionsContainer.innerHTML = htmlContent
    return this.optionsContainer.innerHTML
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Panel;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* global browser */

class Options {
  constructor () {
    this._values = Options.defaults
    for (let key in this._values) {
      if (this._values.hasOwnProperty(key)) {
        /*
        Initialize current values with defaults. Actual values will be set after options are loaded from a
        local storage.
         */
        if (!this._values[key].currentValue) {
          this._values[key].currentValue = this._values[key].defaultValue
        }
      }
    }
  }

  /**
   * Will always return a resolved promise.
   * @return {Promise.<void>}
   */
  async loadStoredData () {
    try {
      let values = await browser.storage.sync.get()
      for (let key in values) {
        if (this._values.hasOwnProperty(key)) {
          this._values[key].currentValue = values[key]
        }
      }
    } catch (errorMessage) {
      console.error(`Cannot retrieve options for Alpheios extension from a local storage: ${errorMessage}`)
    }
  }

  static get defaults () {
    return {
      locale: {
        defaultValue: 'en-US',
        values: [
          {value: 'en-US', text: 'English (US)'},
          {value: 'en-GB', text: 'English (GB)'}
        ],
        inputSelector: '#alpheios-locale-selector-list'
      },
      panelPosition: {
        defaultValue: 'left',
        values: [
          {value: 'left', text: 'Left'},
          {value: 'right', text: 'Right'}
        ],
        inputSelector: '#alpheios-position-selector-list'
      },
      uiType: {
        defaultValue: 'popup',
        values: [
          {value: 'popup', text: 'Pop-up'},
          {value: 'panel', text: 'Panel'}
        ],
        inputSelector: '#alpheios-ui-type-selector-list'
      }
    }
  }

  get items () {
    return this._values
  }

  update (option, value) {
    this._values[option].currentValue = value

    // Update value in the local storage
    let optionObj = {}
    optionObj[option] = value

    browser.storage.sync.set(optionObj).then(
      () => {
        // Options storage succeeded
        console.log('Option value was stored successfully.')
      },
      (errorMessage) => {
        console.err(`Storage of an option value failed: ${errorMessage}`)
      }
    )
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Options;



/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: none;\">\r\n    <symbol id=\"alf-icon-chevron-left\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-chevron-right\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-arrow-left\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-circle-o-notch\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-commenting\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M640 896q0-53-37.5-90.5t-90.5-37.5-90.5 37.5-37.5 90.5 37.5 90.5 90.5 37.5 90.5-37.5 37.5-90.5zm384 0q0-53-37.5-90.5t-90.5-37.5-90.5 37.5-37.5 90.5 37.5 90.5 90.5 37.5 90.5-37.5 37.5-90.5zm384 0q0-53-37.5-90.5t-90.5-37.5-90.5 37.5-37.5 90.5 37.5 90.5 90.5 37.5 90.5-37.5 37.5-90.5zm384 0q0 174-120 321.5t-326 233-450 85.5q-110 0-211-18-173 173-435 229-52 10-86 13-12 1-22-6t-13-18q-4-15 20-37 5-5 23.5-21.5t25.5-23.5 23.5-25.5 24-31.5 20.5-37 20-48 14.5-57.5 12.5-72.5q-146-90-229.5-216.5t-83.5-269.5q0-174 120-321.5t326-233 450-85.5 450 85.5 326 233 120 321.5z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-table\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M576 1376v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm0-384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm-512-768v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm-512-768v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm0-384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm128-320v1088q0 66-47 113t-113 47h-1344q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1344q66 0 113 47t47 113z\"/>\r\n    </symbol>\r\n    <symbol id=\"alf-icon-wrench\" viewBox=\"0 0 1792 1792\">\r\n        <path d=\"M448 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm644-420l-682 682q-37 37-90 37-52 0-91-37l-106-108q-38-36-38-90 0-53 38-91l681-681q39 98 114.5 173.5t173.5 114.5zm634-435q0 39-23 106-47 134-164.5 217.5t-258.5 83.5q-185 0-316.5-131.5t-131.5-316.5 131.5-316.5 316.5-131.5q58 0 121.5 16.5t107.5 46.5q16 11 16 28t-16 28l-293 169v224l193 107q5-3 79-48.5t135.5-81 70.5-35.5q15 0 23.5 10t8.5 25z\"/>\r\n    </symbol>\r\n</svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <svg id=\"alpheios-panel-toggle\" class=\"alpheios-panel-show-btn\">\r\n        <use xlink:href=\"#alf-icon-circle-o-notch\"/>\r\n    </svg>\r\n    <div id=\"popup\"><popup></popup></div>\r\n\r\n</div>"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<div id=\"alpheios-panel\" class=\"alpheios-panel\">\r\n    <div class=\"alpheios-panel__header\">\r\n        <h3 class=\"alpheios-panel__header-title\">Alpheios</h3>\r\n        <svg id=\"alpheios-panel-hide\" class=\"alpheios-panel__header-action-btn\">\r\n            <use xlink:href=\"#alf-icon-chevron-left\"/>\r\n        </svg>\r\n        <svg id=\"alpheios-panel-show-open\" class=\"alpheios-panel__header-action-btn\">\r\n            <use xlink:href=\"#alf-icon-arrow-left\"/>\r\n        </svg>\r\n        <svg id=\"alpheios-panel-show-fw\" class=\"alpheios-panel__header-action-btn\">\r\n            <use xlink:href=\"#alf-icon-chevron-right\"/>\r\n        </svg>\r\n        <div class=\"alpheios-panel__header-button-cont\">\r\n\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"alpheios-panel__body\">\r\n        <div id=\"alpheios-panel-content\" class=\"alpheios-panel__content\">\r\n            <div id=\"alpheios-panel-content-definition\"></div>\r\n            <div id=\"alpheios-panel-content-infl-table\">\r\n                <div id=\"alpheios-panel-content-infl-table-locale-switcher\" class=\"alpheios-ui-form-group\"></div>\r\n                <div id=\"alpheios-panel-content-infl-table-view-selector\" class=\"alpheios-ui-form-group\"></div>\r\n                <div id=\"alpheios-panel-content-infl-table-body\"></div>\r\n            </div>\r\n            <div id=\"alpheios-panel-content-options\"></div>\r\n        </div>\r\n        <div id=\"alpheios-panel__nav\" class=\"alpheios-panel__nav\">\r\n            <svg id=\"alpheios-panel-show-word-data\" class=\"alpheios-panel__nav-btn\"\r\n                 data-target=\"alpheios-panel-content-definition\">\r\n                <use xlink:href=\"#alf-icon-commenting\"/>\r\n            </svg>\r\n            <svg id=\"alpheios-panel-show-infl-table\" class=\"alpheios-panel__nav-btn\"\r\n                 data-target=\"alpheios-panel-content-infl-table\">\r\n                <use xlink:href=\"#alf-icon-table\"/>\r\n            </svg>\r\n            <svg id=\"alpheios-panel-show-options\" class=\"alpheios-panel__nav-btn\"\r\n                 data-target=\"alpheios-panel-content-options\">\r\n                <use xlink:href=\"#alf-icon-wrench\"/>\r\n            </svg>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<h4>Options</h4>\r\n\r\n<div id=\"alpheios-locale-switcher\" class=\"alpheios-ui-form-group\">\r\n    <label for=\"alpheios-locale-selector-list\">Locale:</label>\r\n    <select id=\"alpheios-locale-selector-list\" class=\"alpheios-ui-form-control\"></select>\r\n</div>\r\n\r\n<div id=\"alpheios-ui-type-switcher\" class=\"alpheios-ui-form-group\">\r\n    <label for=\"alpheios-ui-type-selector-list\">Panel position:</label>\r\n    <select id=\"alpheios-ui-type-selector-list\" class=\"alpheios-ui-form-control\"></select>\r\n</div>\r\n\r\n<div id=\"alpheios-position-switcher\" class=\"alpheios-ui-form-group\">\r\n    <label for=\"alpheios-position-selector-list\">Panel position:</label>\r\n    <select id=\"alpheios-position-selector-list\" class=\"alpheios-ui-form-control\"></select>\r\n</div>"

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_element_closest__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_element_closest___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_element_closest__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_alpheios_data_models__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__text_selector__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__media_selector__ = __webpack_require__(33);
 // To polyfill Element.closest() if required




class HTMLSelector extends __WEBPACK_IMPORTED_MODULE_3__media_selector__["a" /* default */] {
  constructor (target, defaultLanguageCode) {
    super(target)
    this.defaultLanguageCode = defaultLanguageCode

    this.wordSeparator = new Map()
    this.wordSeparator.set(__WEBPACK_IMPORTED_MODULE_1_alpheios_data_models__["a" /* Constants */].LANG_UNIT_WORD, this.doSpaceSeparatedWordSelection.bind(this))
    this.wordSeparator.set(__WEBPACK_IMPORTED_MODULE_1_alpheios_data_models__["a" /* Constants */].LANG_UNIT_CHAR, this.doCharacterBasedWordSelection.bind(this))
  }

  static getSelector (target, defaultLanguageCode) {
    return new HTMLSelector(target, defaultLanguageCode).createTextSelector()
  }

  createTextSelector () {
    let wordSelector = new __WEBPACK_IMPORTED_MODULE_2__text_selector__["a" /* default */]()
    wordSelector.languageCode = this.getLanguageCode(this.defaultLanguageCode)
    wordSelector.language = this.getLanguage(wordSelector.languageCode)

    if (this.wordSeparator.has(wordSelector.language.baseUnit)) {
      wordSelector = this.wordSeparator.get(wordSelector.language.baseUnit)(wordSelector)
    } else {
      console.warn(`No word separator function found for a "${wordSelector.language.baseUnit}" base unit`)
    }
    return wordSelector
  }

  /**
   * Returns a language code of a text piece defined by target. Scans for a `lang` attribute of a selection target
   * or, if not found, all parents of a target.
   * @return {string | undefined} Language code of a text piece or undefined if language cannot be determined.
   */
  getLanguageCodeFromSource () {
    let languageCode = this.target.getAttribute('lang') || this.target.getAttribute('xml:lang')
    if (!languageCode) {
      // If no attribute of target element found, check its ancestors
      let closestLangElement = this.target.closest('[lang]') || this.target.closest('[xml\\:lang]')
      if (closestLangElement) {
        languageCode = closestLangElement.getAttribute('lang') || closestLangElement.getAttribute('xml:lang')
      }
    }
    return languageCode
  }

  static getSelection (target) {
    let selection = target.ownerDocument.getSelection()
    if (!selection) { console.warn(`Cannot get selection from a document`) }
    return selection
  }

  /**
   * Helper method for {@link #findSelection} which
   * identifies target word and surrounding
   * context for languages whose words are
   * space-separated
   * @see #findSelection
   * @private
   */
  doSpaceSeparatedWordSelection (textSelector) {
    let selection = HTMLSelector.getSelection(this.target)
    let anchor = selection.anchorNode
    let focus = selection.focusNode
    let anchorText = anchor.data
    let ro = selection.anchorOffset
    // clean string:
    //   convert punctuation to spaces
    anchorText = anchorText.replace(new RegExp('[' + textSelector.language.getPunctuation() + ']', 'g'), ' ')

    // find word
    let wordStart = anchorText.lastIndexOf(' ', ro) + 1
    let wordEnd = anchorText.indexOf(' ', wordStart + 1)

    if (wordStart === -1) {
      wordStart = ro
    }

    if (wordEnd === -1) {
      wordEnd = anchorText.length
    }

    // if empty, nothing to do
    if (wordStart === wordEnd) {
      return textSelector
    }

    // extract word
    let word = anchorText.substring(wordStart, wordEnd).trim()

    /* Identify the words preceeding and following the focus word
    * TODO - query the type of node in the selection to see if we are
    * dealing with something other than text nodes
    * We also need to be able to pull surrounding context for text
    * nodes that are broken up by formatting tags (<br/> etc))
    */

    let contextStr = null
    let contextPos = 0

    if (textSelector.language.contextForward || textSelector.language.contextBackward) {
      let startstr = anchorText.substring(0, wordEnd)
      let endstr = anchorText.substring(wordEnd + 1, anchorText.length)
      let preWordlist = startstr.split(/\s+/)
      let postWordlist = endstr.split(/\s+/)

      // limit to the requested # of context words
      // prior to the selected word
      // the selected word is the last item in the
      // preWordlist array
      if (preWordlist.length > textSelector.language.contextBackward + 1) {
        preWordlist = preWordlist.slice(preWordlist.length - (textSelector.language.contextBackward + 1))
      }
      // limit to the requested # of context words
      // following to the selected word
      if (postWordlist.length > textSelector.language.contextForward) {
        postWordlist = postWordlist.slice(0, textSelector.language.contextForward)
      }

      /* TODO: should we put the punctuation back in to the
      * surrounding context? Might be necessary for syntax parsing.
      */
      contextStr =
        preWordlist.join(' ') + ' ' + postWordlist.join(' ')
      contextPos = preWordlist.length - 1
    }

    textSelector.selectedText = word
    textSelector.normalizedSelectedText = textSelector.language.normalizeWord(word)
    textSelector.start = wordStart
    textSelector.end = wordEnd
    textSelector.context = contextStr
    textSelector.position = contextPos

    if (textSelector.word) {
      // Reset a selection
      selection.setBaseAndExtent(anchor, wordStart, focus, wordEnd)
    }
    return textSelector
  }

  /**
   * Helper method for {@link #findSelection} which identifies
   * target word and surrounding context for languages
   * whose words are character based
   * @see #findSelection
   * @private
   */
  doCharacterBasedWordSelection (textSelection) {
    // TODO
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HTMLSelector;



/***/ }),
/* 31 */
/***/ (function(module, exports) {

// element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Implements a W3C Text Quote Selector (https://www.w3.org/TR/annotation-model/#h-text-quote-selector)
 */
class TextQuoteSelector {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextQuoteSelector;



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_alpheios_data_models__ = __webpack_require__(7);


class MediaSelector {
  constructor (target) {
    this.target = target // A selected text area in a document
  }

  /**
   * Creates a selection from a specific target and a default language code. Should be implemented in a subclass.
   * @param target
   * @param defaultLanguageCode
   * @return {undefined}
   */
  static getSelector (target, defaultLanguageCode) {
    return undefined
  }

  /**
   * Returns a language code of a text piece defined by target. Should scan a text piece and its surrounding environment
   * or use other methods in a best effort to determine the language of a text piece.
   * This method is media specific and should be redefined in media specific subclasses of SourceSelector.
   * @return {string | undefined} Language code of a text piece or undefined if language cannot be determined.
   */
  getLanguageCodeFromSource () {
    return undefined
  }

  /**
   * Returns a language code of a selection target. If language cannot be determined, defaultLanguageCode will be used instead.
   * @param {string} defaultLanguageCode - A default language code that will be used if language cannot be determined.
   * @return {string} A language code of a selection
   */
  getLanguageCode (defaultLanguageCode) {
    return this.getLanguageCodeFromSource() || defaultLanguageCode
  }

  /**
   * Returns a language of a selection target. If language cannot be determined, defaultLanguageCode will be used instead.
   * @param {string} languageCode - A default language code that will be used if language cannot be determined.
   * @return {Symbol} Language of a selection
   */
  getLanguage (languageCode) {
    return __WEBPACK_IMPORTED_MODULE_0_alpheios_data_models__["b" /* LanguageModelFactory */].getLanguageForCode(languageCode)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MediaSelector;



/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.8
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.functionalOptions = undefined;
  this.functionalScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if ("development" !== 'production' && inject) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor,
  isOnce
) {
  // render fns generated by compiler < 2.5.4 does not provide v-once
  // information to runtime so be conservative
  var isOldVersion = arguments.length < 3;
  // if a static tree is generated by v-once, it is cached on the instance;
  // otherwise it is purely static and can be cached on the shared options
  // across all instances.
  var renderFns = this.$options.staticRenderFns;
  var cached = isOldVersion || isOnce
    ? (this._staticTrees || (this._staticTrees = []))
    : (renderFns.cached || (renderFns.cached = []));
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.functionalScopeId = options._scopeId;
        vnode.functionalContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.functionalContext = contextVm;
    vnode.functionalOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && cached$$1 !== current) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.8';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.functionalScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.functionalContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE9 || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms.length; i$1++) {
        postTransforms[i$1](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state, once$$1) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + "," + (el.staticInFor ? 'true' : 'false') + "," + (once$$1 ? 'true' : 'false') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state, true)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(35).setImmediate))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(36);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
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
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
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
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
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
        registerImmediate = function(handle) {
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
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(37)))

/***/ }),
/* 37 */
/***/ (function(module, exports) {

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
function defaultClearTimeout () {
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
} ())
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
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
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
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

!function(root, factory) {
     true ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports["vue-js-modal"] = factory() : root["vue-js-modal"] = factory();
}(this, function() {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        var installedModules = {};
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.i = function(value) {
            return value;
        }, __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "/dist/", __webpack_require__(__webpack_require__.s = 3);
    }([ function(module, exports) {
        module.exports = function() {
            var list = [];
            return list.toString = function() {
                for (var result = [], i = 0; i < this.length; i++) {
                    var item = this[i];
                    item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                }
                return result.join("");
            }, list.i = function(modules, mediaQuery) {
                "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
                for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    "number" == typeof id && (alreadyImportedModules[id] = !0);
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), 
                    list.push(item));
                }
            }, list;
        };
    }, function(module, exports) {
        module.exports = function(rawScriptExports, compiledTemplate, scopeId, cssModules) {
            var esModule, scriptExports = rawScriptExports = rawScriptExports || {}, type = typeof rawScriptExports.default;
            "object" !== type && "function" !== type || (esModule = rawScriptExports, scriptExports = rawScriptExports.default);
            var options = "function" == typeof scriptExports ? scriptExports.options : scriptExports;
            if (compiledTemplate && (options.render = compiledTemplate.render, options.staticRenderFns = compiledTemplate.staticRenderFns), 
            scopeId && (options._scopeId = scopeId), cssModules) {
                var computed = options.computed || (options.computed = {});
                Object.keys(cssModules).forEach(function(key) {
                    var module = cssModules[key];
                    computed[key] = function() {
                        return module;
                    };
                });
            }
            return {
                esModule: esModule,
                exports: scriptExports,
                options: options
            };
        };
    }, function(module, exports, __webpack_require__) {
        function addStylesToDom(styles) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i], domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                    for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j]));
                    domStyle.parts.length > item.parts.length && (domStyle.parts.length = item.parts.length);
                } else {
                    for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j]));
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function createStyleElement() {
            var styleElement = document.createElement("style");
            return styleElement.type = "text/css", head.appendChild(styleElement), styleElement;
        }
        function addStyle(obj) {
            var update, remove, styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]');
            if (styleElement) {
                if (isProduction) return noop;
                styleElement.parentNode.removeChild(styleElement);
            }
            if (isOldIE) {
                var styleIndex = singletonCounter++;
                styleElement = singletonElement || (singletonElement = createStyleElement()), update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), 
                remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
            } else styleElement = createStyleElement(), update = applyToTag.bind(null, styleElement), 
            remove = function() {
                styleElement.parentNode.removeChild(styleElement);
            };
            return update(obj), function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
                childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
            }
        }
        function applyToTag(styleElement, obj) {
            var css = obj.css, media = obj.media, sourceMap = obj.sourceMap;
            if (media && styleElement.setAttribute("media", media), sourceMap && (css += "\n/*# sourceURL=" + sourceMap.sources[0] + " */", 
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */"), 
            styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        var hasDocument = "undefined" != typeof document;
        if ("undefined" != typeof DEBUG && DEBUG && !hasDocument) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
        var listToStyles = __webpack_require__(21), stylesInDom = {}, head = hasDocument && (document.head || document.getElementsByTagName("head")[0]), singletonElement = null, singletonCounter = 0, isProduction = !1, noop = function() {}, isOldIE = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
        module.exports = function(parentId, list, _isProduction) {
            isProduction = _isProduction;
            var styles = listToStyles(parentId, list);
            return addStylesToDom(styles), function(newList) {
                for (var mayRemove = [], i = 0; i < styles.length; i++) {
                    var item = styles[i], domStyle = stylesInDom[item.id];
                    domStyle.refs--, mayRemove.push(domStyle);
                }
                newList ? (styles = listToStyles(parentId, newList), addStylesToDom(styles)) : styles = [];
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (0 === domStyle.refs) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
            };
        }();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _Modal = __webpack_require__(6), _Modal2 = _interopRequireDefault(_Modal), _Dialog = __webpack_require__(5), _Dialog2 = _interopRequireDefault(_Dialog), Plugin = {
            install: function(Vue) {
                var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (!this.installed) {
                    this.installed = !0, this.event = new Vue(), Vue.prototype.$modal = {
                        show: function(name, params) {
                            Plugin.event.$emit("toggle", name, !0, params);
                        },
                        hide: function(name, params) {
                            Plugin.event.$emit("toggle", name, !1, params);
                        },
                        toggle: function(name, params) {
                            Plugin.event.$emit("toggle", name, void 0, params);
                        }
                    };
                    var componentName = options.componentName || "modal";
                    Vue.component(componentName, _Modal2.default), options.dialog && Vue.component("v-dialog", _Dialog2.default);
                }
            }
        };
        exports.default = Plugin;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var inRange = exports.inRange = function(from, to, value) {
            return value < from ? from : value > to ? to : value;
        };
        exports.default = {
            inRange: inRange
        };
    }, function(module, exports, __webpack_require__) {
        __webpack_require__(18);
        var Component = __webpack_require__(1)(__webpack_require__(7), __webpack_require__(15), null, null);
        Component.options.__file = "/Users/yev/Projects/vue/vue-js-modal/src/Dialog.vue", 
        Component.esModule && Object.keys(Component.esModule).some(function(key) {
            return "default" !== key && "__esModule" !== key;
        }) && console.error("named exports are not supported in *.vue files."), Component.options.functional && console.error("[vue-loader] Dialog.vue: functional components are not supported with templates, they should use render functions."), 
        module.exports = Component.exports;
    }, function(module, exports, __webpack_require__) {
        __webpack_require__(19);
        var Component = __webpack_require__(1)(__webpack_require__(8), __webpack_require__(16), null, null);
        Component.options.__file = "/Users/yev/Projects/vue/vue-js-modal/src/Modal.vue", 
        Component.esModule && Object.keys(Component.esModule).some(function(key) {
            return "default" !== key && "__esModule" !== key;
        }) && console.error("named exports are not supported in *.vue files."), Component.options.functional && console.error("[vue-loader] Modal.vue: functional components are not supported with templates, they should use render functions."), 
        module.exports = Component.exports;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = {
            name: "Dialog",
            props: {
                width: {
                    type: [ Number, String ],
                    default: 400
                },
                clickToClose: {
                    type: Boolean,
                    default: !0
                },
                transition: {
                    type: String,
                    default: "fade"
                }
            },
            data: function() {
                return {
                    params: {},
                    defaultButtons: [ {
                        title: "CLOSE"
                    } ]
                };
            },
            computed: {
                buttons: function() {
                    return this.params.buttons || this.defaultButtons;
                },
                buttonStyle: function() {
                    return {
                        flex: "1 1 " + 100 / this.buttons.length + "%"
                    };
                }
            },
            methods: {
                beforeOpened: function(event) {
                    this.params = event.params || {}, this.$emit("before-opened", event);
                },
                beforeClosed: function(event) {
                    this.params = {}, this.$emit("before-closed", event);
                },
                click: function(i, event) {
                    var button = this.buttons[i];
                    if ("function" == typeof button.handler) return button.handler(i, event);
                    this.$modal.hide("dialog");
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _index = __webpack_require__(3), _index2 = _interopRequireDefault(_index), _Resizer = __webpack_require__(14), _Resizer2 = _interopRequireDefault(_Resizer), _util = __webpack_require__(4), _parser = __webpack_require__(10), _parser2 = _interopRequireDefault(_parser);
        exports.default = {
            name: "VueJsModal",
            props: {
                name: {
                    required: !0,
                    type: String
                },
                delay: {
                    type: Number,
                    default: 0
                },
                resizable: {
                    type: Boolean,
                    default: !1
                },
                adaptive: {
                    type: Boolean,
                    default: !1
                },
                draggable: {
                    type: [ Boolean, String ],
                    default: !1
                },
                scrollable: {
                    type: Boolean,
                    default: !1
                },
                reset: {
                    type: Boolean,
                    default: !1
                },
                transition: {
                    type: String
                },
                clickToClose: {
                    type: Boolean,
                    default: !0
                },
                classes: {
                    type: [ String, Array ],
                    default: "v--modal"
                },
                minWidth: {
                    type: Number,
                    default: 0,
                    validator: function(value) {
                        return value >= 0;
                    }
                },
                minHeight: {
                    type: Number,
                    default: 0,
                    validator: function(value) {
                        return value >= 0;
                    }
                },
                width: {
                    type: [ Number, String ],
                    default: 600,
                    validator: function(value) {
                        if ("string" == typeof value) {
                            var width = (0, _parser2.default)(value);
                            return ("%" === width.type || "px" === width.type) && width.value > 0;
                        }
                        return value >= 0;
                    }
                },
                height: {
                    type: [ Number, String ],
                    default: 300,
                    validator: function(value) {
                        if ("string" == typeof value) {
                            if ("auto" === value) return !0;
                            var height = (0, _parser2.default)(value);
                            return ("%" === height.type || "px" === height.type) && height.value > 0;
                        }
                        return value >= 0;
                    }
                },
                pivotX: {
                    type: Number,
                    default: .5,
                    validator: function(value) {
                        return value >= 0 && value <= 1;
                    }
                },
                pivotY: {
                    type: Number,
                    default: .5,
                    validator: function(value) {
                        return value >= 0 && value <= 1;
                    }
                }
            },
            components: {
                Resizer: _Resizer2.default
            },
            data: function() {
                return {
                    visible: !1,
                    visibility: {
                        modal: !1,
                        overlay: !1
                    },
                    shift: {
                        left: 0,
                        top: 0
                    },
                    modal: {
                        width: 0,
                        widthType: "px",
                        height: 0,
                        heightType: "px",
                        renderedHeight: 0
                    },
                    window: {
                        width: 0,
                        height: 0
                    },
                    mutationObserver: null
                };
            },
            watch: {
                visible: function(value) {
                    var _this = this;
                    value ? (this.visibility.overlay = !0, setTimeout(function() {
                        _this.visibility.modal = !0, _this.$nextTick(function() {
                            _this.addDraggableListeners(), _this.callAfterEvent(!0);
                        });
                    }, this.delay)) : (this.visibility.modal = !1, setTimeout(function() {
                        _this.visibility.overlay = !1, _this.$nextTick(function() {
                            _this.removeDraggableListeners(), _this.callAfterEvent(!1);
                        });
                    }, this.delay));
                }
            },
            created: function() {
                this.setInitialSize();
            },
            beforeMount: function() {
                var _this2 = this;
                if (_index2.default.event.$on("toggle", function(name, state, params) {
                    name === _this2.name && (void 0 === state && (state = !_this2.visible), _this2.toggle(state, params));
                }), window.addEventListener("resize", this.onWindowResize), this.onWindowResize(), 
                this.scrollable && !this.isAutoHeight && console.warn('Modal "' + this.name + '" has scrollable flag set to true but height is not "auto" (' + this.height + ")"), 
                this.isAutoHeight) {
                    var MutationObserver = function() {
                        for (var prefixes = [ "", "WebKit", "Moz", "O", "Ms" ], i = 0; i < prefixes.length; i++) {
                            var name = prefixes[i] + "MutationObserver";
                            if (name in window) return window[name];
                        }
                        return !1;
                    }();
                    MutationObserver && (this.mutationObserver = new MutationObserver(function(mutations) {
                        _this2.updateRenderedHeight();
                    }));
                }
            },
            beforeDestroy: function() {
                window.removeEventListener("resize", this.onWindowResize);
            },
            computed: {
                isAutoHeight: function() {
                    return "auto" === this.modal.heightType;
                },
                position: function() {
                    var window = this.window, shift = this.shift, pivotX = this.pivotX, pivotY = this.pivotY, trueModalWidth = this.trueModalWidth, trueModalHeight = this.trueModalHeight, maxLeft = window.width - trueModalWidth, maxTop = window.height - trueModalHeight, left = shift.left + pivotX * maxLeft, top = shift.top + pivotY * maxTop;
                    return {
                        left: (0, _util.inRange)(0, maxLeft, left),
                        top: (0, _util.inRange)(0, maxTop, top)
                    };
                },
                trueModalWidth: function() {
                    var window = this.window, modal = this.modal, adaptive = this.adaptive, minWidth = this.minWidth, value = "%" === modal.widthType ? window.width / 100 * modal.width : modal.width;
                    return adaptive ? (0, _util.inRange)(minWidth, window.width, value) : value;
                },
                trueModalHeight: function() {
                    var window = this.window, modal = this.modal, isAutoHeight = this.isAutoHeight, adaptive = this.adaptive, value = "%" === modal.heightType ? window.height / 100 * modal.height : modal.height;
                    return isAutoHeight ? this.modal.renderedHeight : adaptive ? (0, _util.inRange)(this.minHeight, this.window.height, value) : value;
                },
                overlayClass: function() {
                    return {
                        "v--modal-overlay": !0,
                        scrollable: this.scrollable && this.isAutoHeight
                    };
                },
                modalClass: function() {
                    return [ "v--modal-box", this.classes ];
                },
                modalStyle: function() {
                    return {
                        top: this.position.top + "px",
                        left: this.position.left + "px",
                        width: this.trueModalWidth + "px",
                        height: this.isAutoHeight ? "auto" : this.trueModalHeight + "px"
                    };
                }
            },
            methods: {
                setInitialSize: function() {
                    var modal = this.modal, width = (0, _parser2.default)(this.width), height = (0, 
                    _parser2.default)(this.height);
                    modal.width = width.value, modal.widthType = width.type, modal.height = height.value, 
                    modal.heightType = height.type;
                },
                onWindowResize: function() {
                    this.window.width = window.innerWidth, this.window.height = window.innerHeight;
                },
                genEventObject: function(params) {
                    var eventData = {
                        name: this.name,
                        timestamp: Date.now(),
                        canceled: !1,
                        ref: this.$refs.modal
                    };
                    return Object.assign(eventData, params || {});
                },
                onModalResize: function(event) {
                    this.modal.widthType = "px", this.modal.width = event.size.width, this.modal.heightType = "px", 
                    this.modal.height = event.size.height;
                    var size = this.modal.size, resizeEvent = this.genEventObject({
                        size: size
                    });
                    this.$emit("resize", resizeEvent);
                },
                toggle: function(state, params) {
                    var reset = this.reset, scrollable = this.scrollable, visible = this.visible, beforeEventName = visible ? "before-close" : "before-open";
                    "before-open" === beforeEventName ? (reset && (this.setInitialSize(), this.shift.left = 0, 
                    this.shift.top = 0), scrollable && document.body.classList.add("v--modal-block-scroll")) : scrollable && document.body.classList.remove("v--modal-block-scroll");
                    var stopEventExecution = !1, stop = function() {
                        stopEventExecution = !0;
                    }, beforeEvent = this.genEventObject({
                        stop: stop,
                        state: state,
                        params: params
                    });
                    this.$emit(beforeEventName, beforeEvent), stopEventExecution || (this.visible = state);
                },
                getDraggableElement: function() {
                    var selector = "string" != typeof this.draggable ? ".v--modal-box" : this.draggable;
                    if (selector) {
                        var handler = this.$refs.overlay.querySelector(selector);
                        if (handler) return handler;
                    }
                },
                onBackgroundClick: function() {
                    this.clickToClose && this.toggle(!1);
                },
                addDraggableListeners: function() {
                    var _this3 = this;
                    if (this.draggable) {
                        var dragger = this.getDraggableElement();
                        if (dragger) {
                            var startX = 0, startY = 0, cachedShiftX = 0, cachedShiftY = 0, getPosition = function(event) {
                                return event.touches && event.touches.length > 0 ? event.touches[0] : event;
                            }, mousedown = function(event) {
                                var target = event.target;
                                if (!target || "INPUT" !== target.nodeName) {
                                    var _getPosition = getPosition(event), clientX = _getPosition.clientX, clientY = _getPosition.clientY;
                                    document.addEventListener("mousemove", _mousemove), document.addEventListener("mouseup", _mouseup), 
                                    document.addEventListener("touchmove", _mousemove), document.addEventListener("touchend", _mouseup), 
                                    startX = clientX, startY = clientY, cachedShiftX = _this3.shift.left, cachedShiftY = _this3.shift.top;
                                }
                            }, _mousemove = function(event) {
                                var _getPosition2 = getPosition(event), clientX = _getPosition2.clientX, clientY = _getPosition2.clientY;
                                _this3.shift.left = cachedShiftX + clientX - startX, _this3.shift.top = cachedShiftY + clientY - startY, 
                                event.preventDefault();
                            }, _mouseup = function _mouseup(event) {
                                document.removeEventListener("mousemove", _mousemove), document.removeEventListener("mouseup", _mouseup), 
                                document.removeEventListener("touchmove", _mousemove), document.removeEventListener("touchend", _mouseup), 
                                event.preventDefault();
                            };
                            dragger.addEventListener("mousedown", mousedown), dragger.addEventListener("touchstart", mousedown);
                        }
                    }
                },
                removeDraggableListeners: function() {},
                callAfterEvent: function(state) {
                    state ? this.connectObserver() : this.disconnectObserver();
                    var afterEventName = state ? "opened" : "closed", afterEvent = this.genEventObject({
                        state: state
                    });
                    this.$emit(afterEventName, afterEvent);
                },
                updateRenderedHeight: function() {
                    this.$refs.modal && (this.modal.renderedHeight = this.$refs.modal.getBoundingClientRect().height);
                },
                connectObserver: function() {
                    this.mutationObserver && this.mutationObserver.observe(this.$refs.modal, {
                        childList: !0,
                        attributes: !0,
                        subtree: !0
                    });
                },
                disconnectObserver: function() {
                    this.mutationObserver && this.mutationObserver.disconnect();
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _util = __webpack_require__(4);
        exports.default = {
            name: "VueJsModalResizer",
            props: {
                minHeight: {
                    type: Number,
                    default: 0
                },
                minWidth: {
                    type: Number,
                    default: 0
                }
            },
            data: function() {
                return {
                    clicked: !1,
                    size: {}
                };
            },
            mounted: function() {
                this.$el.addEventListener("mousedown", this.start, !1);
            },
            computed: {
                className: function() {
                    return {
                        "vue-modal-resizer": !0,
                        clicked: this.clicked
                    };
                }
            },
            methods: {
                start: function(event) {
                    this.clicked = !0, window.addEventListener("mousemove", this.mousemove, !1), window.addEventListener("mouseup", this.stop, !1), 
                    event.stopPropagation(), event.preventDefault();
                },
                stop: function() {
                    this.clicked = !1, window.removeEventListener("mousemove", this.mousemove, !1), 
                    window.removeEventListener("mouseup", this.stop, !1), this.$emit("resize-stop", {
                        element: this.$el.parentElement,
                        size: this.size
                    });
                },
                mousemove: function(event) {
                    this.resize(event);
                },
                resize: function(event) {
                    var el = this.$el.parentElement;
                    if (el) {
                        var width = event.clientX - el.offsetLeft, height = event.clientY - el.offsetTop;
                        width = (0, _util.inRange)(this.minWidth, window.innerWidth, width), height = (0, 
                        _util.inRange)(this.minHeight, window.innerHeight, height), this.size = {
                            width: width,
                            height: height
                        }, el.style.width = width + "px", el.style.height = height + "px", this.$emit("resize", {
                            element: el,
                            size: this.size
                        });
                    }
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, types = [ {
            name: "px",
            regexp: new RegExp("^[-+]?[0-9]*.?[0-9]+px$")
        }, {
            name: "%",
            regexp: new RegExp("^[-+]?[0-9]*.?[0-9]+%$")
        }, {
            name: "px",
            regexp: new RegExp("^[-+]?[0-9]*.?[0-9]+$")
        } ], getType = function(value) {
            if ("auto" === value) return {
                type: value,
                value: 0
            };
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                if (type.regexp.test(value)) return {
                    type: type.name,
                    value: parseFloat(value)
                };
            }
            return {
                type: "",
                value: value
            };
        }, parse = exports.parse = function(value) {
            switch (void 0 === value ? "undefined" : _typeof(value)) {
              case "number":
                return {
                    type: "px",
                    value: value
                };

              case "string":
                return getType(value);

              default:
                return {
                    type: "",
                    value: value
                };
            }
        };
        exports.default = parse;
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(0)(), exports.push([ module.i, "\n.vue-dialog div {\n  box-sizing: border-box;\n}\n.vue-dialog .dialog-flex {\n  width: 100%;\n  height: 100%;\n}\n.vue-dialog .dialog-content {\n  flex: 1 0 auto;\n  width: 100%;\n  padding: 15px;\n  font-size: 14px;\n}\n.vue-dialog .dialog-c-title {\n  font-weight: 600;\n  padding-bottom: 15px;\n}\n.vue-dialog .dialog-c-text {\n}\n.vue-dialog .vue-dialog-buttons {\n  display: flex;\n  flex: 0 1 auto;\n  width: 100%;\n  border-top: 1px solid #eee;\n}\n.vue-dialog .vue-dialog-buttons-none {\n  width: 100%;\n  padding-bottom: 15px;\n}\n.vue-dialog-button {\n  font-size: 12px !important;\n  background: transparent;\n  padding: 0;\n  margin: 0;\n  border: 0;\n  cursor: pointer;\n  box-sizing: border-box;\n  line-height: 40px;\n  height: 40px;\n  color:inherit;\n  font:inherit;\n  outline: none;\n}\n.vue-dialog-button:hover {\n  background: rgba(0, 0, 0, 0.01);\n}\n.vue-dialog-button:active {\n  background: rgba(0, 0, 0, 0.025);\n}\n.vue-dialog-button:not(:first-of-type) {\n  border-left: 1px solid #eee;\n}\n", "", {
            version: 3,
            sources: [ "/./src/Dialog.vue?124e6492" ],
            names: [],
            mappings: ";AA4FA;EACA,uBAAA;CACA;AAEA;EACA,YAAA;EACA,aAAA;CACA;AAEA;EACA,eAAA;EACA,YAAA;EACA,cAAA;EACA,gBAAA;CACA;AAEA;EACA,iBAAA;EACA,qBAAA;CAEA;AAEA;CACA;AAEA;EACA,cAAA;EACA,eAAA;EACA,YAAA;EACA,2BAAA;CACA;AAEA;EACA,YAAA;EACA,qBAAA;CACA;AAEA;EACA,2BAAA;EACA,wBAAA;EACA,WAAA;EACA,UAAA;EACA,UAAA;EACA,gBAAA;EACA,uBAAA;EACA,kBAAA;EACA,aAAA;EACA,cAAA;EACA,aAAA;EACA,cAAA;CACA;AAEA;EACA,gCAAA;CACA;AAEA;EACA,iCAAA;CACA;AAEA;EACA,4BAAA;CACA",
            file: "Dialog.vue",
            sourcesContent: [ '<template>\n  <modal name="dialog"\n         height="auto"\n         :classes="[\'v--modal\', \'vue-dialog\', this.params.class]"\n         :width="width"\n         :pivot-y="0.3"\n         :adaptive="true"\n         :clickToClose="clickToClose"\n         :transition="transition"\n         @before-open="beforeOpened"\n         @before-close="beforeClosed"\n         @opened="$emit(\'opened\', $event)"\n         @closed="$emit(\'closed\', $event)">\n      <div class="dialog-content">\n        <div class="dialog-c-title"\n             v-if="params.title"\n             v-html="params.title || \'\'"></div>\n        <div class="dialog-c-text"\n             v-html="params.text || \'\'"></div>\n      </div>\n      <div class="vue-dialog-buttons" v-if="buttons">\n        <button v-for="(button, i) in buttons"\n                :class="button.class || \'vue-dialog-button\'"\n                :style="buttonStyle"\n                :key="i"\n                v-html="button.title"\n                @click.stop="click(i, $event)">\n          {{button.title}}\n        </button>\n      </div>\n      <div v-else class="vue-dialog-buttons-none"></div>\n  </modal>\n</template>\n<script>\n  export default {\n    name: \'Dialog\',\n    props: {\n      width: {\n        type: [Number, String],\n        default: 400\n      },\n      clickToClose: {\n        type: Boolean,\n        default: true\n      },\n      transition: {\n        type: String,\n        default: \'fade\'\n      }\n    },\n    data () {\n      return {\n        params: {},\n        defaultButtons: [{ title: \'CLOSE\' }]\n      }\n    },\n    computed: {\n      buttons () {\n        return this.params.buttons || this.defaultButtons\n      },\n      /**\n       * Returns FLEX style with correct width for arbitrary number of\n       * buttons.\n       */\n      buttonStyle () {\n        return {\n          flex: `1 1 ${100 / this.buttons.length}%`\n        }\n      }\n    },\n    methods: {\n      beforeOpened (event) {\n        this.params = event.params || {}\n        this.$emit(\'before-opened\', event)\n      },\n      beforeClosed (event) {\n        this.params = {}\n        this.$emit(\'before-closed\', event)\n      },\n      click (i, event) {\n        let button = this.buttons[i]\n\n        if (typeof button.handler === \'function\') {\n          return button.handler(i, event)\n        } else {\n          this.$modal.hide(\'dialog\')\n        }\n      }\n    }\n  }\n<\/script>\n<style>\n  .vue-dialog div {\n    box-sizing: border-box;\n  }\n\n  .vue-dialog .dialog-flex {\n    width: 100%;\n    height: 100%;\n  }\n\n  .vue-dialog .dialog-content {\n    flex: 1 0 auto;\n    width: 100%;\n    padding: 15px;\n    font-size: 14px;\n  }\n\n  .vue-dialog .dialog-c-title {\n    font-weight: 600;\n    padding-bottom: 15px;\n\n  }\n\n  .vue-dialog .dialog-c-text {\n  }\n\n  .vue-dialog .vue-dialog-buttons {\n    display: flex;\n    flex: 0 1 auto;\n    width: 100%;\n    border-top: 1px solid #eee;\n  }\n\n  .vue-dialog .vue-dialog-buttons-none {\n    width: 100%;\n    padding-bottom: 15px;\n  }\n\n  .vue-dialog-button {\n    font-size: 12px !important;\n    background: transparent;\n    padding: 0;\n    margin: 0;\n    border: 0;\n    cursor: pointer;\n    box-sizing: border-box;\n    line-height: 40px;\n    height: 40px;\n    color:inherit;\n    font:inherit;\n    outline: none;\n  }\n\n  .vue-dialog-button:hover {\n    background: rgba(0, 0, 0, 0.01);\n  }\n\n  .vue-dialog-button:active {\n    background: rgba(0, 0, 0, 0.025);\n  }\n\n  .vue-dialog-button:not(:first-of-type) {\n    border-left: 1px solid #eee;\n  }\n</style>\n' ],
            sourceRoot: "webpack://"
        } ]);
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(0)(), exports.push([ module.i, "\n.v--modal-block-scroll {\n  overflow: hidden;\n}\n.v--modal-overlay {\n  position: fixed;\n  box-sizing: border-box;\n  left: 0;\n  top: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.2);\n  z-index: 999;\n  opacity: 1;\n}\n.v--modal-overlay.scrollable {\n  height: 100%;\n  min-height: 100vh;\n  overflow-y: auto;\n  padding-bottom: 10px;\n}\n.v--modal-overlay .v--modal-box {\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.v--modal-overlay.scrollable .v--modal-box {\n  margin-bottom: 2px;\n  /* transition: top 0.2s ease; */\n}\n.v--modal {\n  background-color: white;\n  text-align: left;\n  border-radius: 3px;\n  box-shadow: 0 20px 60px -2px rgba(27, 33, 58, .4);\n  padding: 0;\n}\n.v--modal.v--modal-fullscreen {\n  width: 100vw;\n  height: 100vh;\n  margin: 0;\n  left: 0;\n  top: 0;\n}\n.v--modal-top-right {\n  display: block;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n.overlay-fade-enter-active, .overlay-fade-leave-active {\n  transition: all 0.2s;\n}\n.overlay-fade-enter, .overlay-fade-leave-active {\n  opacity: 0;\n}\n.nice-modal-fade-enter-active, .nice-modal-fade-leave-active {\n  transition: all 0.4s;\n}\n.nice-modal-fade-enter, .nice-modal-fade-leave-active {\n  opacity: 0;\n  transform: translateY(-20px);\n}\n", "", {
            version: 3,
            sources: [ "/./src/Modal.vue?be5f9c64" ],
            names: [],
            mappings: ";AA2lBA;EACA,iBAAA;CACA;AAEA;EACA,gBAAA;EACA,uBAAA;EACA,QAAA;EACA,OAAA;EACA,aAAA;EACA,cAAA;EACA,+BAAA;EACA,aAAA;EACA,WAAA;CACA;AAEA;EACA,aAAA;EACA,kBAAA;EACA,iBAAA;EACA,qBAAA;CACA;AAEA;EACA,mBAAA;EACA,iBAAA;EACA,uBAAA;CACA;AAEA;EACA,mBAAA;EACA,gCAAA;CACA;AAEA;EACA,wBAAA;EACA,iBAAA;EACA,mBAAA;EACA,kDAAA;EACA,WAAA;CACA;AAEA;EACA,aAAA;EACA,cAAA;EACA,UAAA;EACA,QAAA;EACA,OAAA;CACA;AAEA;EACA,eAAA;EACA,mBAAA;EACA,SAAA;EACA,OAAA;CACA;AAEA;EACA,qBAAA;CACA;AAEA;EACA,WAAA;CACA;AAEA;EACA,qBAAA;CACA;AAEA;EACA,WAAA;EACA,6BAAA;CACA",
            file: "Modal.vue",
            sourcesContent: [ "<template>\n  <transition name=\"overlay-fade\">\n    <div v-if=\"visibility.overlay\"\n         ref=\"overlay\"\n         :class=\"overlayClass\"\n         :aria-expanded=\"visible.toString()\"\n         :data-modal=\"name\"\n         @mousedown.stop=\"onBackgroundClick\"\n         @touchstart.stop=\"onBackgroundClick\">\n      <div class=\"v--modal-top-right\">\n        <slot name=\"top-right\"/>\n      </div>\n      <transition :name=\"transition\">\n        <div v-if=\"visibility.modal\"\n             ref=\"modal\"\n             :class=\"modalClass\"\n             :style=\"modalStyle\"\n             @mousedown.stop\n             @touchstart.stop>\n          <slot/>\n          <resizer v-if=\"resizable && !isAutoHeight\"\n                   :min-width=\"minWidth\"\n                   :min-height=\"minHeight\"\n                   @resize=\"onModalResize\"/>\n        </div>\n      </transition>\n    </div>\n  </transition>\n</template>\n<script>\n  import Modal       from './index'\n  import Resizer     from './Resizer.vue'\n  import { inRange } from './util'\n  import parseNumber from './parser'\n\n  export default {\n    name: 'VueJsModal',\n    props: {\n      name: {\n        required: true,\n        type: String\n      },\n      delay: {\n        type: Number,\n        default: 0\n      },\n      resizable: {\n        type: Boolean,\n        default: false\n      },\n      adaptive: {\n        type: Boolean,\n        default: false\n      },\n      draggable: {\n        type: [Boolean, String],\n        default: false\n      },\n      scrollable: {\n        type: Boolean,\n        default: false\n      },\n      reset: {\n        type: Boolean,\n        default: false\n      },\n      transition: {\n        type: String\n      },\n      clickToClose: {\n        type: Boolean,\n        default: true\n      },\n      classes: {\n        type: [String, Array],\n        default: 'v--modal'\n      },\n      minWidth: {\n        type: Number,\n        default: 0,\n        validator (value) {\n          return value >= 0\n        }\n      },\n      minHeight: {\n        type: Number,\n        default: 0,\n        validator (value) {\n          return value >= 0\n        }\n      },\n      width: {\n        type: [Number, String],\n        default: 600,\n        validator (value) {\n          if (typeof value === 'string') {\n            let width = parseNumber(value)\n            return (width.type === '%' || width.type === 'px') &&\n              width.value > 0\n          }\n\n          return value >= 0\n        }\n      },\n      height: {\n        type: [Number, String],\n        default: 300,\n        validator (value) {\n          if (typeof value === 'string') {\n            if (value === 'auto') {\n              return true\n            }\n\n            let height = parseNumber(value)\n            return (height.type === '%' || height.type === 'px') &&\n              height.value > 0\n          }\n\n          return value >= 0\n        }\n      },\n      pivotX: {\n        type: Number,\n        default: 0.5,\n        validator (value) {\n          return value >= 0 && value <= 1\n        }\n      },\n      pivotY: {\n        type: Number,\n        default: 0.5,\n        validator (value) {\n          return value >= 0 && value <= 1\n        }\n      }\n    },\n    components: {\n      Resizer\n    },\n    data () {\n      return {\n        visible: false,\n\n        visibility: {\n          modal: false,\n          overlay: false\n        },\n\n        shift: {\n          left: 0,\n          top: 0\n        },\n\n        modal: {\n          width: 0,\n          widthType: 'px',\n          height: 0,\n          heightType: 'px',\n          renderedHeight: 0\n        },\n\n        window: {\n          width: 0,\n          height: 0\n        },\n\n        mutationObserver: null\n      }\n    },\n    watch: {\n      /**\n       * Sets the visibility of overlay and modal.\n       * Events 'opened' and 'closed' is called here\n       * inside `setTimeout` and `$nextTick`, after the DOM changes.\n       * This fixes `$refs.modal` `undefined` bug (fixes #15)\n       */\n      visible (value) {\n        if (value) {\n          this.visibility.overlay = true\n\n          setTimeout(() => {\n            this.visibility.modal = true\n            this.$nextTick(() => {\n              this.addDraggableListeners()\n              this.callAfterEvent(true)\n            })\n          }, this.delay)\n        } else {\n          this.visibility.modal = false\n\n          setTimeout(() => {\n            this.visibility.overlay = false\n            this.$nextTick(() => {\n              this.removeDraggableListeners()\n              this.callAfterEvent(false)\n            })\n          }, this.delay)\n        }\n      }\n    },\n    created () {\n      this.setInitialSize()\n    },\n    /**\n     * Sets global listeners\n     */\n    beforeMount () {\n      Modal.event.$on('toggle', (name, state, params) => {\n        if (name === this.name) {\n          if (typeof state === 'undefined') {\n            state = !this.visible\n          }\n\n          this.toggle(state, params)\n        }\n      })\n\n      window.addEventListener('resize', this.onWindowResize)\n      this.onWindowResize()\n      /**\n       * Making sure that autoHeight is enabled when using \"scrollable\"\n       */\n      if (this.scrollable && !this.isAutoHeight) {\n        console.warn(`Modal \"${this.name}\" has scrollable flag set to true ` +\n          `but height is not \"auto\" (${this.height})`)\n      }\n      /**\n       * Only observe when using height: 'auto'\n       * The callback will be called when modal DOM changes,\n       * this is for updating the `top` attribute for height 'auto' modals.\n       */\n      if (this.isAutoHeight) {\n        /**\n         * MutationObserver feature detection:\n         * Detects if MutationObserver is available, return false if not.\n         * No polyfill is provided here, so height 'auto' recalculation will\n         * simply stay at its initial height (won't crash).\n         * (Provide polyfill to support IE < 11)\n         */\n        const MutationObserver = (function () {\n          const prefixes = ['', 'WebKit', 'Moz', 'O', 'Ms']\n\n          for (let i = 0; i < prefixes.length; i++) {\n            let name = prefixes[i] + 'MutationObserver'\n\n            if (name in window) {\n              return window[name]\n            }\n          }\n          return false\n        }())\n\n        if (MutationObserver) {\n          this.mutationObserver = new MutationObserver(mutations => {\n            this.updateRenderedHeight()\n          })\n        }\n      }\n    },\n    /**\n     * Removes \"resize\" window listener\n     */\n    beforeDestroy () {\n      window.removeEventListener('resize', this.onWindowResize)\n    },\n    computed: {\n      /**\n       * Returns true if height is set to \"auto\"\n       */\n      isAutoHeight () {\n        return this.modal.heightType === 'auto'\n      },\n      /**\n       * Calculates and returns modal position based on the\n       * pivots, window size and modal size\n       */\n      position () {\n        const { window, shift, pivotX, pivotY,\n          trueModalWidth, trueModalHeight } = this\n\n        const maxLeft = window.width - trueModalWidth\n        const maxTop = window.height - trueModalHeight\n\n        const left = shift.left + pivotX * maxLeft\n        const top = shift.top + pivotY * maxTop\n\n        return {\n          left: inRange(0, maxLeft, left),\n          top: inRange(0, maxTop, top)\n        }\n      },\n      /**\n       * Returns pixel width (if set with %) and makes sure that modal size\n       * fits the window\n       */\n      trueModalWidth () {\n        const { window, modal, adaptive, minWidth } = this\n\n        const value = modal.widthType === '%'\n          ? window.width / 100 * modal.width\n          : modal.width\n\n        return adaptive\n          ? inRange(minWidth, window.width, value)\n          : value\n      },\n      /**\n       * Returns pixel height (if set with %) and makes sure that modal size\n       * fits the window.\n       *\n       * Returns modal.renderedHeight if height set as \"auto\"\n       */\n      trueModalHeight () {\n        const { window, modal, isAutoHeight, adaptive } = this\n\n        const value = (modal.heightType === '%')\n          ? window.height / 100 * modal.height\n          : modal.height\n\n        if (isAutoHeight) {\n          // use renderedHeight when height 'auto'\n          return this.modal.renderedHeight\n        }\n\n        return adaptive\n          ? inRange(this.minHeight, this.window.height, value)\n          : value\n      },\n      /**\n       * Returns class list for screen overlay (modal background)\n       */\n      overlayClass () {\n        return {\n          'v--modal-overlay': true,\n          'scrollable': this.scrollable && this.isAutoHeight\n        }\n      },\n      /**\n       * Returns class list for modal itself\n       */\n      modalClass () {\n        return ['v--modal-box', this.classes]\n      },\n      /**\n       * CSS styles for position and size of the modal\n       */\n      modalStyle () {\n        return {\n          top: this.position.top + 'px',\n          left: this.position.left + 'px',\n          width: this.trueModalWidth + 'px',\n          height: this.isAutoHeight\n            ? 'auto'\n            : (this.trueModalHeight + 'px')\n        }\n      }\n    },\n    methods: {\n      /**\n       * Initializes modal's size & position,\n       * if \"reset\" flag is set to true - this function will be called\n       * every time \"beforeOpen\" is triggered\n       */\n      setInitialSize () {\n        let { modal } = this\n        let width = parseNumber(this.width)\n        let height = parseNumber(this.height)\n\n        modal.width = width.value\n        modal.widthType = width.type\n        modal.height = height.value\n        modal.heightType = height.type\n      },\n\n      onWindowResize () {\n        this.window.width = window.innerWidth\n        this.window.height = window.innerHeight\n      },\n\n      /**\n       * Generates event object\n       */\n      genEventObject (params) {\n        var eventData = {\n          name: this.name,\n          timestamp: Date.now(),\n          canceled: false,\n          ref: this.$refs.modal\n        }\n\n        return Object.assign(eventData, params || {})\n      },\n      /**\n       * Event handler which is triggered on modal resize\n       */\n      onModalResize (event) {\n        this.modal.widthType = 'px'\n        this.modal.width = event.size.width\n\n        this.modal.heightType = 'px'\n        this.modal.height = event.size.height\n\n        const { size } = this.modal\n        const resizeEvent = this.genEventObject({ size })\n\n        this.$emit('resize', resizeEvent)\n      },\n      /**\n       * Event handler which is triggered on $modal.show and $modal.hight\n       * BeforeEvents: ('before-close' and 'before-open') are `$emit`ed here,\n       * but AfterEvents ('opened' and 'closed') are moved to `watch.visible`.\n       */\n      toggle (state, params) {\n        const { reset, scrollable, visible } = this\n\n        const beforeEventName = visible\n          ? 'before-close'\n          : 'before-open'\n\n        if (beforeEventName === 'before-open') {\n          if (reset) {\n            this.setInitialSize()\n\n            this.shift.left = 0\n            this.shift.top = 0\n          }\n\n          if (scrollable) {\n            document.body.classList.add('v--modal-block-scroll')\n          }\n        } else {\n          if (scrollable) {\n            document.body.classList.remove('v--modal-block-scroll')\n          }\n        }\n\n        let stopEventExecution = false\n\n        const stop = () => {\n          stopEventExecution = true\n        }\n\n        const beforeEvent = this.genEventObject({ stop, state, params })\n\n        this.$emit(beforeEventName, beforeEvent)\n\n        if (!stopEventExecution) {\n          this.visible = state\n          // after events are called in `watch.visible`\n        }\n      },\n\n      getDraggableElement () {\n        var selector = typeof this.draggable !== 'string'\n          ? '.v--modal-box'\n          : this.draggable\n\n        if (selector) {\n          var handler = this.$refs.overlay.querySelector(selector)\n          if (handler) {\n            return handler\n          }\n        }\n      },\n      /**\n       * Event handler that is triggered when background overlay is clicked\n       */\n      onBackgroundClick () {\n        if (this.clickToClose) {\n          this.toggle(false)\n        }\n      },\n\n      addDraggableListeners () {\n        if (!this.draggable) {\n          return\n        }\n\n        let dragger = this.getDraggableElement()\n\n        if (dragger) {\n          let startX = 0\n          let startY = 0\n          let cachedShiftX = 0\n          let cachedShiftY = 0\n\n          let getPosition = (event) => {\n            return event.touches && event.touches.length > 0\n              ? event.touches[0]\n              : event\n          }\n\n          let mousedown = (event) => {\n            let target = event.target\n\n            if (target && target.nodeName === 'INPUT') {\n              return\n            }\n\n            let { clientX, clientY } = getPosition(event)\n\n            document.addEventListener('mousemove', mousemove)\n            document.addEventListener('mouseup', mouseup)\n\n            document.addEventListener('touchmove', mousemove)\n            document.addEventListener('touchend', mouseup)\n\n            startX = clientX\n            startY = clientY\n            cachedShiftX = this.shift.left\n            cachedShiftY = this.shift.top\n\n          //  event.preventDefault()\n          }\n\n          let mousemove = (event) => {\n            let { clientX, clientY } = getPosition(event)\n\n            this.shift.left = cachedShiftX + clientX - startX\n            this.shift.top = cachedShiftY + clientY - startY\n            event.preventDefault()\n          }\n\n          let mouseup = (event) => {\n            document.removeEventListener('mousemove', mousemove)\n            document.removeEventListener('mouseup', mouseup)\n\n            document.removeEventListener('touchmove', mousemove)\n            document.removeEventListener('touchend', mouseup)\n\n            event.preventDefault()\n          }\n\n          dragger.addEventListener('mousedown', mousedown)\n          dragger.addEventListener('touchstart', mousedown)\n        }\n      },\n\n      removeDraggableListeners () {\n      //  console.log('removing draggable handlers')\n      },\n\n      /**\n       * 'opened' and 'closed' events are `$emit`ed here.\n       * This is called in watch.visible.\n       * Because modal DOM updates are async,\n       * wrapping afterEvents in `$nextTick` fixes `$refs.modal` undefined bug.\n       * (fixes #15)\n       */\n      callAfterEvent (state) {\n        if (state) {\n          this.connectObserver()\n        } else {\n          this.disconnectObserver()\n        }\n\n        const afterEventName = state\n          ? 'opened'\n          : 'closed'\n        const afterEvent = this.genEventObject({ state })\n\n        this.$emit(afterEventName, afterEvent)\n      },\n\n      /**\n       * Update $data.modal.renderedHeight using getBoundingClientRect.\n       * This method is called when:\n       * 1. modal opened\n       * 2. MutationObserver's observe callback\n       */\n      updateRenderedHeight () {\n        if (this.$refs.modal) {\n          this.modal.renderedHeight = this.$refs.modal\n            .getBoundingClientRect().height\n        }\n      },\n\n      /**\n       * Start observing modal's DOM, if childList or subtree changes,\n       * the callback (registered in beforeMount) will be called.\n       */\n      connectObserver () {\n        if (this.mutationObserver) {\n          this.mutationObserver.observe(this.$refs.modal, {\n            childList: true,\n            attributes: true,\n            subtree: true\n          })\n        }\n      },\n\n      /**\n       * Disconnects MutationObserver\n       */\n      disconnectObserver () {\n        if (this.mutationObserver) {\n          this.mutationObserver.disconnect()\n        }\n      }\n    }\n  }\n<\/script>\n<style>\n  .v--modal-block-scroll {\n    overflow: hidden;\n  }\n\n  .v--modal-overlay {\n    position: fixed;\n    box-sizing: border-box;\n    left: 0;\n    top: 0;\n    width: 100vw;\n    height: 100vh;\n    background: rgba(0, 0, 0, 0.2);\n    z-index: 999;\n    opacity: 1;\n  }\n\n  .v--modal-overlay.scrollable {\n    height: 100%;\n    min-height: 100vh;\n    overflow-y: auto;\n    padding-bottom: 10px;\n  }\n\n  .v--modal-overlay .v--modal-box {\n    position: relative;\n    overflow: hidden;\n    box-sizing: border-box;\n  }\n\n  .v--modal-overlay.scrollable .v--modal-box {\n    margin-bottom: 2px;\n    /* transition: top 0.2s ease; */\n  }\n\n  .v--modal {\n    background-color: white;\n    text-align: left;\n    border-radius: 3px;\n    box-shadow: 0 20px 60px -2px rgba(27, 33, 58, .4);\n    padding: 0;\n  }\n\n  .v--modal.v--modal-fullscreen {\n    width: 100vw;\n    height: 100vh;\n    margin: 0;\n    left: 0;\n    top: 0;\n  }\n\n  .v--modal-top-right {\n    display: block;\n    position: absolute;\n    right: 0;\n    top: 0;\n  }\n\n  .overlay-fade-enter-active, .overlay-fade-leave-active {\n    transition: all 0.2s;\n  }\n\n  .overlay-fade-enter, .overlay-fade-leave-active {\n    opacity: 0;\n  }\n\n  .nice-modal-fade-enter-active, .nice-modal-fade-leave-active {\n    transition: all 0.4s;\n  }\n\n  .nice-modal-fade-enter, .nice-modal-fade-leave-active {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n</style>\n" ],
            sourceRoot: "webpack://"
        } ]);
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(0)(), exports.push([ module.i, "\n.vue-modal-resizer {\n  display: block;\n  overflow: hidden;\n  position: absolute;\n  width: 12px;\n  height: 12px;\n  right: 0;\n  bottom: 0;\n  z-index: 9999999;\n  background: transparent;\n  cursor: se-resize;\n}\n.vue-modal-resizer::after {\n  display: block;\n  position: absolute;\n  content: '';\n  background: transparent;\n  left: 0;\n  top: 0;\n  width: 0;\n  height: 0;\n  border-bottom: 10px solid #ddd;\n  border-left: 10px solid transparent;\n}\n.vue-modal-resizer.clicked::after {\n  border-bottom: 10px solid #369BE9;\n}\n", "", {
            version: 3,
            sources: [ "/./src/Resizer.vue?29279603" ],
            names: [],
            mappings: ";AA+EA;EACA,eAAA;EACA,iBAAA;EACA,mBAAA;EACA,YAAA;EACA,aAAA;EACA,SAAA;EACA,UAAA;EACA,iBAAA;EACA,wBAAA;EACA,kBAAA;CACA;AAEA;EACA,eAAA;EACA,mBAAA;EACA,YAAA;EACA,wBAAA;EACA,QAAA;EACA,OAAA;EACA,SAAA;EACA,UAAA;EACA,+BAAA;EACA,oCAAA;CACA;AAEA;EACA,kCAAA;CACA",
            file: "Resizer.vue",
            sourcesContent: [ "<template>\n  <div :class=\"className\"></div>\n</template>\n<script>\nimport { inRange } from './util'\n\nexport default {\n  name: 'VueJsModalResizer',\n  props: {\n    minHeight: {\n      type: Number,\n      default: 0\n    },\n    minWidth: {\n      type: Number,\n      default: 0\n    }},\n  data () {\n    return {\n      clicked: false,\n      size: {}\n    }\n  },\n  mounted () {\n    this.$el.addEventListener('mousedown', this.start, false)\n  },\n  computed: {\n    className () {\n      return {'vue-modal-resizer': true, 'clicked': this.clicked}\n    }\n  },\n  methods: {\n    start (event) {\n      this.clicked = true\n\n      window.addEventListener('mousemove', this.mousemove, false)\n      window.addEventListener('mouseup', this.stop, false)\n\n      event.stopPropagation()\n      event.preventDefault()\n    },\n    stop () {\n      this.clicked = false\n\n      window.removeEventListener('mousemove', this.mousemove, false)\n      window.removeEventListener('mouseup', this.stop, false)\n\n      this.$emit('resize-stop', {\n        element: this.$el.parentElement,\n        size: this.size\n      })\n    },\n    mousemove (event) {\n      this.resize(event)\n    },\n    resize (event) {\n      var el = this.$el.parentElement\n\n      if (el) {\n        var width = event.clientX - el.offsetLeft\n        var height = event.clientY - el.offsetTop\n\n        width = inRange(this.minWidth, window.innerWidth, width)\n        height = inRange(this.minHeight, window.innerHeight, height)\n\n        this.size = {width, height}\n        el.style.width = width + 'px'\n        el.style.height = height + 'px'\n\n        this.$emit('resize', {\n          element: el,\n          size: this.size\n        })\n      }\n    }\n  }\n}\n<\/script>\n<style>\n.vue-modal-resizer {\n  display: block;\n  overflow: hidden;\n  position: absolute;\n  width: 12px;\n  height: 12px;\n  right: 0;\n  bottom: 0;\n  z-index: 9999999;\n  background: transparent;\n  cursor: se-resize;\n}\n\n.vue-modal-resizer::after {\n  display: block;\n  position: absolute;\n  content: '';\n  background: transparent;\n  left: 0;\n  top: 0;\n  width: 0;\n  height: 0;\n  border-bottom: 10px solid #ddd;\n  border-left: 10px solid transparent;\n}\n\n.vue-modal-resizer.clicked::after {\n  border-bottom: 10px solid #369BE9;\n}\n</style>\n" ],
            sourceRoot: "webpack://"
        } ]);
    }, function(module, exports, __webpack_require__) {
        __webpack_require__(20);
        var Component = __webpack_require__(1)(__webpack_require__(9), __webpack_require__(17), null, null);
        Component.options.__file = "/Users/yev/Projects/vue/vue-js-modal/src/Resizer.vue", 
        Component.esModule && Object.keys(Component.esModule).some(function(key) {
            return "default" !== key && "__esModule" !== key;
        }) && console.error("named exports are not supported in *.vue files."), Component.options.functional && console.error("[vue-loader] Resizer.vue: functional components are not supported with templates, they should use render functions."), 
        module.exports = Component.exports;
    }, function(module, exports, __webpack_require__) {
        module.exports = {
            render: function() {
                var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
                return _c("modal", {
                    attrs: {
                        name: "dialog",
                        height: "auto",
                        classes: [ "v--modal", "vue-dialog", this.params.class ],
                        width: _vm.width,
                        "pivot-y": .3,
                        adaptive: !0,
                        clickToClose: _vm.clickToClose,
                        transition: _vm.transition
                    },
                    on: {
                        "before-open": _vm.beforeOpened,
                        "before-close": _vm.beforeClosed,
                        opened: function($event) {
                            _vm.$emit("opened", $event);
                        },
                        closed: function($event) {
                            _vm.$emit("closed", $event);
                        }
                    }
                }, [ _c("div", {
                    staticClass: "dialog-content"
                }, [ _vm.params.title ? _c("div", {
                    staticClass: "dialog-c-title",
                    domProps: {
                        innerHTML: _vm._s(_vm.params.title || "")
                    }
                }) : _vm._e(), _vm._v(" "), _c("div", {
                    staticClass: "dialog-c-text",
                    domProps: {
                        innerHTML: _vm._s(_vm.params.text || "")
                    }
                }) ]), _vm._v(" "), _vm.buttons ? _c("div", {
                    staticClass: "vue-dialog-buttons"
                }, _vm._l(_vm.buttons, function(button, i) {
                    return _c("button", {
                        key: i,
                        class: button.class || "vue-dialog-button",
                        style: _vm.buttonStyle,
                        domProps: {
                            innerHTML: _vm._s(button.title)
                        },
                        on: {
                            click: function($event) {
                                $event.stopPropagation(), _vm.click(i, $event);
                            }
                        }
                    }, [ _vm._v("\n        " + _vm._s(button.title) + "\n      ") ]);
                })) : _c("div", {
                    staticClass: "vue-dialog-buttons-none"
                }) ]);
            },
            staticRenderFns: []
        }, module.exports.render._withStripped = !0;
    }, function(module, exports, __webpack_require__) {
        module.exports = {
            render: function() {
                var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
                return _c("transition", {
                    attrs: {
                        name: "overlay-fade"
                    }
                }, [ _vm.visibility.overlay ? _c("div", {
                    ref: "overlay",
                    class: _vm.overlayClass,
                    attrs: {
                        "aria-expanded": _vm.visible.toString(),
                        "data-modal": _vm.name
                    },
                    on: {
                        mousedown: function($event) {
                            $event.stopPropagation(), _vm.onBackgroundClick($event);
                        },
                        touchstart: function($event) {
                            $event.stopPropagation(), _vm.onBackgroundClick($event);
                        }
                    }
                }, [ _c("div", {
                    staticClass: "v--modal-top-right"
                }, [ _vm._t("top-right") ], 2), _vm._v(" "), _c("transition", {
                    attrs: {
                        name: _vm.transition
                    }
                }, [ _vm.visibility.modal ? _c("div", {
                    ref: "modal",
                    class: _vm.modalClass,
                    style: _vm.modalStyle,
                    on: {
                        mousedown: function($event) {
                            $event.stopPropagation();
                        },
                        touchstart: function($event) {
                            $event.stopPropagation();
                        }
                    }
                }, [ _vm._t("default"), _vm._v(" "), _vm.resizable && !_vm.isAutoHeight ? _c("resizer", {
                    attrs: {
                        "min-width": _vm.minWidth,
                        "min-height": _vm.minHeight
                    },
                    on: {
                        resize: _vm.onModalResize
                    }
                }) : _vm._e() ], 2) : _vm._e() ]) ], 1) : _vm._e() ]);
            },
            staticRenderFns: []
        }, module.exports.render._withStripped = !0;
    }, function(module, exports, __webpack_require__) {
        module.exports = {
            render: function() {
                var _vm = this, _h = _vm.$createElement;
                return (_vm._self._c || _h)("div", {
                    class: _vm.className
                });
            },
            staticRenderFns: []
        }, module.exports.render._withStripped = !0;
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(11);
        "string" == typeof content && (content = [ [ module.i, content, "" ] ]), content.locals && (module.exports = content.locals);
        __webpack_require__(2)("e57c1368", content, !1);
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(12);
        "string" == typeof content && (content = [ [ module.i, content, "" ] ]), content.locals && (module.exports = content.locals);
        __webpack_require__(2)("0ba9730a", content, !1);
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(13);
        "string" == typeof content && (content = [ [ module.i, content, "" ] ]), content.locals && (module.exports = content.locals);
        __webpack_require__(2)("43d3f0d1", content, !1);
    }, function(module, exports) {
        module.exports = function(parentId, list) {
            for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                    id: parentId + ":" + i,
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                });
            }
            return styles;
        };
    } ]);
});

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentTab = function ContentTab(tabID, status) {
  _classCallCheck(this, ContentTab);

  this.tabID = tabID;
  this.status = status;
};

/* harmony default export */ __webpack_exports__["a"] = (ContentTab);

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class TestDefinitionsService {
  static get definitionStub () {
    return `
                <h4>Some Dummy word data</h4>
                <p>
                    Nunc maximus ex id tincidunt pretium. Nunc vel dignissim magna, ut hendrerit lectus. Proin aliquet purus at
                    ullamcorper dignissim. Sed mollis maximus dui. Morbi viverra, metus in fermentum lobortis, arcu est vehicula nibh, a
                    efficitur orci libero eu eros. Nam vulputate risus sed odio fermentum, quis pharetra nibh tincidunt. Mauris eu
                    posuere nunc, tincidunt accumsan metus. Nullam quis enim laoreet, euismod lacus ut, maximus ipsum. Donec vitae
                    sapien non sem eleifend posuere sed vel mauris.
                </p>
                <p>
                    Sed non orci convallis, iaculis ipsum quis, luctus orci. In et auctor metus. Vestibulum venenatis turpis nibh, vitae
                    ornare urna fringilla eu. Nam efficitur blandit metus. Nullam in quam et sapien iaculis accumsan nec ut neque.
                    Aenean aliquam urna quis egestas tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames
                    ac turpis egestas. Praesent sit amet tellus dignissim, tristique ante luctus, gravida lectus.
                </p>
            `
  }

  static async getDefinition (language, word) {
    return TestDefinitionsService.definitionStub
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TestDefinitionsService;



/***/ }),
/* 41 */
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