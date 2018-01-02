import uuidv4 from 'uuid/v4'

let queries = new Map()

export default class LexicalQuery {
  constructor (selector, options) {
    this.ID = uuidv4()
    this.selector = selector
    this.ui = options.uiController
    this.maAdapter = options.maAdapter
    this.langData = options.langData
    this.lexicons = options.lexicons
    this.active = true
  }

  static create (selector, options) {
    queries.forEach(query => query.deactivate())
    queries.clear() // Clean up all previous requests of that type
    let query = new LexicalQuery(selector, options)
    queries.set(query.ID, query)
    console.log('Query had been created')
    return query
  }

  static destroy (query) {
    console.log('Destroy query executed')
    queries.delete(query.ID)
  }

  deactivate () {
    this.active = false
  }

  async getData () {
    this.ui.clear().open().message(`Please wait while data is retrieved ...`)
    let iterator = this.iterations()

    let result = iterator.next()
    while (true) {
      if (!this.active) { this.finalize() }
      if (LexicalQuery.isPromise(result.value)) {
        try {
          let resolvedValue = await result.value
          result = iterator.next(resolvedValue)
        } catch (error) {
          console.error(error)
          iterator.return()
          break
        }
      } else {
        result = iterator.next(result.value)
      }
      if (result.done) { break }
    }
  }

  static isPromise (obj) {
    return Boolean(obj) && typeof obj.then === 'function'
  }

  * iterations () {
    this.homonym = yield this.maAdapter.getHomonym(this.selector.languageCode, this.selector.normalizedText)

    this.ui.addMessage(`Morphological analyzer data is ready`)
    this.ui.updateMorphology(this.homonym)
    this.ui.updateDefinitions(this.homonym)

    this.lexicalData = yield this.langData.getSuffixes(this.homonym)
    this.ui.addMessage(`Inflection data is ready`)
    this.ui.updateInflections(this.lexicalData)

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
            if (this.active) { this.ui.addMessage(`All lexical data is available now`) }
            this.finalize()
          }
        },
        error => {
          console.error(`${definitionRequest.type}(s) request failed: ${error}`)
          definitionRequest.complete = true
          if (this.active) {
            this.ui.addMessage(`${definitionRequest.type} request cannot be completed. Lemma: "${definitionRequest.lexeme.lemma.word}"`)
          }
          if (definitionRequests.every(request => request.complete)) {
            if (this.active) { this.ui.addMessage(`All lexical data is available now`) }
            this.finalize()
          }
        }
      )
    }

    yield 'Retrieval of short and full definitions complete'
  }

  finalize (result) {
    console.log('Finalize query called')
    // Record experience in a wrapper
    LexicalQuery.destroy(this)
    return result
  }
}
