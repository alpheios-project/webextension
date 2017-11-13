import Message from '../message'
import ResponseMessage from './response-message'

export default class StatusResponse extends ResponseMessage {
  /**
   * Status response initialization.
   * @param {RequestMessage} request - A request we're responding to.
   * @param {Message.statuses} status - A current status of a party requested.
   */
  constructor (request, status) {
    super(request, undefined, status)
    this.type = Symbol.keyFor(Message.types.STATUS_RESPONSE)
  }
}
