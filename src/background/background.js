import Browser from '../lib/browser'
import Process from './background-process'
import { Monitor as ExperienceMonitor } from 'alpheios-experience'

// Detect browser features
let browserFeatures = new Browser().inspect().getFeatures()
console.log(`Support of a "browser" namespace: ${browserFeatures.browserNamespace}`)
if (!browserFeatures.browserNamespace) {
  console.log('"browser" namespace is not supported, will load a WebExtensions polyfill into the background script')
  window.browser = require('../../dist/support/webextension-polyfill/browser-polyfill')
}

let monitoredBackgroundProcess = ExperienceMonitor.track(
  new Process(browserFeatures),
  [
    {
      monitoredFunction: 'getHomonymStatefully',
      experience: 'Get homonym from a morphological analyzer',
      asyncWrapper: ExperienceMonitor.recordExperienceDetails
    },
    {
      monitoredFunction: 'handleWordDataRequestStatefully',
      asyncWrapper: ExperienceMonitor.detachFromMessage
    },
    {
      monitoredFunction: 'sendResponseToTabStatefully',
      asyncWrapper: ExperienceMonitor.attachToMessage
    }
  ]
)
monitoredBackgroundProcess.initialize()
