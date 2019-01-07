/**
 * An error that can be transferred between content and background
 * by message, request, or response.
 */
export default class TransferrableError extends Error {
  constructor (...params) {
    super(...params)
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Need this because `message`, `stack`, etc. are not enumerable and won't be serialized
   * @return {{name: string, message: string}}
   */
  toJSON () {
    console.log(`Error toJSON`)
    let values = {}
    Object.getOwnPropertyNames(this).forEach(key => {
      values[key] = this[key]
    })
    return values
  }

  /**
   * Constructs an instance from a JSON-like object.
   * An opposite of [toJSON]{@link AuthError#toJSON}.
   * @param {Object} jsonObj - An object providing data for the instance to be created.
   * @constructor
   */
  static fromJSON (jsonObj) {
    let error = new this()
    for (const key of Object.keys(jsonObj)) {
      error[key] = jsonObj[key]
    }
    return error
  }
}
