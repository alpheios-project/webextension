/* eslint-disable no-unused-vars */
/* global safari */
import { Constants } from 'alpheios-data-models'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Lexicons } from 'alpheios-lexicon-client'

import BaseContentProcess from '@/content/base-content-process'

import Message from '@safari/lib/messaging/message/message'
import MessagingService from '@safari/lib/messaging/service'

import StateMessage from '@safari/lib/messaging/message/state-message'

import TabScript from '@safari/lib/content/tab-script'
import { UIController, HTMLSelector, LexicalQuery, LanguageOptionDefaults, ContentOptionDefaults,
  UIOptionDefaults, Options, AnnotationQuery, LocalStorageArea, MouseDblClick } from 'alpheios-components'
import SiteOptions from '@safari/lib/settings/site-options.json'

export default class ContentProcessSafari extends BaseContentProcess {
  constructor () {
    super(TabScript)

    this.state.setWatcher('panelStatus', this.sendStateToBackground.bind(this))
    this.state.setWatcher('tab', this.sendStateToBackground.bind(this))
    this.state.setWatcher('uiActive', this.updateAnnotations.bind(this))

    this.options = new Options(ContentOptionDefaults, LocalStorageArea)
    this.resourceOptions = new Options(LanguageOptionDefaults, LocalStorageArea)
    this.uiOptions = new Options(UIOptionDefaults, LocalStorageArea)

    this.messagingService = new MessagingService()
    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.ui = new UIController(this.state, this.options, this.resourceOptions, this.uiOptions)
  }

  initialize () {
    this.messagingService.addHandler(Message.types.STATE_REQUEST, this.handleStateRequest, this)
    safari.self.addEventListener('message', this.messagingService.listener.bind(this.messagingService))

    MouseDblClick.listen('body', evt => this.getSelectedText(evt))

    document.addEventListener('keydown', this.handleEscapeKey.bind(this))
    document.body.addEventListener('Alpheios_Reload', this.handleReload.bind(this))
    document.body.addEventListener('Alpheios_Embedded_Response', this.disableContent.bind(this))
    document.body.addEventListener('Alpheios_Page_Load', this.updateAnnotations.bind(this))

    document.body.addEventListener('Alpheios_Options_Loaded', this.updatePanelOnActivation.bind(this))
    // this.reactivate()
    this.sendStateToBackground('updateState')
  }

  get storageAreaClass () {
    return LocalStorageArea
  }

  handleStateRequest (message) {
    console.log(`State request has been received`)
    let state = TabScript.readObject(message.body)
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
      this.updatePanelOnActivation()
      if (diff.has('tab') && diff.tab) {
        this.ui.changeTab(diff.tab)
      }
    }
  }

  sendStateToBackground (messageName) {
    safari.extension.dispatchMessage(messageName, new StateMessage(this.state))
  }

  /**
   * Load site-specific settings
   */
  loadSiteOptions () {
    let allSiteOptions = []
    for (let site of SiteOptions) {
      for (let domain of site.options) {
        let siteOpts = new Options(domain, LocalStorageArea)
        allSiteOptions.push({ uriMatch: site.uriMatch, resourceOptions: siteOpts })
      }
    }
    return allSiteOptions
  }

  updatePanelOnActivation () {
    if (this.isActive && this.ui.uiOptions.items.panelOnActivate.currentValue && !this.ui.panel.isOpen()) {
      this.ui.panel.open()
    }
    this.sendStateToBackground('updateState')
  }
}
