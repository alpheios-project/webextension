import uuidv4 from 'uuid/v4'

let queries = new Map()

export default class ResourceQuery {
  constructor (feature, options) {
    this.ID = uuidv4()
    this.feature = feature
    this.ui = options.uiController
    this.grammars = options.grammars
    this.active = true
  }

  static create (feature, options) {
    queries.forEach(query => query.deactivate())
    queries.clear() // Clean up all previous requests of that type
    let query = new ResourceQuery(feature, options)
    queries.set(query.ID, query)
    console.log('ResourceQuery has been created')
    return query
  }

  static destroy (query) {
    console.log('Destroy ResourceQuery executed')
    queries.delete(query.ID)
  }

  deactivate () {
    this.active = false
  }

  async getData () {
    this.ui.message(`Retrieving requested resource ...`)
    let iterator = this.iterations()

    let result = iterator.next()
    while (true) {
      if (!this.active) { this.finalize() }
      if (ResourceQuery.isPromise(result.value)) {
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
    this.grammarResources = yield this.grammars.fetchResources(this.feature)
    yield 'Retrieval of grammar info complete'
    let grammarRequests = []
    grammarRequests = grammarRequests.concat(this.grammarResources.map(res => {
      return {
        res: res,
        complete: false
      }
    }
    ))
    for (let q of grammarRequests) {
      q.res.then(
        url => {
          q.complete = true
          if (this.active) {
            this.ui.addMessage(`Grammar resource retrieved`)
            this.ui.updateGrammar(url)
          }
          if (grammarRequests.every(request => request.complete)) {
            if (this.active) { this.ui.addMessage(`All grammar resource data retrieved`) }
            this.finalize()
          }
        },
        error => {
          console.log('Error retrieving Grammar resource', error)
          if (grammarRequests.every(request => request.complete)) {
            if (this.active) { this.ui.addMessage(`All resource data retrieved`) }
            this.finalize()
          }
        }
      )
    }
    yield 'Retrieval of resources complete'
  }

  finalize (result) {
    console.log('Finalize ResourceQuery called')
    // Record experience in a wrapper
    ResourceQuery.destroy(this)
    return result
  }
}
