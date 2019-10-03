/* eslint-disable no-unused-vars */
/* global safari */

import BaseService from '@/lib/messaging/base-service'

export default class ServiceSafari extends BaseService {
  listener (sender) {
    const message = sender.message
    if (!message.type) {
      return false
    }
    if (this.listeners.has(Symbol.for(message.type))) {
      // Pass message to a registered handler if there are any
      this.listeners.get(Symbol.for(message.type))(message, sender)
    }
    return false // Indicate that we are not sending any response back
  }
}
