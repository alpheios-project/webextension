/* global safari */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import { TabScript, UIController, LocalStorageArea, HTMLPage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line

let uiController = null

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (message) {
  if (!uiController) {
    let state = new TabScript()
    state.status = TabScript.statuses.script.PENDING
    state.panelStatus = TabScript.statuses.panel.CLOSED
    uiController = new UIController(state, {
      storageAdapter: LocalStorageArea,
      // TODO: Read this from a config file
      app: { name: 'Safari App Extension', version: '2.0.3.0' }
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
  }

  let requestState = TabScript.readObject(message.body)
  let diff = uiController.state.diff(requestState)

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
      uiController.activate().catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
      uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
    }
    sendStateToBackground('updateState')
  }
}

let sendStateToBackground = function sendStateToBackground (messageName) {
  safari.extension.dispatchMessage(messageName, new StateMessage(uiController.state))
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
    } else {
      console.warn(`Alpheios Safari App Extension cannot be enabled on pages with frames`)
    }
  }
})
