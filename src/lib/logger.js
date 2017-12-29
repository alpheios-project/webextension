let log = console.log

export default class Logger {
  static log (...data) {
    log.apply(console, [Logger.timestamp].concat(data))
  }

  static get timestamp () {
    let now = new Date()
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
  }
}
