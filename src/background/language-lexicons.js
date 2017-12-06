import { Constants } from 'alpheios-data-models'
import { AlpheiosLexAdapter } from 'alpheios-lexicon-client'
import Lexicon from './lexicon'

export default class LanguageLexicons {
  constructor (language) {
    this.language = language
    this.lexicons = []
    for (const [lexiconID, lexiconDescription] of LanguageLexicons.getLexiconsForLanguage(this.language).entries()) {
      this.lexicons.push(new Lexicon(lexiconID, lexiconDescription, this.language))
    }
  }

  async lookupFullDef (lemma) {
    if (!lemma) {
      throw new Error(`Lemma object must not be empty.`)
    }
    let requests = []
    let definitions = []
    for (const lexicon of this.lexicons) {
      requests.push(lexicon.lookupFullDef(lemma))
    }
    return Promise.all(requests).then(
      values => {
        for (const value of values) {
          definitions.push(value)
        }
        return definitions
      },
      error => {
        console.error(error)
        throw new Error(error)
      }
    )
  }

  static getLexiconsForLanguage (language) {
    const langCodeMap = new Map([
      [Constants.LANG_LATIN, Constants.STR_LANG_CODE_LAT],
      [Constants.LANG_GREEK, Constants.STR_LANG_CODE_GRC]
    ])
    return AlpheiosLexAdapter.getLexicons(langCodeMap.get(language))
  }
}
