import Message from '@safari/lib/messaging/message/message'

/**
 * A generic response to a request message
 */
export default class ResponseMessage extends Message {
  /**
   * @param {RequestMessage} request - A request that resulted in this response
   * @param {Object} body - A response message body
   * @param {Symbol | string} statusCode - A status code for a request that initiated this response
   * (i.e. Success, Failure, etc.)
   */
  constructor (request, body, statusCode = undefined) {
    super(body)
    this.role = Symbol.keyFor(Message.roles.RESPONSE)
    this.requestID = request.ID // ID of the request to match request and response
    if (statusCode) {
      if (typeof status === 'symbol') {
        // If status is a symbol, store a symbol key instead of a symbol for serialization
        this.status = Symbol.keyFor(statusCode)
      } else {
        this.status = statusCode
      }
    }
  }

  /**
   * Checks if this message is a response (i.e. follows a response message format)
   * @param message
   */
  static isResponse (message) {
    return message.role &&
    Symbol.for(message.role) === Message.roles.RESPONSE && message.requestID
  }
}
