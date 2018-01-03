/* global Node */
import {Presenter} from 'alpheios-inflection-tables' // Required for Presenter
import {Lexeme, Feature} from 'alpheios-data-models'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import Template from './template.htmlf'
import TabScript from '../lib/content/tab-script'
import Panel from './vue-components/panel.vue'
import Setting from './vue-components/setting.vue'
import Popup from './vue-components/popup.vue'
import Morph from './vue-components/morph.vue'
import ShortDef from './vue-components/shortdef.vue'
import UIkit from '../../node_modules/uikit/dist/js/uikit'
import UIkitIconts from '../../node_modules/uikit/dist/js/uikit-icons'

export default class ContentUIController {
  constructor (state, options) {
    this.state = state
    this.options = options
    this.settings = ContentUIController.settingValues

    this.zIndex = this.getZIndexMax()

    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    let container = document.createElement('div')
    document.body.insertBefore(container, null)
    container.outerHTML = Template

    // Initialize components
    this.panel = new Vue({
      el: '#alpheios-panel',
      components: {
        panel: Panel,
        setting: Setting
      },
      data: {
        panelData: {
          isOpen: false,
          tabs: {
            definitions: true,
            inflections: false,
            status: false,
            options: false,
            info: false
          },
          shortDefinitions: '',
          fullDefinitions: '',
          inflections: {
            localeSwitcher: undefined,
            viewSelector: undefined,
            tableBody: undefined
          },
          messages: '',
          settings: this.options.items,
          styles: {
            zIndex: this.zIndex
          }
        },
        state: this.state,
        options: this.options,
        uiController: this
      },
      methods: {
        isOpen: function () {
          return this.state.isPanelOpen()
        },

        open: function () {
          if (!this.state.isPanelOpen()) {
            this.panelData.isOpen = true
            this.state.setItem('panelStatus', TabScript.statuses.panel.OPEN)
          }
          return this
        },

        close: function () {
          if (!this.state.isPanelClosed()) {
            this.panelData.isOpen = false
            this.state.setItem('panelStatus', TabScript.statuses.panel.CLOSED)
          }
          return this
        },

        setPositionTo: function (position) {
          this.options.items.panelPosition.setValue(position)
        },

        attachToLeft: function () {
          this.setPositionTo('left')
        },

        attachToRight: function () {
          this.setPositionTo('right')
        },

        changeTab (name) {
          for (let key of Object.keys(this.panelData.tabs)) {
            if (this.panelData.tabs[key]) { this.panelData.tabs[key] = false }
          }
          this.panelData.tabs[name] = true
        },

        clearContent: function () {
          this.panelData.shortDefinitions = ''
          this.panelData.fullDefinitions = ''
          this.panelData.messages = ''
          return this
        },

        showMessage: function (messageHTML) {
          this.panelData.messages = messageHTML + '<br>'
          this.changeTab('status')
        },

        appendMessage: function (messageHTML) {
          this.panelData.messages += messageHTML + '<br>'
        },

        clearMessages: function () {
          this.panelData.messages = ''
        },

        toggle: function () {
          if (this.state.isPanelOpen()) {
            this.close()
          } else {
            this.open()
          }
          return this
        },

        settingChange: function (name, value) {
          console.log('Change inside instance', name, value)
          this.options.items[name].setTextValue(value)
          switch (name) {
            case 'preferredLanguage':
              this.uiController.setPreferredLanguageTo(this.options.items.preferredLanguage.currentValue)
              break
            case 'locale':
              if (this.uiController.presenter) {
                this.uiController.presenter.setLocale(this.options.items.locale.currentValue)
              }
              break
          }
        }
      },
      mounted: function () {
        this.panelData.inflections.localeSwitcher = document.querySelector('#alpheios-panel-content-infl-table-locale-switcher')
        this.panelData.inflections.viewSelector = document.querySelector('#alpheios-panel-content-infl-table-view-selector')
        this.panelData.inflections.tableBody = document.querySelector('#alpheios-panel-content-infl-table-body')
      }
    })

    // Should be loaded after Panel because options are inserted into a panel
    /* this.optionsUI = new Vue({
      el: '#alpheios-options',
      components: { setting: Setting },
      data: {
        preferredLanguageValues: this.options.items.preferredLanguage.textValues(),
        localeValues: this.options.items.locale.textValues(),
        panelPositionValues: this.options.items.panelPosition.textValues(),
        uiTypeValues: this.options.items.uiType.textValues(),

        preferredLanguage: this.options.items.preferredLanguage.currentTextValue(),
        locale: this.options.items.locale.currentTextValue(),
        panelPosition: this.options.items.panelPosition.currentTextValue(),
        uiType: this.options.items.uiType.currentTextValue(),

        preferredLanguageLabel: 'Page language:',
        localeLabel: 'UI Locale:',
        panelPositionLabel: 'Panel position:',
        uiTypeLabel: 'UI type:'
      },
      methods: {
        update (options) {
          this.preferredLanguageValues = options.items.preferredLanguage.textValues()
          this.locale = options.items.locale.textValues()
          this.panelPositionValues = options.items.panelPosition.textValues()
          this.uiTypeValues = options.items.uiType.textValues()

          this.preferredLanguage = options.items.preferredLanguage.currentTextValue()
          this.locale = options.items.locale.currentTextValue()
          this.panelPosition = options.items.panelPosition.currentTextValue()
          this.uiType = options.items.uiType.currentTextValue()
        },
        changePreferredLanguage: function (value) {
          this.preferredLanguage = value
          this.options.items.preferredLanguage.setTextValue(value)
          this.uiController.setPreferredLanguageTo(this.options.items.preferredLanguage.currentValue)
        },
        changeLocale: function (value) {
          this.locale = value
          this.options.items.locale.setTextValue(value)
          // If presenter is loaded
          if (this.uiController.presenter) { this.uiController.presenter.setLocale(this.options.items.locale.currentValue) }
        },
        changePanelPosition: function (value) {
          this.options.items.panelPosition.setTextValue(value)
          this.uiController.setPanelPositionTo(this.options.items.panelPosition.currentValue)
        },
        changeUiType: function (value) {
          this.uiType = value
          this.options.items.uiType.setTextValue(value)
        }
      },
      mounted () {

      }
    })
    this.optionsUI.options = this.options
    this.optionsUI.uiController = this

    */
    this.options.load(() => {
      this.state.status = TabScript.statuses.script.ACTIVE
      this.setPreferredLanguageTo(this.options.items.preferredLanguage.currentValue)
      console.log('Content script is activated')
    })

    Vue.component('morph',Morph)
    Vue.component('shortdef',ShortDef)

    // Create a Vue instance for a popup
    this.popup = new Vue({
      el: '#alpheios-popup',
      components: { morph:Morph, popup: Popup, shortdef:ShortDef },
      data: {
        messages: [],
        lexemes: [],
        definitions: {},
        visible: false,
        defDataReady: false,
        inflDataReady: false,
        morphDataReady: false
      },
      methods: {
        showMessage: function (message) {
          this.messages = [message]
          return this
        },

        appendMessage: function (message) {
          this.messages.push(message)
          return this
        },

        clearMessages: function () {
          while (this.messages.length > 0) {
            this.messages.pop()
          }
          return this
        },

        clearContent: function () {
          this.definitions = {}
          this.lexemes = []
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
          this.panel.changeTab('definitions')
          this.panel.open()
          return this
        },

        showInflectionsPanelTab: function () {
          this.visible = false
          this.panel.changeTab('inflections')
          this.panel.open()
          return this
        }
      }
    })
    this.popup.panel = this.panel

    // Initialize UIKit
    UIkit.use(UIkitIconts)
  }

  /**
   * A temporary solution
   * @return {*|OptionsComponent}
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
  getZIndexMax (zIndexDefualt = 2000) {
    let startTime = new Date().getTime()
    let zIndex = this.zIndexRecursion(document.querySelector('body'), Number.NEGATIVE_INFINITY)
    let timeDiff = new Date().getTime() - startTime
    console.log(`Z-index max value is ${zIndex}, calculation time is ${timeDiff} ms`)

    if (zIndex >= zIndexDefualt) {
      if (zIndex < Number.POSITIVE_INFINITY) { zIndex++ } // To be one level higher that the highest element on a page
    } else {
      zIndex = zIndexDefualt
    }

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
    homonym.lexemes.sort(Lexeme.getSortByTwoLemmaFeatures(Feature.types.frequency, Feature.types.part))
    this.popup.lexemes = homonym.lexemes
    this.popup.morphDataReady = true
  }

  updateDefinitions (homonym) {
    this.panel.panelData.shortDefinitions = ''
    this.panel.panelData.fullDefinitions = ''
    let definitions = {}
    for (let lexeme of homonym.lexemes) {
      if (lexeme.meaning.shortDefs.length > 0) {
        this.panel.panelData.shortDefinitions += this.formatShortDefinitions(lexeme)
        definitions[lexeme.lemma.key] = lexeme.meaning.shortDefs
      }

      if (lexeme.meaning.fullDefs.length > 0) {
        this.panel.panelData.fullDefinitions += this.formatFullDefinitions(lexeme)
      }
    }

    // Populate a popup
    this.popup.definitions = definitions
    this.popup.defDataReady = true
  }

  updateInflections (lexicalData) {
    this.presenter = new Presenter(
      this.panel.panelData.inflections.tableBody,
      this.panel.panelData.inflections.viewSelector,
      this.panel.panelData.inflections.localeSwitcher,
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
      if (this.panel.isOpen) { this.panel.close() }
      this.popup.open()
    }
    return this
  }

  openPanel () {
    this.panel.open()
  }

  closePanel () {
    this.panel.close()
  }

  setPreferredLanguageTo (language) {
    this.preferredLangauge = language
  }

  setPanelPositionTo (position) {
    if (position === 'right') {
      this.attachPanelToRight()
    } else {
      this.attachPanelToLeft()
    }
  }

  attachPanelToLeft () {
    this.options.items.panelPosition.setValue('left')
    this.optionsUI.panelPosition = this.options.items.panelPosition.currentTextValue()
    this.panel.attachToLeft()
  }

  attachPanelToRight () {
    this.options.items.panelPosition.setValue('right')
    this.optionsUI.panelPosition = this.options.items.panelPosition.currentTextValue()
    this.panel.attachToRight()
  }
}
