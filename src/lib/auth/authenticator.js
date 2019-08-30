
/**
 * This is a base class for all other authenticator classes.
 * It defines an API that is common across all variations of authenticator objects.
 * An authenticator object serves as a proxy between a component's Auth data module
 * and platform-specific lower level authentication functionality.
 */
export default class Authenticator {
  /**
   * @constructor
   */
  constructor () {
  }

  /**
   * A link for login external to the Alpheios components.
   * @returns null for client side login
   */
  loginUrl () {
    return null
  }

  /**
   * A link for logout external to the Alpheios components.
   * @returns null for client side login
   */
  logoutUrl () {
    return null
  }

  getEndPoints () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }

  /**
   * Check access token expiration.
   * @returns {Promise}
   */
  session () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }

  /**
   * Authenticates user with an Auth0.
   * @returns {Promise}
   */
  authenticate () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }

  /**
   * Retrieves user profile information from Auth0.
   * @returns {Promise}
   */
  getProfileData () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }

  /**
   * Retrieves user data from a remote provider (e.g. Alpheios servers).
   * @returns {Promise}
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }

  /**
   * Logs the user out
   */
  logout () {
    return new Promise((resolve, reject) => {
      reject('Not implemented')
    })
  }
}
