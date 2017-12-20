/**
 * Contains a state of a tab content script.
 * @property {Number} tabID - An ID of a tab where the content script is loaded
 * @property {Symbol} status - A status of a current script (Active, Deactivated, Pending)
 * @property {panelStatus} panelStatus
 */
export default class TabScript {
  constructor (tabID, status, panelStatus) {
    this.tabID = tabID
    this.status = status || TabScript.defaults.status
    this.panelStatus = panelStatus || TabScript.defaults.panelStatus
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

  IDMatch (tabID) {
    return this.tabID === tabID
  }

  isActive () {
    return this.status === TabScript.statuses.script.ACTIVE
  }

  activate () {
    this.status = TabScript.statuses.script.ACTIVE
    return this
  }

  deactivate () {
    this.status = TabScript.statuses.script.DEACTIVATED
    return this
  }

  openPanel () {
    this.panelStatus = TabScript.statuses.panel.OPEN
    return this
  }

  closePanel () {
    this.panelStatus = TabScript.statuses.panel.CLOSED
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
   * @return {source} A serializable copy of a source.
   */
  static serializable (source) {
    let serializable = TabScript.create(source)
    for (let key of Object.keys(serializable)) {
      let value = serializable[key]
      if (typeof value === 'symbol') { serializable[key] = Symbol.keyFor(value) }
    }
    return serializable
  }

  static readObject (jsonObject) {
    let props = ['tabID']
    let symbolProps = ['status', 'panelStatus']
    let tabScript = new TabScript()

    for (let prop of props) {
      if (jsonObject.hasOwnProperty(prop)) { tabScript[prop] = jsonObject[prop] }
    }
    for (let prop of symbolProps) {
      if (jsonObject.hasOwnProperty(prop)) { tabScript[prop] = Symbol.for(jsonObject[prop]) }
    }

    return tabScript
  }
}
