import Component from '../lib/component'
import template from './template.htmlf'
import interact from 'interactjs' // Interact.js (for resizability)

/**
 * This is a singleton component.
 */
export default class Panel extends Component {
  constructor (options) {
    super(Panel.defaults, options)

    this.hiddenClassName = 'hidden'
    this.panelOpenedClassName = 'opened'
    this.panelFullWidthClassName = 'full-width'
    this.bodyNormalWidthClassName = 'alpheios-panel-opened'
    this.resizableSel = '[data-resizable="true"]' // for Interact.js

    this.setPositionTo(this.options.position)
    this.width = Panel.widths.zero // Sets initial width to zero because panel is closed initially

    // Set panel controls event handlers
    this.innerElements.normalWidthButton.element.addEventListener('click', this.open.bind(this, Panel.widths.normal))
    this.innerElements.fullWidthButton.element.addEventListener('click', this.open.bind(this, Panel.widths.full))
    this.innerElements.closeButton.element.addEventListener('click', this.close.bind(this))

    // Initialize Interact.js: make panel resizable
    interact(this.resizableSel)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true
        },

        // minimum size
        restrictSize: {
          min: { width: 400, height: 800 }
        },

        inertia: true
      })
      .on('resizemove', event => {
        let target = event.target
        // update the element's style
        target.style.width = `${event.rect.width}px`
      })
  }

  static get defaults () {
    return {
      template: template,
      selfSelector: '[data-component="alpheios-panel"]',
      innerElements: {
        normalWidthButton: { selector: '#alpheios-panel-show-open' },
        fullWidthButton: { selector: '#alpheios-panel-show-fw' },
        closeButton: { selector: '#alpheios-panel-hide' }
      },
      outerElements: {
        page: { selector: 'body' }
      },
      contentAreas: {
        messages: {},
        shortDefinitions: {},
        fullDefinitions: {},
        inflectionsLocaleSwitcher: {},
        inflectionsViewSelector: {},
        inflectionsTable: {}
      },
      position: Panel.positions.default
    }
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
      this.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)

      this.self.element.classList.add(this.panelOpenedClassName)
      this.self.element.classList.add(this.panelFullWidthClassName)
      this.innerElements.normalWidthButton.element.classList.remove(this.hiddenClassName)
    } else {
      // Default: panel will to be shown in normal width
      this.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyNormalWidthClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)
      this.self.element.classList.add(this.panelOpenedClassName)
      this.innerElements.fullWidthButton.element.classList.remove(this.hiddenClassName)
    }
    return this
  }
  close () {
    if (this.isOpened) {
      this.resetWidth()
      this.options.methods.onClose()
    }
    return this
  }

  get isOpened () {
    return !(this.width === Panel.widths.zero)
  }

  resetWidth () {
    this.self.element.classList.remove(this.panelOpenedClassName)
    this.outerElements.page.element.classList.remove(this.bodyNormalWidthClassName)
    this.outerElements.page.element.classList.remove(this.bodyPositionClassName)

    this.self.element.classList.remove(this.panelOpenedClassName)
    this.self.element.classList.remove(this.panelFullWidthClassName)
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

  clearContent () {
    for (let contentArea in this.contentAreas) {
      if (this.contentAreas.hasOwnProperty(contentArea)) {
        this.contentAreas[contentArea].clearContent()
      }
    }
    return this
  }

  showMessage (messageHTML) {
    this.contentAreas.messages.setContent(messageHTML)
    this.tabGroups.contentTabs.activate('statusTab')
  }

  appendMessage (messageHTML) {
    this.contentAreas.messages.appendContent(messageHTML)
  }

  clearMessages () {
    this.contentAreas.messages.setContent('')
  }
}
