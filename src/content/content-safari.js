/* global safari */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import { TabScript, UIController, LocalStorageArea, HTMLPage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line
import Package from '../../package.json'

let uiController = null
let state = null

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (message) {
  if (!uiController) {
    uiController = UIController.build(state, {
      storageAdapter: LocalStorageArea,
      app: { name: 'Safari App Extension', version: `${Package.version}.${Package.build}` }
    })
    uiController.state.setWatcher('panelStatus', sendStateToBackground)
    uiController.state.setWatcher('tab', sendStateToBackground)

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

    document.body.addEventListener('Alpheios_Reload', () => {
      console.log('Alpheios reload event caught')
      if (uiController.state.isActive()) {
        uiController.deactivate()
          .then(() => window.location.reload())
          .catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
      }
    })
  }

  let requestState = TabScript.readObject(message.body)
  let diff = uiController.state.diff(requestState)

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
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
  In Safari, content script is loaded for the "main" page (the page whose URL is shown in an address bar) AND
  for each of the "derivative" pages. These could be pages loaded within iframes of the main page.
  Safari might also load content script for one or several blank pages that are created during Vue.js component rendering.
  We need to filter out loading for the main page (this is when a content process should be created and initialized)
  from the calls to the derivative pages (when content process is already created and we should not create it again).
  For this, we can use a `URL` prop from `event.currentTarget`.
   */
  const SAFARI_BLANK_ADDR = 'about:blank'
  const ALPHEIOS_GRAMMAR_ADDR = 'grammars.alpheios.net'

  if (event.currentTarget.URL.search(`${SAFARI_BLANK_ADDR}|${ALPHEIOS_GRAMMAR_ADDR}`) === -1) {
    if (!HTMLPage.hasFrames && !HTMLPage.isFrame) {
      let messagingService = new MessagingService()
      messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest)
      safari.self.addEventListener('message', messagingService.listener.bind(messagingService))

      /*
      In situations where a page with an already activated content script is reloaded
      and UI controller deactivated because of that,
      we'll need to notify Safari app extension about this
      so that it could update states of an icon and pop-up menu
       */
      state = new TabScript()
      state.status = TabScript.statuses.script.PENDING
      state.panelStatus = TabScript.statuses.panel.CLOSED
      sendStateToBackground('updateState')
    } else {
      console.warn(`Alpheios Safari App Extension cannot be enabled on pages with frames`)
    }
  }
})
