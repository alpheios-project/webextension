export default class Element {
  constructor (name, scope, elementData = {}) {
    this.options = Element.defaults

    this.name = name
    let defaultSelector = `[data-element="${this.name}"]`
    this.selector = elementData.selector || defaultSelector
    let elements = scope.querySelectorAll(this.selector)
    if (elements.length === 0) { throw new Error(`Element(s) does not exist:`, elements) }
    this.elements = (elements.length > 0) ? Array.from(elements) : [elements]
    this.dataFunction = elementData.dataFunction
  }

  static get defaults () {
    return {
      classNames: {
        hidden: 'hidden',
        active: 'active'
      }
    }
  }

  get element () {
    return this.elements[0]
  }

  setContent (...values) {
    let contentHTML = this.dataFunction ? this.dataFunction(...values) : values[0]
    for (let element of this.elements) {
      element.innerHTML = contentHTML
    }
  }

  appendContent (...values) {
    let contentHTML = this.dataFunction ? this.dataFunction(...values) : values[0]
    for (let element of this.elements) {
      element.innerHTML += contentHTML
    }
  }

  clearContent () {
    for (let element of this.elements) {
      element.innerHTML = ''
    }
  }

  show () {
    for (let element of this.elements) {
      element.classList.remove(this.options.classNames.hidden)
    }
  }

  hide () {
    for (let element of this.elements) {
      element.classList.add(this.options.classNames.hidden)
    }
  }
}
