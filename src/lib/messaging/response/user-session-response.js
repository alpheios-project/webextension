import Message from '../message/message'
import ResponseMessage from './response-message'

/**
 * Sends user session data validity
 */
export default class UserSessionResponse extends ResponseMessage {
  constructor (request, userData, responseCode) {
    super(request, userData, responseCode)
    this.type = Symbol.keyFor(Message.types.USER_SESSION_RESPONSE)
  }
}
