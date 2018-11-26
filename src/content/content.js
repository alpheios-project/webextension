/* global browser */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service.js'
import { TabScript, UIController, UIEventController, ExtensionSyncStorage, MouseDblClick, GenericEvt,
  LexicalQuery, ResourceQuery, AnnotationQuery } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line
import StateResponse from '../lib/messaging/response/state-response'

let messagingService = null
let uiController = null

// Provide our own implementation of a UIController builder
UIController.create = function build (state, options) {
  let uiController = new UIController(state, options)

  // Attaches an event controller to a UIController instance. This EventController registers a double click as a default `getSelectedText` selector.
  uiController.evc = new UIEventController()
    .registerListener('GetSelectedText', 'body', uiController.getSelectedText.bind(uiController), MouseDblClick)
    .registerListener('HandleEscapeKey', document, uiController.handleEscapeKey.bind(uiController), GenericEvt, 'keydown')
    .registerListener('AlpheiosPageLoad', 'body', uiController.updateAnnotations.bind(uiController), GenericEvt, 'Alpheios_Page_Load')

  // Subscribe to LexicalQuery events
  LexicalQuery.evt.LEXICAL_QUERY_COMPLETE.sub(uiController.onLexicalQueryComplete.bind(uiController))
  LexicalQuery.evt.MORPH_DATA_READY.sub(uiController.onMorphDataReady.bind(uiController))
  LexicalQuery.evt.MORPH_DATA_NOT_FOUND.sub(uiController.onMorphDataNotFound.bind(uiController))
  LexicalQuery.evt.HOMONYM_READY.sub(uiController.onHomonymReady.bind(uiController))
  LexicalQuery.evt.LEMMA_TRANSL_READY.sub(uiController.onLemmaTranslationsReady.bind(uiController))
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

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (request, sender) {
  let requestState = TabScript.readObject(request.body)
  let diff = uiController.state.diff(requestState)

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

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
      uiController.activate().catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
      uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
    } else if (diff.status === TabScript.statuses.script.DISABLED) {
      // TODO: Do we really need this state?
      uiController.state.disable()
    }
  }

  if (diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) { uiController.panel.open() } else { uiController.panel.close() }
  }

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
    .catch((error) => console.error('Unable to send state to background', error))
}

messagingService = new MessagingService()
let browserManifest = browser.runtime.getManifest()
let state = new TabScript()
state.status = TabScript.statuses.script.PENDING
state.panelStatus = TabScript.statuses.panel.CLOSED
uiController = UIController.create(state, {
  storageAdapter: ExtensionSyncStorage,
  app: { name: browserManifest.name, version: browserManifest.version }
})
uiController.state.setWatcher('panelStatus', sendStateToBackground)
uiController.state.setWatcher('tab', sendStateToBackground)

// A notification from a embedded lib that it is present on a page. Upon receiving this we should destroy all Alpheios objects.
document.body.addEventListener('Alpheios_Embedded_Response', () => {
  console.log(`Alpheios is embedded`)
  // if we weren't already disabled, remember the current state
  // and then deactivate before disabling
  if (!uiController.state.isDisabled()) {
    uiController.state.save()
    if (uiController.state.isActive()) {
      console.log('Deactivating Alpheios webextension')
      uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
    }
  }
  uiController.state.disable()
  // TODO: Need to handle this in a content. Send state to BG on every state change?
  // sendStateToBackground()
})

document.body.addEventListener('Alpheios_Reload', () => {
  console.log('Alpheios reload event caught.')
  if (uiController.state.isActive()) {
    uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
  }
  window.location.reload()
})

uiController.activate()
  .then(() => {
    messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest, uiController)
    browser.runtime.onMessage.addListener(messagingService.listener.bind(messagingService))
  })
  .catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
