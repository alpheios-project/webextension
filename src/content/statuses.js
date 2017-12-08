/**
 * A common object shared between content and background.
 */
export default {
  PENDING: Symbol.for('Pending'), // Content script has not been fully initialized yet
  ACTIVE: Symbol.for('Active'), // Content script is loaded and active
  DEACTIVATED: Symbol.for('Deactivated'), // Content script has been loaded, but is deactivated
  PANEL_OPEN: Symbol.for('PanelOpened') // Panel has been opened
}
