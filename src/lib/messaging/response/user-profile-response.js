import Message from '../message/message'
import ResponseMessage from './response-message'

/**
 * Sends user profile data that is retrieved from Auth0 back
 */
export default class UserProfileResponse extends ResponseMessage {
  constructor (request, userInfo, responseCode) {
    super(request, userInfo, responseCode)
    this.type = Symbol.keyFor(Message.types.USER_PROFILE_RESPONSE)
  }
}
