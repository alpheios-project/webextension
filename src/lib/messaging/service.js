/* global browser */
import BaseService from '@/lib/messaging/base-service'
import ResponseMessage from './response/response-message'
import StoredOutgoingRequest from './stored-request'

// Errors that are known to the Service
import TransferrableError from '@/lib/messaging/error/transferrable-error.js'
import AuthError from '@/lib/auth/errors/auth-error.js'
import { Logger } from 'alpheios-components'

const knownErrors = new Map([
  [AuthError.name, AuthError]
])
const logger = Logger.getInstance()

export default class Service extends BaseService {
  /**
   * A message dispatcher function
   */
  listener (message, sender) {
    if (!message.type) {
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
    let requestInfo = new StoredOutgoingRequest(request) // eslint-disable-line prefer-const
    this.messages.set(request.ID, requestInfo)
    if (timeout) {
      requestInfo.timeoutID = window.setTimeout((requestID) => {
        let requestInfo = this.messages.get(requestID) // eslint-disable-line prefer-const
        requestInfo.reject(new Error('Timeout has been expired'))
        this.messages.delete(requestID) // Remove from map
      }, timeout, request.ID)
    }
    return requestInfo.promise
  }

  sendRequestToTab (request, timeout, tabID) {
    const promise = this.registerRequest(request, timeout)

    browser.tabs.sendMessage(tabID, request).catch(error => {
      logger.error('Tabs.sendMessage() failed:', error)
      this.rejectRequest(request.ID, error)
    })
    return promise
  }

  /**
   * Sends a request to the background with a specified timout.
   * @param request
   * @param timeout
   * @return {Promise}
   */
  sendRequestToBg (request, timeout) {
    const promise = this.registerRequest(request, timeout)
    browser.runtime.sendMessage(request).catch(error => {
      logger.error('Sending request to a background failed:', error)
      this.rejectRequest(request.ID, error)
    })
    return promise
  }

  sendResponseToTab (message, tabID) {
    return browser.tabs.sendMessage(tabID, message)
  }

  sendResponseToBg (message) {
    return browser.runtime.sendMessage(message)
  }

  /**
   * Passes a response information to the request callback by resolving or rejecting a promise.
   * If request has been completed successfully, promise is resolved with the response message object.
   * If request failed, a responseCode is ERROR and a response body contains
   * a TranferrableError JSON-like object. In this case an error instance will be created
   * and a promise will be rejected with this error object.
   * @param responseMessage
   */
  fulfillRequest (responseMessage) {
    if (this.messages.has(responseMessage.requestID)) {
      const requestInfo = this.messages.get(responseMessage.requestID)
      const responseCode = ResponseMessage.responseCode(responseMessage)
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      if (responseCode === ResponseMessage.responseCodes.ERROR) {
        // There was an error
        if (!responseMessage.body.name) {
          // No error information in the message body
          requestInfo.reject(responseMessage) // Resolve with a response message body
        } else if (knownErrors.has(responseMessage.body.name)) {
          // This is a known error
          requestInfo.reject(knownErrors.get(responseMessage.body.name).fromJSON(responseMessage.body))
        } else {
          // It is an error, but not known to the Service. Reject with a base error object.
          requestInfo.reject(TransferrableError.fromJSON(responseMessage.body))
        }
      } else {
        // Request was processed without errors
        requestInfo.resolve(responseMessage)
      }

      this.messages.delete(responseMessage.requestID) // Remove request from a map
    }
  }

  rejectRequest (requestID, error) {
    if (requestID && this.messages.has(requestID)) {
      let requestInfo = this.messages.get(requestID) // eslint-disable-line prefer-const
      window.clearTimeout(requestInfo.timeoutID) // Clear a timeout
      requestInfo.reject(error)
      this.messages.delete(requestID) // Remove request from a map
    }
  }

  sendMessageToTab (request, tabID) {
    return browser.tabs.sendMessage(tabID, request)
  }

  sendMessageToBg (request) {
    return browser.runtime.sendMessage(request)
  }
}
