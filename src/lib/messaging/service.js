/* global browser */
import ResponseMessage from './response/response-message'
import StoredOutgoingRequest from './stored-request'

export default class Service {
  constructor () {
    this.messages = new Map()
    this.listeners = new Map()
  }

  /**
   * Adds a handler function for each particular message type. If thisValue is provided, a handler function
   * will be bound to it.
   * Usually there is no need to add handlers to responses: they will be handled via a promise fulfillment
   * within registerRequest() and SendRequestTo...() logic. Thus, only handlers to incoming requests
   * need to be registered.
   * @param {Message.types} type - A type of a message to listen
   * @param {Function} handlerFunc - A function that will be called when a message of a certain type is received.
   * @param thisValue - An object a listenerFunc will be bound to (optional)
   */
  addHandler (type, handlerFunc, thisValue = undefined) {
    if (thisValue) { handlerFunc = handlerFunc.bind(thisValue) }
    this.listeners.set(type, handlerFunc)
  }

  /**
   * A message dispatcher function
   */
  listener (message, sender) {
    console.log(`New message received:`, message)
    console.log(`From:`, sender)
    if (!message.type) {
      console.error(`Skipping a message of an unknown type`)
      return false
    }

    if (ResponseMessage.isResponse(message) && this.messages.has(message.requestID)) {
      /*
    If message is a response to a known request, remove it from the map and resolve a promise.
    Response will be handled within a request callback.
    */
      this.fulfillRequest(message)
    } else if (this.listeners.has(Symbol.for(message.type))) {
      // Pass message to a registered handler if there are any
      this.listeners.get(Symbol.for(message.type))(message, sender)
    } else {
      console.log(`Either no listeners has been registered for a message of type "${message.type}" or
      this is a response message with a timeout expired. Ignoring`)
    }

    return false // Indicate that we are not sending any response back
  }

  /**
   * Registers an outgoing request in a request map. Returns a promise that will be fulfilled when when
   * a response will be received or will be rejected when a timeout will expire.
   * @param {RequestMessage} request - An outgoing request.
   * @param {number} timeout - A number of milliseconds we'll wait for a response before rejecting a promise.
   * @return {Promise} - An asynchronous result of an operation.
   */
  registerRequest (request, timeout = undefined) {
    let requestInfo = new StoredOutgoingRequest(request)
    this.messages.set(request.ID, requestInfo)
    if (timeout) {
      requestInfo.timeoutID = window.setTimeout((requestID) => {
        let requestInfo = this.messages.get(requestID)
        console.log('Timeout has been expired')
        requestInfo.reject(new Error(`Timeout has been expired`))
        this.messages.delete(requestID) // Remove from map
        console.log(`Map length is ${this.messages.size}`)
      }, timeout, request.ID)
    }
    console.log(`Map length is ${this.messages.size}`)
    return requestInfo.promise
  }

  sendRequestToTab (request, timeout, tabID) {
    let promise = this.registerRequest(request, timeout)
    browser.tabs.sendMessage(tabID, request).then(
      () => { console.log(`Successfully sent a request to a tab`) },
      (error) => {
        console.error(`tabs.sendMessage() failed: ${error}`)
        this.rejectRequest(request.ID, error)
      }
    )
    return promise
  }

  sendRequestToBg (request, timeout) {
    let promise = this.registerRequest(request, timeout)
    browser.runtime.sendMessage(request).then(
      () => { console.log(`Successfully sent a request to a background`) },
      (error) => {
        console.error(`Sending request to a background failed: ${error}`)
        this.rejectRequest(request.ID, error)
      }
    )
    return promise
  }

  sendResponseToTab (message, tabID) {
    console.log(`Sending response to a tab ID ${tabID}`)
    return browser.tabs.sendMessage(tabID, message)
  }

  sendResponseToBg (message) {
    return browser.runtime.sendMessage(message)
  }

  fulfillRequest (responseMessage) {
    if (this.messages.has(responseMessage.requestID)) {
      let requestInfo = this.messages.get(responseMessage.requestID)
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      requestInfo.resolve(responseMessage) // Resolve with a response message
      this.messages.delete(responseMessage.requestID) // Remove request from a map
      console.log(`Map length is ${this.messages.size}`)
    }
  }

  rejectRequest (requestID, error) {
    if (requestID && this.messages.has(requestID)) {
      let requestInfo = this.messages.get(requestID)
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      requestInfo.reject(error)
      this.messages.delete(requestID) // Remove request from a map
      console.log(`Map length is ${this.messages.size}`)
    }
  }
}
