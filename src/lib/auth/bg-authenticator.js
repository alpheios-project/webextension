import LoginRequest from '@/lib/messaging/request/login-request.js'
import UserInfoRequest from '@/lib/messaging/request/user-info-request.js'

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

  authenticate () {
    console.log('Authenticate called')
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new LoginRequest(), BgAuthenticator.AUTH_TIMEOUT).then(
        message => {
          if (message.body.result) {
            resolve()
          } else {
            reject(new Error(`Authentication failed`))
          }
        },
        error => {
          console.error(`Login request failed: ${error.message}`)
          reject(new Error(`Authentication failed`))
        }
      )
    })
  }

  getUserInfo () {
    console.log(`Get user info`)
    return new Promise((resolve, reject) => {
      this.messagingService.sendRequestToBg(new UserInfoRequest(), BgAuthenticator.DEFAULT_MSG_TIMEOUT).then(
        message => {
          resolve(message.body)
        },
        error => {
          console.error(`User info request failed: ${error.message}`)
          reject(new Error(`User info request failed: ${error.message}`))
        }
      )
    })
  }
}
// Defaults
BgAuthenticator.DEFAULT_MSG_TIMEOUT = 10000
// During authentication we should provide enough time for the user to enter his or her credentials
BgAuthenticator.AUTH_TIMEOUT = 600000
