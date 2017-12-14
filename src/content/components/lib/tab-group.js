import Element from './element'
import TabElement from './tab-element'

export default class TabGroup {
  constructor (groupName, scope) {
    this.options = TabGroup.defaults

    this.nameIndex = {}
    this.tabs = Array.from(scope.querySelectorAll(`[data-tab-group="${groupName}"]`)).map(
      tab => {
        let name = tab.dataset.element
        let tabElement = new TabElement(name, scope)
        this.nameIndex[name] = tabElement
        return tabElement
      }
    )

    // Try to set active tabe based on presence of an `active` class
    for (let tab of this.tabs) {
      if (tab.element.classList.contains(Element.defaults.classNames.active)) {
        this.activeTab = tab
      }
    }
    // If not found, let's set it to a default value
    if (!this.activeTab) {
      this.activeTab = this.tabs[0] // Set to a first tab if `active` class is not assigned to any tab element
    }

    for (let tab of this.tabs) {
      tab.deactivate() // Reset all panels and tabs to match object configuration
      tab.element.addEventListener('click', this.onClick.bind(this))
    }
    this.activeTab.activate()
  }

  activate (tabName) {
    // Deactivate a currently active tab
    this.activeTab.deactivate()
    this.activeTab = this.nameIndex[tabName]
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
