/* eslint-disable no-unused-vars */

/**
 * This is a Safari-specific implementation of a messaging service.
 */
export default class ServiceSafari {
  constructor () {
    this.messages = new Map()
    this.listeners = new Map()
  }

  addHandler (type, handlerFunc, thisValue = undefined) {
    if (thisValue) { handlerFunc = handlerFunc.bind(thisValue) }
    this.listeners.set(type, handlerFunc)
  }

  listener (sender) {
    let message = sender.message
    console.log(`New message received:`, message)
    console.log(`From:`, sender)
    if (!message.type) {
      console.error(`Skipping a message of an unknown type`)
      return false
    }
    if (this.listeners.has(Symbol.for(message.type))) {
      // Pass message to a registered handler if there are any
      this.listeners.get(Symbol.for(message.type))(message, sender)
    } else {
      console.log(`Either no listeners has been registered for a message of type "${message.type}" or
      this is a response message with a timeout expired. Ignoring`)
    }
    return false // Indicate that we are not sending any response back
  }
}
