/* global Node */
import {Lexeme, Feature, Definition, LanguageModelFactory, Constants} from 'alpheios-data-models'
import {ObjectMonitor as ExpObjMon} from 'alpheios-experience'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import Template from './template.htmlf'
import TabScript from '../lib/content/tab-script'
import Panel from './vue-components/panel.vue'
import Popup from './vue-components/popup.vue'
import { Grammars } from 'alpheios-res-client'
import ResourceQuery from './queries/resource-query'
import L10n from '../lib/l10n/l10n'
import Locales from '../locales/locales'
import enUS from '../locales/en-us/messages.json'
import enGB from '../locales/en-gb/messages'

const languageNames = new Map([
  [Constants.LANG_LATIN, 'Latin'],
  [Constants.LANG_GREEK, 'Greek'],
  [Constants.LANG_ARABIC, 'Arabic'],
  [Constants.LANG_PERSIAN, 'Persian']
])

export default class ContentUIController {
  constructor (state, options, resourceOptions) {
    this.state = state
    this.options = options
    this.resourceOptions = resourceOptions
    this.settings = ContentUIController.settingValues
    this.irregularBaseFontSizeClassName = 'alpheios-irregular-base-font-size'
    this.irregularBaseFontSize = !ContentUIController.hasRegularBaseFontSize()

    this.zIndex = this.getZIndexMax()

    this.l10n = new L10n()
      .addMessages(enUS, Locales.en_US)
      .addMessages(enGB, Locales.en_GB)
      .setLocale(Locales.en_US)

    // Inject HTML code of a plugin. Should go in reverse order.
    document.body.classList.add('alpheios')
    let container = document.createElement('div')
    document.body.insertBefore(container, null)
    container.outerHTML = Template
    // Initialize components
    this.panel = new Vue({
      el: '#alpheios-panel',
      components: { panel: Panel },
      data: {
        panelData: {
          isOpen: false,
          tabs: {
            definitions: false,
            inflections: false,
            status: false,
            options: false,
            info: true
          },
          grammarRes: {},
          inflectionData: false, // If no inflection data present, it is set to false
          shortDefinitions: [],
          fullDefinitions: '',
          inflections: {
            localeSwitcher: undefined,
            viewSelector: undefined,
            tableBody: undefined
          },
          inflectionIDs: {
            localeSwitcher: 'alpheios-panel-content-infl-table-locale-switcher',
            viewSelector: 'alpheios-panel-content-infl-table-view-selector',
            tableBody: 'alpheios-panel-content-infl-table-body'
          },
          messages: [],
          notification: {
            visible: false,
            important: false,
            showLanguageSwitcher: false,
            text: ''
          },
          status: {
            selectedText: '',
            languageName: ''
          },
          settings: this.options.items,
          resourceSettings: this.resourceOptions.items,
          classes: {
            [this.irregularBaseFontSizeClassName]: this.irregularBaseFontSize
          },
          styles: {
            zIndex: this.zIndex
          },
          minWidth: 400,
          l10n: this.l10n
        },
        state: this.state,
        options: this.options,
        resourceOptions: this.resourceOptions,
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
          return this
        },

        clearContent: function () {
          this.panelData.shortDefinitions = []
          this.panelData.fullDefinitions = ''
          this.panelData.messages = ''
          this.clearNotifications()
          this.clearStatus()
          return this
        },

        showMessage: function (message) {
          this.panelData.messages = [message]
        },

        appendMessage: function (message) {
          this.panelData.messages.push(message)
        },

        clearMessages: function () {
          this.panelData.messages = []
        },

        showNotification: function (text, important = false) {
          this.panelData.notification.visible = true
          this.panelData.notification.important = important
          this.panelData.notification.showLanguageSwitcher = false
          this.panelData.notification.text = text
        },

        showImportantNotification: function (text) {
          this.showNotification(text, true)
        },

        showLanguageNotification: function (homonym, notFound = false) {
          this.panelData.notification.visible = true
          let languageName = ContentUIController.getLanguageName(homonym.languageID)
          if (notFound) {
            this.panelData.notification.important = true
            this.panelData.notification.showLanguageSwitcher = true
          } else {
            this.panelData.notification.important = false
            this.panelData.notification.showLanguageSwitcher = false
          }
          this.panelData.notification.text = `Language: ${languageName}<br>Wrong? Change to:`
        },

        showStatusInfo: function (selectionText, languageID) {
          this.panelData.status.languageName = ContentUIController.getLanguageName(languageID)
          this.panelData.status.selectedText = selectionText
        },

        showErrorInformation: function (errorText) {
          this.panelData.notification.visible = true
          this.panelData.notification.important = true
          this.panelData.notification.showLanguageSwitcher = false
          this.panelData.notification.text = errorText
        },

        clearNotifications: function () {
          this.panelData.notification.visible = false
          this.panelData.notification.important = false
          this.panelData.notification.showLanguageSwitcher = false
          this.panelData.notification.text = ''
        },

        clearStatus: function () {
          this.panelData.status.languageName = ''
          this.panelData.status.selectedText = ''
        },

        toggle: function () {
          if (this.state.isPanelOpen()) {
            this.close()
          } else {
            this.open()
          }
          return this
        },

        updateInflections: function (inflectionData) {
          this.panelData.inflectionData = inflectionData
        },

        requestGrammar: function (feature) {
          ExpObjMon.track(
            ResourceQuery.create(feature, {
              uiController: this.uiController,
              grammars: Grammars
            }),
            {
              experience: 'Get resource',
              actions: [
                { name: 'getData', action: ExpObjMon.actions.START, event: ExpObjMon.events.GET },
                { name: 'finalize', action: ExpObjMon.actions.STOP, event: ExpObjMon.events.GET }
              ]
            }).getData()
        },

        settingChange: function (name, value) {
          console.log('Change inside instance', name, value)
          this.options.items[name].setTextValue(value)
          switch (name) {
            case 'locale':
              if (this.uiController.presenter) {
                this.uiController.presenter.setLocale(this.options.items.locale.currentValue)
              }
              break
          }
        },
        resourceSettingChange: function (name, value) {
          let keyinfo = this.resourceOptions.parseKey(name)
          console.log('Change inside instance', keyinfo.setting, keyinfo.language, value)
          this.resourceOptions.items[keyinfo.setting].filter((f) => f.name === name).forEach((f) => { f.setTextValue(value) })
        }
      },
      mounted: function () {
        this.panelData.inflections.localeSwitcher = document.querySelector(`#${this.panelData.inflectionIDs.localeSwitcher}`)
        this.panelData.inflections.viewSelector = document.querySelector(`#${this.panelData.inflectionIDs.viewSelector}`)
        this.panelData.inflections.tableBody = document.querySelector(`#${this.panelData.inflectionIDs.tableBody}`)
      }
    })

    this.options.load(() => {
      this.resourceOptions.load(() => {
        this.state.status = TabScript.statuses.script.ACTIVE
        console.log('Content script is activated')
      })
    })

    // Create a Vue instance for a popup
    this.popup = new Vue({
      el: '#alpheios-popup',
      components: { popup: Popup },
      data: {
        messages: [],
        lexemes: [],
        definitions: {},
        linkedFeatures: [],
        visible: false,
        popupData: {
          minWidth: 400,
          minHeight: 400,
          settings: this.options.items,
          defDataReady: false,
          inflDataReady: false,
          morphDataReady: false,
          classes: {
            [this.irregularBaseFontSizeClassName]: this.irregularBaseFontSize
          },
          notification: {
            visible: false,
            important: false,
            showLanguageSwitcher: false,
            text: ''
          },
          status: {
            selectedText: '',
            languageName: ''
          }
        },
        panel: this.panel,
        options: this.options
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

        showNotification: function (text, important = false) {
          this.popupData.notification.visible = true
          this.popupData.notification.important = important
          this.popupData.notification.showLanguageSwitcher = false
          this.popupData.notification.text = text
        },

        showImportantNotification: function (text) {
          this.showNotification(text, true)
        },

        showLanguageNotification: function (homonym, notFound = false) {
          this.popupData.notification.visible = true
          let languageName = ContentUIController.getLanguageName(homonym.languageID)
          if (notFound) {
            this.popupData.notification.important = true
            this.popupData.notification.showLanguageSwitcher = true
          } else {
            this.popupData.notification.important = false
            this.popupData.notification.showLanguageSwitcher = false
          }
          this.popupData.notification.text = `Language: ${languageName}<br>Wrong? Change to:`
        },

        showStatusInfo: function (selectionText, languageID) {
          this.popupData.status.languageName = ContentUIController.getLanguageName(languageID)
          this.popupData.status.selectedText = selectionText
        },

        showErrorInformation: function (errorText) {
          this.popupData.notification.visible = true
          this.popupData.notification.important = true
          this.popupData.notification.showLanguageSwitcher = false
          this.popupData.notification.text = errorText
        },

        clearContent: function () {
          this.definitions = {}
          this.lexemes = []
          this.popupData.defDataReady = false
          this.popupData.inflDataReady = false
          this.popupData.morphDataReady = false
          this.clearNotifications()
          this.clearStatus()
          return this
        },

        clearNotifications: function () {
          this.popupData.notification.visible = false
          this.popupData.notification.important = false
          this.popupData.notification.showLanguageSwitcher = false
          this.popupData.notification.text = ''
        },

        clearStatus: function () {
          this.popupData.status.languageName = ''
          this.popupData.status.selectedText = ''
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
        },

        sendFeature: function (feature) {
          this.visible = false
          this.panel.requestGrammar(feature)
          this.panel.changeTab('grammar')
          this.panel.open()
          return this
        },

        settingChange: function (name, value) {
          console.log('Change inside instance', name, value)
          this.options.items[name].setTextValue(value)
          switch (name) {
            case 'locale':
              if (this.uiController.presenter) {
                this.uiController.presenter.setLocale(this.options.items.locale.currentValue)
              }
              break
          }
        }
      }
    })
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

  static hasRegularBaseFontSize () {
    let htmlElement = document.querySelector('html')
    return window.getComputedStyle(htmlElement, null).getPropertyValue('font-size') === '16px'
  }

  formatFullDefinitions (lexeme) {
    let content = `<h3>${lexeme.lemma.word}</h3>\n`
    for (let fullDef of lexeme.meaning.fullDefs) {
      content += `${fullDef.text}<br>\n`
    }
    return content
  }

  message (message) {
    this.panel.showMessage(message)
    this.popup.showMessage(message)
    this.panel.showNotification(message)
    this.popup.showNotification(message)
    return this
  }

  addMessage (message) {
    this.panel.appendMessage(message)
    this.popup.appendMessage(message)
    this.panel.showNotification(message)
    this.popup.showNotification(message)
  }

  static getLanguageName (languageID) {
    return languageNames.has(languageID) ? languageNames.get(languageID) : ''
  }

  showLanguageInfo (homonym) {
    let notFound = !homonym.lexemes || homonym.lexemes.length < 1
    notFound = true // Debug only
    this.panel.showLanguageNotification(homonym, notFound)
    this.popup.showLanguageNotification(homonym, notFound)
  }

  showStatusInfo (selectionText, languageID) {
    this.panel.showStatusInfo(selectionText, languageID)
    this.popup.showStatusInfo(selectionText, languageID)
  }

  showErrorInfo (errorText) {
    this.panel.showErrorInformation(errorText)
  }

  showImportantNotification (message) {
    this.panel.showImportantNotification(message)
    this.popup.showImportantNotification(message)
  }

  changeTab (tabName) {
    this.panel.changeTab(tabName)
    return this
  }

  updateMorphology (homonym) {
    homonym.lexemes.sort(Lexeme.getSortByTwoLemmaFeatures(Feature.types.frequency, Feature.types.part))
    this.popup.lexemes = homonym.lexemes
    if (homonym.lexemes.length > 0) {
      // TODO we could really move this into the morph component and have it be calculated for each lemma in case languages are multiple
      this.popup.linkedFeatures = LanguageModelFactory.getLanguageForCode(homonym.lexemes[0].lemma.language).grammarFeatures()
    }
    this.popup.popupData.morphDataReady = true
  }

  updateGrammar (urls) {
    if (urls.length > 0) {
      this.panel.panelData.grammarRes = urls[0]
    } else {
      console.log('Requested Grammar Resource Not Found')
    }
    // todo show TOC or not found
  }

  updateDefinitions (homonym) {
    this.panel.panelData.fullDefinitions = ''
    this.panel.panelData.shortDefinitions = []
    let definitions = {}
    let defsList = []
    let hasFullDefs = false
    for (let lexeme of homonym.lexemes) {
      if (lexeme.meaning.shortDefs.length > 0) {
        definitions[lexeme.lemma.key] = []
        for (let def of lexeme.meaning.shortDefs) {
          // for now, to avoid duplicate showing of the provider we create a new unproxied definitions
          // object without a provider if it has the same provider as the morphology info
          if (def.provider && lexeme.provider && def.provider.uri === lexeme.provider.uri) {
            definitions[lexeme.lemma.key].push(new Definition(def.text, def.language, def.format, def.lemmaText))
          } else {
            definitions[lexeme.lemma.key].push(def)
          }
        }
        this.panel.panelData.shortDefinitions.push(...lexeme.meaning.shortDefs)
      } else if (Object.entries(lexeme.lemma.features).size > 0) {
        definitions[lexeme.lemma.key] = [new Definition("No definition found.", 'en-US', 'text/plain', lexeme.lemma.word)]
      }

      if (lexeme.meaning.fullDefs.length > 0) {
        this.panel.panelData.fullDefinitions += this.formatFullDefinitions(lexeme)
        hasFullDefs = true
      }
    }

    // Populate a popup
    this.popup.definitions = definitions
    this.popup.popupData.defDataReady = hasFullDefs
  }

  updateInflections (inflectionData, homonym) {
    this.panel.updateInflections(inflectionData, homonym)
    this.popup.popupData.inflDataReady = inflectionData[Feature.types.part].length > 0 // TODO should be a method on InflectionData
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
}
