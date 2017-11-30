import Component from '../component'
import template from './template.htmlf'
import './style.scss'

/**
 * This is a singleton component.
 */
export default class Panel extends Component {
  constructor (options) {
    super(Object.assign(options, {
      template: template,
      selectors: {
        self: '[data-component="alpheios-panel"]',
        page: 'body',
        definitionContainer: '#alpheios-panel-content-definition',
        inflTableContainer: '#alpheios-panel-content-infl-table-body',
        viewSelectorContainer: '#alpheios-panel-content-infl-table-view-selector',
        localeSwitcherContainer: '#alpheios-panel-content-infl-table-locale-switcher',
        optionsContainer: '#alpheios-panel-content-options',
        showOpenBtn: '#alpheios-panel-show-open',
        showFWBtn: '#alpheios-panel-show-fw',
        hideBtn: '#alpheios-panel-hide',
        tabs: '#alpheios-panel__nav .alpheios-panel__nav-btn',
        activeTab: '#alpheios-panel__nav .alpheios-panel__nav-btn.active'
      }
    }))

    /*this.inflTableContainer = document.querySelector('#alpheios-panel-content-infl-table-body')
    this.viewSelectorContainer = document.querySelector('#alpheios-panel-content-infl-table-view-selector')
    this.localeSwitcherContainer = document.querySelector('#alpheios-panel-content-infl-table-locale-switcher')
    this.optionsContainer = document.querySelector('#alpheios-panel-content-options')

    this.showOpenBtn = document.querySelector('#alpheios-panel-show-open')
    this.showFWBtn = document.querySelector('#alpheios-panel-show-fw')
    this.hideBtn = document.querySelector('#alpheios-panel-hide')

    this.tabs = document.querySelectorAll('#alpheios-panel__nav .alpheios-panel__nav-btn')
    this.activeTab = document.querySelector('#alpheios-panel__nav .alpheios-panel__nav-btn')*/
    this.activeClassName = 'active'

    this.panelOpenClassName = 'open'
    this.hiddenClassName = 'hidden'
    this.panelOpenFWClassName = 'open-fw'
    this.bodyOpenClassName = 'alpheios-panel-open'
    this.bodyPositionClassName = Panel.positions.left
    /*if (this.options.items.panelPosition.currentValue === 'right') {
      this.bodyPositionClassName = Panel.positions.right
    }*/

    this.isOpen = false
    this.isOpenFW = false

    this.options.elements.page.classList.add(this.bodyPositionClassName)

    this.options.elements.showOpenBtn.addEventListener('click', this.open.bind(this))
    this.options.elements.showFWBtn.addEventListener('click', this.openFullWidth.bind(this))
    this.options.elements.hideBtn.addEventListener('click', this.close.bind(this))

    for (let tab of this.options.elements.tabs) {
      let target = tab.dataset.target
      document.getElementById(target).classList.add(this.hiddenClassName)
      tab.addEventListener('click', this.switchTab.bind(this))
    }
    this.changeActiveTabTo(this.options.elements.tabs[0])
  }

  static get positions () {
    return {
      left: 'alpheios-panel-left',
      right: 'alpheios-panel-right'
    }
  }

  setPoistionToLeft () {
    if (this.bodyPositionClassName !== Panel.positions.left) {
      this.options.elements.page.classList.replace(this.bodyPositionClassName, Panel.positions.left)
      this.bodyPositionClassName = Panel.positions.left
    }
  }

  setPoistionToRight () {
    if (this.bodyPositionClassName !== Panel.positions.right) {
      this.options.elements.page.classList.replace(this.bodyPositionClassName, Panel.positions.right)
      this.bodyPositionClassName = Panel.positions.right
    }
  }

  open () {
    if (this.isOpenFW) {
      this.options.elements.self.classList.remove(this.panelOpenFWClassName)
      this.isOpenFW = false
    }
    if (!this.isOpen) {
      this.options.elements.self.classList.add(this.panelOpenClassName)
      this.options.elements.page.classList.add(this.bodyOpenClassName)
      this.isOpen = true
    }
    this.options.elements.showOpenBtn.classList.add(this.hiddenClassName)
    return this
  }

  openFullWidth () {
    if (this.isOpen) {
      this.options.elements.self.classList.remove(this.panelOpenClassName)
      this.options.elements.page.classList.remove(this.bodyOpenClassName)
      this.isOpen = false
    }
    if (!this.isOpenFW) {
      this.options.elements.self.classList.add(this.panelOpenFWClassName)
      this.isOpenFW = true
    }
    this.options.elements.showOpenBtn.classList.remove(this.hiddenClassName)
    return this
  }

  close () {
    if (this.isOpen) {
      this.options.elements.self.classList.remove(this.panelOpenClassName)
      this.options.elements.page.classList.remove(this.bodyOpenClassName)
      this.isOpen = false
    }
    if (this.isOpenFW) {
      this.options.elements.self.classList.remove(this.panelOpenFWClassName)
      this.isOpenFW = false
    }
    return this
  }

  toggle () {
    if (this.isOpen || this.isOpenFW) {
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
}
