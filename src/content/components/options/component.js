/* global browser */
import Component from '../component'
import template from './template.htmlf'

export default class Options extends Component {
  constructor (options) {
    super(Object.assign({
      template: template,
      selectors: {
        self: '[data-component="alpheios-panel-options"]'
      },
      data: {
        locale: {
          defaultValue: 'en-US',
          values: [
            {value: 'en-US', text: 'English (US)'},
            {value: 'en-GB', text: 'English (GB)'}
          ],
          selector: '#alpheios-locale-selector-list'
        },
        panelPosition: {
          defaultValue: 'left',
          values: [
            {value: 'left', text: 'Left'},
            {value: 'right', text: 'Right'}
          ],
          selector: '#alpheios-position-selector-list'
        },
        uiType: {
          defaultValue: 'popup',
          values: [
            {value: 'popup', text: 'Pop-up'},
            {value: 'panel', text: 'Panel'}
          ],
          selector: '#alpheios-ui-type-selector-list'
        }
      }
    },
    options))

    for (let [optionName, optionData] of Object.entries(this.options.data)) {
      if (this.options.data.hasOwnProperty(optionName)) {
        /*
        Initialize current values with defaults. Actual values will be set after options are loaded from a
        local storage.
         */
        optionData.currentValue = optionData.defaultValue
        let element = this.options.elements.self.querySelector(optionData.selector)
        if (element) {
          optionData.element = element
        } else {
          console.warn(`Option element with "${optionData.selector}" selector is not found`)
        }
      }
    }

    this.load().then(
      () => {
        this.render()
      },
      (error) => {
        console.error(`Cannot retrieve options for Alpheios extension from a local storage: ${error}. Default values
          will be used instead`)
        this.render()
      }
    )
  }

  /**
   * Will always return a resolved promise.
   * @return {Promise.<void>}
   */
  async load () {
    let values = await browser.storage.sync.get()
    for (let key in values) {
      if (this.options.data.hasOwnProperty(key)) {
        this.options.data[key].currentValue = values[key]
      }
    }
    console.log('Data is loaded', this.options.data)
    if (this.options.methods.ready) {
      this.options.methods.ready()
    }
  }

  save (optionName, optionValue) {
    // Update value in the local storage
    let option = {}
    option[optionName] = optionValue

    browser.storage.sync.set(option).then(
      () => {
        // Options storage succeeded
        console.log(`Value "${optionValue}" of "${optionName}" option value was stored successfully`)
      },
      (errorMessage) => {
        console.error(`Storage of an option value failed: ${errorMessage}`)
      }
    )
  }

  render () {
    for (let [optionName, optionData] of Object.entries(this.options.data)) {
      for (let optionValue of optionData.values) {
        let optionElement = document.createElement('option')
        optionElement.value = optionValue.value
        optionElement.text = optionValue.text
        if (optionValue.value === optionData.currentValue) {
          optionElement.setAttribute('selected', 'selected')
        }
        optionData.element.appendChild(optionElement)
      }
      optionData.element.addEventListener('change', this.changeListener.bind(this, optionName, optionData))
    }
  }

  changeListener (optionName, optionData, event) {
    optionData.currentValue = event.target.value
    this.save(optionName, optionData.currentValue)
    if (this.options.methods.onChange) {
      this.options.methods.onChange(optionName, optionData.currentValue)
    }
  }

  get items () {
    return this.options.data
  }
}
