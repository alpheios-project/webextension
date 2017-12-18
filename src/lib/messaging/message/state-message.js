import Message from './message'
import TabScript from '../../content/tab-script'

export default class StateMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.STATE_MESSAGE)
  }
}
