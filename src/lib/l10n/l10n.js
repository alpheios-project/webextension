import MessageBundle from './message-bundle'

/**
 * Combines several message bundles for different locales.
 */
export default class L10n {
  constructor () {
    this.locales = []
    this.bundles = new Map()
    this.messages = {}
    return this
  }

  addMessages (messageJSON, locale) {
    let messageBundle = new MessageBundle(messageJSON, locale)
    this.addMessageBundle(messageBundle)
    return this
  }

  /**
   * Adds one or several message bundles.
   * This function is chainable.
   * @param {MessageBundle} messageBundle - A message bundle that will be stored within an L10n object.
   * @return {L10n} - Returns self for chaining.
   */
  addMessageBundle (messageBundle) {
    this.locales.push(messageBundle.locale)
    this.bundles.set(messageBundle.locale, messageBundle)
    return this
  }

  setLocale (locale) {
    this.locale = locale
    const bundle = this.bundles.get(this.locale)
    this.messages = {}
    for (const [key, message] of bundle.messages.entries()) {
      if (message.params && Array.isArray(message.params) && message.params.length > 0) {
        // This message has parameters
        this.messages[key] = {
          format (options) {
            return message.formatFunc.format(options)
          },
          get (...options) {
            let params = {}
            // TODO: Add checks
            for (let [index, param] of message.params.entries()) {
              params[param] = options[index]
            }
            return message.formatFunc.format(params)
          }
        }
      } else {
        // A message without parameters
        Object.defineProperty(this.messages, key, {
          get () {
            console.log('Get accessed', arguments)
            return message.formatFunc.format()
          },
          enumerable: true
        })
      }
    }
    return this
  }
}
