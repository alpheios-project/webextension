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

    this.messagingService.addHandler(Message.types.WORD_DATA_REQUEST, this.handleWordDataRequestStatefully, this)
    this.messagingService.addHandler(Message.types.PANEL_STATUS_CHANGE_REQUEST, this.updatePanelStatus, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))

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

  isPanelOpen (tabID) {
    return this.isContentActive(tabID) && this.tabs.get(tabID).panelStatus === Statuses.PANEL_OPEN
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

  handleOpenPanelRequest (tabID) {
    this.messagingService.sendRequestToTab(new OpenPanelRequest(), 10000, tabID).then(
      (message) => {
        this.tabs.get(tabID).panelStatus = message
      },
      (error) => {
        console.log(`Error opening panel ${error}`)
      }
    )
  }

  loadContent (tabID, options = {activate: true, openPanel: true}) {
    let polyfillScript = this.loadPolyfill(tabID)
    let contentScript = this.loadContentScript(tabID)
    let contentCSS = this.loadContentCSS(tabID)
    Promise.all([polyfillScript, contentScript, contentCSS]).then(() => {
      console.log('Content script(s) has been loaded successfully or already present')
      this.tabs.set(tabID, new ContentTab(tabID, Statuses.ACTIVE, Statuses.PANEL_OPEN))
      BackgroundProcess.defaults.contentScriptLoaded = true
      if (!options.activate) {
        console.log('Deactiving after load')
        this.deactivateContent(tabID)
      }
      if (options.openPanel) {
        this.handleOpenPanelRequest(tabID)
      }
    }, (error) => {
      console.log(`Content script loading failed, ${error.message}`)
      // throw new Error('Content script loading failed', error)
    })
  }

  sendResponseToTabStatefully (request, tabID, state = undefined) {
    return State.value(state, this.messagingService.sendResponseToTab(request, tabID))
  }

  updatePanelStatus (request, sender) {
    console.log(`Request to update panel status ${request.body.isOpen}`)
    let tab = this.tabs.get(sender.tab.id)
    tab.panelStatus = request.body.isOpen ? Statuses.PANEL_OPEN : Statuses.PANEL_CLOSED
    return tab.panelStatus
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
      let wasLoaded = this.isContentLoaded(tabID)
      let wasActive = this.isContentActive(tabID)
      let panelOpen = this.isPanelOpen(tabID)
      if (wasLoaded) {
        // If content script was loaded to that tab, restore it to the state it had before
        this.loadContent(tabID, { activate: wasActive, openPanel: panelOpen })
      }
    }
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(tab.id)
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(tab.id)
    } else if (info.menuItemId === this.settings.openPanelMenuItemId) {
      // make sure the content script is loaded and active first
      this.activateContent(tab.id)
      this.handleOpenPanelRequest(tab.id)
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
