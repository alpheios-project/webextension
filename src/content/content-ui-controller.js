/* global Node */
import {Presenter} from 'alpheios-inflection-tables' // Required for Presenter
import {Lexeme, Feature} from 'alpheios-data-models'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import Template from './template.htmlf'
import Panel from './components/panel/component'
import TabScript from '../lib/content/tab-script'
import Options from './components/options/component'
import Popup from './vue-components/popup.vue'
import Morph from './vue-components/morph.vue'
import UIkit from '../../node_modules/uikit/dist/js/uikit'
import UIkITIconts from '../../node_modules/uikit/dist/js/uikit-icons'

export default class ContentUIController {
  constructor (state) {
    this.state = state
    this.settings = ContentUIController.settingValues

    // Finds a max z-index of element on the page.
    // Need to run this before our UI elements are loaded to avoid scanning them too.
    let zIndexMax = this.getZIndexMax()

    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    let container = document.createElement('div')
    document.body.insertBefore(container, null)
    container.outerHTML = Template

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
    this.panel.updateZIndex(zIndexMax)

    // Should be loaded after Panel because options are inserted into a panel
    this.options = new Options({
      methods: {
        ready: (options) => {
          this.state.status = TabScript.statuses.script.ACTIVE
          this.setPanelPositionTo(options.panelPosition.currentValue)
          this.setDefaultLanguageTo(options.defaultLanguage.currentValue)
          console.log('Content script is set to active')
        },
        onChange: this.optionChangeListener.bind(this)
      }
    })

    Vue.component('morph',Morph)

    // Create a Vue instance for a popup
    this.popup = new Vue({
      el: '#alpheios-popup',
      components: { morph:Morph, popup: Popup },
      data: {
        messages: '',
        content: '',
        lexemes: [],
        visible: false,
        defDataReady: false,
        inflDataReady: false,
        morphDataReady: false
      },
      methods: {
        showMessage: function (message) {
          this.messages = message
          return this
        },

        appendMessage: function (message) {
          this.messages += message
          return this
        },

        clearMessages: function () {
          this.messages = ''
          return this
        },

        setContent: function (content) {
          this.content = content
          return this
        },

        clearContent: function () {
          this.content = ''
          return this
        },

        open: function () {
          this.visible = true
          return this
        },

        close: function () {
          this.visible = false
          return this
        },

        showDefinitionsPanelTab: function () {
          this.visible = false
          this.panel.tabGroups.contentTabs.activate('definitionsTab')
          this.panel.open()
          return this
        },

        showInflectionsPanelTab: function () {
          this.visible = false
          this.panel.tabGroups.contentTabs.activate('inflectionsTab')
          this.panel.open()
          return this
        }
      }
    })
    this.popup.panel = this.panel

    // Initialize UIKit
    UIkit.use(UIkITIconts)
  }

  /**
   * A temporary solution
   * @return {*|Options}
   */
  getOptions () {
    return this.options
  }

  static get settingValues () {
    return {
      uiTypePanel: 'panel',
      uiTypePopup: 'popup'
    }
  }

  /**
   * Finds a maximal z-index value of elements on a page.
   * @return {Number}
   */
  getZIndexMax () {
    let startTime = new Date().getTime()
    let zIndex = this.zIndexRecursion(document.querySelector('body'), Number.NEGATIVE_INFINITY)
    let timeDiff = new Date().getTime() - startTime
    console.log(`Z-index max value is ${zIndex}, calculation time is ${timeDiff} ms`)
    return zIndex
  }

  /**
   * A recursive function that iterates over all elements on a page searching for a highest z-index.
   * @param {Node} element - A root page element to start scan with (usually `body`).
   * @param {Number} zIndexMax - A current highest z-index value found.
   * @return {Number} - A current highest z-index value.
   */
  zIndexRecursion (element, zIndexMax) {
    if (element) {
      let zIndexValues = [
        window.getComputedStyle(element).getPropertyValue('z-index'), // If z-index defined in CSS rules
        element.style.getPropertyValue('z-index') // If z-index is defined in an inline style
      ]
      for (const zIndex of zIndexValues) {
        if (zIndex && zIndex !== 'auto') {
          // Value has some numerical z-index value
          zIndexMax = Math.max(zIndexMax, zIndex)
        }
      }
      for (let node of element.childNodes) {
        let nodeType = node.nodeType
        if (nodeType === Node.ELEMENT_NODE || nodeType === Node.DOCUMENT_NODE || nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          zIndexMax = this.zIndexRecursion(node, zIndexMax)
        }
      }
    }
    return zIndexMax
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

  message (message) {
    this.panel.showMessage(message)
    this.popup.showMessage(message)
  }

  addMessage (message) {
    this.panel.appendMessage(message)
    this.popup.appendMessage(message)
  }

  updateMorphology (homonym) {
    homonym.lexemes.sort(Lexeme.getSortByTwoLemmaFeatures(Feature.types.frequency,Feature.types.part))
    this.popup.lexemes = homonym.lexemes
    this.popup.morphDataReady = true
  }

  updateDefinitions (homonym) {
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

    // Populate a popup
    this.popup.setContent(shortDefsText)
    this.popup.defDataReady = true
  }

  updateInflections (lexicalData) {
    this.presenter = new Presenter(
      this.panel.contentAreas.inflectionsTable.element,
      this.panel.contentAreas.inflectionsViewSelector.element,
      this.panel.contentAreas.inflectionsLocaleSwitcher.element,
      lexicalData,
      this.options.items.locale.currentValue
    ).render()
    this.popup.inflDataReady = true
  }

  clear () {
    this.panel.clearContent()
    this.popup.clearContent()
    return this
  }

  open () {
    if (this.options.items.uiType.currentValue === this.settings.uiTypePanel) {
      this.panel.open()
    } else {
      if (this.panel.isOpened) { this.panel.close() }
      this.popup.open()
    }
    return this
  }

  openPanel () {
    this.panel.open()
    this.state.setPanelOpen()
  }

  closePanel () {
    this.panel.close()
    this.state.setPanelClosed()
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
}
