import Message from '../message/message'
import RequestMessage from './request-message'

/**
 * Retrieves user profile data from Auth0
 */
export default class UserProfileRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.USER_PROFILE_REQUEST)
  }
}
