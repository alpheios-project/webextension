export default class Tab {
  constructor (tabId, windowId) {
    this.tabId = tabId
    this.windowId = windowId
    this.status = 'attached'
  }

  get uniqueId () {
    return this.constructor.createUniqueId(this.tabId, this.windowId)
  }

  deattach () {
    this.status = 'deattached'
  }

  attach (newWinId) {
    this.windowId = newWinId
    this.status = 'attached'
  }

  compareWithTab (tabId, windowId, userAgent) {
    return this.tabId === tabId && this.windowId === windowId
  }

  static createUniqueId (tabId, windowId) {
    return tabId + '-' + windowId
  }

  static getTabIDfromUnique (uniqueId) {
    return parseInt(uniqueId.substr(0, uniqueId.indexOf('-')))
  }
}
