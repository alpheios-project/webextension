import Statuses from './statuses'

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

  static get defaults () {
    return {
      status: Statuses.ACTIVE,
      panelStatus: Statuses.PANEL_OPEN
    }
  }

  update (source) {
    for (let key of Object.keys(source)) {
      this[key] = source[key]
    }
    return this
  }

  diff (state) {
    let diff = {}
    for (let key of Object.keys(state)) {
      if (this.hasOwnProperty(key)) {
        if (this[key] !== state[key]) {
          diff[key] = state[key]
        }
      } else {
        console.warn(`TabScript has no property named "${key}"`)
      }
    }
    return diff
  }

  static serializable (source) {
    let serializable = new TabScript()
    for (let key of Object.keys(source)) {
      let value = source[key]
      serializable[key] = (typeof value === 'symbol') ? Symbol.keyFor(value) : value
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
