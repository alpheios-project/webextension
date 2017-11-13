import Message from '../message'
import RequestMessage from './request-message'

export default class DeactivationRequest extends RequestMessage {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(Message.types.DEACTIVATION_REQUEST)
  }
}
