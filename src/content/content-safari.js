/* global safari, Event */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import { TabScript, UIController, PanelModule, PopupModule, LocalStorageArea, HTMLPage, L10n, enUS, Locales, enGB } from 'alpheios-components'
import Package from '../../package.json'

const pingInterval = 15000 // How often to ping background with a state message, in ms
let pingIntervalID = null
let uiController = null
let state = null

/**
 * Activates a ping that will send state to background periodically
 */
let activatePing = function activatePing () {
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
  pingIntervalID = window.setInterval(() => {
    if (state && state.isActive()) {
      sendMessageToBackground('ping')
    }
  }, pingInterval)
}

/**
 * Deactivates a ping that was set by `activatePing`
 */
let deactivatePing = function deactivatePing () {
  if (pingIntervalID) {
    window.clearInterval(pingIntervalID)
  }
}

/**
 * Dispatch an Alpheios_Active event to the page
 */
let notifyPageActive = function () {
  document.body.dispatchEvent(new Event('Alpheios_Active'))
}

/**
 * Dispatch an Alpheios_Inactive event to the page
 */
let notifyPageInactive = function () {
  document.body.dispatchEvent(new Event('Alpheios_Inactive'))
}

/**
 * Deactivates a UI controller and notifies Safari app extension about it,
 * depending on the `notify` parameter value.
 * @param {Boolean} notify - Will notify app extension only if this parameter is true.
 */
let deactivateUIController = function deactivateUIController (notify = true) {
  uiController.deactivate()
    .then(() => {
      if (notify) {
        sendMessageToBackground('updateState')
      }
      deactivatePing()
      notifyPageInactive()
    })
    .catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
}

/**
 * A listener for an Alpheios embedded library event message.
 */
let embeddedLibListener = function embeddedLibListener () {
  // We discovered that an Alpheios embedded lib is active
  state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
  // Notify background that an embed lib is active
  sendMessageToBackground('embedLibActive')
  if (state.isActive()) {
    // Display a panel with a warning about extension being deactivated
    let l10n = new L10n().addMessages(enUS, Locales.en_US).addMessages(enGB, Locales.en_GB).setLocale(Locales.en_US)
    let embedLibWarning = UIController.getEmbedLibWarning(l10n.getMsg('EMBED_LIB_WARNING_TEXT'))
    document.body.appendChild(embedLibWarning.$el)
    deactivateUIController(false)
  }
}

/**
 * State request processing function.
 */
let handleStateRequest = async function handleStateRequest (message) {
  state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
  if (state.isEmbedLibActive()) {
    // Inform a background that an Alpheios embedded library is active
    sendMessageToBackground('embedLibActive')
    return
  }

  let requestState = TabScript.readObject(message.body)
  let diff = state.diff(requestState)

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
    if (diff.has('status') && diff.status === TabScript.statuses.script.ACTIVE) {
      uiController = UIController.create(state, {
        storageAdapter: LocalStorageArea,
        app: { name: 'Safari App Extension', version: `${Package.version}.${Package.build}` }
      })
      uiController.registerUiModule(PanelModule, {
        mountPoint: '#alpheios-panel', // To what element a panel will be mounted
        panelComponent: 'panel' // A Vue component that will represent a panel
      })
      uiController.registerUiModule(PopupModule, {
        mountPoint: '#alpheios-popup'
      })
      await uiController.init()
    } else {
      // If uninitialized, ignore all other requests other than activate
      // TODO: This is due to Safari background sending state request after reload. Need to fix
      return
    }
  }

  if (diff.has('status') && diff.status === TabScript.statuses.script.ACTIVE) {
    // This is an activation request

    // Set state according to activation request data
    if (diff.has('panelStatus')) { state.panelStatus = diff.panelStatus }
    if (diff.has('tab')) { state.tab = diff.tab }
    uiController.activate()
      .then(() => {
        // Set watchers after UI Controller activation so they will not notify background of activation-related events
        uiController.state.setWatcher('panelStatus', sendMessageToBackground.bind(this, 'updateState'))
        uiController.state.setWatcher('tab', sendMessageToBackground.bind(this, 'updateState'))
        activatePing()
        notifyPageActive()
        sendMessageToBackground('updateState')
      })
      .catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    return
  } else if (diff.has('status') && diff.status === TabScript.statuses.script.DEACTIVATED) {
    // This is a deactivation request

    // Set state according to activation request data
    if (diff.has('panelStatus')) { state.panelStatus = diff.panelStatus }
    if (diff.has('tab')) { state.tab = diff.tab }
    deactivateUIController()
    return
  }

  if (diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) {
      uiController.api.ui.openPanel()
    } else if (diff.panelStatus === TabScript.statuses.panel.CLOSED) {
      uiController.api.ui.closePanel()
    }
  }
  if (diff.has('tab') && diff.tab) { uiController.changeTab(diff.tab) }
  sendMessageToBackground('updateState')
}

let sendMessageToBackground = function sendStateToBackground (messageName) {
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
    state.deactivate()
    state.setPanelDefault()
    state.setTabDefault()
    state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
    if (!state.isEmbedLibActive()) {
      // We did not discover embedded library right away. Let's set a message listener for its response
      // and fire an event to double check
      document.body.addEventListener('Alpheios_Embedded_Response', embeddedLibListener)
      document.body.dispatchEvent(new Event('Alpheios_Embedded_Check'))
    }
    sendMessageToBackground('contentReady')
  }
})
