import Message from '@safari/lib/messaging/message/message'
import ResponseMessage from '@safari/lib/messaging/response/response-message'
import TabScript from '@safari/lib/content/tab-script'

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
