export default class State {
  static value (state, value = undefined) {
    return {
      value: value,
      state: state
    }
  }

  static emptyValue (state) {
    return {
      value: undefined,
      state: state
    }
  }

  static getValue (stateObject) {
    return stateObject.value
  }

  static getState (stateObject) {
    return stateObject.state
  }
}
