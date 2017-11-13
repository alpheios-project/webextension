import * as Lib from 'alpheios-inflection-tables'
import Message from '../message'
import RequestMessage from './request-message'

export default class WordDataRequest extends RequestMessage {
  constructor (language, word) {
    super(new Lib.SelectedWord(language, word))
    this.type = Symbol.keyFor(Message.types.WORD_DATA_REQUEST)
  }
}
