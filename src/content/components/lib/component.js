import Element from './element'
import TabGroup from './tab-group'

export default class Component {
  constructor (componentOptions = {}, userOptions = {}) {
    this.options = {}
    this.options = Object.assign(this.options, componentOptions)
    this.options = Object.assign(this.options, userOptions)
    if (componentOptions.innerElements && userOptions.innerElements) {
      this.options.innerElements = Object.assign(componentOptions.innerElements, userOptions.innerElements)
    }
    if (componentOptions.outerElements && userOptions.outerElements) {
      this.options.outerElements = Object.assign(componentOptions.outerElements, userOptions.outerElements)
    }
    if (componentOptions.contentAreas && userOptions.contentAreas) {
      this.options.contentAreas = Object.assign(componentOptions.contentAreas, userOptions.contentAreas)
    }
    this.self = {
      selector: this.options.selfSelector
    }
    this.options.elements = {}
    this.innerElements = {}
    this.outerElements = {}
    this.tabGroups = {}
    this.contentAreas = {}

    this.self.element = document.querySelector(this.self.selector)
    if (!this.self.element) {
      throw new Error(`Element's placeholder "${this.self.selector}" does not exist. Cannot create a component`)
    }
    this.self.element.outerHTML = this.options.template
    this.self.element = document.querySelector(this.self.selector)

    if (this.options && this.options.innerElements) {
      for (const [name, elementData] of Object.entries(this.options.innerElements)) {
        this.innerElements[name] = new Element(name, this.self.element, elementData)
      }
    }

    if (this.options && this.options.outerElements) {
      for (const [name, elementData] of Object.entries(this.options.outerElements)) {
        this.outerElements[name] = new Element(name, document, elementData)
      }
    }

    // Scan for tab groups
    let tabGroups = new Set()
    let tabs = this.self.element.querySelectorAll('[data-tab-group]')
    for (let tab of tabs) {
      let groupName = tab.dataset.tabGroup
      if (!tabGroups.has(groupName)) { tabGroups.add(groupName) }
    }
    for (let groupNames of tabGroups.entries()) {
      let groupName = groupNames[0] // entries() returns [groupName, groupName]
      this.tabGroups[groupName] = new TabGroup(groupName, this.self.element)
    }

    if (this.options && this.options.methods) {
      for (const [key, value] of Object.entries(this.options.methods)) {
        this[key] = value
      }
    }

    if (this.options && this.options.contentAreas) {
      for (const [areaName, areaData] of Object.entries(this.options.contentAreas)) {
        areaData.selector = `[data-content-area="${areaName}"]`
        this.contentAreas[areaName] = new Element(areaName, this.self.element, areaData)
      }
    }
  }
}
