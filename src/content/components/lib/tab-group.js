import Element from './element'
import TabElement from './tab-element'

export default class TabGroup {
  constructor (groupName, scope) {
    this._index = []

    let tabs = scope.querySelectorAll(`[data-tab-group="${groupName}"]`)
    if (!tabs || tabs.length === 0) { throw new Error(`Tab group "${groupName}" has no tabs in it`) }
    for (let tab of tabs) {
      let name = tab.dataset.element
      let tabElement = new TabElement(name, scope)
      this[name] = tabElement
      this._index.push(tabElement)
    }

    // Try to set active tabe based on presence of an `active` class
    for (let tab of this._index) {
      if (tab.element.classList.contains(Element.defaults.classNames.active)) {
        this.activeTab = tab
      }
    }
    // If not found, let's set it to a default value
    if (!this.activeTab) {
      this.activeTab = this._index[0] // Set to a first tab if `active` class is not assigned to any tab element
    }

    for (let tab of this._index) {
      tab.deactivate() // Reset all panels and tabs to match object configuration
      tab.element.addEventListener('click', this.onClick.bind(this))
    }
    this.activeTab.activate()
  }

  activate (tabName) {
    // Deactivate a currently active tab
    this.activeTab.deactivate()
    this.activeTab = this[tabName]
    this.activeTab.activate()
  }

  onClick (event) {
    let tabName = event.currentTarget.dataset.element
    if (!tabName) {
      throw new Error(`Tab currently being selected has no name`)
    }
    this.activate(tabName)
  }
}
