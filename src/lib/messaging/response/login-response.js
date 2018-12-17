import Message from '../message/message'
import ResponseMessage from './response-message'

export default class LoginResponse extends ResponseMessage {
  /**
   * Status response initialization.
   * @param {RequestMessage} request - A request we're responding to.
   * @param {boolean} result - True if user logged in successfully, false otherwise.
   * @param {Symbol | string} statusCode - A status code for a request that initiated this response.
   */
  constructor (request, result, statusCode = undefined) {
    super(request, { result: result }, statusCode)
    this.type = Symbol.keyFor(Message.types.LOGIN_RESPONSE)
  }
}
