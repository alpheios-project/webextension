import Message from './message.js'

export default class LogoutMessage extends Message {
  /**
   * Creates an instance of a LogoutMessage.
   *
   * @param {AuthData} authData - an AuthData object.
   * It will be empty except for the `hasSessionExpired` flag
   * which will be set if user had been logged out due to timeout.
   */
  constructor (authData) {
    super(authData)
    this.type = Symbol.keyFor(Message.types.LOGOUT_MESSAGE)
  }
}
