import Message from '../message'

export default class ResponseMessage extends Message {
  constructor (request, body, status = undefined) {
    super(body)
    this.role = Symbol.keyFor(Message.roles.RESPONSE)
    this.requestID = request.ID // ID of the request to match request and response
    if (status) {
      if (typeof status === 'symbol') {
        // If status is a symbol, store a symbol key instead of a symbol for serialization
        this.status = Symbol.keyFor(status)
      } else {
        this.status = status
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
