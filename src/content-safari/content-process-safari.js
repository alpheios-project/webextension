/* eslint-disable no-unused-vars */
/* global safari */
import { Constants } from 'alpheios-data-models'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Lexicons } from 'alpheios-lexicon-client'

// import Message from '@/lib/messaging/message/message.js'
// import MessagingService from '@safari/lib/messaging/service-safari.js'

import StateMessage from '@/lib/messaging/message/state-message.js'

import TabScript from '@/lib/content/tab-script.js'
import { UIController, HTMLSelector, LexicalQuery, LanguageOptionDefaults, ContentOptionDefaults,
  UIOptionDefaults, Options, AnnotationQuery, LocalStorageArea, MouseDblClick } from 'alpheios-components'
import SiteOptions from '@/lib/settings/site-options.json'

export default class ContentProcessSafari {
  constructor () {
    this.state = new TabScript()
    this.state.status = TabScript.statuses.script.PENDING
    this.state.panelStatus = TabScript.statuses.panel.CLOSED

    this.siteOptions = this.loadSiteOptions()
    this.state.setWatcher('panelStatus', this.sendStateToBackground.bind(this))
    this.state.setWatcher('tab', this.sendStateToBackground.bind(this))
    this.state.setWatcher('uiActive', this.updateAnnotations.bind(this))

    this.options = new Options(ContentOptionDefaults, LocalStorageArea)
    this.resourceOptions = new Options(LanguageOptionDefaults, LocalStorageArea)
    this.uiOptions = new Options(UIOptionDefaults, LocalStorageArea)

    /**
     * Whether content process has been initialized.
     * @type {boolean}
     */
    this.isInitialized = false
  }

  /**
   * Initializes a content process. It successful, sets `isInitialized` prop to true.
   */
  async init () {
    if (this.isInitialized) { return `Already initialized` }

    console.log(`Initialization started`)
    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.ui = new UIController(this.state, this.options, this.resourceOptions, this.uiOptions)
    await this.ui.init()

    MouseDblClick.listen('body', evt => this.getSelectedText(evt))

    document.addEventListener('keydown', this.handleEscapeKey.bind(this))
    document.body.addEventListener('Alpheios_Reload', this.handleReload.bind(this))
    document.body.addEventListener('Alpheios_Embedded_Response', this.disableContent.bind(this))
    document.body.addEventListener('Alpheios_Page_Load', this.updateAnnotations.bind(this))

    document.body.addEventListener('Alpheios_Options_Loaded', this.updatePanelOnActivation.bind(this))
    // this.reactivate()
    this.sendStateToBackground('updateState')
    this.isInitialized = true
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

  activate () {
    console.log('Content has been activated.')
    this.state.activate()
  }

  deactivate () {
    console.log('Content has been deactivated.')
    this.state.deactivate()
    this.ui.panel.close()
    this.ui.popup.close()
  }

  reactivate () {
    if (this.state.isDisabled()) {
      console.log('Alpheios is disabled')
    } else {
      console.log('Content has been reactivated.')
      this.state.activate()
    }
  }

  sendStateToBackground (messageName) {
    safari.extension.dispatchMessage(messageName, new StateMessage(this.state))
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
        LexicalQuery.create(textSelector, {
          htmlSelector: htmlSelector,
          uiController: this.ui,
          maAdapter: this.maAdapter,
          lexicons: Lexicons,
          resourceOptions: this.resourceOptions,
          siteOptions: [],
          langOpts: { [Constants.LANG_PERSIAN]: { lookupMorphLast: true } } // TODO this should be externalized
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
        let siteOpts = new Options(domain, LocalStorageArea)
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
    if (this.isActive && this.ui.uiOptions.items.panelOnActivate.currentValue && !this.ui.panel.isOpen()) {
      this.ui.panel.open()
    }
    this.sendStateToBackground('updateState')
  }
}
