/* global browser */
import * as Lib from 'alpheios-inflection-tables'
import Message from '../lib/messaging/message'
import MessagingService from '../lib/messaging/service'
import WordDataRequest from '../lib/messaging/request/word-data-request'
import StatusResponse from '../lib/messaging/response/status-response'
import Panel from './panel'
import Options from '../lib/options'
import State from '../lib/state'
import SymbolsTemplate from './templates/symbols.htmlf'
import PageControlsTemplate from './templates/page-controls.htmlf'
import PanelTemplate from './templates/panel.htmlf'
import OptionsTemplate from './templates/options.htmlf'
import HTMLSelector from '../lib/selection/media/html-selector'

export default class ContentProcess {
  constructor () {
    this.status = ContentProcess.statuses.PENDING
    this.settings = ContentProcess.settingValues
    this.options = new Options()

    this.messagingService = new MessagingService()
  }

  static get settingValues () {
    return {
      hiddenClassName: 'hidden',
      pageControlSel: '#alpheios-panel-toggle',
      requestTimeout: 4000
    }
  }

  static get statuses () {
    return {
      PENDING: Symbol.for('Pending'), // Content script has not been fully initialized yet
      ACTIVE: Symbol.for('Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Deactivated') // Content script has been loaded, but is deactivated
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
    return this.status === ContentProcess.statuses.ACTIVE
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.panel.close()
    this.pageControl.classList.add(this.settings.hiddenClassName)
    this.status = ContentProcess.statuses.DEACTIVATED
  }

  reactivate () {
    console.log('Content has been reactivated.')
    this.pageControl.classList.remove(this.settings.hiddenClassName)
    this.status = ContentProcess.statuses.ACTIVE
  }

  async initialize () {
    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    ContentProcess.loadPanel()
    ContentProcess.loadPageControls()
    ContentProcess.loadSymbols()

    this.panel = new Panel(this.options)
    this.panelToggleBtn = document.querySelector('#alpheios-panel-toggle')
    this.renderOptions()

    this.pageControl = document.querySelector(this.settings.pageControlSel)

    // Add a message listener
    this.messagingService.addHandler(Message.types.STATUS_REQUEST, this.handleStatusRequest, this)
    this.messagingService.addHandler(Message.types.ACTIVATION_REQUEST, this.handleActivationRequest, this)
    this.messagingService.addHandler(Message.types.DEACTIVATION_REQUEST, this.handleDeactivationRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))

    this.panelToggleBtn.addEventListener('click', this.togglePanel.bind(this))
    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
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

  async getWordDataStatefully (language, word, state = undefined) {
    try {
      let messageObject = await this.sendRequestToBgStatefully(
        new WordDataRequest(language, word), this.settings.requestTimeout, state
      )
      let message = messageObject.value

      if (Message.statusSymIs(message, Message.statuses.DATA_FOUND)) {
        let wordData = Lib.WordData.readObject(message.body)
        console.log('Word data is: ', wordData)
        this.panel.clear()
        this.updateDefinition(wordData)
        this.updateInflectionTable(wordData)
        this.panel.open()
      } else if (Message.statusSymIs(message, Message.statuses.NO_DATA_FOUND)) {
        this.panel.clear()
        this.panel.definitionContainer.innerHTML = '<p>Sorry, the word you requested was not found.</p>'
        this.panel.open().changeActiveTabTo(this.panel.tabs[0])
      }
      return messageObject
    } catch (error) {
      console.error(`Word data request failed: ${error.value}`)
      throw error
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
    this.panel.optionsPage = OptionsTemplate
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
    }
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
      let selection = HTMLSelector.getSelector(event.target, 'grc')
      // HTMLSelector.getExtendedTextQuoteSelector()
      if (selection.word) {
        let language = selection.language.toCode()
        this.getWordDataStatefully(language, selection.word)
      }
    }
  }
}
