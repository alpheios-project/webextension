import Message from '../message/message'
import ResponseMessage from './response-message'

export default class UserInfoResponse extends ResponseMessage {
  constructor (request, userInfo, statusCode = undefined) {
    super(request, userInfo, statusCode)
    this.type = Symbol.keyFor(Message.types.USER_INFO_RESPONSE)
  }
}
