import Component from '../component'
import template from './template.htmlf'

/**
 * This is a singleton component.
 */
export default class Panel extends Component {
  constructor (options) {
    super(Object.assign({
      template: template,
      selfSelector: '[data-component="alpheios-panel"]',
      innerElements: {
        definitionContainer: '#alpheios-panel-content-definition',
        inflTableContainer: '#alpheios-panel-content-infl-table-body',
        viewSelectorContainer: '#alpheios-panel-content-infl-table-view-selector',
        localeSwitcherContainer: '#alpheios-panel-content-infl-table-locale-switcher',
        optionsContainer: '#alpheios-panel-content-options',
        normalWidthButton: '#alpheios-panel-show-open',
        fullWidthButton: '#alpheios-panel-show-fw',
        closeButton: '#alpheios-panel-hide',
        tabs: '#alpheios-panel__nav .alpheios-panel__nav-btn',
        activeTab: '#alpheios-panel__nav .alpheios-panel__nav-btn.active'
      },
      outerElements: {
        page: 'body'
      },
      position: Panel.positions.default
    },
    options))

    this.activeClassName = 'active'
    this.hiddenClassName = 'hidden'
    this.panelOpenedClassName = 'opened'
    this.panelFullWidthClassName = 'full-width'
    this.bodyNormalWidthClassName = 'alpheios-panel-opened'

    this.setPositionTo(this.options.position)
    this.width = Panel.widths.zero // Sets initial width to zero because panel is closed initially

    // Set panel controls event handlers
    this.innerElements.normalWidthButton.element.addEventListener('click', this.open.bind(this, Panel.widths.normal))
    this.innerElements.fullWidthButton.element.addEventListener('click', this.open.bind(this, Panel.widths.full))
    this.innerElements.closeButton.element.addEventListener('click', this.close.bind(this))

    let activeTab = this.innerElements.tabs.elements[0]
    for (let tab of this.innerElements.tabs.elements) {
      let target = tab.dataset.target
      let targetElem = document.getElementById(target)
      if (targetElem.classList.contains(this.activeClassName)) {
        activeTab.elements[0] = tab
      } else {
        document.getElementById(target).classList.add(this.hiddenClassName)
      }
      tab.addEventListener('click', this.switchTab.bind(this))
    }
    this.changeActiveTabTo(activeTab)
  }

  static get positions () {
    return {
      default: 'alpheios-panel-left',
      left: 'alpheios-panel-left',
      right: 'alpheios-panel-right'
    }
  }

  static get widths () {
    return {
      default: 'alpheios-panel-opened',
      zero: 'alpheios-panel-zero-width',
      normal: 'alpheios-panel-opened',
      full: 'alpheios-panel-full-width'
    }
  }

  setPositionTo (position = Panel.positions.default) {
    if (this.bodyPositionClassName !== position) {
      this.bodyPositionClassName = position
      if (position === Panel.positions.right) {
        // Panel is at the right
        this.outerElements.page.element.classList.remove(Panel.positions.left)
        this.outerElements.page.element.classList.add(Panel.positions.right)
      } else {
        // Default: Panel is at the left
        this.outerElements.page.element.classList.remove(Panel.positions.right)
        this.outerElements.page.element.classList.add(Panel.positions.left)
      }
    }
  }

  positionToLeft () {
    this.setPositionTo(Panel.positions.left)
  }

  positionToRight () {
    this.setPositionTo(Panel.positions.right)
  }

  open (width = Panel.widths.normal) {
    this.resetWidth()
    this.width = width

    if (this.width === Panel.widths.full) {
      // Panel will to be shown in full width
      this.options.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)

      this.options.self.element.classList.add(this.panelOpenedClassName)
      this.options.self.element.classList.add(this.panelFullWidthClassName)
      this.innerElements.normalWidthButton.element.classList.remove(this.hiddenClassName)
    } else {
      // Default: panel will to be shown in normal width
      this.options.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyNormalWidthClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)
      this.options.self.element.classList.add(this.panelOpenedClassName)
      this.innerElements.fullWidthButton.element.classList.remove(this.hiddenClassName)
    }
  }
  close () {
    if (this.isOpened) {
      this.resetWidth()
    }
    return this
  }

  get isOpened () {
    return !(this.width === Panel.widths.zero)
  }

  resetWidth () {
    this.options.self.element.classList.remove(this.panelOpenedClassName)
    this.outerElements.page.element.classList.remove(this.bodyNormalWidthClassName)
    this.outerElements.page.element.classList.remove(this.bodyPositionClassName)

    this.options.self.element.classList.remove(this.panelOpenedClassName)
    this.options.self.element.classList.remove(this.panelFullWidthClassName)
    this.innerElements.normalWidthButton.element.classList.add(this.hiddenClassName)
    this.innerElements.fullWidthButton.element.classList.add(this.hiddenClassName)

    this.width = Panel.widths.zero
  }

  toggle () {
    if (this.isOpened) {
      this.close()
    } else {
      this.open()
    }
    return this
  }

  clear () {
    this.innerElements.definitionContainer.element.innerHTML = ''
    this.innerElements.inflTableContainer.element.innerHTML = ''
    this.innerElements.viewSelectorContainer.element.innerHTML = ''
    this.innerElements.localeSwitcherContainer.element.innerHTML = ''
    return this
  }

  switchTab (event) {
    this.changeActiveTabTo(event.currentTarget)
    return this
  }

  /**
   * Todo: simplify
   * @param {HTMLElement} activeTab - A tab that must be set to active state.
   * @return {Panel}
   */
  changeActiveTabTo (activeTab) {
    if (this.innerElements.activeTab) {
      let target = this.innerElements.activeTab.element.dataset.target
      document.getElementById(target).classList.add(this.hiddenClassName)
      this.innerElements.activeTab.element.classList.remove(this.activeClassName)
    }

    activeTab.classList.add(this.activeClassName)
    let target = activeTab.dataset.target
    document.getElementById(target).classList.remove(this.hiddenClassName)
    this.innerElements.activeTab.elements = document.querySelectorAll(this.innerElements.activeTab.selector)
    return this
  }

  get optionsPage () {
    return this.innerElements.element.optionsContainer
  }

  set optionsPage (htmlContent) {
    this.innerElements.optionsContainer.element.innerHTML = htmlContent
    return this.innerElements.optionsContainer.element.innerHTML
  }

  showMessage (messageHTML) {
    this.clear()
    this.innerElements.definitionContainer.element.innerHTML = messageHTML
    this.open().changeActiveTabTo(this.innerElements.tabs.elements[0])
  }
}
