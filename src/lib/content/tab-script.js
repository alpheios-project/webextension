const propTypes = {
  NUMERIC: Symbol('Numeric'),
  SYMBOL: Symbol('Symbol')
}

const props = {
  status: {
    name: 'status',
    valueType: propTypes.SYMBOL,
    values: {
      PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
      ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated') // Content script has been loaded, but is deactivated
    },
    defaultValueIndex: 0
  },
  panelStatus: {
    name: 'panelStatus',
    valueType: propTypes.SYMBOL,
    values: {
      OPEN: Symbol.for('Alpheios_Status_PanelOpen'), // Panel is open
      CLOSED: Symbol.for('Alpheios_Status_PanelClosed') // Panel is closed
    },
    defaultValueIndex: 1
  }
}

/**
 * Contains a state of a tab content script.
 * @property {Number} tabID - An ID of a tab where the content script is loaded
 * @property {Symbol} status - A status of a current script (Active, Deactivated, Pending)
 * @property {panelStatus} panelStatus
 */
export default class TabScript {
  constructor (tabID) {
    this.tabID = tabID
    this.status = undefined
    this.panelStatus = undefined

    this.watchers = new Map()
  }

  static get symbolProps () {
    return [props.status.name, props.panelStatus.name]
  }

  /**
   * Only certain features will be stored within a serialized version of a TabScript. This is done
   * to prevent context-specific features (such as local event handlers) to be passed over the network
   * to a different context where they would make no sense. This getter returns a list of such fields.
   * @return {String[]}
   */
  static get dataProps () {
    return TabScript.symbolProps
  }

  /**
   * A copy constructor.
   * @param {TabScript} source - An instance of TabScript object we need to copy.
   * @return {TabScript} A copy of a source object.
   */
  static create (source) {
    let copy = new TabScript()
    for (let key of Object.keys(source)) {
      copy[key] = source[key]
    }
    return copy
  }

  static get defaults () {
    return {
      status: TabScript.statuses.script.ACTIVE,
      panelStatus: TabScript.statuses.panel.OPEN
    }
  }

  static get statuses () {
    return {
      script: {
        PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
        ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
        DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated') // Content script has been loaded, but is deactivated
      },
      panel: {
        OPEN: Symbol.for('Alpheios_Status_PanelOpen'), // Panel is open
        CLOSED: Symbol.for('Alpheios_Status_PanelClosed') // Panel is closed
      }
    }
  }

  /**
   * Sets a watcher function that is called every time a property is changed using a setItem() method.
   * @param {String} property - A name of a property that should be monitored
   * @param {Function} watchFunc - A function that will be called every time a property changes
   * @return {TabScript} Reference to self for chaining
   */
  setWatcher (property, watchFunc) {
    this.watchers.set(property, watchFunc)
    return this
  }

  /**
   * SetItem provides a monitored way to change a TabScript state. If value is assigned to a data property directly
   * there is no way to know if a property was changed. However, if a property was changed using setItem() method,
   * and if there is a watcher function registered for a changed property name,
   * this function will be called on every property change, passing a changed property name as an argument.
   * @param key
   * @param value
   * @return {TabScript}
   */
  setItem (key, value) {
    this[key] = value
    if (this.watchers && this.watchers.has(key)) {
      this.watchers.get(key)(key, this)
    }
    return this
  }

  isPanelOpen () {
    return this.panelStatus === TabScript.statuses.panel.OPEN
  }

  isPanelClosed () {
    return this.panelStatus === TabScript.statuses.panel.CLOSED
  }

  setPanelOpen () {
    this.setItem('panelStatus', TabScript.statuses.panel.OPEN)
    return this
  }

  setPanelClosed () {
    this.setItem('panelStatus', TabScript.statuses.panel.CLOSED)
    return this
  }

  hasSameID (tabID) {
    return this.tabID === tabID
  }

  isActive () {
    return this.status === TabScript.statuses.script.ACTIVE
  }

  isDeactivated () {
    return this.status === TabScript.statuses.script.DEACTIVATED
  }

  activate () {
    this.status = TabScript.statuses.script.ACTIVE
    return this
  }

  deactivate () {
    this.status = TabScript.statuses.script.DEACTIVATED
    return this
  }

  update (source) {
    for (let key of Object.keys(source)) {
      this[key] = source[key]
    }
    return this
  }

  diff (state) {
    let diff = {
      _changedKeys: [],
      _changedEntries: []
    }
    for (let key of Object.keys(state)) {
      // Build diffs only for data properties
      if (this.tabID !== state.tabID) {
        diff.tabID = state.tabID
        diff['_changedKeys'].push('tabID')
        diff['_changedEntries'].push(['tabID', state.tabID])
      }
      if (TabScript.dataProps.includes(key)) {
        if (this.hasOwnProperty(key)) {
          if (this[key] !== state[key]) {
            diff[key] = state[key]
            diff['_changedKeys'].push(key)
            diff['_changedEntries'].push([key, state[key]])
          }
        } else {
          console.warn(`TabScript has no property named "${key}"`)
        }
      }
    }

    diff.keys = function () {
      return diff['_changedKeys']
    }

    diff.entries = function () {
      return diff['_changedEntries']
    }

    diff.has = function (prop) {
      return diff._changedKeys.includes(prop)
    }

    diff.isEmpty = function () {
      return !diff._changedKeys.length
    }
    return diff
  }

  /**
   * Creates a serializable copy of a source object.
   * @param {TabScript} source - An object to be serialized.
   * @return {TabScript} A serializable copy of a source.
   */
  static serializable (source) {
    let serializable = TabScript.create(source)
    serializable.tabID = source.tabID
    for (let key of Object.keys(serializable)) {
      if (TabScript.dataProps.includes(key)) {
        /*
        Only certain features will be stored within a serialized version of a TabScript. This is done
        to prevent context-specific features (such as local event handlers) to be passed over the network
        to a different context where they would make no sense.
         */
        let value = serializable[key]
        if (typeof value === 'symbol') { serializable[key] = Symbol.keyFor(value) }
      }
    }
    return serializable
  }

  static readObject (jsonObject) {
    let tabScript = new TabScript(jsonObject.tabID)

    for (let prop of TabScript.symbolProps) {
      if (jsonObject.hasOwnProperty(prop)) { tabScript[prop] = Symbol.for(jsonObject[prop]) }
    }

    return tabScript
  }
}
