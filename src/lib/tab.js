export default class Tab {
  constructor (tabId, windowId, userAgent) {
    this.tabId = tabId
    this.windowId = windowId
    this.userAgent = userAgent
  }

  get uniqueId () {
    return this.tabId + '-' + this.windowId
  }

  compareWithTab (tabId, windowId, userAgent) {
    return this.tabId === tabId && this.windowId === windowId
  }
}
