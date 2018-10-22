/* eslint-disable no-unused-vars */
import ContentProcessSafari from '@/content/content-process-safari.js'
import HTMLPage from '@/lib/html-page.js'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line
// import { Monitor as ExperienceMonitor } from 'alpheios-experience'

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
      let contentProcess = new ContentProcessSafari()
      contentProcess.initialize()
    } else {
      console.warn(`Alpheios Safari App Extension cannot be enabled on pages with frames`)
    }

    /* let contentProcess = ExperienceMonitor.track(
      new ContentProcess(),
      [
        {
          monitoredFunction: 'getWordDataStatefully',
          experience: 'Get word data',
          asyncWrapper: ExperienceMonitor.recordExperience
        }
      ]
    )

    contentProcess.initialize() */
  }
})
