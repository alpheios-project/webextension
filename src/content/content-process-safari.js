/* eslint-disable no-unused-vars */
/* global safari */

import BaseContentProcess from '@/content/base-content-process'

import Message from '@/lib/messaging/message/message'
import MessagingService from '@/lib/messaging/service-safari'

import StateMessage from '@/lib/messaging/message/state-message'

import { LocalStorageArea } from 'alpheios-components'

export default class ContentProcessSafari extends BaseContentProcess {
  initialize () {
    super.initialize()
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    safari.self.addEventListener('message', this.messagingService.listener.bind(this.messagingService))
    this.sendStateToBackground('updateState')
  }

  get storageAreaClass () {
    return LocalStorageArea
  }

  get messagingServiceClass () {
    return MessagingService
  }

  sendStateToBackground (messageName) {
    safari.extension.dispatchMessage(messageName, new StateMessage(this.state))
  }

  updatePanelOnActivation () {
    super.updatePanelOnActivation()
    this.sendStateToBackground('updateState')
  }
}
