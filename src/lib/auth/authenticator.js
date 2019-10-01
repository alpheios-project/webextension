
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
    // Whether authenticator has user data obtained
    this.hasUserData = false
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
      reject(new Error('getEndPoints is not implemented'))
    })
  }

  /**
   * Check access token expiration.
   * @returns {Promise}
   */
  session () {
    return new Promise((resolve, reject) => {
      reject(new Error('Session method is not implemented'))
    })
  }

  /**
   * This method is called in order for Authenticator
   * to perform actions specific to logging a user in
   * (i.e. to send an authentication request to the remote server)
   * @returns {Promise} - Promise that is resolved if a user authenticated successfully and
   *                      rejected if a user authentication failed.
   */
  authenticate () {
    return new Promise((resolve, reject) => {
      reject(new Error('Authenticate method is not implemented'))
    })
  }

  /**
   * @typedef UserProfileData
   * @property {string} name - A full name of the user.
   * @property {string} nickname - A user's nickname.
   * @property {string} sub - A user ID.
   */
  /**
   * Retrieves user profile information.
   * This function can be used by third-party libraries to retrieve user profile data.
   * One example of such use is a UserDataManager which is used by the word list controller.
   * @return {Promise<UserProfileData>|Promise<Error>} - Resolved with user profile data
   * in case of success or rejected with an error in case of failure.
   */
  getProfileData () {
    return new Promise((resolve, reject) => {
      reject(new Error('getProfileData is not implemented'))
    })
  }

  /**
   * Retrieves user information.
   * @return {Promise<string>|Promise<Error>} - Resolved with an access token
   * in case of success or rejected with an error in case of failure.
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      reject(new Error('getUserData is not implemented'))
    })
  }

  /**
   * This method is called in order for Authenticator
   * to perform actions specific to logging a user out
   * (i.e. to send a request to end user session to the remote server)
   * @returns {Promise} - Promise that is resolved if a user has been logged out successfully and
   *                      rejected if there was an error during a logout.
   */
  logout () {
    return new Promise((resolve, reject) => {
      reject(new Error('Logout is not implemented'))
    })
  }
}
