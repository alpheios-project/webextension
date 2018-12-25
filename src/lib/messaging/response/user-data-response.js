import Message from '../message/message'
import ResponseMessage from './response-message'

/**
 * Sends user profile data that is retrieved from Auth0 back
 */
export default class UserDataResponse extends ResponseMessage {
  constructor (request, userData, responseCode) {
    super(request, userData, responseCode)
    this.type = Symbol.keyFor(Message.types.USER_DATA_RESPONSE)
  }
}
