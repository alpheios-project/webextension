/* global browser */
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateRequest from '../lib/messaging/request/state-request'
import Statuses from '../lib/content/statuses'
import ContextMenuItem from './context-menu-item'
import TabScript from '../lib/content/tab-script'
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

    this.messagingService.addHandler(Message.types.STATE_MESSAGE, this.stateMessageHandler, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))

    this.menuItems = {
      activate: new ContextMenuItem(BackgroundProcess.defaults.activateMenuItemId, BackgroundProcess.defaults.activateMenuItemText),
      deactivate: new ContextMenuItem(BackgroundProcess.defaults.deactivateMenuItemId, BackgroundProcess.defaults.deactivateMenuItemText),
      openPanel: new ContextMenuItem(BackgroundProcess.defaults.openPanelMenuItemId, BackgroundProcess.defaults.openPanelMenuItemText)
    }
    this.menuItems.activate.enable() // This one will be enabled by default

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
      // This tab has no content loaded. loadContent will load content and set it to a tabID state
      this.loadContent(new TabScript(tabID))
    } else {
      let tab = this.tabs.get(tabID)
      tab.status = Statuses.ACTIVE
      tab.panelStatus = Statuses.PANEL_OPEN
      this.updateContentState(tabID, tab)
    }
  }

  deactivateContent (tabID) {
    let tab = this.tabs.get(tabID)
    tab.status = Statuses.DEACTIVATED
    tab.panelStatus = Statuses.PANEL_CLOSED
    this.updateContentState(tabID, tab)
  }

  openPanel (tabID) {
    if (!this.isContentLoaded(tabID)) {
      // This tab has no content loaded. loadContent will load content and set it to a tabID state
      this.loadContent(new TabScript(tabID))
    } else {
      let tab = this.tabs.get(tabID)
      tab.status = Statuses.ACTIVE
      tab.panelStatus = Statuses.PANEL_OPEN
      this.updateContentState(tabID, tab)
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
  }

  loadContentCSS (tabID) {
    console.log('Loading CSS into a content tab')
    return browser.tabs.insertCSS(tabID, {
      file: this.settings.contentCSSFileName
    })
  }

  loadContent (tabScript) {
    let polyfillScript = this.loadPolyfill(tabScript.tabID)
    let contentScript = this.loadContentScript(tabScript.tabID)
    let contentCSS = this.loadContentCSS(tabScript.tabID)
    Promise.all([polyfillScript, contentScript, contentCSS]).then(() => {
      console.log('Content script(s) has been loaded successfully or already present')
      if (!this.tabs.has(tabScript.tabID)) { this.tabs.set(tabScript.tabID, tabScript) }
      this.updateContentState(tabScript.tabID, this.tabs.get(tabScript.tabID))
    }, (error) => {
      console.log(`Content script loading failed, ${error.message}`)
    })
  }

  sendResponseToTabStatefully (request, tabID, state = undefined) {
    return State.value(state, this.messagingService.sendResponseToTab(request, tabID))
  }

  updateContentState (tabID, state) {
    this.messagingService.sendRequestToTab(new StateRequest(state), 10000, tabID).then(
      message => {
        let contentState = TabScript.readObject(message.body)
        this.updateTabState(tabID, contentState)
      },
      error => {
        console.log(`No status confirmation from tab ${tabID} on state request: ${error.message}`)
      }
    )
  }

  stateMessageHandler (message, sender) {
    let contentState = TabScript.readObject(message.body)
    this.updateTabState(contentState.tabID, contentState)
  }

  static async getActiveTabID () {
    let tabs = await browser.tabs.query({ active: true })
    console.log(`Active tab ID is ${tabs[0].id}`)
    return tabs[0].id
  }

  /**
   * Called when tab is updated
   * @param tabID
   * @param changeInfo
   * @param tab
   * @return {Promise.<void>}
   */
  tabUpdatedListener (tabID, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (this.tabs.has(tabID)) {
        // If content script was loaded to that tab, restore it to the state it had before
        let tab = this.tabs.get(tabID)
        // TODO: do we need to activate it? Then
        // let tab = this.tabs.get(tabID).update({status: Statuses.ACTIVE, panelStatus: Statuses.PANEL_OPEN})
        this.loadContent(tab)
      }
    }
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(tab.id)
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(tab.id)
    } else if (info.menuItemId === this.settings.openPanelMenuItemId) {
      this.openPanel(tab.id)
    }
  }

  async browserActionListener (tab) {
    if (!this.isContentActive(tab.id)) {
      this.activateContent(tab.id)
    } else {
      this.deactivateContent(tab.id)
    }
  }

  updateTabState (tabID, newState) {
    let tab = this.tabs.get(tabID).update(newState)

    // Menu state should reflect a status of a content script
    if (tab.hasOwnProperty('status')) {
      if (tab.status === Statuses.ACTIVE) {
        this.menuItems.activate.disable()
        this.menuItems.deactivate.enable()
        this.menuItems.openPanel.enable()
      } else if (tab.status === Statuses.DEACTIVATED) {
        this.menuItems.deactivate.disable()
        this.menuItems.activate.enable()
        this.menuItems.openPanel.disable()
      }
    }

    if (tab.hasOwnProperty('panelStatus')) {
      if (tab.panelStatus === Statuses.PANEL_OPEN) {
        this.menuItems.openPanel.disable()
      } else if (tab.status === Statuses.DEACTIVATED) {
        this.menuItems.openPanel.enable()
      }
    }
  }
}
