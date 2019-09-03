import Authenticator from '@/lib/auth/authenticator.js'
import Message from '@/lib/messaging/message/message.js'
import { PsEvent } from 'alpheios-data-models'

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
  constructor (messagingService) {
    super()
    console.info(`SafariAuthenticator has been created`)
    this._messagingService = messagingService
    this._messagingService.addHandler(Message.types.LOGIN_NTFY_MESSAGE, this.loginCB.bind(this))
    this._messagingService.addHandler(Message.types.LOGOUT_NTFY_MESSAGE, this.logoutCB.bind(this))

    // User data props
    this.isAuthenticated = false
    this.hasUserData = false
    this.email = null
    // A full name of the user
    this.userName = null
    // A user's nickname
    this.userNickname = null
    // A user ID
    this.userId = null

    this.accessToken = null

    // TODO: Need to determine the best way to store endpoints configuration in Safari
    this.endpoints = {
      wordlist : 'https://userapis.alpheios.net/v1/words',
      settings : 'https://settings.alpheios.net/v1/settings'
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
  * @typedef UserProfileData
  * @property {string} name - A full name of the user.
  * @property {string} nickname - A user's nickname.
  * @property {string} sub - A user ID.
  */
  /**
   * Retrieves user profile information from Auth0.
   * This function can be used by third-party libraries to retrieve user profile data.
   * One example of such use is a UserDataManager which is used by the word list controller.
   * @return {Promise<UserProfileData>|Promise<Error>} - Resolved with user profile data
   * in case of success or rejected with an error in case of failure.
   */
  getProfileData () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new UserProfileRequest(), BgAuthenticator.DEFAULT_MSG_TIMEOUT)
        .then(message => resolve(message.body), error => reject(error))
    })
  }

  /**
   * @typedef UserData
   * @property {string} userId - A user ID.
   * @property {string} accessToken - A user ID.
   * @property {object} endpoints - An object containing endpoints in
   * props such as `wordlist` and `settings`
   */
  /**
   * Retrieves user profile information from Auth0.
   * This function can be used by third-party libraries to retrieve user profile data.
   * One example of such use is a UserDataManager which is used by the word list controller.
   * @return {Promise<UserData>|Promise<Error>} - Resolved with user profile data
   * in case of success or rejected with an error in case of failure.
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      if (this.hasUserData) {
        // User data has been retrieved
        console.info(`Returning user data`)
        resolve({
          id: this.userId,
          accessToken: this.accessToken,
          endpoints: this.endpoints
        })
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
      reject('Not implemented')
    })
  }

  loginCB (message) {
    console.info(`User has been logged in via the containing app`, message.body)

    this.email = message.body.email
    this.userId = message.body.id
    this.userName = message.body.name
    this.userNickname = message.body.nickname
    this.accessToken = message.body.accessToken
    this.hasUserData = true
    this.isAuthenticated = true

    SafariAuthenticator.evt.LOGGED_IN.pub({
      id: this.userId,
      nickname: this.userNickname
    })
    console.info(`Log in event has been published`)
  }

  logoutCB (message) {
    console.info(`User has been logged out via the containing app`, message.body)
    // Erase user data
    this.hasUserData = false
    this.isAuthenticated = false
    this.email = null
    this.userId = null
    this.userName = null
    this.userNickname = null
    this.accessToken = null
    SafariAuthenticator.evt.LOGGED_OUT.pub()
  }
}

/**
 * This is a description of a SafariAuthenticator event interface.
 */
SafariAuthenticator.evt = {
  /**
   * Published when a user has been logged in via a third-party app.
   * Data: {
   *  {string} userId - A user ID.
      {string} userNickName - A user nick name
   * }
   */
  LOGGED_IN: new PsEvent('User has been logged in', SafariAuthenticator),

  /**
   * Published when a user has been logged out via a third-party app.
   * Data: an empty object.
   */
  LOGGED_OUT: new PsEvent(`User has been logged out`, SafariAuthenticator)
}
