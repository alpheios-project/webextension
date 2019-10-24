import { AuthData } from 'alpheios-components'
import Auth0env from '../../../../protected-config/auth0/prod/env-safari-app-ext.js'
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
    this._authData = new AuthData()
    this.hasUserData = false

    // TODO: Hardcoded for now. Can we do it any better than that?
    this.endpoints = Auth0env.ENDPOINTS
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
        reject('No user data has been retrieved yet') // eslint-disable-line prefer-promise-reject-errors
      }
    })
  }

  /**
   * Returns an authentication data along with an expiration data.
   * Is used to obtain user information and set expiration timeout
   * if user has already been authenticated previously.
   * @return {Promise<AuthData> | Promise<Error>}
   */
  session () {
    return new Promise((resolve, reject) => {
      if (this._authData.isAuthenticated) {
        resolve(this._authData)
      } else {
        reject(new Error('Not authenticated'))
      }
    })
  }

  /**
   * @typedef SafariAuthData
   * @property {string} userId - A user ID (`sub` in Auth0).
   * @property {string} userName - A full name of the user.
   * @property {string} userNickname - A user's nickname.
   * @property {string} accessToken - An access token of the user.
   * @property {Date} accessTokenExpiresIn - A date and time when access token expires.
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
      this._authData.userId = authData.userId
      this._authData.userName = authData.userName
      this._authData.userNickname = authData.userNickname
      this._authData.accessToken = authData.accessToken
      this._authData.expirationDateTime = authData.accessTokenExpiresIn
      this.hasUserData = true
      this._authData.isAuthenticated = true
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
        resolve(this._authData)
      } else {
        reject('No user profile data is available yet') // eslint-disable-line prefer-promise-reject-errors
      }
    })
  }

  /**
   * Retrieves user information (an access token currently).
   * @return {Promise<string>|Promise<Error>} - Resolved with an access token
   * in case of success or rejected with an error in case of failure.
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      if (this.hasUserData) {
        // User data has been retrieved
        resolve(this._authData.accessToken)
      } else {
        reject('No user data has been retrieved yet') // eslint-disable-line prefer-promise-reject-errors
      }
    })
  }

  get iFrameURL () {
    return Auth0env.ALPHEIOS_DOMAIN || ''
  }

  /**
   * Logs the user out
   */
  logout () {
    return new Promise((resolve, reject) => {
      // Erase user data
      this.hasUserData = false
      this._authData.erase()
      resolve()
    })
  }
}
