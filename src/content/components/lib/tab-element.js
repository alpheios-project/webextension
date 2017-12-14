import Element from './element'

export default class TabElement extends Element {
  constructor (name, scope, elementData = {}) {
    super(name, scope, elementData)
    this.isActive = false
    this.panel = new Element(this.element.dataset.targetName, scope)
  }

  deactivate () {
    this.element.classList.remove(Element.defaults.classNames.active)
    this.panel.hide()
    this.isActive = false
  }

  activate () {
    this.element.classList.add(Element.defaults.classNames.active)
    this.panel.show()
    this.isActive = true
  }
}
