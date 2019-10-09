import Message from './message.js'

export default class LogoutMessage extends Message {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.LOGOUT_MESSAGE)
  }
}
