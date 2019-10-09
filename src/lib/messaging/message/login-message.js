import Message from './message.js'

export default class LoginMessage extends Message {
  constructor (authData) {
    super(authData)
    this.type = Symbol.keyFor(Message.types.LOGIN_MESSAGE)
  }
}
