import LoginRequest from '@/lib/messaging/request/login-request.js'
import LogoutRequest from '@/lib/messaging/request/logout-request.js'
import UserProfileRequest from '@/lib/messaging/request/user-profile-request.js'
import UserDataRequest from '@/lib/messaging/request/user-data-request.js'
import UserSessionRequest from '@/lib/messaging/request/user-session-request.js'
import EndpointsRequest from '@/lib/messaging/request/endpoints-request.js'

/**
 * An authentication object that sends messages to the background script.
 */
export default class BgAuthenticator {
  /**
   * @constructor
   * @param {MessagingService} messagingService - An instance of messaging service to communicate with the background.
   */
  constructor (messagingService) {
    this.messagingService = messagingService
  }

  /**
   * a link for login external to the alpheios components
   * @return null for client side login
   */
  loginUrl () {
    return null
  }

  /**
   * a link for logout external to the alpheios components
   * @return null for client side login
   */
  logoutUrl () {
    return null
  }

  getEndPoints () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new EndpointsRequest(), BgAuthenticator.AUTH_TIMEOUT)
        .then(message => {
          resolve(message.body)
        }, error => reject(error))
    })
  }

  /**
   * check access token expiration
   */
  session () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new UserSessionRequest(), BgAuthenticator.AUTH_TIMEOUT)
        .then(message => {
          resolve(message.body)
        }, error => reject(error))
    })
  }

  /**
   * Authenticates user with an Auth0.
   * @return {Promise}
   */
  authenticate () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new LoginRequest(), BgAuthenticator.AUTH_TIMEOUT)
        .then(message => {
          resolve(message.body)
        }, error => reject(error))
    })
  }

  /**
   * Retrieves user profile information from Auth0.
   * @return {Promise}
   */
  getProfileData () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new UserProfileRequest(), BgAuthenticator.DEFAULT_MSG_TIMEOUT)
        .then(message => resolve(message.body), error => reject(error))
    })
  }

  /**
   * Retrieves user data from a remote provider (e.g. Alpheios servers).
   * @return {Promise}
   */
  getUserData () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new UserDataRequest(), BgAuthenticator.DEFAULT_MSG_TIMEOUT)
        .then(message => resolve(message.body), error => reject(error))
    })
  }

  /**
   * Logs the user out
   */
  logout () {
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new LogoutRequest(), BgAuthenticator.DEFAULT_MSG_TIMEOUT)
        .then(message => resolve(message.body), error => {
          console.log(`Logout error:`, error)
          resolve()
        })
    })
  }
}
// Defaults
BgAuthenticator.DEFAULT_MSG_TIMEOUT = 10000
// During authentication we should provide enough time for the user to enter his or her credentials
BgAuthenticator.AUTH_TIMEOUT = 600000
