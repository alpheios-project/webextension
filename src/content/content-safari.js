/* global safari */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message'
import MessagingService from '@/lib/messaging/service-safari.js'
import TabScript from '@/lib/content/tab-script.js'
import { UIController, LocalStorageArea, HTMLPage } from 'alpheios-components'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line

console.log(`Loading a content script`)
let uiController = null

/**
 * State request processing function.
 */
let handleStateRequest = function handleStateRequest (message) {
  console.log(`State request has been received`)
  let state = TabScript.readObject(message.body)
  let diff = uiController.state.diff(state)

  if (diff.has('status')) {
    if (diff.status === TabScript.statuses.script.ACTIVE) {
      console.log(`Preparing to activate state`)
      uiController.activate().catch((error) => console.error(`Cannot activate a UI controller: ${error}`))
    } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
      console.log(`Preparing to deactivate state`)
      uiController.deactivate().catch((error) => console.error(`UI controller cannot be deactivated: ${error}`))
    }
    sendStateToBackground('updateState')
  }
}

let sendStateToBackground = function sendStateToBackground (messageName) {
  console.log(`Content: Sending state to background`)
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

  console.log(`Loaded listener fired`)

  if (event.currentTarget.URL.search(`${SAFARI_BLANK_ADDR}|${ALPHEIOS_GRAMMAR_ADDR}`) === -1) {
    if (!HTMLPage.hasFrames && !HTMLPage.isFrame) {
      console.log(`This is a valid content page or frame`)
      let state = new TabScript()
      state.status = TabScript.statuses.script.PENDING
      state.panelStatus = TabScript.statuses.panel.CLOSED
      state.setWatcher('panelStatus', sendStateToBackground)
      state.setWatcher('tab', sendStateToBackground)
      let messagingService = new MessagingService()
      // let browserManifest = browser.runtime.getManifest() // TODO: Do we need this in Safari?
      uiController = new UIController(state, LocalStorageArea/*, browserManifest */)
      messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest, uiController)
      safari.self.addEventListener('message', messagingService.listener.bind(messagingService))
    } else {
      console.warn(`Alpheios Safari App Extension cannot be enabled on pages with frames`)
    }
  }
})
