import Message from '../message'
import ResponseMessage from './response-message'

export default class WordDataResponse extends ResponseMessage {
  constructor (request, wordData, status) {
    super(request, wordData, status)
    this.type = Symbol.keyFor(Message.types.WORD_DATA_RESPONSE)
  }
}
