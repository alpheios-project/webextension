import Message from '../message/message'
import RequestMessage from './request-message'
import TabScript from '../../content/tab-script'

export default class StateRequest extends RequestMessage {
  constructor (tabScriptState) {
    super(TabScript.serializable(tabScriptState))
    this.type = Symbol.keyFor(Message.types.STATE_REQUEST)
  }
}
