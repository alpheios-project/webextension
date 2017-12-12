import Component from '../component'
import template from './template.htmlf'

/**
 * This is a singleton component.
 */
export default class Panel extends Component {
  constructor (options) {
    super(Object.assign({
      template: template,
      selectors: {
        self: '[data-component="alpheios-panel"]',
        page: 'body',
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
    this.options.elements.normalWidthButton.addEventListener('click', this.open.bind(this, Panel.widths.normal))
    this.options.elements.fullWidthButton.addEventListener('click', this.open.bind(this, Panel.widths.full))
    this.options.elements.closeButton.addEventListener('click', this.close.bind(this))

    let activeTab = this.options.elements.tabs[0]
    for (let tab of this.options.elements.tabs) {
      let target = tab.dataset.target
      let targetElem = document.getElementById(target)
      if (targetElem.classList.contains(this.activeClassName)) {
        activeTab = tab
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
        this.options.elements.page.classList.remove(Panel.positions.left)
        this.options.elements.page.classList.add(Panel.positions.right)
      } else {
        // Default: Panel is at the left
        this.options.elements.page.classList.remove(Panel.positions.right)
        this.options.elements.page.classList.add(Panel.positions.left)
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
      this.options.elements.self.classList.add(this.panelOpenedClassName)
      this.options.elements.page.classList.add(this.bodyPositionClassName)

      this.options.elements.self.classList.add(this.panelOpenedClassName)
      this.options.elements.self.classList.add(this.panelFullWidthClassName)
      this.options.elements.normalWidthButton.classList.remove(this.hiddenClassName)
    } else {
      // Default: panel will to be shown in normal width
      this.options.elements.self.classList.add(this.panelOpenedClassName)
      this.options.elements.page.classList.add(this.bodyNormalWidthClassName)
      this.options.elements.page.classList.add(this.bodyPositionClassName)
      this.options.elements.self.classList.add(this.panelOpenedClassName)
      this.options.elements.fullWidthButton.classList.remove(this.hiddenClassName)
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
    this.options.elements.self.classList.remove(this.panelOpenedClassName)
    this.options.elements.page.classList.remove(this.bodyNormalWidthClassName)
    this.options.elements.page.classList.remove(this.bodyPositionClassName)

    this.options.elements.self.classList.remove(this.panelOpenedClassName)
    this.options.elements.self.classList.remove(this.panelFullWidthClassName)
    this.options.elements.normalWidthButton.classList.add(this.hiddenClassName)
    this.options.elements.fullWidthButton.classList.add(this.hiddenClassName)

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
    this.options.elements.definitionContainer.innerHTML = ''
    this.options.elements.inflTableContainer.innerHTML = ''
    this.options.elements.viewSelectorContainer.innerHTML = ''
    this.options.elements.localeSwitcherContainer.innerHTML = ''
    return this
  }

  switchTab (event) {
    this.changeActiveTabTo(event.currentTarget)
    return this
  }

  changeActiveTabTo (activeTab) {
    if (this.options.elements.activeTab) {
      let target = this.options.elements.activeTab.dataset.target
      document.getElementById(target).classList.add(this.hiddenClassName)
      this.options.elements.activeTab.classList.remove(this.activeClassName)
    }

    activeTab.classList.add(this.activeClassName)
    let target = activeTab.dataset.target
    document.getElementById(target).classList.remove(this.hiddenClassName)
    this.options.elements.activeTab = activeTab
    return this
  }

  get optionsPage () {
    return this.options.elements.optionsContainer
  }

  set optionsPage (htmlContent) {
    this.options.elements.optionsContainer.innerHTML = htmlContent
    return this.options.elements.optionsContainer.innerHTML
  }

  showMessage (messageHTML) {
    this.clear()
    this.options.elements.definitionContainer.innerHTML = messageHTML
    this.open().changeActiveTabTo(this.options.elements.tabs[0])
  }
}
