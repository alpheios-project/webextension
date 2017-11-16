import uuidv4 from 'uuid/v4'

export default class Message {
  constructor (body) {
    /** @member {Symbol} requestType - */
    this.role = undefined
    this.type = Message.types.GENERIC_MESSAGE
    this.ID = uuidv4()
    this.body = body
  }

  static get types () {
    return {
      GENERIC_MESSAGE: Symbol.for('Alpheios_GenericMessage'),
      WORD_DATA_REQUEST: Symbol.for('Alpheios_WordDataRequest'),
      WORD_DATA_RESPONSE: Symbol.for('Alpheios_WordDataResponse'),
      STATUS_REQUEST: Symbol.for('Alpheios_StatusRequest'),
      STATUS_RESPONSE: Symbol.for('Alpheios_StatusResponse'),
      ACTIVATION_REQUEST: Symbol.for('Alpheios_ActivateRequest'),
      DEACTIVATION_REQUEST: Symbol.for('Alpheios_DeactivateRequest')
    }
  }

  static get roles () {
    return {
      REQUEST: Symbol.for('Alpheios_Request'),
      RESPONSE: Symbol.for('Alpheios_Response')
    }
  }

  static get statuses () {
    return {
      DATA_FOUND: Symbol.for('Alpheios_DataFound'), // Requested word's data has been found
      NO_DATA_FOUND: Symbol.for('Alpheios_NoDataFound'), // Requested word's data has not been found,
      ACTIVE: Symbol.for('Alpheios_Active'), // Content script is loaded and active
      DEACTIVATED: Symbol.for('Alpheios_Deactivated') // Content script has been loaded, but is deactivated
    }
  }

  static statusSym (message) {
    return Symbol.for(message.status)
  }

  static statusSymIs (message, status) {
    return Message.statusSym(message) === status
  }
}
