import Message from './message'
import { TabScript } from 'alpheios-components'

export default class StateMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.STATE_MESSAGE)
  }
}
