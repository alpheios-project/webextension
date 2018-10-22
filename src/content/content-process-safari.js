/* eslint-disable no-unused-vars */
/* global safari */

import BaseContentProcess from '@/content/base-content-process'

import Message from '@safari/lib/messaging/message/message'
import MessagingService from '@safari/lib/messaging/service'

import StateMessage from '@safari/lib/messaging/message/state-message'

import TabScript from '@safari/lib/content/tab-script'
import { LocalStorageArea, MouseDblClick } from 'alpheios-components'

export default class ContentProcessSafari extends BaseContentProcess {
  initialize () {
    super.initialize()
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    safari.self.addEventListener('message', this.messagingService.listener.bind(this.messagingService))
    this.sendStateToBackground('updateState')
  }

  get tabScriptClass () {
    return TabScript
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
