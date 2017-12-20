/* global browser */
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateRequest from '../lib/messaging/request/state-request'
import ContextMenuItem from './context-menu-item'
import TabScript from '../lib/content/tab-script'
import {
  Transporter,
  StorageAdapter as LocalExperienceStorage,
  TestAdapter as RemoteExperienceServer
} from 'alpheios-experience'
// Use a logger that outputs timestamps (but loses line numbers)
// import Logger from '../lib/logger'
// console.log = Logger.log

export default class BackgroundProcess {
  constructor (browserFeatures) {
    this.browserFeatures = browserFeatures
    this.settings = BackgroundProcess.defaults

    this.tabs = new Map() // A list of tabs that have content script loaded
    this.activeTab = undefined // A tab that is currently active in a browser window

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
    browser.tabs.onActivated.addListener(this.tabActivationListener.bind(this))
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

  async activateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).activate().openPanel()
    this.setContentState(tab)
  }

  async deactivateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).deactivate().closePanel()
    this.setContentState(tab)
  }

  async openPanel (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).activate().openPanel()
    this.setContentState(tab)
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

  /**
   * Creates a TabScript object and loads content script(s) into a corresponding browser tab
   * @param {Number} tabID - An ID of a tab
   * @return {Promise.<TabScript>} A Promise that is resolved into a newly created TabScript object
   */
  async createTab (tabID) {
    console.log(`Creating a new tab with an ID of ${tabID}`)
    let newTab = new TabScript(tabID)
    this.tabs.set(tabID, newTab)
    try {
      await this.loadContentData(newTab)
    } catch (error) {
      console.error(`Cannot load content script for a tab with an ID of ${tabID}`)
    }
    return newTab
  }

  /**
   * Changes state of a tab by sending it a state update request. Content script of a tab returns
   * its actual state after request it fulfilled. A warning will be produced if an actual
   * state does not match desired one.
   * @param {TabScript} tab - A TabScript object that represents a tab and it desired state
   */
  setContentState (tab) {
    this.messagingService.sendRequestToTab(new StateRequest(tab), 10000, tab.tabID).then(
      message => {
        let contentState = TabScript.readObject(message.body)
        /*
        ContentState is an actual state content script is in. It may not match a desired state because
        content script may fail in one or several operations.
         */
        let diff = tab.diff(contentState)
        if (!diff.isEmpty()) {
          console.warn(`Content script was not able to update the following properties:`, diff.keys())
        }
        this.updateTabState(tab.tabID, contentState)
      },
      error => {
        console.log(`No status confirmation from tab ${tab.tabID} on state request: ${error.message}`)
      }
    )
  }

  loadContentData (tabScript) {
    let polyfillScript = this.loadPolyfill(tabScript.tabID)
    let contentScript = this.loadContentScript(tabScript.tabID)
    let contentCSS = this.loadContentCSS(tabScript.tabID)
    return Promise.all([polyfillScript, contentScript, contentCSS])
  }

  stateMessageHandler (message, sender) {
    let contentState = TabScript.readObject(message.body)
    this.updateTabState(contentState.tabID, contentState)
  }

  tabActivationListener (info) {
    this.activeTab = info.tabId
    let tab = this.tabs.has(info.tabId) ? this.tabs.get(info.tabId) : undefined
    this.setMenuForTab(tab)
  }

  /**
   * Called when tab is updated
   * @param tabID
   * @param changeInfo
   * @param tab
   * @return {Promise.<void>}
   */
  async tabUpdatedListener (tabID, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log('tab update complete')
      if (this.tabs.has(tabID)) {
        // If content script was loaded to that tab, restore it to the state it had before
        let tab = this.tabs.get(tabID)
        try {
          await this.loadContentData(tab)
          this.setContentState(tab)
        } catch (error) {
          console.error(`Cannot load content script for a tab with an ID of ${tabID}`)
        }
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
    if (this.tabs.has(tab.id) && this.tabs.get(tab.id).isActive()) {
      this.deactivateContent(tab.id)
    } else {
      this.activateContent(tab.id)
    }
  }

  updateTabState (tabID, newState) {
    let tab = this.tabs.get(tabID).update(newState)

    // Menu state should reflect a status of a content script
    this.setMenuForTab(tab)
  }

  setMenuForTab (tab) {
    if (tab) {
      // Menu state should reflect a status of a content script
      if (tab.hasOwnProperty('status')) {
        if (tab.isActive()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.enable()
          this.menuItems.openPanel.enable()
        } else if (tab.isDeactivated()) {
          this.menuItems.deactivate.disable()
          this.menuItems.activate.enable()
          this.menuItems.openPanel.disable()
        }
      }

      if (tab.hasOwnProperty('panelStatus')) {
        if (tab.isActive() && tab.isPanelClosed()) {
          this.menuItems.openPanel.enable()
        } else {
          this.menuItems.openPanel.disable()
        }
      }
    } else {
      // If tab is not provided will set menu do an initial state
      this.menuItems.activate.enable()
      this.menuItems.deactivate.disable()
      this.menuItems.openPanel.disable()
    }
  }
}
