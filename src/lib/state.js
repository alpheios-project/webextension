export default class State {
  constructor (state, value = undefined) {
    this.state = state
    this.value = value
  }
  static value (state, value = undefined) {
    return new State(state, value)
  }

  static emptyValue (state) {
    return new State(state)
  }

  static getValue (state) {
    if (!(state instanceof State)) {
      // The object passed is of a different type, will return this object as a value
      return state
    }
    if (!state.hasOwnProperty('value')) { return undefined }
    return state.value
  }

  static getState (state) {
    if (!state.hasOwnProperty('state')) { return undefined }
    return state.state
  }
}
