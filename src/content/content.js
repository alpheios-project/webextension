/* global browser */
import Message from '@/lib/messaging/message/message.js'
import ContentReadyMessage from '@/lib/messaging/message/content-ready-message.js'
import EmbedLibMessage from '@/lib/messaging/message/embed-lib-message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import MessagingService from '@/lib/messaging/service.js'
import BgAuthenticator from '@/lib/auth/bg-authenticator.js'
import { TabScript, UIController, UIEventController, ExtensionSyncStorage, HTMLPage, L10n, Locales, enUS, enGB,
  LexicalQuery, ResourceQuery, AnnotationQuery, L10nModule, AuthModule, PanelModule, PopupModule,
  MouseDblClick, LongTap, GenericEvt } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line

let messagingService = null
let uiController = null

/*
A UI controller's builder function customized for webextension
 */
const createUiController = (state, options) => {
  let uiController = new UIController(state, options)

  // Register data modules
  uiController.registerDataModule(L10nModule, Locales.en_US, Locales.bundleArr())
  uiController.registerDataModule(AuthModule, new BgAuthenticator(messagingService))

  // Register UI modules
  uiController.registerUiModule(PanelModule, {
    mountPoint: '#alpheios-panel', // To what element a panel will be mounted
    panelComponent: 'panel' // A Vue component that will represent a panel
  })
  uiController.registerUiModule(PopupModule, {
    mountPoint: '#alpheios-popup'
  })

  // Creates on configures an event listener
  let eventController = new UIEventController()
  switch (uiController.options.textQueryTrigger) {
    case 'dblClick':
      eventController.registerListener('GetSelectedText', uiController.options.textQuerySelector, uiController.getSelectedText.bind(uiController), MouseDblClick)
      break
    case 'longTap':
      eventController.registerListener('GetSelectedText', uiController.options.textQuerySelector, uiController.getSelectedText.bind(uiController), LongTap)
      break
    default:
      eventController.registerListener(
        'GetSelectedText', uiController.options.textQuerySelector, uiController.getSelectedText.bind(uiController), GenericEvt, uiController.options.textQueryTrigger
      )
  }

  eventController.registerListener('HandleEscapeKey', document, uiController.handleEscapeKey.bind(uiController), GenericEvt, 'keydown')
  eventController.registerListener('AlpheiosPageLoad', 'body', uiController.updateAnnotations.bind(uiController), GenericEvt, 'Alpheios_Page_Load')

  // Attaches an event controller to a UIController instance
  uiController.evc = eventController

  // Subscribe to LexicalQuery events
  LexicalQuery.evt.LEXICAL_QUERY_COMPLETE.sub(uiController.onLexicalQueryComplete.bind(uiController))
  LexicalQuery.evt.MORPH_DATA_READY.sub(uiController.onMorphDataReady.bind(uiController))
  LexicalQuery.evt.MORPH_DATA_NOTAVAILABLE.sub(uiController.onMorphDataNotFound.bind(uiController))
  LexicalQuery.evt.HOMONYM_READY.sub(uiController.onHomonymReady.bind(uiController))
  LexicalQuery.evt.LEMMA_TRANSL_READY.sub(uiController.updateTranslations.bind(uiController))
  LexicalQuery.evt.WORD_USAGE_EXAMPLES_READY.sub(uiController.onWordUsageExamplesReady.bind(uiController))
  LexicalQuery.evt.DEFS_READY.sub(uiController.onDefinitionsReady.bind(uiController))
  LexicalQuery.evt.DEFS_NOT_FOUND.sub(uiController.onDefinitionsNotFound.bind(uiController))

  // Subscribe to ResourceQuery events
  ResourceQuery.evt.RESOURCE_QUERY_COMPLETE.sub(uiController.onResourceQueryComplete.bind(uiController))
  ResourceQuery.evt.GRAMMAR_AVAILABLE.sub(uiController.onGrammarAvailable.bind(uiController))
  ResourceQuery.evt.GRAMMAR_NOT_FOUND.sub(uiController.onGrammarNotFound.bind(uiController))

  // Subscribe to AnnotationQuery events
  AnnotationQuery.evt.ANNOTATIONS_AVAILABLE.sub(uiController.onAnnotationsAvailable.bind(uiController))

  return uiController
}

let sendContentReadyToBackground = function sendContentReadToBackground () {
  messagingService.sendMessageToBg(new ContentReadyMessage(uiController.state))
    .catch((error) => console.error('Unable to send content ready message to background', error))
}

let sendStateToBackground = function sendStateToBackground () {
  messagingService.sendMessageToBg(new StateMessage(uiController.state))
    .catch((error) => console.error('Unable to send state to background', error))
}

let sendResponseToBackground = function sendResponseToBackground (request, state = uiController.state) {
  messagingService.sendResponseToBg(new StateResponse(request, state)).catch(
    (error) => {
      console.error('Unable to send a response to a state request', error)
    }
  )
}

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (request) {
  let requestState = TabScript.readObject(request.body)
  let diff = uiController.state.diff(requestState)

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
      console.warn(`State request with the wrong tab ID "${Symbol.keyFor(diff.tabID)}" received. This tab ID is "${Symbol.keyFor(uiController.state.tabID)}"`)
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
      .catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    return
  } else if (diff.has('status') && diff.status === TabScript.statuses.script.DEACTIVATED) {
    // This is a deactivation request
    uiController.deactivate()
      .then(() => {
        sendResponseToBackground(request)
      })
      .catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
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
let browserManifest = browser.runtime.getManifest()
let state = new TabScript()
// A message with PENDING status do not cause background object state updates
state.status = TabScript.statuses.script.PENDING
state.setPanelDefault()
state.setTabDefault()
uiController = createUiController(state, {
  storageAdapter: ExtensionSyncStorage,
  app: { name: browserManifest.name, version: browserManifest.version }
})
// uiController.auth = new BgAuthenticator(messagingService)

// A notification from a embedded lib that it is present on a page. Upon receiving this we should destroy all Alpheios objects.
document.body.addEventListener('Alpheios_Embedded_Response', () => {
  console.log(`Alpheios is embedded`)

  uiController.state.setEmbedLibActiveStatus()
  messagingService.sendMessageToBg(new EmbedLibMessage(uiController.state))
    .catch((error) => console.error('Unable to send embed lib message to background', error))
  if (uiController.state.isActive()) {
    let l10n = new L10n().addMessages(enUS, Locales.en_US).addMessages(enGB, Locales.en_GB).setLocale(Locales.en_US)
    let embedLibWarning = UIController.getEmbedLibWarning(l10n.getMsg('EMBED_LIB_WARNING_TEXT'))
    document.body.appendChild(embedLibWarning.$el)
    uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
  }
})

document.body.addEventListener('Alpheios_Reload', () => {
  console.log('Alpheios reload event caught.')
  if (uiController.state.isActive()) {
    uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
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
  .catch((error) => console.error(`Cannot activate a UI controller: ${error}`, error))
