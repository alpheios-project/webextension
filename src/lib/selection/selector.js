import TextQuoteSelector from './w3c/text-quote-selector'

export default class Selector {
  constructor () {
    this.word = null
    this.normalized_word = null
    this.start = 0
    this.end = 0
    this.context = null
    this.position = 0
  }

  get textQuoteSelector () {
    return new TextQuoteSelector()
  }
}
