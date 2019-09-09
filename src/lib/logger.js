let log = console.log // eslint-disable-line prefer-const

export default class Logger {
  static log (...data) {
    log.apply(console, [Logger.timestamp].concat(data))
  }

  static get timestamp () {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
  }
}
