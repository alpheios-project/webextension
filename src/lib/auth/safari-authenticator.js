import auth0Env from '@/lib/auth/env-safari-app-ext.js'
import Authenticator from '@/lib/auth/authenticator.js'

/**
 * This is a base class for all other authenticator classes.
 * It defines an API that is common across all variations of authenticator objects.
 * An authenticator object serves as a proxy between a component's Auth data module
 * and platform-specific lower level authentication functionality.
 */
export default class SafariAuthenticator extends Authenticator {
  /**
   * @constructor
   */
  constructor () {
    super()

    // User data props
    this.isAuthenticated = false
    this.hasUserData = false
    // A full name of the user
    this.userName = null
    // A user's nickname
    this.userNickname = null
    // A user ID
    this.userId = null

    this.accessToken = null

    // TODO: Hardcoded for now. Can we do it any better than that?
    this.endpoints = auth0Env.ENDPOINTS
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
      if (this.hasUserData) {
        // User data has been retrieved
        resolve(this.endpoints)
      } else {
        reject('No user data has been retrieved yet')
      }
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
   * @typedef SafariAuthData
   * @property {string} userId - A user ID (`sub` in Auth0).
   * @property {string} userName - A full name of the user.
   * @property {string} userNickname - A user's nickname.
   * @property {string} accessToken - An access token of the user..
   */
  /**
   * Authenticates user with an Auth0.
   * @param {SafariAuthData} authData - A user auth data.
   * @returns {Promise | Promise<Error>} Is resolved with an empty promise in case of success and
   *          is rejected with an error in case of failure.
   */
  authenticate (authData) {
    return new Promise((resolve, reject) => {
      // Check the validity of user data. All required fields must be available
      if (!authData.userId || !authData.userName || !authData.userNickname || !authData.accessToken) {
        reject(new Error('Some of the required parameters (userId, userNae, userNickname, accessToken) are missing'))
      }
      this.userId = authData.userId
      this.userName = authData.userName
      this.userNickname = authData.userNickname
      this.accessToken = authData.accessToken
      this.hasUserData = true
      this.isAuthenticated = true
      resolve()
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
      if (this.hasUserData) {
        // User data has been retrieved
        resolve({
          name: this.userName,
          nickname: this.userNickname,
          sub: this.userId
        })
      } else {
        reject('No user profile data is available yet')
      }
    })
  }

  /**
   * Retrieves user information.
   * @return {Promise<string>|Promise<Error>} - Resolved with an access token
   * in case of success or rejected with an error in case of failure.
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      if (this.hasUserData) {
        // User data has been retrieved
        resolve(this.accessToken)
      } else {
        reject('No user data has been retrieved yet')
      }
    })
  }

  /**
   * Logs the user out
   */
  logout () {
    return new Promise((resolve, reject) => {
      // Erase user data
      this.hasUserData = false
      this.isAuthenticated = false
      this.userId = null
      this.userName = null
      this.userNickname = null
      this.accessToken = null
      resolve()
    })
  }
}

SafariAuthenticator.authStatuses = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT'
}
