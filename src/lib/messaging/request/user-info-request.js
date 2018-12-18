import Message from '../message/message'
import RequestMessage from './request-message'

export default class UserInfoRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.USER_INFO_REQUEST)
  }
}
