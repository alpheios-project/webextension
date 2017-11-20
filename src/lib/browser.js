export default class Browser {
  constructor () {
    this.browserNamespace = undefined
  }

  inspect () {
    this.browserNamespace = !(typeof browser === 'undefined')
    return this
  }

  getFeatures () {
    return {
      browserNamespace: this.browserNamespace
    }
  }

  supportsBrowserNamespace () {
    if (!this.browserNamespace) { this.inspect() }
    return this.browserNamespace
  }
}
