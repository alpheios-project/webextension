import TextQuoteSelector from './w3c/text-quote-selector'

/**
 * This is a general-purpose, media abstract selector that
 * @property {string} selectedText - Selected text (usually a single word)
 * @property {string] normalizedSelectedText - Selected text after normalization
 * @property {string} languageCode - A language code of a selection
 */
export default class TextSelector {
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
    return new TextQuoteSelector()
  }
}
