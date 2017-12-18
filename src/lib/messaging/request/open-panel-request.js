import Message from '../message/message'
import RequestMessage from './request-message'

export default class OpenPanelRequest extends RequestMessage {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(Message.types.OPEN_PANEL_REQUEST)
  }
}
