import * as Models from 'alpheios-data-models'

export default class MediaSelector {
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
    return Models.LanguageModelFactory.getLanguageForCode(languageCode)
  }
}
