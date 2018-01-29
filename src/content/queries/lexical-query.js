import { LanguageModelFactory as LMF, Lexeme, Lemma, Homonym } from 'alpheios-data-models'
import Query from './query.js'

export default class LexicalQuery extends Query {
  constructor (name, selector, options) {
    super(name)
    this.selector = selector
    this.ui = options.uiController
    this.maAdapter = options.maAdapter
    this.langData = options.langData
    this.lexicons = options.lexicons
    this.langOpts = options.langOpts
  }

  static create (selector, options) {
    return Query.create(LexicalQuery, selector, options)
  }

  async getData () {
    this.languageID = LMF.getLanguageIdFromCode(this.selector.languageCode)
    this.ui.clear().open().changeTab('definitions').message(`Please wait while data is retrieved ...`)
    this.ui.showStatusInfo(this.selector.normalizedText, this.languageID)
    let iterator = this.iterations()

    let result = iterator.next()
    while (true) {
      if (!this.active) { this.finalize() }
      if (Query.isPromise(result.value)) {
        try {
          let resolvedValue = await result.value
          result = iterator.next(resolvedValue)
        } catch (error) {
          iterator.return()
          this.finalize(error)
          break
        }
      } else {
        result = iterator.next(result.value)
      }
      if (result.done) { break }
    }
  }

  * iterations () {
    let formLexeme = new Lexeme(new Lemma(this.selector.normalizedText, this.selector.languageCode), [])
    this.homonym = yield this.maAdapter.getHomonym(this.selector.languageCode, this.selector.normalizedText)

    if (this.homonym) {
      if (this.langOpts[this.homonym.languageID] && this.langOpts[this.homonym.languageID].lookupForm &&
        this.homonym.lexemes.filter((l) => l.lemma.word === this.selector.normalizedText).length === 0) {
        this.homonym.lexemes.push(formLexeme)
      }
      this.ui.addMessage(`Morphological analyzer data is ready`)

    } else {
      this.ui.addImportantMessage("Morphological data not found. Definition queries pending.")
      this.homonym = new Homonym([formLexeme], this.selector.normalizedText)
    }
    this.ui.updateMorphology(this.homonym)
    this.ui.updateDefinitions(this.homonym)
    // Update status info with data from a morphological analyzer
    this.ui.showStatusInfo(this.homonym.targetWord, this.homonym.languageID)

    this.lexicalData = yield this.langData.getSuffixes(this.homonym)
    this.ui.addMessage(`Inflection data is ready`)
    this.ui.updateInflections(this.lexicalData, this.homonym)

    let definitionRequests = []
    for (let lexeme of this.homonym.lexemes) {
      // Short definition requests
      let requests = this.lexicons.fetchShortDefs(lexeme.lemma)
      definitionRequests = definitionRequests.concat(requests.map(request => {
        return {
          request: request,
          type: 'Short definition',
          lexeme: lexeme,
          appendFunction: 'appendShortDefs',
          complete: false
        }
      }))
      // Full definition requests
      requests = this.lexicons.fetchFullDefs(lexeme.lemma)
      definitionRequests = definitionRequests.concat(requests.map(request => {
        return {
          request: request,
          type: 'Full definition',
          lexeme: lexeme,
          appendFunction: 'appendFullDefs',
          complete: false
        }
      }))
    }

    // Handle definition responses
    for (let definitionRequest of definitionRequests) {
      definitionRequest.request.then(
        definition => {
          console.log(`${definitionRequest.type}(s) received:`, definition)
          definitionRequest.lexeme.meaning[definitionRequest.appendFunction](definition)
          definitionRequest.complete = true
          if (this.active) {
            this.ui.addMessage(`${definitionRequest.type} request is completed successfully. Lemma: "${definitionRequest.lexeme.lemma.word}"`)
            this.ui.updateDefinitions(this.homonym)
          }
          if (definitionRequests.every(request => request.complete)) {
            this.finalize('Success')
          }
        },
        error => {
          console.error(`${definitionRequest.type}(s) request failed: ${error}`)
          definitionRequest.complete = true
          if (this.active) {
            this.ui.addMessage(`${definitionRequest.type} request cannot be completed. Lemma: "${definitionRequest.lexeme.lemma.word}"`)
          }
          if (definitionRequests.every(request => request.complete)) {
            this.finalize(error)
          }
        }
      )
    }

    yield 'Retrieval of short and full definitions complete'
  }

  finalize (result) {
    if (this.active) {
      this.ui.addMessage(`All lexical queries complete.`)
      if (typeof result === 'object' && result instanceof Error) {
        console.error(`LexicalQuery failed: ${result.message}`)
      } else {
        console.log('LexicalQuery completed successfully')
      }
      // we might have previous requests which succeeded so go ahead and try
      // to show language info. It will catch empty data.
      this.ui.showLanguageInfo(this.homonym)
    }
    Query.destroy(this)
    return result
  }
}
