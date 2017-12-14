import Message from '../message'
import RequestMessage from './request-message'

export default class PanelStatusChangeRequest extends RequestMessage {
  constructor (isOpen) {
    // passing a Symbol (i.e. the PANEL_OPEN or PANEL_CLOSED Status)
    // fails -- probably there is a way to make it work but for now
    // a simple boolean flag works
    super({isOpen: isOpen})
    this.type = Symbol.keyFor(Message.types.PANEL_STATUS_CHANGE_REQUEST)
  }
}
