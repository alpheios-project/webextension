import Message from '../message/message'
import ResponseMessage from './response-message'
import TabScript from '../../content/tab-script'

export default class StateResponse extends ResponseMessage {
  /**
   * Status response initialization.
   * @param {RequestMessage} request - A request we're responding to.
   * @param {Message.statuses} status - A current status of an object.
   * @param {Symbol | string} statusCode - A status code for a request that initiated this response.
   */
  constructor (request, status, statusCode = undefined) {
    super(request, TabScript.serializable(status), statusCode)
    this.type = Symbol.keyFor(Message.types.STATE_RESPONSE)
  }
}
