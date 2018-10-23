export default class BaseService {
  constructor () {
    this.messages = new Map()
    this.listeners = new Map()
  }

  addHandler (type, handlerFunc, thisValue = undefined) {
    if (thisValue) { handlerFunc = handlerFunc.bind(thisValue) }
    this.listeners.set(type, handlerFunc)
  }
}
