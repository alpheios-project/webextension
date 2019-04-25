import Message from '../message/message'
import RequestMessage from './request-message'

/**
 * Retrieves user session data validity
 */
export default class UserSessionRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.USER_SESSION_REQUEST)
  }
}
