/* global browser */
// import { ObjectMonitor as ExpObjMon } from 'alpheios-experience'

import BaseContentProcess from '@/content/base-content-process'

import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import TabScript from '../lib/content/tab-script'
import { ExtensionSyncStorage, MouseDblClick } from 'alpheios-components'

export default class ContentProcess extends BaseContentProcess {
  constructor () {
    super(TabScript)
  }

  initialize () {
    // Adds message listeners
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    MouseDblClick.listen('body', evt => this.getSelectedText(evt))
    document.body.addEventListener('keydown', this.handleEscapeKey.bind(this))
    document.body.addEventListener('Alpheios_Reload', this.handleReload.bind(this))
    document.body.addEventListener('Alpheios_Embedded_Response', this.disableContent.bind(this))
    document.body.addEventListener('Alpheios_Page_Load', this.updateAnnotations.bind(this))

    document.body.addEventListener('Alpheios_Options_Loaded', this.updatePanelOnActivation.bind(this))
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

  handleStateRequest (request, sender) {
    // Send a status response
    console.log(`State request has been received`)
    let state = TabScript.readObject(request.body)

    let diff = this.state.diff(state)
    if (diff.has('tabID')) {
      if (!this.state.tabID) {
        // Content script has been just loaded and does not have its tab ID yet
        this.state.tabID = diff.tabID
        this.state.tabObj = state.tabObj
      } else if (!this.state.hasSameID(diff.tabID)) {
        console.warn(`State request with the wrong tab ID "${Symbol.keyFor(diff.tabID)}" received. This tab ID is "${Symbol.keyFor(this.state.tabID)}"`)
        // TODO: Should we ignore such requests?
        this.state.tabID = state.tabID
        this.state.tabObj = state.tabObj
      }
    }

    if (diff.has('status')) {
      if (diff.status === TabScript.statuses.script.ACTIVE) {
        this.state.activate()
      } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
        this.state.deactivate()
        this.ui.panel.close()
        this.ui.popup.close()
        console.log('Content has been deactivated')
      } else if (diff.status === TabScript.statuses.script.DISABLED) {
        this.state.disable()
        console.log('Content has been disabled')
      }
    }

    if (this.ui) {
      if (diff.has('panelStatus')) {
        if (diff.panelStatus === TabScript.statuses.panel.OPEN) { this.ui.panel.open() } else { this.ui.panel.close() }
      }
      this.updatePanelOnActivation()

      if (diff.has('tab') && diff.tab) {
        this.ui.changeTab(diff.tab)
      }
    }

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

  updatePanelOnActivation () {
    if (this.isActive && this.ui.uiOptions.items.panelOnActivate.currentValue && !this.ui.panel.isOpen()) {
      this.ui.panel.open()
    }
  }
}
