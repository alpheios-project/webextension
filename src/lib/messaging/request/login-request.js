import Message from '../message/message'
import RequestMessage from './request-message'

export default class LoginRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.LOGIN_REQUEST)
  }
}
