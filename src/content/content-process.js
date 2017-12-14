/* global browser */
import * as InflectionTables from 'alpheios-inflection-tables'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import {Lexicons} from 'alpheios-lexicon-client'
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import StatusResponse from '../lib/messaging/response/status-response'
import Panel from './components/panel/component'
import Options from './components/options/component'
import State from '../lib/state'
import Statuses from './statuses'
import Template from './template.htmlf'
// import PageControls from './components/page-controls/component'
import HTMLSelector from '../lib/selection/media/html-selector'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import VueJsModal from 'vue-js-modal'
import Popup from './vue-components/popup.vue'
// UIKit
import UIkit from '../../node_modules/uikit/dist/js/uikit'
import UIkITIconts from '../../node_modules/uikit/dist/js/uikit-icons'

export default class ContentProcess {
  constructor () {
    this.status = Statuses.PENDING
    this.settings = ContentProcess.settingValues
    this.vueInstance = undefined

    this.modal = undefined

    this.messagingService = new MessagingService()

    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.langData = new InflectionTables.LanguageData([InflectionTables.LatinDataSet, InflectionTables.GreekDataSet]).loadData()
  }

  initialize () {
    this.loadUI()

    // Adds message listeners
    this.messagingService.addHandler(Message.types.STATUS_REQUEST, this.handleStatusRequest, this)
    this.messagingService.addHandler(Message.types.ACTIVATION_REQUEST, this.handleActivationRequest, this)
    this.messagingService.addHandler(Message.types.DEACTIVATION_REQUEST, this.handleDeactivationRequest, this)
    this.messagingService.addHandler(Message.types.OPEN_PANEL_REQUEST, this.handleOpenPanelRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    // this.panelToggleBtn.addEventListener('click', this.togglePanel.bind(this))
    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
    this.reactivate()
  }

  loadUI () {
    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    ContentProcess.loadTemplate(Template)

    // Initialize components
    this.panel = new Panel({
      contentAreas: {
        shortDefinitions: {
          dataFunction: this.formatShortDefinitions.bind(this)
        },
        fullDefinitions: {
          dataFunction: this.formatFullDefinitions.bind(this)
        }
      }
    })
    // Should be loaded after Panel because options are inserted into a panel
    this.options = new Options({
      methods: {
        ready: (options) => {
          this.status = Statuses.ACTIVE
          this.setPanelPositionTo(options.panelPosition.currentValue)
          this.setDefaultLanguageTo(options.defaultLanguage.currentValue)
          console.log('Content script is set to active')
        },
        onChange: this.optionChangeListener.bind(this)
      }
    })

    // Register a Vue.js modal plugin
    Vue.use(VueJsModal, {
      dialog: false
    })

    // Create a Vue instance for a popup
    this.vueInstance = new Vue({
      el: '#popup',
      // template: '<app/>',
      components: { popup: Popup },
      data: {
        popupTitle: '',
        popupContent: '',
        panel: undefined
      },
      mounted: function () {
        console.log('Root instance is mounted')
      }
    })
    this.modal = this.vueInstance.$modal

    // Initialize a UIKit
    UIkit.use(UIkITIconts)
  }

  static get settingValues () {
    return {
      hiddenClassName: 'hidden',
      pageControlsID: 'alpheios-page-controls',
      requestTimeout: 60000,
      uiTypePanel: 'panel',
      uiTypePopup: 'popup'
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
    return this.status === Statuses.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.panel.close()
    this.status = Statuses.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.panel.open()
    this.status = Statuses.ACTIVE
  }

  static loadTemplate (template) {
    let container = document.createElement('div')
    document.body.insertBefore(container, document.body.firstChild)
    container.outerHTML = template
  }

  async sendRequestToBgStatefully (request, timeout, state = undefined) {
    try {
      let result = await this.messagingService.sendRequestToBg(request, timeout)
      return State.value(state, result)
    } catch (error) {
      // Wrap an error the same way we wrap the value
      console.log(`Statefull request to a background failed: ${error}`)
      throw State.value(state, error)
    }
  }

  async getHomonymStatefully (languageCode, word, state) {
    try {
      let result = await this.maAdapter.getHomonym(languageCode, word, state)
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

  async getWordDataStatefully (textSelector, state = undefined) {
    let homonym, lexicalData
    // this.showMessage('Please wait while your data is loading ...<br>')
    try {
      // homonymObject is a state object, where a 'value' property stores a homonym, and 'state' property - a state
      ({ value: homonym, state } = await this.getHomonymStatefully(textSelector.languageCode, textSelector.normalizedText, state))
      if (!homonym) { throw State.value(state, new Error(`Homonym data is empty`)) }
      // this.appendMessage('Homonym data is ready<br>')
      this.updateDefinitionsData(homonym)
    } catch (error) {
      console.error(`Cannot retrieve homonym data: ${error}`)
    }

    try {
      lexicalData = this.langData.getSuffixes(homonym, state)
      // this.panel.contentAreas.messages.appendContent('Inflection data is ready<br>')
      this.updateInflectionsData(lexicalData)
    } catch (e) {
      console.log(`Failure retrieving inflection data. ${e}`)
    }

    let defRequestOptions = { timeout: 10000 }
    try {
      for (let lexeme of homonym.lexemes) {
        // this.appendMessage(`<br>Retrieving data for "${lexeme.lemma.word}" lexeme<br>`)
        let shortDefs = await Lexicons.fetchShortDefs(lexeme.lemma, defRequestOptions)
        console.log(`Retrieved short definitions:`, shortDefs)
        lexeme.meaning.appendShortDefs(shortDefs)
        this.updateDefinitionsData(homonym)
        // this.appendMessage('Short definitions are ready<br>')
        let fullDefs = await Lexicons.fetchFullDefs(lexeme.lemma, defRequestOptions)
        console.log(`Retrieved full definitions:`, fullDefs)
        lexeme.meaning.appendFullDefs(fullDefs)
        this.updateDefinitionsData(homonym)
        // this.appendMessage('Full definitions are ready<br>')
      }
      console.log('Lexical data is: ', lexicalData)
      this.displayWordData(lexicalData)
      return State.emptyValue(state)
    } catch (error) {
      let errorValue = State.getValue(error) // In a mixed environment, both statefull and stateless error messages can be thrown
      console.error(`Word data retrieval failed: ${errorValue}`)
      return State.emptyValue(state)
    }
  }

  displayWordData (lexicalData) {
    this.panel.clearContent()
    let shortDefsText = ''
    for (let lexeme of lexicalData.homonym.lexemes) {
      if (lexeme.meaning.shortDefs.length > 0) {
        this.panel.contentAreas.shortDefinitions.setContent(lexeme)
        shortDefsText += this.formatShortDefinitions(lexeme)
      }

      if (lexeme.meaning.fullDefs.length > 0) {
        this.panel.contentAreas.fullDefinitions.setContent(lexeme)
      }
    }

    this.updateInflectionTable(lexicalData)

    // Pouplate a popup
    this.vueInstance.panel = this.panel
    this.vueInstance.popupTitle = `${lexicalData.homonym.targetWord}`

    this.vueInstance.popupContent = decodeURIComponent(shortDefsText)

    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.open()
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.vueInstance.$modal.show('popup')
    }
  }

  updateDefinitionsData (homonym) {
    this.panel.clearContent()
    let shortDefsText = ''
    for (let lexeme of homonym.lexemes) {
      if (lexeme.meaning.shortDefs.length > 0) {
        this.panel.contentAreas.shortDefinitions.setContent(lexeme)
        shortDefsText += this.formatShortDefinitions(lexeme)
      }

      if (lexeme.meaning.fullDefs.length > 0) {
        this.panel.contentAreas.fullDefinitions.setContent(lexeme)
      }
    }

    // Pouplate a popup
    this.vueInstance.panel = this.panel
    this.vueInstance.popupTitle = `${homonym.targetWord}`

    this.vueInstance.popupContent = decodeURIComponent(shortDefsText)

    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.open()
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.vueInstance.$modal.show('popup')
    }
  }

  updateInflectionsData (lexicalData) {
    this.updateInflectionTable(lexicalData)
  }

  showMessage (message) {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      if (!this.panel.isOpened) { this.panel.open() }
      this.panel.showMessage(message)
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.vueInstance.$modal.show('popup')
      this.vueInstance.messageContent = message
    }
  }

  appendMessage (message) {
    if (!this.panel.isOpened) { this.panel.open() }
    this.panel.contentAreas.messages.appendContent(message)
  }

  formatShortDefinitions (lexeme) {
    let content = `<h3>Lemma: ${lexeme.lemma.word}</h3>\n`
    for (let shortDef of lexeme.meaning.shortDefs) {
      content += `${shortDef.text}<br>\n`
    }
    return content
  }

  formatFullDefinitions (lexeme) {
    let content = `<h3>Lemma: ${lexeme.lemma.word}</h3>\n`
    for (let fullDef of lexeme.meaning.fullDefs) {
      content += `${fullDef.text}<br>\n`
    }
    return content
  }

  handleStatusRequest (request, sender) {
    // Send a status response
    console.log(`Status request received. Sending a response back.`)
    this.messagingService.sendResponseToBg(new StatusResponse(request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleActivationRequest (request, sender) {
    // Send a status response
    console.log(`Activate request received. Sending a response back.`)
    if (!this.isActive) {
      this.reactivate()
    }
    this.messagingService.sendResponseToBg(new StatusResponse(request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleDeactivationRequest (request, sender) {
    // Send a status response
    console.log(`Deactivate request received. Sending a response back.`)
    if (this.isActive) {
      this.deactivate()
    }
    this.messagingService.sendResponseToBg(new StatusResponse(request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleOpenPanelRequest (request, sender) {
    console.log(`Open panel request received. Sending a response back.`)
    this.panel.open()
    this.status = Statuses.PANEL_OPEN
    this.messagingService.sendResponseToBg(new StatusResponse(request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to panel open request: ${error}`)
      }
    )
  }

  updateInflectionTable (wordData) {
    this.presenter = new InflectionTables.Presenter(
      this.panel.contentAreas.inflectionsTable.element,
      this.panel.contentAreas.inflectionsViewSelector.element,
      this.panel.contentAreas.inflectionsLocaleSwitcher.element,
      wordData,
      this.options.items.locale.currentValue
    ).render()
  }

  optionChangeListener (optionName, optionValue) {
    if (optionName === 'locale' && this.presenter) { this.presenter.setLocale(optionValue) }
    if (optionName === 'panelPosition') { this.setPanelPositionTo(optionValue) }
    if (optionName === 'defaultLanguage') { this.setDefaultLanguageTo(optionValue) }
  }

  setDefaultLanguageTo (language) {
    this.defaultLanguage = language
  }

  setPanelPositionTo (position) {
    if (position === 'right') {
      this.panel.positionToRight()
    } else {
      this.panel.positionToLeft()
    }
  }

  getSelectedText (event) {
    if (this.isActive) {
      let textSelector = HTMLSelector.getSelector(event.target, this.defaultLanguage)

      if (!textSelector.isEmpty()) {
        this.getWordDataStatefully(textSelector)
      }
    }
  }
}
