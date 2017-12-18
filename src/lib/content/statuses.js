/**
 * A common object shared between content and background.
 */
export default {
  PENDING: Symbol.for('Alpheios_Status_Pending'), // Content script has not been fully initialized yet
  ACTIVE: Symbol.for('Alpheios_Status_Active'), // Content script is loaded and active
  DEACTIVATED: Symbol.for('Alpheios_Status_Deactivated'), // Content script has been loaded, but is deactivated
  PANEL_OPEN: Symbol.for('Alpheios_Status_PanelOpened'), // Panel has been opened
  PANEL_CLOSED: Symbol.for('Alpheios_Status_PanelClosed')
}
