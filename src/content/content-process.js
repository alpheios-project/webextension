/* global browser */
import {Constants} from 'alpheios-data-models'
import {AlpheiosTuftsAdapter} from 'alpheios-morph-client'
import {Lexicons} from 'alpheios-lexicon-client'
import {ObjectMonitor as ExpObjMon} from 'alpheios-experience'
import Message from '../lib/messaging/message/message'
import MessagingService from '../lib/messaging/service'
import StateMessage from '../lib/messaging/message/state-message'
import StateResponse from '../lib/messaging/response/state-response'
import TabScript from '../lib/content/tab-script'
import { UIController, HTMLSelector, LexicalQuery, LanguageOptionDefaults, ContentOptionDefaults,
  UIOptionDefaults, Options, AnnotationQuery, ExtensionSyncStorage, MouseDblClick } from 'alpheios-components'
import SiteOptions from '../lib/settings/site-options.json'

export default class ContentProcess {
  constructor () {
    this.state = new TabScript()
    this.state.status = TabScript.statuses.script.PENDING
    this.state.panelStatus = TabScript.statuses.panel.CLOSED

    this.siteOptions = this.loadSiteOptions()
    this.state.setWatcher('panelStatus', this.sendStateToBackground.bind(this))
    this.state.setWatcher('tab', this.sendStateToBackground.bind(this))
    this.state.setWatcher('uiActive', this.updateAnnotations.bind(this))
    this.options = new Options(ContentOptionDefaults, ExtensionSyncStorage)
    this.resourceOptions = new Options(LanguageOptionDefaults, ExtensionSyncStorage)
    this.uiOptions = new Options(UIOptionDefaults, ExtensionSyncStorage)
    this.messagingService = new MessagingService()
    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.ui = new UIController(this.state, this.options, this.resourceOptions, this.uiOptions, browser.runtime.getManifest())
  }

  initialize () {
    // Adds message listeners
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    browser.runtime.onMessage.addListener(this.messagingService.listener.bind(this.messagingService))
    MouseDblClick.listen('body', evt => this.getSelectedText(evt))
    document.body.addEventListener('keydown', this.handleEscapeKey.bind(this))
    document.body.addEventListener('Alpheios_Reload', this.handleReload.bind(this))
    document.body.addEventListener('Alpheios_Embedded_Response', this.disableContent.bind(this))
    document.body.addEventListener('Alpheios_Page_Load', this.updateAnnotations.bind(this))

    document.body.addEventListener('Alpheios_Options_Loaded', this.updatePanelOnActivation.bind(this))
    this.reactivate()
  }

  get isActive () {
    return this.state.isActive()
  }

  get uiIsActive () {
    return this.state.uiIsActive()
  }

  disableContent () {
    console.log('Alpheios is embedded.')
    // if we weren't already disabled, remember the current state
    // and then deactivate before disabling
    if (!this.state.isDisabled()) {
      this.state.save()
      if (this.isActive) {
        console.log('Deactivating Alpheios')
        this.deactivate()
      }
    }
    this.state.disable()
    this.sendStateToBackground()
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
    this.state.deactivate()
  }

  reactivate () {
    if (this.state.isDisabled()) {
      console.log('Alpheios is disabled')
    } else {
      console.log('Content has been reactivated.')
      this.state.activate()
    }
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
        this.state.tabObj = state.tabObj
      } else if (!this.state.hasSameID(diff.tabID)) {
        console.warn(`State request with the wrong tab ID "${Symbol.keyFor(diff.tabID)}" received. This tab ID is "${Symbol.keyFor(this.state.tabID)}"`)
        // TODO: Should we ignore such requests?
        this.state.tabID = state.tabID
        this.state.tabObj = state.tabObj
      }
    }

    if (diff.has('status')) {
      if (diff.status === TabScript.statuses.script.ACTIVE) {
        this.state.activate()
      } else if (diff.status === TabScript.statuses.script.DEACTIVATED) {
        this.state.deactivate()
        this.ui.panel.close()
        this.ui.popup.close()
        console.log('Content has been deactivated')
      } else if (diff.status === TabScript.statuses.script.DISABLED) {
        this.state.disable()
        console.log('Content has been disabled')
      }
    }

    if (this.ui) {
      if (diff.has('panelStatus')) {
        if (diff.panelStatus === TabScript.statuses.panel.OPEN) { this.ui.panel.open() } else { this.ui.panel.close() }
      }
      if (diff.has('tab') && diff.tab) {
        this.ui.changeTab(diff.tab)
      }
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
    if (this.isActive && this.uiIsActive) {
      /*
      TextSelector conveys text selection information. It is more generic of the two.
      HTMLSelector conveys page-specific information, such as location of a selection on a page.
      It's probably better to keep them separated in order to follow a more abstract model.
       */
      let htmlSelector = new HTMLSelector(event, this.options.items.preferredLanguage.currentValue)
      let textSelector = htmlSelector.createTextSelector()

      if (!textSelector.isEmpty()) {
        ExpObjMon.track(
          LexicalQuery.create(textSelector, {
            htmlSelector: htmlSelector,
            uiController: this.ui,
            maAdapter: this.maAdapter,
            lexicons: Lexicons,
            resourceOptions: this.resourceOptions,
            siteOptions: [],
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

  /**
   * Load site-specific settings
   */
  loadSiteOptions () {
    let allSiteOptions = []
    for (let site of SiteOptions) {
      for (let domain of site.options) {
        let siteOpts = new Options(domain, ExtensionSyncStorage)
        allSiteOptions.push({ uriMatch: site.uriMatch, resourceOptions: siteOpts })
      }
    }
    return allSiteOptions
  }

  /**
   * Issues an AnnotationQuery to find and apply annotations for the currently loaded document
   */
  updateAnnotations () {
    if (this.isActive && this.uiIsActive) {
      AnnotationQuery.create({
        uiController: this.ui,
        document: document,
        siteOptions: this.siteOptions
      }).getData()
    }
  }

  updatePanelOnActivation () {
    if (this.isActive && this.ui.uiOptions.items.panelOnActivate.currentValue) {
      this.ui.panel.open()
    } else {
      this.ui.panel.close()
    }
  }
}
