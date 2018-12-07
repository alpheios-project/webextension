import Message from './message'
import { TabScript } from 'alpheios-components'

/**
 * Notifies background that a content script is fully loaded and ready to accept its commands.
 */
export default class ContentReadyMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.CONTENT_READY_MESSAGE)
  }
}
