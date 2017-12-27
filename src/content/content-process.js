/* global browser, Node */
import {LanguageData, LatinDataSet, GreekDataSet} from 'alpheios-inflection-tables'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import {Lexicons} from 'alpheios-lexicon-client'
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import TabScript from '../lib/content/tab-script'
import HTMLSelector from '../lib/selection/media/html-selector'
import LexicalQuery from './lexical-query'
import UIController from './ui-controller'

export default class ContentProcess {
  constructor () {
    this.state = new TabScript()
    this.state.status = TabScript.statuses.script.PENDING
    this.state.panelStatus = TabScript.statuses.panel.CLOSED
    this.settings = ContentProcess.settingValues

    this.messagingService = new MessagingService()

    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.langData = new LanguageData([LatinDataSet, GreekDataSet]).loadData()
    this.ui = new UIController(this.state, this.sendStateToBackground.bind(this))
    this.options = this.ui.getOptions()
  }

  initialize () {
    // Adds message listeners
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
    this.reactivate()
  }

  static get settingValues () {
    return {
      requestTimeout: 60000
    }
  }

  /**
   * Loads any asynchronous data that there might be.
   * @return {Promise}
   */
  async loadData () {
    return this.options.load()
  }

  get isActive () {
    return this.state.status === TabScript.statuses.script.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.ui.closePanel()
    this.state.status = TabScript.statuses.script.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.state.status = TabScript.statuses.script.ACTIVE
  }

  handleStateRequest (request, sender) {
    // Send a status response
    console.log(`State request has been received`)
    let state = TabScript.readObject(request.body)
    let diff = this.state.diff(state)
    if (diff.has('tabID')) {
      if (!this.state.tabID) {
        // Content script has been just loaded and does not have its tab ID yet
        this.state.tabID = diff.tabID
      } else if (!this.state.hasSameID(diff.tabID)) {
        console.warn(`State request with the wrong tab ID "${diff.tabID}" received. This tab ID is "${this.state.tabID}"`)
        // TODO: Should we ignore such requests?
      }
    }
    if (diff.has('status')) {
      if (diff.status === TabScript.statuses.script.ACTIVE) {
        this.state.activate()
      } else {
        this.state.deactivate()
        this.closePanel()
        console.log('Content has been deactivated')
      }
    }
    if (diff.hasOwnProperty('panelStatus')) {
      if (diff.panelStatus === TabScript.statuses.panel.OPEN) { this.ui.openPanel() } else { this.ui.closePanel() }
    }
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state)).catch(
      (error) => {
        console.error(`Unable to send a response to a state request: ${error}`)
      }
    )
  }

  sendStateToBackground () {
    this.messagingService.sendMessageToBg(new StateMessage(this.state)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  getSelectedText (event) {
    if (this.isActive) {
      let textSelector = HTMLSelector.getSelector(event.target, this.options.items.defaultLanguage.currentValue)

      if (!textSelector.isEmpty()) {
        let query = LexicalQuery.create(textSelector, {
          uiController: this.ui,
          maAdapter: this.maAdapter,
          langData: this.langData,
          lexicons: Lexicons
        })
        query.getData()
      }
    }
  }
}
