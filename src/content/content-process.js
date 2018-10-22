/* global browser */
// import { ObjectMonitor as ExpObjMon } from 'alpheios-experience'

import BaseContentProcess from '@/content/base-content-process'

import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import TabScript from '../lib/content/tab-script'
import { ExtensionSyncStorage } from 'alpheios-components'

export default class ContentProcess extends BaseContentProcess {
  initialize () {
    // Adds message listeners
    super.initialize()
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    this.reactivate()
  }

  get storageAreaClass () {
    return ExtensionSyncStorage
  }

  get browserManifest () {
    return browser.runtime.getManifest()
  }

  get messagingServiceClass () {
    return MessagingService
  }

  get tabScriptClass () {
    return TabScript
  }

  handleStateRequest (request, sender) {
    super.handleStateRequest(request, sender)
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state)).catch(
      (error) => {
        console.error('Unable to send a response to a state request', error)
      }
    )
  }

  sendStateToBackground () {
    this.messagingService.sendMessageToBg(new StateMessage(this.state)).catch(
      (error) => {
        console.error('Unable to send a response to activation request', error)
      }
    )
  }
}
