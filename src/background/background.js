import * as InflectionTables from 'alpheios-inflection-tables'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import ActivationRequest from '../lib/messaging/request/activation-request'
import DeactivationRequest from '../lib/messaging/request/deactivation-request'
import WordDataResponse from '../lib/messaging/response/word-data-response'
import * as Content from '../content/process'
import ExperienceMonitor from '../lib/experience/monitor'
import State from '../lib/state'

let alpheiosTestData = {
  definition: `
                <h4>Some Dummy word data</h4>
                <p>
                    Nunc maximus ex id tincidunt pretium. Nunc vel dignissim magna, ut hendrerit lectus. Proin aliquet purus at
                    ullamcorper dignissim. Sed mollis maximus dui. Morbi viverra, metus in fermentum lobortis, arcu est vehicula nibh, a
                    efficitur orci libero eu eros. Nam vulputate risus sed odio fermentum, quis pharetra nibh tincidunt. Mauris eu
                    posuere nunc, tincidunt accumsan metus. Nullam quis enim laoreet, euismod lacus ut, maximus ipsum. Donec vitae
                    sapien non sem eleifend posuere sed vel mauris.
                </p>
                <p>
                    Sed non orci convallis, iaculis ipsum quis, luctus orci. In et auctor metus. Vestibulum venenatis turpis nibh, vitae
                    ornare urna fringilla eu. Nam efficitur blandit metus. Nullam in quam et sapien iaculis accumsan nec ut neque.
                    Aenean aliquam urna quis egestas tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames
                    ac turpis egestas. Praesent sit amet tellus dignissim, tristique ante luctus, gravida lectus.
                </p>
            `
}

class ContentData {
  constructor (tabID, status) {
    this.tabID = tabID
    this.status = status
  }
}

class BackgroundProcess {
  constructor () {
    this.settings = BackgroundProcess.defaults
    this.settings.browserSupport = !(typeof browser === 'undefined')

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
      contentCSSFileName: 'styles/style.css',
      contentScriptFileName: 'content.js',
      browserPolyfillName: 'support/webextension-polyfill/browser-polyfill.js',
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
  }

  isContentLoaded (tabID) {
    return this.tabs.has(tabID)
  }

  isContentActive (tabID) {
    return this.isContentLoaded(tabID) && this.tabs.get(tabID).status === Content.Process.statuses.ACTIVE
  }

  activateContent (tabID) {
    if (!this.isContentLoaded(tabID)) {
            // This tab has no content loaded
      this.loadContent(tabID)
    } else {
      if (!this.isContentActive(tabID)) {
        this.messagingService.sendRequestToTab(new ActivationRequest(), 1000, tabID).then(
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
      this.messagingService.sendRequestToTab(new DeactivationRequest(), 1000, tabID).then(
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
    if (!this.settings.browserSupport) {
      console.log('Loading WebExtension polyfill into a content tab')
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
      this.tabs.set(tabID, new ContentData(tabID, Content.Process.statuses.ACTIVE))
      BackgroundProcess.defaults.contentScriptLoaded = true
    }, (error) => {
      throw new Error('Content script loading failed', error)
    })
  }

  sendResponseToTabStatefully (request, tabID, state = undefined) {
    return State.value(state, this.messagingService.sendResponseToTab(request, tabID))
  }

  async getHomonymStatefully (language, word, state) {
    let result = await this.maAdapter.getHomonym(language, word, state)
    return State.value(state, result)
  }

  async handleWordDataRequestStatefully (request, sender, state = undefined) {
    let selectedWord = InflectionTables.SelectedWord.readObjects(request.body)
    console.log(`Request for a "${selectedWord.word}" word`)

    try {
      // homonymObject is a state object, where 'value' proparty has homonym, and 'state' - a state
      let homonymObject = await this.getHomonymStatefully(selectedWord.language, selectedWord.word, state)
      let homonym = homonymObject.value
      state = homonymObject.state
      let wordData
      let status = Message.statuses.NO_DATA_FOUND
      if (homonym) {
        // If word data is found, get matching suffixes from an inflection library
        wordData = this.langData.getSuffixes(homonym, state)
        wordData.definition = encodeURIComponent(alpheiosTestData.definition)
        status = Message.statuses.DATA_FOUND
        console.log(wordData)
      }
      let tabID = await BackgroundProcess.getActiveTabID()
      let returnObject = this.sendResponseToTabStatefully(new WordDataResponse(request, wordData, status), tabID, state)
      state = returnObject.state
      return State.emptyValue(state)
    } catch (error) {
      console.error(`An error occurred during a retrieval of word data: ${error}`)
      return State.emptyValue(state)
    }
  }

  static async getActiveTabID () {
    let tabs = await browser.tabs.query({ active: true })
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

let monitoredBackgroundProcess = ExperienceMonitor.track(
  new BackgroundProcess(),
  [
    {
      name: 'handleWordDataRequestStatefully',
      wrapper: ExperienceMonitor.asyncIncomingMessageWrapper,
      experience: 'Get word data from a library'
    },
    {
      name: 'sendResponseToTabStatefully',
      wrapper: ExperienceMonitor.asyncOutgoingMessageWrapper,
      experience: 'Send word data back to a content script'
    },
    {
      name: 'getHomonymStatefully',
      wrapper: ExperienceMonitor.asyncWrapper,
      experience: 'Get homonym from a morphological analyzer'
    }
  ]
)
/*
BackgroundProcess constructor performs a `browser` global object support detection. Because of that,
webextension-polyfill, that emulates a `browser` object, should be loaded after BackgroundProcess constructor.
 */
window.browser = require('../../dist/support/webextension-polyfill/browser-polyfill')
monitoredBackgroundProcess.initialize()
console.log(`Support of global "browser" object: ${monitoredBackgroundProcess.settings.browserSupport}`)
