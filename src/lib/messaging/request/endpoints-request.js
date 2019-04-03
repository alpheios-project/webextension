import Message from '../message/message'
import RequestMessage from './request-message'

/**
 * Retrieves endpoint config from environment
 */
export default class EndpointsRequest extends RequestMessage {
  constructor () {
    super()
    this.type = Symbol.keyFor(Message.types.ENDPOINTS_REQUEST)
  }
}
