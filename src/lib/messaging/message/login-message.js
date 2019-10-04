import Message from './message'
import { TabScript } from 'alpheios-components'

export default class LoginMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.LOGIN_MESSAGE)
  }
}
