import Message from '../message/message'
import RequestMessage from './request-message'
import { TabScript } from 'alpheios-components'

export default class StateRequest extends RequestMessage {
  constructor (tabScriptState) {
    super(TabScript.serializable(tabScriptState))
    this.type = Symbol.keyFor(Message.types.STATE_REQUEST)
  }
}
