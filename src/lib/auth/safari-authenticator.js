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
    this.userEmail = null
    // A full name of the user
    this.userName = null
    // A user's nickname
    this.userNickname = null
    // A user ID
    this.userId = null

    this.accessToken = null

    // TODO: Hardcoded for now. Can we do it any better than that?
    this.endpoints = {
      wordlist: 'https://userapis.alpheios.net/v1/words',
      settings: 'https://settings.alpheios.net/v1/settings'
    }
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
        console.info(`SA: Returning endpoints`)
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
   * @property {string} userEmail - An email of the user.
   * @property {string} userId - A user ID (`sub` in Auth0).
   * @property {string} userName - A full name of the user.
   * @property {string} userNickname - A user's nickname.
   * @property {string} accessToken - An access token of the user..
   */
  /**
   * Authenticates user with an Auth0.
   * @param {SafariAuthData} authData - A user auth data.
   * @returns {Promise}
   */
  authenticate (authData) {
    return new Promise((resolve, reject) => {
      console.info(`Authenticate: User has been logged in via the containing app`, authData)

      this.userEmail = authData.userEmail
      this.userId = authData.userId
      this.userName = authData.userName
      this.userNickname = authData.userNickname
      this.accessToken = authData.accessToken
      this.hasUserData = true
      this.isAuthenticated = true

      console.info(`Authenticator object is`, this)
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
        console.info(`Returning profile data`)
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
        console.info(`SA: Returning user data`)
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
      console.info(`Logout: User has been logged out via the containing app`)
      // Erase user data
      this.hasUserData = false
      this.isAuthenticated = false
      this.userEmail = null
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
