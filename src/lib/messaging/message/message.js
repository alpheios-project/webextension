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
  /*
  A message that notifies abut the user login. It is used in a one-way
  communication as within a Safari App Extension
   */
  LOGIN_NTFY_MESSAGE: Symbol.for('Alpheios_LoginNotificationMessage'),
  LOGIN_MESSAGE: Symbol.for('Alpheios_LoginMessage'),
  /*
  A message that notifies abut the user logout. It is used in a one-way
  communication as within a Safari App Extension
   */
  LOGOUT_NTFY_MESSAGE: Symbol.for('Alpheios_LogoutNotificationMessage'),
  LOGOUT_MESSAGE: Symbol.for('Alpheios_LogoutMessage'),

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

  // User session: checks access token expiration
  USER_SESSION_REQUEST: Symbol.for('Alpheios_UserSessionRequest'),
  USER_SESSION_RESPONSE: Symbol.for('Alpheios_UserSessionResponse'),

  // User profile: retrieves user data from a user data storage provider (e.g. Alpheios)
  USER_DATA_REQUEST: Symbol.for('Alpheios_UserDataRequest'),
  USER_DATA_RESPONSE: Symbol.for('Alpheios_UserDataResponse'),

  // Logout: logs the user out
  LOGOUT_REQUEST: Symbol.for('Alpheios_LogoutRequest'),
  LOGOUT_RESPONSE: Symbol.for('Alpheios_LogoutResponse'),

  // Retrieves endpoints
  ENDPOINTS_REQUEST: Symbol.for('Alpheios_EndpointsRequest'),
  ENDPOINTS_RESPONSE: Symbol.for('Alpheios_EndpointsResponse'),

  ACTIVATION_REQUEST: Symbol.for('Alpheios_ActivateRequest'),
  DEACTIVATION_REQUEST: Symbol.for('Alpheios_DeactivateRequest'),
  OPEN_PANEL_REQUEST: Symbol.for('Alpheios_OpenPanelRequest'),
  PANEL_STATUS_CHANGE_REQUEST: Symbol.for('Alpheios_PanelStatusChangeRequest'),
  // Indicates that a content script if fully loaded and is ready to accept commands from a background script
  CONTENT_READY_MESSAGE: Symbol.for('Alpheios_ContentReadyMessage'),
  // Notifies background about the state of an embedded library
  EMBED_LIB_MESSAGE: Symbol.for('Alpheios_EmbedLibMessage')
}

/**
 * Specifies whether a message is a request or response
 */
Message.roles = {
  REQUEST: Symbol.for('Alpheios_Request'),
  RESPONSE: Symbol.for('Alpheios_Response')
}
