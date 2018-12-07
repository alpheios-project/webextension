import Message from './message'
import { TabScript } from 'alpheios-components'

/**
 * Notifies background that a state of an embedded lib.
 */
export default class EmbedLibMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.CONTENT_READY_MESSAGE)
  }
}
