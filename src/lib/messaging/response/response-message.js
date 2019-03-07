import Message from '../message/message'

/**
 * A generic response to a request message
 */
export default class ResponseMessage extends Message {
  /**
   * @param {RequestMessage} request - A request that resulted in this response
   * @param {Object} body - A response message body
   * @param {symbol} responseCode - A status code for a request that initiated this response
   * (i.e. Success, Failure, etc.)
   */
  constructor (request, body = {}, responseCode = ResponseMessage.responseCodes.UNDEFINED) {
    super(body)
    this.role = Symbol.keyFor(Message.roles.RESPONSE)
    this.requestID = request.ID // ID of the request to match request and response
    this.responseCodeStr = Symbol.keyFor(responseCode)
  }

  /**
   * A builder for a message with a SUCCESS response code.
   * @param request
   * @param {Object} body - A response message body
   * @return {ResponseMessage}
   * @constructor
   */
  static Success (request, body) {
    return new this(request, body, ResponseMessage.responseCodes.SUCCESS)
  }

  /**
   * A builder for a message with an Error response code.
   * @param request
   * @param {Error} error - An error object
   * @return {ResponseMessage}
   * @constructor
   */
  static Error (request, error) {
    return new this(request, error, ResponseMessage.responseCodes.ERROR)
  }

  static responseCode (message) {
    return Symbol.for(message.responseCodeStr)
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

/**
 * Specifies whether a request was processed successfully or not
 */
ResponseMessage.responseCodes = {
  // Request was processed successfully.
  // In this case a message body may contain a response data object or be empty
  SUCCESS: Symbol.for('Success'),

  // There is no information about what was the outcome of request
  UNDEFINED: Symbol.for('Undefined'),

  // Request failed
  ERROR: Symbol.for('Error')
}
