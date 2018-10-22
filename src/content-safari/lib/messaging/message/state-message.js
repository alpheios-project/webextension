import Message from '@safari/lib/messaging/message/message'
import TabScript from '@/lib/content/tab-script'

export default class StateMessage extends Message {
  constructor (state) {
    super(TabScript.serializable(state))
    this.type = Symbol.keyFor(Message.types.STATE_MESSAGE)
  }
}
