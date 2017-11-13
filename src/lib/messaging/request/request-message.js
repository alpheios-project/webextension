import Message from '../message'

export default class RequestMessage extends Message {
  constructor (body) {
    super(body)
    this.role = Symbol.keyFor(Message.roles.REQUEST)
  }
}
