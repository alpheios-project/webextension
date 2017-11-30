/* global browser */
import Component from '../component'
import template from './template.htmlf'
import './style.css'

export default class Options extends Component {
  constructor (options) {
    super(Object.assign(options, {
      template: template,
      selectors: {
        self: '[data-component="alpheios-panel-options"]'
      }
    }))

    this._values = Options.defaults
    for (let key in this._values) {
      if (this._values.hasOwnProperty(key)) {
        /*
        Initialize current values with defaults. Actual values will be set after options are loaded from a
        local storage.
         */
        if (!this._values[key].currentValue) {
          this._values[key].currentValue = this._values[key].defaultValue
        }
      }
    }
  }

  /**
   * Will always return a resolved promise.
   * @return {Promise.<void>}
   */
  async loadStoredData () {
    try {
      let values = await browser.storage.sync.get()
      for (let key in values) {
        if (this._values.hasOwnProperty(key)) {
          this._values[key].currentValue = values[key]
        }
      }
    } catch (errorMessage) {
      console.error(`Cannot retrieve options for Alpheios extension from a local storage: ${errorMessage}`)
    }
  }

  static get defaults () {
    return {
      locale: {
        defaultValue: 'en-US',
        values: [
          {value: 'en-US', text: 'English (US)'},
          {value: 'en-GB', text: 'English (GB)'}
        ],
        inputSelector: '#alpheios-locale-selector-list'
      },
      panelPosition: {
        defaultValue: 'left',
        values: [
          {value: 'left', text: 'Left'},
          {value: 'right', text: 'Right'}
        ],
        inputSelector: '#alpheios-position-selector-list'
      },
      uiType: {
        defaultValue: 'popup',
        values: [
          {value: 'popup', text: 'Pop-up'},
          {value: 'panel', text: 'Panel'}
        ],
        inputSelector: '#alpheios-ui-type-selector-list'
      }
    }
  }

  get items () {
    return this._values
  }

  update (option, value) {
    this._values[option].currentValue = value

    // Update value in the local storage
    let optionObj = {}
    optionObj[option] = value

    browser.storage.sync.set(optionObj).then(
      () => {
        // Options storage succeeded
        console.log('Option value was stored successfully.')
      },
      (errorMessage) => {
        console.error(`Storage of an option value failed: ${errorMessage}`)
      }
    )
  }
}
