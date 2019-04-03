import Message from '../message/message'
import ResponseMessage from './response-message'

/**
 * Sends endpoint data that is retrieved from environment back
 */
export default class EndpointsResponse extends ResponseMessage {
  constructor (request, userInfo, responseCode) {
    super(request, userInfo, responseCode)
    this.type = Symbol.keyFor(Message.types.ENDPOINTS_RESPONSE)
  }
}
