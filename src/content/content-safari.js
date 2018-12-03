/* global safari */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import { TabScript, UIController, LocalStorageArea, HTMLPage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style-safari.min.css' // eslint-disable-line
import Package from '../../package.json'

const pingInterval = 15000 // How often to ping background with a state message, in ms
let uiController = null
let state = null

/**
 * Sends a state message to background, if UI Controller is in an active state.
 */
let pingBg = function pingBg () {
  if (state && state.isActive()) {
    sendStateToBackground('updateState')
  }
}

/**
 * State request processing function.
 */
let handleStateRequest = async function handleStateRequest (message) {
  /*
  As opposed to webextension, where content script is injected into a document (i.e. `window.document`)
  by a background script, Safari app extension injects content script into each document within a page
  (including documents within frames) on every page load. Since it happens automatically, script injection
  occurs event if extension is not activated by the user. That's why we don't want to create a controller
  instance when a script is injected (i.e. in DOMContentLoaded callback): if Alpheios extension will never
  be activated on a particular page (document) we would still waste resources creating an instance
  of a UI controller that will never be used. The more rational approach would be on page load
  to activate a message listener instead that, when an activation request from Safari App Extension is
  received, would create an instance of a UI controller, following a lazy initialization approach.
   */
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
      if (uiController.state.isPending()) {
        // This is a new activation (an activation after page reload)
        // If activation request has a desired panel status, set it now so that UI controller would open/not open panel according to it
        if (requestState.panelStatus) { uiController.state.panelStatus = requestState.panelStatus }
        if (requestState.tab) { uiController.changeTab(requestState.tab) }
      } else if (uiController.state.isDeactivated()) {
        // This is an activation after the previous deactivation
        // Panel status and tabs will be set to their default values
        uiController.setDefaultPanelState().setDefaultTabState()
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

    /*
    If Safari with an activated Alpheios Safari App Extension is moved out of focus,
    as when user is temporarily switched to some other application,  Safari App
    Extension will automatically be deactivated. Thus usually happens after a few
    dozen seconds (exact amount of time is not clear). As a result of this, an icon
    of an extension will be switched to an inactive state. To prevent this, we have
    to ping a background with a state message periodically.
    There might be a more elegant way to handle this in future versions of
    Safari App Extension API, but for now it seems to be the only way.
     */
    window.setInterval(pingBg, pingInterval)
  }
})
