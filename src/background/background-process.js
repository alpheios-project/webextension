/* global browser */
import { enUS, enGB, Locales, L10n } from 'alpheios-components'
import Message from '../lib/messaging/message/message.js'
import MessagingService from '../lib/messaging/service.js'
import StateRequest from '../lib/messaging/request/state-request.js'
import ContextMenuItem from './context-menu-item.js'
import ContentMenuSeparator from './context-menu-separator.js'
import TabScript from '../lib/content/tab-script.js'

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
    this.tab = undefined // A tab that is currently active in a browser window

    this.messagingService = new MessagingService()

    this.browserIcons = {
      active: {
        16: 'icons/alpheios_16.png',
        32: 'icons/alpheios_32.png'
      },
      nonactive: {
        16: 'icons/alpheios_black_16.png',
        32: 'icons/alpheios_black_32.png'
      }
    }
  }

  static get defaults () {
    console.log('add messages')
    let l10n = new L10n()
      .addMessages(enUS, Locales.en_US)
      .addMessages(enGB, Locales.en_GB)
      .setLocale(Locales.en_US)
    return {
      activateBrowserActionTitle: l10n.messages.LABEL_BROWSERACTION_ACTIVATE,
      deactivateBrowserActionTitle: l10n.messages.LABEL_BROWSERACTION_DEACTIVATE,
      disabledBrowserActionTitle: l10n.messages.LABEL_BROWSERACTION_DISABLED,
      activateMenuItemId: 'activate-alpheios-content',
      activateMenuItemText: l10n.messages.LABEL_CTXTMENU_ACTIVATE,
      deactivateMenuItemId: 'deactivate-alpheios-content',
      deactivateMenuItemText: l10n.messages.LABEL_CTXTMENU_DEACTIVATE,
      disabledMenuItemId: 'disabled-alpheios-content',
      disabledMenuItemText: l10n.messages.LABEL_CTXTMENU_DISABLED,
      openPanelMenuItemId: 'open-alpheios-panel',
      openPanelMenuItemText: l10n.messages.LABEL_CTXTMENU_OPENPANEL,
      infoMenuItemId: 'show-alpheios-panel-info',
      infoMenuItemText: l10n.messages.LABEL_CTXTMENU_INFO,
      separatorOneId: 'separator-one',
      sendExperiencesMenuItemId: 'send-experiences',
      sendExperiencesMenuItemText: l10n.messages.LABEL_CTXTMENU_SENDEXP,
      contentCSSFileNames: ['style/style.min.css'],
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
    // browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))
    browser.tabs.onRemoved.addListener(this.tabRemovalListener.bind(this))
    browser.webNavigation.onCompleted.addListener(this.navigationCompletedListener.bind(this))
    browser.runtime.onUpdateAvailable.addListener(this.updateAvailableListener.bind(this))
    browser.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this))

    this.menuItems = {
      activate: new ContextMenuItem(BackgroundProcess.defaults.activateMenuItemId, BackgroundProcess.defaults.activateMenuItemText),
      deactivate: new ContextMenuItem(BackgroundProcess.defaults.deactivateMenuItemId, BackgroundProcess.defaults.deactivateMenuItemText),
      openPanel: new ContextMenuItem(BackgroundProcess.defaults.openPanelMenuItemId, BackgroundProcess.defaults.openPanelMenuItemText),
      separatorOne: new ContentMenuSeparator(BackgroundProcess.defaults.separatorOneId),
      info: new ContextMenuItem(BackgroundProcess.defaults.infoMenuItemId, BackgroundProcess.defaults.infoMenuItemText),
      disabled: new ContextMenuItem(BackgroundProcess.defaults.disabledMenuItemId, BackgroundProcess.defaults.disabledMenuItemText)
    }
    this.menuItems.activate.enable() // This one will be enabled by default

    browser.contextMenus.onClicked.addListener(this.menuListener.bind(this))
    browser.browserAction.onClicked.addListener(this.browserActionListener.bind(this))

    this.transporter = new Transporter(LocalExperienceStorage, RemoteExperienceServer,
      BackgroundProcess.defaults.experienceStorageThreshold, BackgroundProcess.defaults.experienceStorageCheckInterval)
  }

  updateIcon (active) {
    browser.browserAction.setIcon({
      path: active ? this.browserIcons.active : this.browserIcons.nonactive
    })
  }
  /**
   * handler for the runtime.onInstalled event
   */
  handleOnInstalled (details) {
    // if this is an update versus a fresh install we need to trigger reloads
    // of the previously loaded content scripts. Only tabs with Alpheios loaded
    // will respond to this event. Messaging between the new background script and the
    // old content scripts is broken so we just send a custom event on the body of
    // the page.
    if (details.previousVersion) {
      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((t) => {
          try {
            browser.tabs.executeScript(t.id, {
              code: "document.body.dispatchEvent(new Event('Alpheios_Reload'))"
            })
          } catch (e) {
            // just quietly fail here
          }
        })
      })
    }
  }

  async activateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).activate()
    this.setContentState(tab)
    this.checkEmbeddedContent(tabID)
    this.updateIcon(true)
  }

  async deactivateContent (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).deactivate().setPanelClosed()
    this.setContentState(tab)
    this.updateIcon(false)
  }

  async openPanel (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).activate().setPanelOpen()
    this.setContentState(tab)
  }

  async openInfoTab (tabID) {
    if (!this.tabs.has(tabID)) { await this.createTab(tabID) }
    let tab = TabScript.create(this.tabs.get(tabID)).activate().setPanelOpen().changeTab('info')
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

  loadContentCSS (tabID, fileName) {
    console.log('Loading CSS into a content tab')
    return browser.tabs.insertCSS(tabID, {
      file: fileName
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
    newTab.tab = TabScript.props.tab.values.INFO // Set active tab to `info` by default
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
    let contentCSS = []
    for (let fileName of this.settings.contentCSSFileNames) {
      contentCSS.push(this.loadContentCSS(tabScript.tabID, fileName))
    }
    return Promise.all([polyfillScript, contentScript, ...contentCSS])
  }

  stateMessageHandler (message, sender) {
    let contentState = TabScript.readObject(message.body)
    this.updateTabState(contentState.tabID, contentState)
    console.log(this.tabs.get(contentState.tabID))
  }

  tabActivationListener (info) {
    this.tab = info.tabId
    let tab = this.tabs.has(info.tabId) ? this.tabs.get(info.tabId) : undefined
    this.setMenuForTab(tab)
  }

  /**
   * Called when a page is loaded.
   * Use this to listen on webNavigation.onCompleted rather than tabs.onUpdated
   * because you can't tell from the tabs.onUpdated event whether it's the main
   * browser window or an iframe that has been updated.
   * the webNavigation.onCompleted event is the equivalent of domLoaded and you
   * can distinguish iFrames from the main window in the details
   * @param details
   * @return {Promise.<void>}
   */
  async navigationCompletedListener (details) {
    // make sure this is a tab we know about AND that it's not an iframe event
    if (this.tabs.has(details.tabId) && details.frameId === 0) {
      // If content script was loaded to that tab, restore it to the state it had before
      let tab = this.tabs.get(details.tabId)
      tab.restore()
      try {
        await this.loadContentData(tab)
        this.setContentState(tab)
        this.checkEmbeddedContent(details.tabId)
        this.notifyPageLoad(details.tabId)
      } catch (error) {
        console.error(`Cannot load content script for a tab with an ID of ${details.tabId}`)
      }
    }
  }

  checkEmbeddedContent (tabID) {
    try {
      browser.tabs.executeScript(tabID, {
        code: "document.body.dispatchEvent(new Event('Alpheios_Embedded_Check'))"
      })
    } catch (e) {
      console.error(e)
    }
  }

  notifyPageLoad (tabID) {
    try {
      browser.tabs.executeScript(tabID, {
        code: "document.body.dispatchEvent(new Event('Alpheios_Page_Load'))"
      })
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Listen to extension updates. Need to define to prevent the browser
   * from applying updates and reloading while the extension is activated
   */
  updateAvailableListener (details) {
    console.log(`Update pending to version ${details.version} pending.`)
  }

  tabRemovalListener (tabID, removeInfo) {
    if (this.tabs.has(tabID)) {
      this.tabs.delete(tabID)
    }
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(tab.id)
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(tab.id)
    } else if (info.menuItemId === this.settings.openPanelMenuItemId) {
      this.openPanel(tab.id)
    } else if (info.menuItemId === this.settings.infoMenuItemId) {
      this.openInfoTab(tab.id)
    }
  }

  async browserActionListener (tab) {
    if (this.tabs.has(tab.id) && this.tabs.get(tab.id).isActive()) {
      this.deactivateContent(tab.id)
      this.updateIcon(false)
    } else {
      this.activateContent(tab.id)
      this.updateIcon(true)
    }
  }

  updateTabState (tabID, newState) {
    let tab = this.tabs.get(tabID).update(newState)

    // Menu state should reflect a status of a content script
    this.updateBrowserActionForTab(tab)
    this.setMenuForTab(tab)
  }

  updateBrowserActionForTab (tab) {
    if (tab && tab.hasOwnProperty('status')) {
      if (tab.isActive()) {
        browser.browserAction.setTitle({title: BackgroundProcess.defaults.deactivateBrowserActionTitle, tabId: tab.tabID})
      } else if (tab.isDeactivated()) {
        browser.browserAction.setTitle({title: BackgroundProcess.defaults.activateBrowserActionTitle, tabId: tab.tabID})
      } else if (tab.isDisabled()) {
        browser.browserAction.setTitle({title: BackgroundProcess.defaults.disabledBrowserActionTitle, tabId: tab.tabID})
      }
    }
  }

  setMenuForTab (tab) {
    // Deactivate all previously activated menu items to keep an order intact
    this.menuItems.activate.disable()
    this.menuItems.deactivate.disable()
    this.menuItems.openPanel.disable()
    this.menuItems.separatorOne.disable()
    this.menuItems.info.disable()
    this.menuItems.disabled.disable()

    if (tab) {
      // Menu state should reflect a status of a content script
      if (tab.hasOwnProperty('status')) {
        if (tab.isActive()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.enable()
          this.menuItems.openPanel.enable()
          this.menuItems.info.enable()

          this.updateIcon(true)
        } else if (tab.isDeactivated()) {
          this.menuItems.deactivate.disable()
          this.menuItems.activate.enable()
          this.menuItems.openPanel.disable()
          this.menuItems.info.enable()

          this.updateIcon(false)
        } else if (tab.isDisabled()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.disable()
          this.menuItems.disabled.enable()
          this.menuItems.openPanel.disable()
          this.menuItems.info.disable()
          this.updateIcon(false)
        }
      }

      if (tab.hasOwnProperty('panelStatus')) {
        if (tab.isActive() && tab.isPanelClosed()) {
          this.menuItems.openPanel.enable()
        } else {
          this.menuItems.openPanel.disable()
        }
      }

      this.menuItems.separatorOne.enable()
    } else {
      // If tab is not provided will set menu do an initial state
      this.menuItems.activate.enable()
      this.menuItems.deactivate.disable()
      this.menuItems.openPanel.disable()
      this.menuItems.separatorOne.enable()
      this.menuItems.info.enable()

      this.updateIcon(false)
    }
  }
}
