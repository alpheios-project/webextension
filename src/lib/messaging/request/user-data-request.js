import Message from '../message/message'
import RequestMessage from './request-message'

/**
 * Retrieves user data from a remote provider
 */
export default class UserDataRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.USER_DATA_REQUEST)
  }
}
