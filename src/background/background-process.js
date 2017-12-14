/* global browser */
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import ActivationRequest from '../lib/messaging/request/activation-request'
import DeactivationRequest from '../lib/messaging/request/deactivation-request'
import OpenPanelRequest from '../lib/messaging/request/open-panel-request'
import Statuses from '../content/statuses'
import ContentTab from './content-tab'
import State from '../lib/state'
import {
  Transporter,
  StorageAdapter as LocalExperienceStorage,
  TestAdapter as RemoteExperienceServer
} from 'alpheios-experience'

export default class BackgroundProcess {
  constructor (browserFeatures) {
    this.browserFeatures = browserFeatures
    this.settings = BackgroundProcess.defaults

    this.tabs = new Map() // A list of tabs that have content script loaded

    this.messagingService = new MessagingService()
  }

  static get defaults () {
    return {
      activateMenuItemId: 'activate-alpheios-content',
      activateMenuItemText: 'Activate',
      deactivateMenuItemId: 'deactivate-alpheios-content',
      deactivateMenuItemText: 'Deactivate',
      openPanelMenuItemId: 'open-alpheios-panel',
      openPanelMenuItemText: 'Open Panel',
      sendExperiencesMenuItemId: 'send-experiences',
      sendExperiencesMenuItemText: 'Send Experiences to a remote server',
      contentCSSFileName: 'styles/style.min.css',
      contentScriptFileName: 'content.js',
      browserPolyfillName: 'support/webextension-polyfill/browser-polyfill.js',
      experienceStorageCheckInterval: 10000,
      experienceStorageThreshold: 3,
      contentScriptLoaded: false
    }
  }

  initialize () {
    console.log('Background script initialization started ...')

    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    BackgroundProcess.createMenuItem()

    browser.contextMenus.onClicked.addListener(this.menuListener.bind(this))
    browser.browserAction.onClicked.addListener(this.browserActionListener.bind(this))

    this.transporter = new Transporter(LocalExperienceStorage, RemoteExperienceServer,
      BackgroundProcess.defaults.experienceStorageThreshold, BackgroundProcess.defaults.experienceStorageCheckInterval)
  }

  isContentLoaded (tabID) {
    return this.tabs.has(tabID)
  }

  isContentActive (tabID) {
    return this.isContentLoaded(tabID) && this.tabs.get(tabID).status === Statuses.ACTIVE
  }

  activateContent (tabID) {
    if (!this.isContentLoaded(tabID)) {
      // This tab has no content loaded
      this.loadContent(tabID)
    } else {
      if (!this.isContentActive(tabID)) {
        this.messagingService.sendRequestToTab(new ActivationRequest(), 10000, tabID).then(
          (message) => {
            console.log(`Status update, new status is "${message.status}"`)
            this.tabs.get(tabID).status = Message.statusSym(message)
          },
          (error) => {
            console.log(`No status confirmation from tab {tabID} on activation request: ${error.message}`)
          }
        )
      }
    }
  }

  deactivateContent (tabID) {
    if (this.isContentActive(tabID)) {
      this.messagingService.sendRequestToTab(new DeactivationRequest(), 10000, tabID).then(
        (message) => {
          console.log(`Status update, new status is "${message.status}"`)
          this.tabs.get(tabID).status = Message.statusSym(message)
        },
        (error) => {
          console.log(`No status confirmation from tab {tabID} on deactivation request: ${error.message}`)
        }
      )
    }
  }

  loadPolyfill (tabID) {
    if (!this.browserFeatures.browserNamespace) {
      console.log('"browser" namespace is not supported, will load a WebExtension polyfill into a content script')
      return browser.tabs.executeScript(
        tabID,
        {
          file: this.settings.browserPolyfillName
        })
    } else {
      // `browser` object is supported natively, no need to load a polyfill.
      return Promise.resolve()
    }
  }

  loadContentScript (tabID) {
    console.log('Loading content script into a content tab')
    return browser.tabs.executeScript(tabID, {
      file: this.settings.contentScriptFileName
    })
  };

  loadContentCSS (tabID) {
    console.log('Loading CSS into a content tab')
    return browser.tabs.insertCSS(tabID, {
      file: this.settings.contentCSSFileName
    })
  };

  loadContent (tabID) {
    let polyfillScript = this.loadPolyfill(tabID)
    let contentScript = this.loadContentScript(tabID)
    let contentCSS = this.loadContentCSS(tabID)
    Promise.all([polyfillScript, contentScript, contentCSS]).then(() => {
      console.log('Content script(s) has been loaded successfully or already present')
      this.tabs.set(tabID, new ContentTab(tabID, Statuses.ACTIVE))
      BackgroundProcess.defaults.contentScriptLoaded = true
    }, (error) => {
      throw new Error('Content script loading failed', error)
    })
  }

  sendResponseToTabStatefully (request, tabID, state = undefined) {
    return State.value(state, this.messagingService.sendResponseToTab(request, tabID))
  }

  static async getActiveTabID () {
    let tabs = await browser.tabs.query({ active: true })
    console.log(`Active tab ID is ${tabs[0].id}`)
    return tabs[0].id
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(tab.id)
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(tab.id)
    } else if (info.menuItemId === this.settings.openPanelMenuItemId) {
      this.activateContent(tab.id)
      this.messagingService.sendRequestToTab(new OpenPanelRequest(), 10000, tab.id).then(
        (message) => {
        },
        (error) => {
          console.log(`Error opening panel ${error.message}`)
        }
      )
    }
  }

  async browserActionListener (tab) {
    if (!this.isContentActive(tab.id)) {
      this.activateContent(tab.id)
    } else {
      this.deactivateContent(tab.id)
    }
  }

  static createMenuItem () {
    browser.contextMenus.create({
      id: BackgroundProcess.defaults.activateMenuItemId,
      title: BackgroundProcess.defaults.activateMenuItemText
    })
    browser.contextMenus.create({
      id: BackgroundProcess.defaults.deactivateMenuItemId,
      title: BackgroundProcess.defaults.deactivateMenuItemText
    })
    browser.contextMenus.create({
      id: BackgroundProcess.defaults.openPanelMenuItemId,
      title: BackgroundProcess.defaults.openPanelMenuItemText
    })
  }
}
