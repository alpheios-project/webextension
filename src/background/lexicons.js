import { Constants } from 'alpheios-data-models'
import LanguageLexicon from './language-lexicons'

export default class Lexicons {
  constructor (languages) {
    if (languages) {
      if (Array.isArray(languages)) {
        this.languages = languages
      } else {
        // It's probably a single language code
        this.languages = [languages]
      }
    } else {
      // No language codes provided, shall use default values
      this.languages = Lexicons.supportedLanguages
    }

    for (const language of this.languages) {
      this[language] = new LanguageLexicon(language)
    }
  }

  static get supportedLanguages () {
    return [Constants.LANG_LATIN, Constants.LANG_GREEK]
  }
}
