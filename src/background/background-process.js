/* global browser */
import { enUS, enGB, Locales, L10n, Tab, TabScript } from 'alpheios-components'
import Message from '../lib/messaging/message/message.js'
import MessagingService from '../lib/messaging/service.js'
import StateRequest from '../lib/messaging/request/state-request.js'
import ContextMenuItem from './context-menu-item.js'
import ContentMenuSeparator from './context-menu-separator.js'

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
    browser.tabs.onDetached.addListener(this.tabDetachedListener.bind(this))
    browser.tabs.onAttached.addListener(this.tabAttachedListener.bind(this))
    // browser.tabs.onUpdated.addListener(this.tabUpdatedListener.bind(this))
    browser.tabs.onRemoved.addListener(this.tabRemovalListener.bind(this))
    browser.webNavigation.onCompleted.addListener(this.navigationCompletedListener.bind(this))
    browser.runtime.onUpdateAvailable.addListener(this.updateAvailableListener.bind(this))
    browser.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this))

    this.menuItems = {
      activate: new ContextMenuItem(BackgroundProcess.defaults.activateMenuItemId, BackgroundProcess.defaults.activateMenuItemText),
      deactivate: new ContextMenuItem(BackgroundProcess.defaults.deactivateMenuItemId, BackgroundProcess.defaults.deactivateMenuItemText),
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

  updateIcon (active, tabId) {
    let params = { path: active ? this.browserIcons.active : this.browserIcons.nonactive }
    if (tabId) { params.tabId = tabId }
    browser.browserAction.setIcon(params)
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

  async activateContent (tabObj) {
    if (!this.tabs.has(tabObj.uniqueId)) { await this.createTab(tabObj) }

    let tab = TabScript.create(this.tabs.get(tabObj.uniqueId)).activate()
    this.setContentState(tab)
    this.checkEmbeddedContent(tabObj.tabId)
    this.updateIcon(true, tabObj.tabId)
  }

  async deactivateContent (tabObj) {
    if (!this.tabs.has(tabObj.uniqueId)) { await this.createTab(tabObj) }

    let tab = TabScript.create(this.tabs.get(tabObj.uniqueId)).deactivate().setPanelClosed()
    this.setContentState(tab)
    this.updateIcon(false, tabObj.tabId)
  }

  async openPanel (tabObj) {
    if (!this.tabs.has(tabObj.uniqueId)) { await this.createTab(tabObj) }

    let tab = TabScript.create(this.tabs.get(tabObj.uniqueId)).activate().setPanelOpen()
    this.setContentState(tab)
  }

  async openInfoTab (tabObj) {
    if (!this.tabs.has(tabObj.uniqueId)) { await this.createTab(tabObj) }

    let tab = TabScript.create(this.tabs.get(tabObj.uniqueId)).activate().setPanelOpen().changeTab('info')
    this.setContentState(tab)
  }

  loadPolyfill (tabId) {
    if (!this.browserFeatures.browserNamespace) {
      return browser.tabs.executeScript(
        tabId,
        {
          file: this.settings.browserPolyfillName
        })
    } else {
      // `browser` object is supported natively, no need to load a polyfill.
      return Promise.resolve()
    }
  }

  loadContentScript (tabId) {
    return browser.tabs.executeScript(tabId, {
      file: this.settings.contentScriptFileName
    })
  }

  loadContentCSS (tabId, fileName) {
    return browser.tabs.insertCSS(tabId, {
      file: fileName
    })
  }

  /**
   * Creates a TabScript object and loads content script(s) into a corresponding browser tab
   * @param {Number} tabID - An ID of a tab
   * @return {Promise.<TabScript>} A Promise that is resolved into a newly created TabScript object
   */
  async createTab (tabObj) {
    let newTab = new TabScript(tabObj)
    newTab.tab = TabScript.props.tab.values.INFO // Set active tab to `info` by default
    this.tabs.set(tabObj.uniqueId, newTab)

    try {
      await this.loadContentData(newTab)
    } catch (error) {
      console.error(`Cannot load content script for a tab with an ID of ${tabObj.uniqueId}`)
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
    this.messagingService.sendRequestToTab(new StateRequest(tab), 10000, tab.tabObj.tabId).then(
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
    let polyfillScript = this.loadPolyfill(tabScript.tabObj.tabId)
    let contentScript = this.loadContentScript(tabScript.tabObj.tabId)
    let contentCSS = []
    for (let fileName of this.settings.contentCSSFileNames) {
      contentCSS.push(this.loadContentCSS(tabScript.tabObj.tabId, fileName))
    }
    return Promise.all([polyfillScript, contentScript, ...contentCSS])
  }

  stateMessageHandler (message, sender) {
    let contentState = TabScript.readObject(message.body)
    contentState.updateTabObject(sender.tab.id, sender.tab.windowId)

    this.updateTabState(contentState.tabID, contentState)
  }

  tabActivationListener (info) {
    let tmpUniqueTabId = Tab.createUniqueId(info.tabId, info.windowId)
    this.tab = tmpUniqueTabId
    let tab = this.tabs.has(tmpUniqueTabId) ? this.tabs.get(tmpUniqueTabId) : undefined

    this.setMenuForTab(tab)
  }

  tabDetachedListener (tabId, detachInfo) {
    let tmpUniqueTabObj = Tab.createUniqueId(tabId, detachInfo.oldWindowId)
    if (this.tabs.has(tmpUniqueTabObj)) {
      this.tabs.get(tmpUniqueTabObj).deattach()
    }
  }

  tabAttachedListener (tabId, attachInfo) {
    let keyForChange = null
    let valueForChange = null
    this.tabs.forEach((value, key) => {
      if (value.isDeattached) {
        keyForChange = key
        valueForChange = value
      }
    })

    if (!keyForChange) {
      this.tabs.forEach((value, key) => {
        if (value.tabObj.tabId === tabId) {
          keyForChange = key
          valueForChange = value
        }
      })
    }

    if (keyForChange) {
      this.tabs.delete(keyForChange)
      let newKey = Tab.createUniqueId(tabId, attachInfo.newWindowId)

      this.tabs.set(newKey, valueForChange.updateTabObject(tabId, attachInfo.newWindowId))
      this.setMenuForTab(valueForChange)
    }
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
    let finalWindowId = this.defineCurrentWindowIdForActivation(details)

    let tmpTabUniqueId = Tab.createUniqueId(details.tabId, finalWindowId)

    if (this.tabs.has(tmpTabUniqueId)) {
      // make sure this is a tab we know about
      if (details.frameId === 0) {
        // AND that it's not an iframe event
        // If content script was loaded to that tab, restore it to the state it had before
        let tab = this.tabs.get(tmpTabUniqueId)
        tab.restore()
        try {
          await this.loadContentData(tab)
          this.setContentState(tab)
          this.checkEmbeddedContent(details.tabId)
          this.notifyPageLoad(details.tabId)
        } catch (error) {
          console.error(`Cannot load content script for a tab with an ID of tabId = ${details.tabId}, windowId = ${details.windowId}`)
        }
      // but if it is an iFrame event
      // firefox resets the browserAction icon and title when the user navigates to a new page
      // even when the navigation is in a frame so we need to be sure it's updated
      } else if (this.tabs.get(tmpTabUniqueId).isActive()) {
        this.updateIcon(true, details.tabId)
        this.updateBrowserActionForTab(this.tabs.get(tmpTabUniqueId))
      }
    }
  }

  defineCurrentWindowIdForActivation (details) {
    // try to get windowId from arguments - from details
    let finalWindowId = details.windowId

    // try to get windowId from the tab with the same tabId
    if (!finalWindowId && this.tabs.size > 0) {
      finalWindowId = Array.from(this.tabs.values()).filter(el => el.tabObj.tabId === details.tabId)
      finalWindowId = finalWindowId.length > 0 ? finalWindowId[0].windowId : null
    }

    // try to get windowId from the first tab from the saved tab array
    if (!finalWindowId && this.tabs.size > 0) {
      finalWindowId = this.tabs.values().next().value.tabObj.windowId
    }

    // if all tries fail get 0
    return finalWindowId || 0
  }

  checkEmbeddedContent (tabId) {
    try {
      browser.tabs.executeScript(tabId, {
        code: "document.body.dispatchEvent(new Event('Alpheios_Embedded_Check'))"
      })
    } catch (e) {
      console.error(e)
    }
  }

  notifyPageLoad (tabId) {
    try {
      browser.tabs.executeScript(tabId, {
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
    let tmpTabUniqueId = Tab.createUniqueId(tabID, removeInfo.windowId)
    if (this.tabs.has(tmpTabUniqueId)) {
      this.tabs.delete(tmpTabUniqueId)
    }
  }

  async menuListener (info, tab) {
    if (info.menuItemId === this.settings.activateMenuItemId) {
      this.activateContent(new Tab(tab.id, tab.windowId))
    } else if (info.menuItemId === this.settings.deactivateMenuItemId) {
      this.deactivateContent(new Tab(tab.id, tab.windowId))
    } else if (info.menuItemId === this.settings.infoMenuItemId) {
      this.openInfoTab(new Tab(tab.id, tab.windowId))
    }
  }

  async browserActionListener (tab) {
    let tmpTabUniqueId = Tab.createUniqueId(tab.id, tab.windowId)

    if (this.tabs.has(tmpTabUniqueId) && this.tabs.get(tmpTabUniqueId).isActive()) {
      this.deactivateContent(new Tab(tab.id, tab.windowId))
      this.updateIcon(false, tab.id)
    } else {
      this.activateContent(new Tab(tab.id, tab.windowId))
      this.updateIcon(true, tab.id)
    }
  }

  updateTabState (tabID, newState) {
    let tab = this.tabs.get(tabID)
    tab.update(newState)

    // Menu state should reflect a status of a content script
    this.updateBrowserActionForTab(tab)
    this.setMenuForTab(tab)
  }

  updateBrowserActionForTab (tab) {
    if (tab && tab.hasOwnProperty('status')) {
      if (tab.isActive()) {
        browser.browserAction.setTitle({ title: BackgroundProcess.defaults.deactivateBrowserActionTitle, tabId: tab.tabObj.tabId })
      } else if (tab.isDeactivated()) {
        browser.browserAction.setTitle({ title: BackgroundProcess.defaults.activateBrowserActionTitle, tabId: tab.tabObj.tabId })
      } else if (tab.isDisabled()) {
        browser.browserAction.setTitle({ title: BackgroundProcess.defaults.disabledBrowserActionTitle, tabId: tab.tabObj.tabId })
      }
    }
  }

  setMenuForTab (tab) {
    //
    // Deactivate all previously activated menu items to keep an order intact
    this.menuItems.activate.disable()
    this.menuItems.deactivate.disable()
    this.menuItems.separatorOne.disable()
    this.menuItems.info.disable()
    this.menuItems.disabled.disable()

    if (tab) {
      let tabId = tab.tabObj.tabId
      // Menu state should reflect a status of a content script
      if (tab.hasOwnProperty('status')) {
        if (tab.isActive()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.enable()

          if (tab.isPanelOpen()) {
            this.menuItems.info.disable()
          } else {
            this.menuItems.info.enable()
          }

          this.updateIcon(true, tabId)
        } else if (tab.isDeactivated()) {
          this.menuItems.deactivate.disable()
          this.menuItems.activate.enable()
          this.menuItems.info.disable()

          this.updateIcon(false, tabId)
        } else if (tab.isDisabled()) {
          this.menuItems.activate.disable()
          this.menuItems.deactivate.disable()
          this.menuItems.disabled.enable()
          this.menuItems.info.disable()
          this.updateIcon(false, tabId)
        }
      }
      this.menuItems.separatorOne.enable()
    } else {
      // If tab is not provided will set menu do an initial state
      this.menuItems.activate.enable()
      this.menuItems.deactivate.disable()
      this.menuItems.separatorOne.enable()
      this.menuItems.info.disable()
    }
  }
}
