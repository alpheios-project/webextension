import Message from '../message/message'
import ResponseMessage from './response-message'
import { TabScript } from 'alpheios-components'

export default class StateResponse extends ResponseMessage {
  /**
   * Status response initialization.
   * @param {RequestMessage} request - A request we're responding to.
   * @param {TabScript} state - A current state of an object.
   * @param {Symbol} responseCode - A status code for a request that initiated this response.
   */
  constructor (request, state, responseCode) {
    super(request, TabScript.serializable(state), responseCode)
    this.type = Symbol.keyFor(Message.types.STATE_RESPONSE)
  }
}
