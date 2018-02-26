/* global browser */
import {LanguageDataList} from 'alpheios-inflection-tables'
import {Constants} from 'alpheios-data-models'
import AlpheiosTuftsAdapter from 'alpheios-tufts-adapter'
import {Lexicons} from 'alpheios-lexicon-client'
import {ObjectMonitor as ExpObjMon} from 'alpheios-experience'
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import TabScript from '../lib/content/tab-script'
import Options from './content-options'
import ResourceOptions from './resource-options'
import { UIController, HTMLSelector, LexicalQuery } from 'alpheios-components'

export default class ContentProcess {
  constructor () {
    this.state = new TabScript()
    this.state.status = TabScript.statuses.script.PENDING
    this.state.panelStatus = TabScript.statuses.panel.CLOSED
    this.state.setWatcher('panelStatus', this.sendStateToBackground.bind(this))
    this.state.setWatcher('tab', this.sendStateToBackground.bind(this))
    this.options = new Options()
    this.resourceOptions = new ResourceOptions()

    this.messagingService = new MessagingService()

    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.langData = new LanguageDataList().loadData()
    this.ui = new UIController(this.state, this.options, this.resourceOptions, TabScript.statuses)
  }

  initialize () {
    // Adds message listeners
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    document.body.addEventListener('dblclick', this.getSelectedText.bind(this))
    document.body.addEventListener('keydown', this.handleEscapeKey.bind(this))
    document.body.addEventListener('Alpheios_Reload', this.handleReload.bind(this))
    this.reactivate()
  }

  get isActive () {
    return this.state.status === TabScript.statuses.script.ACTIVE
  }

  handleReload () {
    console.log('Alpheios reload event caught.')
    if (this.isActive) {
      this.deactivate()
    }
    window.location.reload()
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.ui.popup.close()
    this.ui.panel.close()
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
        this.ui.panel.close()
        this.ui.popup.close()
        console.log('Content has been deactivated')
      }
    }
    if (diff.has('panelStatus')) {
      if (diff.panelStatus === TabScript.statuses.panel.OPEN) { this.ui.panel.open() } else { this.ui.panel.close() }
    }
    if (diff.has('tab') && diff.tab) {
      this.ui.changeTab(diff.tab)
    }
    this.messagingService.sendResponseToBg(new StateResponse(request, this.state)).catch(
      (error) => {
        console.error('Unable to send a response to a state request', error)
      }
    )
  }

  sendStateToBackground () {
    this.messagingService.sendMessageToBg(new StateMessage(this.state)).catch(
      (error) => {
        console.error('Unable to send a response to activation request', error)
      }
    )
  }

  handleEscapeKey (event) {
    if (event.keyCode === 27 && this.isActive) {
      if (this.state.isPanelOpen()) {
        this.ui.panel.close()
      } else if (this.ui.popup.visible) {
        this.ui.popup.close()
      }
    }
    return true
  }

  getSelectedText (event) {
    if (this.isActive) {
      /*
      TextSelector conveys text selection information. It is more generic of the two.
      HTMLSelector conveys page-specific information, such as location of a selection on a page.
      It's probably better to keep them separated in order to follow a more abstract model.
       */
      let htmlSelector = new HTMLSelector(event, this.options.items.preferredLanguage.currentValue)
      let textSelector = htmlSelector.createTextSelector()

      if (!textSelector.isEmpty()) {
        this.ui.updateLanguage(textSelector.languageCode)
        ExpObjMon.track(
          LexicalQuery.create(textSelector, {
            htmlSelector: htmlSelector,
            uiController: this.ui,
            maAdapter: this.maAdapter,
            langData: this.langData,
            lexicons: Lexicons,
            resourceOptions: this.resourceOptions,
            langOpts: { [Constants.LANG_PERSIAN]: { lookupMorphLast: true } } // TODO this should be externalized
          }),
          {
            experience: 'Get word data',
            actions: [
              { name: 'getData', action: ExpObjMon.actions.START, event: ExpObjMon.events.GET },
              { name: 'finalize', action: ExpObjMon.actions.STOP, event: ExpObjMon.events.GET }
            ]
          })
        .getData()
      }
    }
  }
}
