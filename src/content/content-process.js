/* global browser */
import * as InflectionTables from 'alpheios-inflection-tables'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import {Lexicons} from 'alpheios-lexicon-client'
import {Feature, Lexeme} from 'alpheios-data-models'
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import Panel from './components/panel/component'
import Options from './components/options/component'
import State from '../lib/state'
import TabScript from '../lib/content/tab-script'
import Statuses from '../lib/content/statuses'
import Template from './template.htmlf'
// import PageControls from './components/page-controls/component'
import HTMLSelector from '../lib/selection/media/html-selector'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import VueJsModal from 'vue-js-modal'
import Popup from './vue-components/popup.vue'
import Morph from './vue-components/morph.vue'
// UIKit
import UIkit from '../../node_modules/uikit/dist/js/uikit'
import UIkITIconts from '../../node_modules/uikit/dist/js/uikit-icons'

export default class ContentProcess {
  constructor () {
    this.state = new TabScript()
    this.state.status = Statuses.PENDING
    this.state.panelStatus = Statuses.PANEL_CLOSED
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
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
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
      },
      methods: {
        onClose: this.closePanel.bind(this)
      }
    })
    // Should be loaded after Panel because options are inserted into a panel
    this.options = new Options({
      methods: {
        ready: (options) => {
          this.state.status = Statuses.ACTIVE
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

    Vue.component('morph',Morph)

    // Create a Vue instance for a popup
    this.vueInstance = new Vue({
      el: '#popup',
      // template: '<app/>',
      components: { morph: Morph, popup: Popup },
      data: {
        popupTitle: '',
        popupContent: '',
        messageContent: '',
        lexemes: [],
        panel: this.panel
      },
      mounted: function () {
        console.log('Root instance is mounted')
      }
    })
    this.modal = this.vueInstance.$modal

    // Initialize UIKit
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
    return this.state.status === Statuses.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.closePanel()
    this.state.status = Statuses.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.state.status = Statuses.ACTIVE
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

    this.clearUI()
    this.openUI()
    this.showMessage(`Please wait while data is retrieved ...<br>`)
    try {
      // homonymObject is a state object, where a 'value' property stores a homonym, and 'state' property - a state
      ({ value: homonym, state } = await this.getHomonymStatefully(textSelector.languageCode, textSelector.normalizedText, state))
      if (!homonym) { throw State.value(state, new Error(`Homonym data is empty`)) }
      this.appendMessage(`Morphological analyzer data is ready<br>`)
      this.updateMorphologyData(homonym)
      this.updateDefinitionsData(homonym)
    } catch (error) {
      console.error(`Cannot retrieve homonym data: ${error}`)
    }

    try {
      lexicalData = this.langData.getSuffixes(homonym, state)
      // this.panel.contentAreas.messages.appendContent('Inflection data is ready<br>')
      this.appendMessage(`Inflection data is ready<br>`)
      this.updateInflectionsData(lexicalData)
    } catch (e) {
      console.log(`Failure retrieving inflection data. ${e}`)
    }

    let definitionRequests = []
    try {
      for (let lexeme of homonym.lexemes) {
        // Short definition requests
        let requests = Lexicons.fetchShortDefs(lexeme.lemma)
        definitionRequests = definitionRequests.concat(requests.map(request => {
          return {
            request: request,
            type: 'Short definition',
            lexeme: lexeme,
            appendFunction: 'appendShortDefs',
            isCompleted: false
          }
        }))
        requests = Lexicons.fetchFullDefs(lexeme.lemma)
        definitionRequests = definitionRequests.concat(requests.map(request => {
          return {
            request: request,
            type: 'Full definition',
            lexeme: lexeme,
            appendFunction: 'appendFullDefs',
            isCompleted: false
          }
        }))
      }

      // Full definition requests
      for (let definitionRequest of definitionRequests) {
        definitionRequest.request.then(
          definition => {
            console.log(`${definitionRequest.type}(s) received: ${definition}`)
            definitionRequest.lexeme.meaning[definitionRequest.appendFunction](definition)
            definitionRequest.isCompleted = true
            this.appendMessage(`${definitionRequest.type} request is completed successfully. Lemma: "${definitionRequest.lexeme.lemma.word}"<br>`)
            if (definitionRequests.every(request => request.isCompleted)) {
              this.appendMessage(`<strong>All lexical data is available now</strong><br>`)
            }
            this.updateDefinitionsData(homonym)
          },
          error => {
            console.error(`${definitionRequest.type}(s) request failed: ${error}`)
            definitionRequest.isCompleted = true
            this.appendMessage(`${definitionRequest.type} request cannot be completed. Lemma: "${definitionRequest.lexeme.lemma.word}"<br>`)
            if (definitionRequests.every(request => request.isCompleted)) {
              this.appendMessage(`<strong>All lexical data is available now</strong><br>`)
            }
          }
        )
      }

      return State.emptyValue(state)
    } catch (error) {
      let errorValue = State.getValue(error) // In a mixed environment, both statefull and stateless error messages can be thrown
      console.error(`Word data retrieval failed: ${errorValue}`)
      return State.emptyValue(state)
    }
  }

  openUI () {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.open()
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.vueInstance.$modal.show('popup')
    }
  }

  clearUI () {
    this.panel.clearContent()
    this.vueInstance.popupTitle = ''
    this.vueInstance.popupContent = ''
  }

  updateMorphologyData (homonym) {
    //this.panel.contentAreas.morphology.clearContent()
    homonym.lexemes.sort(Lexeme.getSortByLemmaFeature(Feature.types.frequency))
    homonym.lexemes.sort(Lexeme.getSortByLemmaFeature(Feature.types.part))
    this.vueInstance.lexemes = homonym.lexemes
  }

  updateDefinitionsData (homonym) {
    this.panel.contentAreas.shortDefinitions.clearContent()
    this.panel.contentAreas.fullDefinitions.clearContent()
    let shortDefsText = ''
    for (let lexeme of homonym.lexemes) {
      if (lexeme.meaning.shortDefs.length > 0) {
        this.panel.contentAreas.shortDefinitions.appendContent(lexeme)
        shortDefsText += this.formatShortDefinitions(lexeme)
      }

      if (lexeme.meaning.fullDefs.length > 0) {
        this.panel.contentAreas.fullDefinitions.appendContent(lexeme)
      }
    }

    // Pouplate a popup
    this.vueInstance.popupTitle = `${homonym.targetWord}`
    this.vueInstance.popupContent = shortDefsText
  }

  updateInflectionsData (lexicalData) {
    this.updateInflectionTable(lexicalData)
  }

  showMessage (message) {
    this.panel.showMessage(message)
    this.vueInstance.messageContent = message
  }

  appendMessage (message) {
    this.panel.appendMessage(message)
    this.vueInstance.messageContent += message
  }

  clearMessages () {
    this.panel.clearMessages()
    this.vueInstance.messageContent = ''
  }

  openPanel () {
    this.panel.open()
    this.state.panelStatus = Statuses.PANEL_OPEN
    this.sendStateToBackground()
  }

  closePanel () {
    this.panel.close()
    this.state.panelStatus = Statuses.PANEL_CLOSED
    this.sendStateToBackground()
  }

  formatShortDefinitions (lexeme) {
    let content = `<h3>Lemma: ${lexeme.lemma.word}</h3>\n`
    for (let shortDef of lexeme.meaning.shortDefs) {
      content += `<div class="alpheios-meaning">${shortDef.text}\n`
      if (shortDef.provider) {
        content += `<div class="alpheios-provider">${shortDef.provider}</div>\n`
      }
      content += '</div>'
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

  handleStateRequest (request, sender) {
    // Send a status response
    console.log(`State request has been received`)
    let state = TabScript.readObject(request.body)
    let diff = this.state.diff(state)
    if (diff.hasOwnProperty('tabID')) { this.state.tabID = diff.tabID }
    if (diff.hasOwnProperty('status')) {
      if (diff.status === Statuses.ACTIVE) {
        this.state.status = Statuses.ACTIVE
      } else {
        this.state.status = Statuses.DEACTIVATED
        this.closePanel()
        console.log('Content has been deactivated')
      }
    }
    if (diff.hasOwnProperty('panelStatus')) {
      if (diff.panelStatus === Statuses.PANEL_OPEN) { this.openPanel() } else { this.closePanel() }
    }
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state)).catch(
      (error) => {
        console.error(`Unable to send a response to a state request: ${error}`)
      }
    )
  }

  handleActivationRequest (request, sender) {
    // Send a status response
    console.log(`Activate request received. Sending a response back.`)
    if (!this.isActive) {
      this.reactivate()
    }
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state.status)).catch(
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
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state.status)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
      }
    )
  }

  handleOpenPanelRequest (request, sender) {
    console.log(`Open panel request received. Sending a response back.`)
    let panelStatus = this.openPanel()
  }

  sendStateToBackground () {
    this.messagingService.sendMessageToBg(new StateMessage(this.state)).catch(
      (error) => {
        console.error(`Unable to send a response to activation request: ${error}`)
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
