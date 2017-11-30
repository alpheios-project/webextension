export default class Component {
  constructor (options) {
    this.options = options
    this.options.elements = {}

    this.options.elements.self = document.querySelector(this.options.selectors.self)
    if (!this.options.elements.self) {
      throw new Error(`Own element "${this.options.selectors.self}" does not exist. Cannot create a component`)
    }
    this.options.elements.self.outerHTML = this.options.template

    if (this.options && this.options.selectors) {
      for (const [key, value] of Object.entries(this.options.selectors)) {
        let elements = document.querySelectorAll(value)
        if (elements.length === 0) {
          console.warn(`Element "${value}" does not exist. Some component's functionality might be disabled`)
        } else if (elements.length === 1) {
          this.options.elements[key] = elements[0]
        } else {
          this.options.elements[key] = elements
        }
      }
    }

    if (options && options.methods) {
      for (const [key, value] of Object.entries(options.methods)) {
        this[key] = value
      }
    }
  }
}
