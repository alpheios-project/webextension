import Message from '../message/message'
import ResponseMessage from './response-message'

export default class LoginResponse extends ResponseMessage {
  constructor (request, result, statusCode = undefined) {
    super(request, { result: result }, statusCode)
    this.type = Symbol.keyFor(Message.types.LOGIN_RESPONSE)
  }
}
