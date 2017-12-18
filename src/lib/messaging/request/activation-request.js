import Message from '../message/message'
import RequestMessage from './request-message'

export default class ActivationRequest extends RequestMessage {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(Message.types.ACTIVATION_REQUEST)
  }
}
