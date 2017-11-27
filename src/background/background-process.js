/* global browser */
import * as InflectionTables from 'alpheios-inflection-tables'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import ActivationRequest from '../lib/messaging/request/activation-request'
import DeactivationRequest from '../lib/messaging/request/deactivation-request'
import WordDataResponse from '../lib/messaging/response/word-data-response'
import Content from '../content/content-process'
import ContentTab from './content-tab'
import State from '../lib/state'
import TestDefinitionService from '../../test/stubs/definitions/test'
import {
  Transporter,
  StorageAdapter as LocalExperienceStorage,
  TestAdapter as RemoteExperienceServer
} from 'alpheios-experience'

export default class BackgroundProcess {
  constructor (browserFeatures) {
    this.browserFeatures = browserFeatures
    this.settings = BackgroundProcess.defaults

    let adapterArgs = {
      engine: {lat: 'whitakerLat'},
      url: 'http://morph.alpheios.net/api/v1/analysis/word?word=r_WORD&engine=r_ENGINE&lang=r_LANG'
    }
    this.maAdapter = new AlpheiosTuftsAdapter(adapterArgs) // Morphological analyzer adapter
    this.maAdapter.fetch = this.maAdapter.fetchTestData // Switch adapter to a test mode

    this.tabs = new Map() // A list of tabs that have content script loaded

    this.messagingService = new MessagingService()
  }

  static get defaults () {
    return {
      activateMenuItemId: 'activate-alpheios-content',
      activateMenuItemText: 'Activate',
      deactivateMenuItemId: 'deactivate-alpheios-content',
      deactivateMenuItemText: 'Deactivate',
      sendExperiencesMenuItemId: 'send-experiences',
      sendExperiencesMenuItemText: 'Send Experiences to a remote server',
      contentCSSFileName: 'styles/style.css',
      contentScriptFileName: 'content.js',
      browserPolyfillName: 'support/webextension-polyfill/browser-polyfill.js',
      experienceStorageCheckInterval: 10000,
      experienceStorageThreshold: 3,
      contentScriptLoaded: false
    }
  }

  initialize () {
    console.log('initialize')

    this.langData = new InflectionTables.LanguageData([InflectionTables.LatinDataSet, InflectionTables.GreekDataSet]).loadData()

    this.messagingService.addHandler(Message.types.WORD_DATA_REQUEST, this.handleWordDataRequestStatefully, this)
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
    return this.isContentLoaded(tabID) && this.tabs.get(tabID).status === Content.statuses.ACTIVE
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
            console.log(`No status confirmation from tab {tabID} on activation request: ${error}`)
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
          console.log(`No status confirmation from tab {tabID} on deactivation request: ${error}`)
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
      this.tabs.set(tabID, new ContentTab(tabID, Content.statuses.ACTIVE))
      BackgroundProcess.defaults.contentScriptLoaded = true
    }, (error) => {
      throw new Error('Content script loading failed', error)
    })
  }

  sendResponseToTabStatefully (request, tabID, state = undefined) {
    return State.value(state, this.messagingService.sendResponseToTab(request, tabID))
  }

  async getHomonymStatefully (language, word, state) {
    try {
      let result = await this.maAdapter.getHomonym(language, word, state)
      // If no valid homonym data found should always throw an error to be caught in a calling function
      return State.value(state, result)
    } catch (error) {
      /*
      getHomonym is non-statefull function. If it throws an error, we should catch it here, attach state
      information, and rethrow
      */
      throw (State.value(state, error))
    }
  }

  async handleWordDataRequestStatefully (request, sender, state = undefined) {
    let selectedWord = InflectionTables.SelectedWord.readObjects(request.body)
    console.log(`Request for a "${selectedWord.word}" word`)
    let tabID = sender.tab.id

    try {
      // homonymObject is a state object, where 'value' proparty has homonym, and 'state' - a state
      let homonym
      let wordData
      ({ value: homonym, state } = await this.getHomonymStatefully(selectedWord.language, selectedWord.word, state))
      if (!homonym) { throw State.value(state, new Error(`Homonym data is empty`)) }

      wordData = this.langData.getSuffixes(homonym, state)
      wordData.definition = await TestDefinitionService.getDefinition(selectedWord.language, selectedWord.word)
      wordData.definition = encodeURIComponent(wordData.definition)
      console.log(wordData)

      let returnObject = this.sendResponseToTabStatefully(new WordDataResponse(request, wordData, Message.statuses.DATA_FOUND), tabID, state)
      return State.emptyValue(returnObject.state)
    } catch (error) {
      let errorValue = State.getValue(error) // In a mixed environment, both statefull and stateless error messages can be thrown
      console.error(`Word data retrieval failed: ${errorValue}`)
      let returnObject = this.sendResponseToTabStatefully(
        new WordDataResponse(request, undefined, Message.statuses.NO_DATA_FOUND), tabID, State.getState(error)
      )
      return State.emptyValue(returnObject.state)
    }
  }

  newExperienceInStorageEvent () {
    console.log('A new experience has been saved to a local storage:')
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
    }
  }

  async browserActionListener (tab) {
    this.activateContent(tab.id)
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
  }
}
