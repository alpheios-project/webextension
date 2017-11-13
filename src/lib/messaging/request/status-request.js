import Message from '../message'
import RequestMessage from './request-message'

export default class StatusRequest extends RequestMessage {
  constructor () {
    super(undefined)
    this.type = Symbol.keyFor(Message.types.STATUS_REQUEST)
  }
}
