import { AlpheiosLexAdapter } from 'alpheios-lexicon-client'

export default class Lexicon {
  constructor (ID, description, language) {
    this.ID = ID
    this.description = description
    this.language = language
    this.adapter = new AlpheiosLexAdapter(this.ID)
  }

  async lookupShortDef (lemma) {
    if (!lemma) {
      throw new Error(`Lemma object must not be empty.`)
    }
    return this.adapter.lookupShortDef(lemma)
  }

  async lookupFullDef (lemma) {
    if (!lemma) {
      throw new Error(`Lemma object must not be empty.`)
    }
    return this.adapter.lookupFullDef(lemma)
  }
}
