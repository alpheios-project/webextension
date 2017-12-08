/* global browser */
import * as Lib from 'alpheios-inflection-tables'
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import WordDataRequest from '../lib/messaging/request/word-data-request'
import StatusResponse from '../lib/messaging/response/status-response'
import Panel from './components/panel/component'
import Options from './components/options/component'
import State from '../lib/state'
import Statuses from './statuses'
import Template from './template.htmlf'
import PageControls from './components/page-controls/component'
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
    this.panel = new Panel({})
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

// components can be called from the imported UIkit reference
    UIkit.notification('Hello world.')
  }

  static get settingValues () {
    return {
      hiddenClassName: 'hidden',
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

  showMessage (messageHTML) {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.showMessage(messageHTML)
    } else {
      this.panel.close()
      this.vueInstance.panel = this.panel // For being able to open a panel from within a popup
      this.vueInstance.popupTitle = ''
      this.vueInstance.popupContent = messageHTML
      this.vueInstance.$modal.show('popup')
    }
  }

  async sendRequestToBgStatefully (request, timeout, state = undefined) {
    try {
      let result = await this.messagingService.sendRequestToBg(request, timeout)
      return State.value(state, result)
    } catch (error) {
      // Wrap error te same way we wrap value
      console.log(`Statefull request to a background failed: ${error}`)
      throw State.value(state, error)
    }
  }

  async getWordDataStatefully (textSelector, state = undefined) {
    try {
      let messageObject = await this.sendRequestToBgStatefully(
        new WordDataRequest(textSelector),
        this.settings.requestTimeout,
        state
      )
      let message = messageObject.value

      if (Message.statusSymIs(message, Message.statuses.DATA_FOUND)) {
        let wordData = Lib.WordData.readObject(message.body)
        console.log('Word data is: ', wordData)
        this.displayWordData(wordData)
      } else if (Message.statusSymIs(message, Message.statuses.NO_DATA_FOUND)) {
        this.showMessage('<p>Sorry, the word you requested was not found.</p>')
      }
      return messageObject
    } catch (error) {
      console.error(`Word data request failed: ${error.value}`)
      this.showMessage(`<p>Sorry, your word you requested failed:<br><strong>${error.value}</strong></p>`)
    }
  }

  displayWordData (wordData) {
    /* let definitions = ''
    if (wordData.definitions) {
      for (let definition of wordData.definitions) {
        definition.text = decodeURIComponent(definition.text)
        definitions += definition.text
      }
    } */

    // Populate a panel
    this.panel.clear()
    //this.updateDefinition(wordData)
    this.updateInflectionTable(wordData)

    // Pouplate a popup
    this.vueInstance.panel = this.panel
    this.vueInstance.popupTitle = `${wordData.homonym.targetWord}`
    // this.vueInstance.popupContent = decodeURIComponent(definitions)

    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.open()
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.vueInstance.$modal.show('popup')
    }
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
    this.status = Status.PANEL_OPEN
    this.messagingService.sendResponseToBg(new StatusResponse(request, this.status)).catch(
      (error) => {
        console.error(`Unable to send a response to panel open request: ${error}`)
      }
    )
  }

  togglePanel () {
    this.panel.toggle()
  }

  updateDefinition (wordData) {
    this.panel.options.elements.definitionContainer.innerHTML = decodeURIComponent(wordData.definition)
  }

  updateInflectionTable (wordData) {
    this.presenter = new Lib.Presenter(
      this.panel.options.elements.inflTableContainer,
      this.panel.options.elements.viewSelectorContainer,
      this.panel.options.elements.localeSwitcherContainer,
      wordData,
      this.options.items.locale.currentValue
    ).render()
  }

  optionChangeListener (optionName, optionValue) {
    if (optionName === 'locale' && this.presenter) { this.presenter.setLocale(optionValue) }
    if (optionName === 'panelPosition') { this.setPanelPositionTo(optionValue) }
    if (optionName === 'defaulLanguage') { this.setDefaultLanguageTo(optionValue)}
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

      // HTMLSelector.getExtendedTextQuoteSelector()
      if (!textSelector.isEmpty()) {
        this.getWordDataStatefully(textSelector)
      }
    }
  }
}
