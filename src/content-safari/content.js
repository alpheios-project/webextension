/* eslint-disable no-unused-vars */
/* global safari */
import Message from '@/lib/messaging/message/message.js'
import MessagingService from '@safari/lib/messaging/service-safari.js'
import TabScript from '@/lib/content/tab-script.js'
import ContentProcessSafari from '@safari/content-process-safari.js'
import HTMLPage from '@/lib/html-page.js'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line
// import { Monitor as ExperienceMonitor } from 'alpheios-experience'

console.log(`Content script is loaded!!!`)

let messagingService

/**
 * This is a content process builder (builder pattern).
 * Content process listens to interactions on a page and sends them to UI controller. Can we do this in a UI controller?
 * Content process sends state update to background. We should abstract this away into a content script.
 */
class Content {
  static loadedListener (event) {
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
        let contentProcess = new ContentProcessSafari()
        // if (!contentProcess.isInitialized) { contentProcess.initialize() }
        messagingService = new MessagingService()
        messagingService.addHandler(Message.types.STATE_REQUEST, Content.handleStateRequest, contentProcess)
        safari.self.addEventListener('message', messagingService.listener.bind(messagingService))
      } else {
        console.warn(`Alpheios Safari App Extension cannot be enabled on pages with frames`)
      }
    }
  }

  /**
   * State request processing function.
   * `this` will be set to an active instance of ContentProcessSafari by the messaging service.
   * @param {Message} message - A message that was received from the background.
   */
  static handleStateRequest (message) {
    console.log(`State request has been received`)
    let state = TabScript.readObject(message.body)
    let diff = this.state.diff(state)

    if (diff.has('status')) {
      if (diff.status === TabScript.statuses.script.ACTIVE) {
        console.log(`Preparing to activate state`)
        this.init()
          .then(() => this.activate())
          .catch((error) => console.error(`Cannot initialize content process, ${error}`))
      } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
        console.log(`Preparing to deactivate state`)
        this.deactivate()
      }
    }

    if (this.ui) { this.updatePanelOnActivation() }
  }
}

document.addEventListener('DOMContentLoaded', Content.loadedListener)
