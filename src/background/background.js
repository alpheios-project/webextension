import Browser from '../lib/browser'
import Process from './background-process'

// Detect browser features
const browserFeatures = new Browser().inspect().getFeatures()
console.log(`Support of a "browser" namespace: ${browserFeatures.browserNamespace}`)
if (!browserFeatures.browserNamespace) {
  console.log('"browser" namespace is not supported, will load a WebExtensions polyfill into the background script')
  window.browser = require('../../dist/support/webextension-polyfill/browser-polyfill.min.js')
}

let backgroundProcess = new Process(browserFeatures) // eslint-disable-line prefer-const
backgroundProcess.initialize()
