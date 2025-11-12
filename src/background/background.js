import './service-worker-globals.js'
import browser from 'webextension-polyfill'
import Browser from '../lib/browser'
import Process from './background-process'

if (typeof globalThis.browser === 'undefined') {
  globalThis.browser = browser
}

// Detect browser features
const browserFeatures = new Browser().inspect().getFeatures()
console.log(`Support of a "browser" namespace: ${browserFeatures.browserNamespace}`)

const backgroundProcess = new Process(browserFeatures)
backgroundProcess.initialize()
