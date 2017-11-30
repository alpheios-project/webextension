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
import PanelTemplate from './components/panel/template.htmlf'
import HTMLSelector from '../lib/selection/media/html-selector'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import VueJsModal from 'vue-js-modal'
import Popup from './vue-components/popup.vue'

export default class ContentProcess {
  constructor () {
    this.status = Statuses.PENDING
    this.settings = ContentProcess.settingValues
    this.vueInstance = undefined

    this.modal = undefined

    this.messagingService = new MessagingService()

    this.loadUI()
  }

  loadUI () {
    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    ContentProcess.loadTemplate(Template)

    // Initialize components
    this.pageControls = new PageControls({
      methods: {
        onPanelToggle: this.togglePanel.bind(this)
      }
    })
    this.panel = new Panel({})
    // Should be loaded after Panel because they are inserted into a panel
    this.options = new Options({})

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
  }

  static get settingValues () {
    return {
      hiddenClassName: 'hidden',
      pageControlsID: 'alpheios-page-controls',
      requestTimeout: 4000,
      uiTypePanel: 'panel',
      uiTypePopup: 'popup'
    }
  }

  /**
   * Loads any asynchronous data that there might be.
   * @return {Promise}
   */
  async loadData () {
    return this.options.loadStoredData()
  }

  get isActive () {
    return this.status === Statuses.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.panel.close()
    this.pageControl.classList.add(this.settings.hiddenClassName)
    this.status = Statuses.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.pageControl.classList.remove(this.settings.hiddenClassName)
    this.status = Statuses.ACTIVE
  }

  async initialize () {
    // this.panelToggleBtn = document.querySelector('#alpheios-panel-toggle')
    // this.renderOptions()

    this.pageControl = document.querySelector(this.settings.pageControlSel)

    // Add a message listener
    this.messagingService.addHandler(Message.types.STATUS_REQUEST, this.handleStatusRequest, this)
    this.messagingService.addHandler(Message.types.ACTIVATION_REQUEST, this.handleActivationRequest, this)
    this.messagingService.addHandler(Message.types.DEACTIVATION_REQUEST, this.handleDeactivationRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    // this.panelToggleBtn.addEventListener('click', this.togglePanel.bind(this))
    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
  }

  static loadTemplate (template) {
    let container = document.createElement('div')
    document.body.insertBefore(container, document.body.firstChild)
    container.outerHTML = template
  }

  static loadSymbols () {
    ContentProcess.loadHTMLFragment(SymbolsTemplate)
  }

  static loadPageControls () {
    ContentProcess.loadHTMLFragment(PageControlsTemplate)
  }

  static loadPanel () {
    ContentProcess.loadHTMLFragment(PanelTemplate)
  }

  static loadHTMLFragment (html) {
    let container = document.createElement('div')
    container.innerHTML = html
    document.body.insertBefore(container.firstChild, document.body.firstChild)
  }

  showMessage (messageHTML) {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.clear()
      this.panel.definitionContainer.innerHTML = messageHTML
      this.panel.open().changeActiveTabTo(this.panel.tabs[0])
    } else {
      this.vueInstance.panel = this.panel
      this.vueInstance.popupTitle = ''
      this.vueInstance.popupContent = messageHTML
      this.vueInstance.$modal.show('popup')
    }
  }

  pageControlsClicked () {
    console.log('Page controls clicked')
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

        // Populate a panel
        this.panel.clear()
        this.updateDefinition(wordData)
        this.updateInflectionTable(wordData)

        // Pouplate a popup
        this.vueInstance.panel = this.panel
        this.vueInstance.popupTitle = `${wordData.homonym.targetWord}`
        this.vueInstance.popupContent = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum purus egestas libero ornare venenatis.
                Maecenas pharetra tortor eu tortor imperdiet, a faucibus quam finibus. Nulla id lacinia quam.
                Praesent imperdiet sed magna non finibus. Aenean blandit, mauris vitae lacinia rutrum,
                nunc mi scelerisque sem, in laoreet sem lectus ut orci. Ut egestas nulla in vehicula feugiat.
                Vivamus tincidunt nisi vel risus dictum suscipit. Nulla id blandit mi, vulputate aliquam enim.</p>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum purus egestas libero ornare venenatis.
                Maecenas pharetra tortor eu tortor imperdiet, a faucibus quam finibus. Nulla id lacinia quam.
                Praesent imperdiet sed magna non finibus. Aenean blandit, mauris vitae lacinia rutrum,
                nunc mi scelerisque sem, in laoreet sem lectus ut orci. Ut egestas nulla in vehicula feugiat.
                Vivamus tincidunt nisi vel risus dictum suscipit. Nulla id blandit mi, vulputate aliquam enim.</p>`

        if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
          this.panel.open()
        } else {
          this.vueInstance.$modal.show('popup')
        }
      } else if (Message.statusSymIs(message, Message.statuses.NO_DATA_FOUND)) {
        this.showMessage('<p>Sorry, the word you requested was not found.</p>')
      }
      return messageObject
    } catch (error) {
      console.error(`Word data request failed: ${error.value}`)
      this.showMessage(`<p>Sorry, your word you requested failed:<br><strong>${error.value}</strong></p>`)
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

  togglePanel () {
    this.panel.toggle()
  }

  updateDefinition (wordData) {
    this.panel.definitionContainer.innerHTML = decodeURIComponent(wordData.definition)
  }

  updateInflectionTable (wordData) {
    this.presenter = new Lib.Presenter(this.panel.inflTableContainer, this.panel.viewSelectorContainer,
      this.panel.localeSwitcherContainer, wordData, this.options.items.locale.currentValue).render()
  }

  renderOptions () {
    /* this.panel.optionsPage = OptionsTemplate
    let optionEntries = Object.entries(this.options.items)
    for (let [optionName, option] of optionEntries) {
      let localeSelector = this.panel.optionsPage.querySelector(option.inputSelector)
      for (let optionValue of option.values) {
        let optionElement = document.createElement('option')
        optionElement.value = optionValue.value
        optionElement.text = optionValue.text
        if (optionValue.value === option.currentValue) {
          optionElement.setAttribute('selected', 'selected')
        }
        localeSelector.appendChild(optionElement)
      }
      localeSelector.addEventListener('change', this.optionChangeListener.bind(this, optionName))
    } */
  }

  optionChangeListener (option, event) {
    this.options.update(option, event.target.value)
    if (option === 'locale' && this.presenter) {
      this.presenter.setLocale(event.target.value)
    }
    if (option === 'panelPosition') {
      if (event.target.value === 'right') {
        this.panel.setPoistionToRight()
      } else {
        this.panel.setPoistionToLeft()
      }
    }
  }

  getSelectedText (event) {
    if (this.isActive) {
      let textSelector = HTMLSelector.getSelector(event.target, 'grc')

      // HTMLSelector.getExtendedTextQuoteSelector()
      if (!textSelector.isEmpty()) {
        this.getWordDataStatefully(textSelector)
      }
    }
  }
}
