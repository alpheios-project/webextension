import IntlMessageFormat from 'intl-messageformat'

/**
 * Combines messages with the same locale code into a single message bundle.
 */
export default class MessageBundle {
  /**
   * Creates a message bundle (a list of messages) for a locale.
   * @param {String} messagesJSON - Messages for a locale in a JSON format.
   * @param {string} locale - A locale code for a message group. IETF language tag format is recommended.
   */
  constructor (messagesJSON, locale) {
    if (!locale) {
      throw new Error('Locale data is missing')
    }
    if (!messagesJSON) {
      throw new Error('Message data is missing')
    }

    this._locale = locale
    let messageObject = JSON.parse(messagesJSON)
    this.messages = new Map(Object.entries(messageObject))
    Array.from(this.messages.values()).forEach(message => { message.formatFunc = new IntlMessageFormat(message.message, this._locale) })
  }

  /**
   * Returns a (formatted) message for a message ID provided.
   * @param messageID - An ID of a message.
   * @param options - Options that can be used for message formatting in the following format:
   * {
   *     paramOneName: paramOneValue,
   *     paramTwoName: paramTwoValue
   * }.
   * @returns {string} A formatted message. If message not found, returns a message that contains an error text.
   */
  get (messageID, options = undefined) {
    if (this[messageID]) {
      return this[messageID].format(options)
    } else {
      // If message with the ID provided is not in translation data, generate a warning.
      return `Not in translation data: "${messageID}"`
    }
  }

  /**
   * Returns a locale of a current message bundle.
   * @return {string} A locale of this message bundle.
   */
  get locale () {
    return this._locale
  }
}
