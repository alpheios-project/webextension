/* eslint new-cap: ["error", { "newIsCap": false }] */
import { Constants } from 'alpheios-data-models'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { LemmaTranslations } from 'alpheios-lemma-client'
import { Lexicons } from 'alpheios-lexicon-client'

import { HTMLSelector, LexicalQuery, Options, AnnotationQuery, UIController, LanguageOptionDefaults, ContentOptionDefaults,
  UIOptionDefaults } from 'alpheios-components'

import SiteOptions from '@/lib/settings/site-options.json'

export default class BaseContentProcess {
  constructor (TabScriptClass) {
    this.state = new TabScriptClass()
    this.state.status = TabScriptClass.statuses.script.PENDING
    this.state.panelStatus = TabScriptClass.statuses.panel.CLOSED

    this.siteOptions = this.loadSiteOptions()

    this.state.setWatcher('panelStatus', this.sendStateToBackground.bind(this))
    this.state.setWatcher('tab', this.sendStateToBackground.bind(this))
    this.state.setWatcher('uiActive', this.updateAnnotations.bind(this))

    this.options = new Options(ContentOptionDefaults, this.storageAreaClass)
    this.resourceOptions = new Options(LanguageOptionDefaults, this.storageAreaClass)
    this.uiOptions = new Options(UIOptionDefaults, this.storageAreaClass)

    this.messagingService = new this.messagingServiceClass()
    this.maAdapter = new AlpheiosTuftsAdapter() // Morphological analyzer adapter, with default arguments
    this.ui = new UIController(this.state, this.options, this.resourceOptions, this.uiOptions, this.browserManifest)
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
        // TODO: disable experience monitor as it might cause memory leaks
        /* ExpObjMon.track(
          LexicalQuery.create(textSelector, {
            htmlSelector: htmlSelector,
            uiController: this.ui,
            maAdapter: this.maAdapter,
            lexicons: Lexicons,
            resourceOptions: this.resourceOptions,
            siteOptions: [],
            lemmaTranslations: this.enableLemmaTranslations(textSelector) ? { adapter: LemmaTranslations, locale: this.options.items.locale.currentValue } : null,
            langOpts: { [Constants.LANG_PERSIAN]: { lookupMorphLast: true } } // TODO this should be externalized
          }),
          {
            experience: 'Get word data',
            actions: [
              { name: 'getData', action: ExpObjMon.actions.START, event: ExpObjMon.events.GET },
              { name: 'finalize', action: ExpObjMon.actions.STOP, event: ExpObjMon.events.GET }
            ]
          })
          .getData() */

        LexicalQuery.create(textSelector, {
          htmlSelector: htmlSelector,
          uiController: this.ui,
          maAdapter: this.maAdapter,
          lexicons: Lexicons,
          resourceOptions: this.resourceOptions,
          siteOptions: [],
          lemmaTranslations: this.enableLemmaTranslations(textSelector) ? { adapter: LemmaTranslations, locale: this.options.items.locale.currentValue } : null,
          langOpts: { [Constants.LANG_PERSIAN]: { lookupMorphLast: true } } // TODO this should be externalized
        }).getData()
      }
    }
  }

  /**
   * Check to see if Lemma Translations should be enabled for a query
   *  NB this is Prototype functionality
   */
  enableLemmaTranslations (textSelector) {
    return textSelector.languageID === Constants.LANG_LATIN &&
      this.options.items.enableLemmaTranslations.currentValue &&
      !this.options.items.locale.currentValue.match(/^en-/)
  }

  /**
   * Load site-specific settings
   */
  loadSiteOptions () {
    let allSiteOptions = []
    for (let site of SiteOptions) {
      for (let domain of site.options) {
        let siteOpts = new Options(domain, this.storageAreaClass)
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
  }
}
