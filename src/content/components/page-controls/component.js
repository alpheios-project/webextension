import Component from '../component'
import template from './template.htmlf'

/**
 * This is a singleton component.
 */
export default class PageControls extends Component {
  constructor (options) {
    super(Object.assign({
      template: template,
      selectors: {
        self: '[data-component="page-controls"]',
        toggle: '[data-action="toggle-panel"]'
      }
    },
    options))
  }

  /**
   * The name should match one of the options. An option value should be a handler function.
   * @param handler
   * @return {PageControls}
   */
  set onPanelToggle (handler) {
    this.options.elements.toggle.addEventListener('click', handler)
    return this
  }
}
