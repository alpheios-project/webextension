/* global browser */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service.js'
import TabScript from '@/lib/content/tab-script.js'
import { UIController, ExtensionSyncStorage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line
import StateResponse from '../lib/messaging/response/state-response'

let messagingService = null
let uiController = null

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (request, sender) {
  console.log(`State request has been received`)
  let state = TabScript.readObject(request.body)
  let diff = uiController.state.diff(state)

  if (diff.has('tabID')) {
    if (!uiController.state.tabID) {
      // Content script has been just loaded and does not have its tab ID yet
      uiController.state.tabID = diff.tabID
      uiController.state.tabObj = state.tabObj
    } else if (!uiController.state.hasSameID(diff.tabID)) {
      console.warn(`State request with the wrong tab ID "${Symbol.keyFor(diff.tabID)}" received. This tab ID is "${Symbol.keyFor(uiController.state.tabID)}"`)
      // TODO: Should we ignore such requests?
      uiController.state.tabID = state.tabID
      uiController.state.tabObj = state.tabObj
    }
  }

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
      uiController.activate().catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
      uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
      console.log('Content has been deactivated')
    } else if (diff.status === TabScript.statuses.script.DISABLED) {
      // TODO: Do we really need this state?
      uiController.state.disable()
      console.log('Content has been disabled')
    }
  }

  if (diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) { uiController.panel.open() } else { uiController.panel.close() }
  }
  this.updatePanelOnActivation()
  if (diff.has('tab') && diff.tab) {
    uiController.changeTab(diff.tab)
  }

  messagingService.sendResponseToBg(new StateResponse(request, uiController.state)).catch(
    (error) => {
      console.error('Unable to send a response to a state request', error)
    }
  )
}

let sendStateToBackground = function sendStateToBackground () {
  messagingService.sendMessageToBg(new StateMessage(uiController.state))
    .catch((error) => console.error('Unable to send a response to activation request', error))
}

console.log(`Loaded listener fired`)

let state = new TabScript()
state.status = TabScript.statuses.script.PENDING
state.panelStatus = TabScript.statuses.panel.CLOSED
state.setWatcher('panelStatus', sendStateToBackground)
state.setWatcher('tab', sendStateToBackground)
messagingService = new MessagingService()
let browserManifest = browser.runtime.getManifest()
uiController = new UIController(state, ExtensionSyncStorage, browserManifest)
uiController.activate()
  .then(() => {
    messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest, uiController)
    browser.runtime.onMessage.addListener(messagingService.listener.bind(messagingService))
  })
  .catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
