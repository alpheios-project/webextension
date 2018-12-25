import uuidv4 from 'uuid/v4'

export default class Message {
  constructor (body) {
    /** @member {Symbol} requestType - */
    this.role = undefined
    this.type = Message.types.GENERIC_MESSAGE
    this.ID = uuidv4()
    this.body = body
  }
}

/**
 * Specifies a message type
 */
Message.types = {
  // Messages: a one way communication vehicles
  GENERIC_MESSAGE: Symbol.for('Alpheios_GenericMessage'),
  STATE_MESSAGE: Symbol.for('Alpheios_StateMessage'),

  // Requests; a two way communication vehicles
  // State: updates state of a UIStateAPI object
  STATE_REQUEST: Symbol.for('Alpheios_StateRequest'),
  STATE_RESPONSE: Symbol.for('Alpheios_StateResponse'),

  // Login: logs the user in
  LOGIN_REQUEST: Symbol.for('Alpheios_LoginRequest'),
  LOGIN_RESPONSE: Symbol.for('Alpheios_LoginResponse'),

  // User profile: retrieves user profile information from an identity or authentication provider
  USER_PROFILE_REQUEST: Symbol.for('Alpheios_UserProfileRequest'),
  USER_PROFILE_RESPONSE: Symbol.for('Alpheios_UserProfileResponse'),

  // User profile: retrieves user data from a user data storage provider (e.g. Alpheios)
  USER_DATA_REQUEST: Symbol.for('Alpheios_UserDataRequest'),
  USER_DATA_RESPONSE: Symbol.for('Alpheios_UserDataResponse')
}

/**
 * Specifies whether a message is a request or response
 */
Message.roles = {
  REQUEST: Symbol.for('Alpheios_Request'),
  RESPONSE: Symbol.for('Alpheios_Response')
}
