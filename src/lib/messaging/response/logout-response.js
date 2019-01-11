import Message from '../message/message'
import ResponseMessage from './response-message'

export default class LogoutResponse extends ResponseMessage {
  constructor (request, body, responseCode) {
    super(request, body, responseCode)
    this.type = Symbol.keyFor(Message.types.LOGOUT_RESPONSE)
  }
}
