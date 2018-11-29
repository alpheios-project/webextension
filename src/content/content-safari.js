/* global safari */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import { TabScript, UIController, LocalStorageArea, HTMLPage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style-safari.min.css' // eslint-disable-line
import Package from '../../package.json'

let uiController = null
let state = null
let initialized = false

/**
 * State request processing function.
 */
let handleStateRequest = async function handleStateRequest (message) {
  console.log(`State request received`, message)
  if (!uiController) {
    uiController = UIController.create(state, {
      storageAdapter: LocalStorageArea,
      app: { name: 'Safari App Extension', version: `${Package.version}.${Package.build}` }
    })
    uiController.state.setWatcher('panelStatus', sendStateToBackground)
    uiController.state.setWatcher('tab', sendStateToBackground)

    await uiController.init()

    // A notification from a embedded lib that it is present on a page. Upon receiving this we should destroy all Alpheios objects.
    document.body.addEventListener('Alpheios_Embedded_Response', () => {
      // if we weren't already disabled, remember the current state
      // and then deactivate before disabling
      if (!uiController.state.isDisabled()) {
        uiController.state.save()
        if (uiController.state.isActive()) {
          uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
        }
      }
      uiController.state.disable()
    })
  }

  let requestState = TabScript.readObject(message.body)
  let diff = uiController.state.diff(requestState)

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
      if (requestState.panelStatus) {
        uiController.state.panelStatus = requestState.panelStatus
      }
      uiController.activate()
        .then(() => sendStateToBackground('updateState'))
        .catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    } else if (uiController.isActivated && diff.status === TabScript.statuses.script.DEACTIVATED) {
      uiController.deactivate()
        .then(() => sendStateToBackground('updateState'))
        .catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
    }
  }

  if (uiController.isActivated && diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) { uiController.panel.open() } else { uiController.panel.close() }
  }

  if (uiController.isActivated && diff.has('tab') && diff.tab) {
    uiController.changeTab(diff.tab)
  }
}

let sendStateToBackground = function sendStateToBackground (messageName) {
  safari.extension.dispatchMessage(messageName, new StateMessage(state))
}

document.addEventListener('DOMContentLoaded', (event) => {
  /*
  In Safari, if page contains several documents (as in case with frames), a content script is
  loaded for the "main" document (the topmost document) AND for each of the child documents
  (i.e. frames). Safari might also load content script for one or several blank documents
  that are created during Vue.js component rendering.
  We will use `HTMLPage.isValidTarget` to filter out documents where an Alpheios UI can and should
  be shown from those where it can not. If we're lucky, a single document will be selected.
  If not, we should adjust filtering rules to accommodate such cases.
   */

  if (HTMLPage.isValidTarget) {
    initialized = true
    console.log(`Activating a messaging service, initialized: ${initialized}`)
    let messagingService = new MessagingService()
    messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest)
    safari.self.addEventListener('message', messagingService.listener.bind(messagingService))

    /*
    In situations where a page with an already activated content script is reloaded
    and a UI controller is deactivated because of that,
    we need to notify Safari app extension about this
    so that it could update states of an icon and a pop-up menu
     */
    state = new TabScript()
    state.status = TabScript.statuses.script.PENDING
    state.panelStatus = TabScript.statuses.panel.CLOSED
    sendStateToBackground('updateState')
  }
})
