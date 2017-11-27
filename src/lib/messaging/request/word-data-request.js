import Message from '../message'
import RequestMessage from './request-message'

export default class WordDataRequest extends RequestMessage {
  constructor (textSelector) {
    super(textSelector)
    this.type = Symbol.keyFor(Message.types.WORD_DATA_REQUEST)
  }
}
