import Message from '../message/message'
import RequestMessage from './request-message'

export default class LogoutRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.LOGOUT_REQUEST)
  }
}
