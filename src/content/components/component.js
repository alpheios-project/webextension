export default class Component {
  constructor (options) {
    this.options = options
    this.options.self = {
      selector: this.options.selfSelector
    }
    this.options.elements = {}
    this.innerElements = {}
    this.outerElements = {}
    this.contentAreas = {}

    this.options.self.element = document.querySelector(this.options.self.selector)
    if (!this.options.self.element) {
      throw new Error(`Element's placeholder "${this.options.self.selector}" does not exist. Cannot create a component`)
    }
    this.options.self.element.outerHTML = this.options.template
    this.options.self.element = document.querySelector(this.options.self.selector)

    if (this.options && this.options.innerElements) {
      for (const [name, selector] of Object.entries(this.options.innerElements)) {
        let elements = this.options.self.element.querySelectorAll(selector)
        if (elements.length === 0) { throw new Error(`Inner element "${name}" cannot be found`) }
        this.innerElements[name] = {
          elements: elements,
          element: elements[0],
          selector: selector
        }
      }
    }

    if (this.options && this.options.outerElements) {
      for (const [name, selector] of Object.entries(this.options.outerElements)) {
        let elements = document.querySelectorAll(selector)
        if (elements.length === 0) { throw new Error(`Outer element "${name}" cannot be found`) }
        this.outerElements[name] = {
          elements: elements,
          element: elements[0],
          selector: selector
        }
      }
    }

    if (this.options && this.options.methods) {
      for (const [key, value] of Object.entries(this.options.methods)) {
        this[key] = value
      }
    }

    if (this.options && this.options.contentAreas) {
      for (const [areaName, dataFunction] of Object.entries(this.options.contentAreas)) {
        let elements = this.options.self.element.querySelectorAll(`[data-content-area="${areaName}"]`)
        if (elements.length === 0) { throw new Error(`Content area "${areaName}" cannot be found`) }
        this.contentAreas[areaName] = {
          elements: elements,
          dataFunction: dataFunction,
          setContent: (...values) => {
            let contentHTML = dataFunction(...values)
            elements.forEach(element => { element.innerHTML = contentHTML })
          },
          appendContent: (...values) => {
            let contentHTML = dataFunction(...values)
            elements.forEach(element => { element.innerHTML += contentHTML })
          }
        }
      }
    }
  }
}
