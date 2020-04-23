/* global browser, BUILD_NUMBER, BUILD_NAME, BUILD_BRANCH */
import Message from '@/lib/messaging/message/message.js'
import ContentReadyMessage from '@/lib/messaging/message/content-ready-message.js'
import EmbedLibMessage from '@/lib/messaging/message/embed-lib-message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import MessagingService from '@/lib/messaging/service.js'
import BgAuthenticator from '@/lib/auth/bg-authenticator.js'
import {
  TabScript, UIController, ExtensionSyncStorage, HTMLPage, L10n, Locales, enUS, enGB,
  AuthModule, PanelModule, PopupModule, ToolbarModule, ActionPanelModule, Platform, Logger
} from 'alpheios-components'

let messagingService = null
let uiController = null
const logger = Logger.getInstance()

const sendContentReadyToBackground = function sendContentReadToBackground () {
  messagingService.sendMessageToBg(new ContentReadyMessage(uiController.state))
    .catch((error) => logger.error('Unable to send content ready message to background', error))
}

const sendStateToBackground = function sendStateToBackground () {
  messagingService.sendMessageToBg(new StateMessage(uiController.state))
    .catch((error) => logger.error('Unable to send state to background', error))
}

const sendResponseToBackground = function sendResponseToBackground (request, state = uiController.state) {
  messagingService.sendResponseToBg(new StateResponse(request, state)).catch(
    (error) => {
      logger.error('Unable to send a response to a state request', error)
    }
  )
}

/**
 * State request processing function.
 */
const handleStateRequest = function handleStateRequest (request) {
  const requestState = TabScript.readObject(request.body)
  const diff = uiController.state.diff(requestState)

  // If there is an Alpheios embedded library present, ignore all requests from background
  // and send a response back informing that an embedded lib is enabled
  uiController.state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
  if (uiController.state.isEmbedLibActive()) {
    // Notify background if an embedded library is active
    requestState.setEmbedLibActiveStatus()
    sendResponseToBackground(request, requestState)
    return
  }

  if (diff.has('tabID')) {
    if (!uiController.state.tabID) {
      // Content script has been just loaded and does not have its tab ID yet
      uiController.state.tabID = diff.tabID
      uiController.state.tabObj = requestState.tabObj
    } else if (!uiController.state.hasSameID(diff.tabID)) {
      logger.warn(`State request with the wrong tab ID "${Symbol.keyFor(diff.tabID)}" received. This tab ID is "${Symbol.keyFor(uiController.state.tabID)}"`)
      // TODO: Should we ignore such requests?
      uiController.state.tabID = requestState.tabID
      uiController.state.tabObj = requestState.tabObj
    }
  }

  if (diff.has('status') && diff.status === TabScript.statuses.script.ACTIVE) {
    // This is an activation request

    // Set state according to activation request data
    if (diff.has('panelStatus')) { uiController.state.panelStatus = diff.panelStatus }
    if (diff.has('tab')) { uiController.state.tab = diff.tab }
    uiController.activate()
      .then(() => {
        // Set watchers after UI Controller activation so they will not notify background of activation-related events
        uiController.state.setWatcher('panelStatus', sendStateToBackground)
        uiController.state.setWatcher('tab', sendStateToBackground)
        sendResponseToBackground(request)
      })
      .catch((error) => logger.error(`Unable to activate Alpheios: ${error}`))
    return
  } else if (diff.has('status') && diff.status === TabScript.statuses.script.DEACTIVATED) {
    // This is a deactivation request
    uiController.deactivate()
      .then(() => {
        sendResponseToBackground(request)
      })
      .catch((error) => logger.error(`UI controller cannot be deactivated: ${error}`))
    return
  }

  if (diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) {
      uiController.api.ui.openPanel()
    } else if (diff.panelStatus === TabScript.statuses.panel.CLOSED) {
      uiController.api.ui.closePanel()
    }
  }

  if (diff.has('tab') && diff.tab) {
    uiController.changeTab(diff.tab)
  }

  sendResponseToBackground(request)
}

messagingService = new MessagingService()
const browserManifest = browser.runtime.getManifest()
let state = new TabScript() // eslint-disable-line prefer-const
// A message with PENDING status do not cause background object state updates
state.status = TabScript.statuses.script.PENDING
state.setPanelDefault()
state.setTabDefault()

// Set an application's mode from URL params
// If it is `dev` or `development`, an app will show additional options
const url = new URL(window.location.href)
let mode = url.searchParams.get('mode')
mode = (['dev', 'development'].includes(mode)) ? 'development' : 'production'

uiController = UIController.create(state, {
  storageAdapter: ExtensionSyncStorage,
  app: { name: browserManifest.name, version: browserManifest.version, buildBranch: BUILD_BRANCH, buildNumber: BUILD_NUMBER, buildName: BUILD_NAME },
  appType: Platform.appTypes.WEBEXTENSION,
  mode: mode
})
// Do environment-specific initializations
uiController.registerModule(AuthModule, { auth: new BgAuthenticator(messagingService) })
uiController.registerModule(PanelModule, {
  mountPoint: '#alpheios-panel' // To what element a panel will be mounted
})
uiController.registerModule(PopupModule, {
  mountPoint: '#alpheios-popup'
})
uiController.registerModule(ToolbarModule)
uiController.registerModule(ActionPanelModule)

// A notification from a embedded lib that it is present on a page. Upon receiving this we should destroy all Alpheios objects.
document.body.addEventListener('Alpheios_Embedded_Response', () => {
  uiController.state.setEmbedLibActiveStatus()
  messagingService.sendMessageToBg(new EmbedLibMessage(uiController.state))
    .catch((error) => logger.error('Unable to send embed lib message to background', error))
  if (uiController.state.isActive()) {
    const l10n = new L10n().addMessages(enUS, Locales.en_US).addMessages(enGB, Locales.en_GB).setLocale(Locales.en_US)
    const embedLibWarning = UIController.getEmbedLibWarning(l10n.getMsg('EMBED_LIB_WARNING_TEXT'))
    document.body.appendChild(embedLibWarning.$el)
    uiController.deactivate().catch((error) => logger.error(`Unable to deactivate Alpheios: ${error}`))
  }
})

document.body.addEventListener('Alpheios_Reload', () => {
  if (uiController.state.isActive()) {
    uiController.deactivate().catch((error) => logger.error(`Unable to deactivate Alpheios: ${error}`))
  }
  window.location.reload()
})

uiController.init()
  .then(() => {
    uiController.state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
    messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest, uiController)
    browser.runtime.onMessage.addListener(messagingService.listener.bind(messagingService))
    sendContentReadyToBackground()
  })
  .catch((error) => logger.error('Unable to activate Alpheios', error))
