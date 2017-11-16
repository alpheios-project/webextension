import Experience from './experience'
import Storage from './local/storage'

export default class Monitor {
  constructor (monitoringDataList) {
    this.monitored = new Map()
    if (monitoringDataList) {
      for (let monitoringData of monitoringDataList) {
        this.monitored.set(monitoringData.name, monitoringData)
      }
    }
  }

  static track (object, monitoringDataList) {
    return new Proxy(object, new Monitor(monitoringDataList))
  }

  get (target, property, receiver) {
    if (this.monitored.has(property)) {
      let monitoringData = this.monitored.get(property)
      return monitoringData.wrapper.call(this,
        target, property, monitoringData)
    }
    return target[property]
  }

  monitor (functionName, functionConfig) {
    this.monitored.set(functionName, functionConfig)
  }

  static syncWrapper (target, property, experience) {
    console.log(`${property}() sync method has been called`)
    const origMethod = target[property]
    return function (...args) {
      let result = origMethod.apply(this, args)
      console.log(`${property}() sync method has been completed`)
      experience.complete()
      console.log(`${experience}`)
      return result
    }
  }

  /**
   * A wrapper around asynchronous functions that create new experience. A wrapped function is called
   * as a direct result of a user action: use of UI controls, etc.
   * @param target
   * @param property
   * @param monitoringData
   * @return {Function}
   */
  static asyncNewExperienceWrapper (target, property, monitoringData) {
    console.log(`${property}() async method has been requested`)
    const origMethod = target[property]
    return async function (...args) {
      try {
        let experience = new Experience(monitoringData.experience)
        console.log(`${property}() async method has been called`)
        // Last item in arguments list is a transaction
        args.push(experience)
        let resultObject = await origMethod.apply(this, args)
        // resultObject.value is a returned message, experience object is in a `experience` property
        experience = Experience.readObject(resultObject.value.experience)
        experience.complete()
        console.log(`${property}() completed with success, experience is:`, experience)

        Storage.write(experience)
        return resultObject
      } catch (error) {
        console.error(`${property}() completed with an error: ${error.value}`)
        return error
      }
    }
  }

  /**
   * A wrapper around functions that are indirect result of user actions. Those functions are usually a part of
   * functions that create user experience.
   * @param target
   * @param property
   * @param monitoringData
   * @return {Function}
   */
  static asyncWrapper (target, property, monitoringData) {
    console.log(`${property}() async method has been requested`)
    const originalMethod = target[property]
    return async function (...args) {
      try {
        let experience = new Experience(monitoringData.experience)
        console.log(`${property}() async method has been called`)
        let resultObject = await originalMethod.apply(this, args)
        experience.complete()
        resultObject.state.attach(experience)
        console.log(`${property}() completed with success, experience is: ${experience}`)
        return resultObject
      } catch (error) {
        console.error(`${property}() completed with an error: ${error.value}`)
        return error
      }
    }
  }

  /**
   * This is a wrapper around functions that handle incoming messages with an experience object attached.
   * @param target
   * @param property
   * @param monitoringData
   * @return {Function}
   */
  static asyncIncomingMessageWrapper (target, property, monitoringData) {
    console.log(`${property}() async method has been requested`)
    const origMethod = target[property]
    return async function (...args) {
      try {
        let experience = new Experience(monitoringData.experience)
        console.log(`${property}() async method has been called`)
        // First argument is an incoming request object
        args.push(Experience.readObject(args[0].experience))
        let result = await origMethod.apply(this, args)
        console.log(`${property}() completed with success`)
        experience.complete()
        console.log(`${experience}`)
        return result
      } catch (error) {
        console.error(`${property}() completed with an error: ${error.value}`)
        return error
      }
    }
  }

  /**
   * This is a wrapper around functions that handle outgoing messages that should have an experience object attached
   * to them.
   * @param target
   * @param property
   * @param monitoringData
   * @return {Function}
   */
  static asyncOutgoingMessageWrapper (target, property, monitoringData) {
    console.log(`${property}() async method has been requested`)
    const origMethod = target[property]
    return async function (...args) {
      try {
        let experience = new Experience(monitoringData.experience)
        console.log(`${property}() async method has been called`)
        // First argument is always a request object, last argument is a state (Experience) object
        args[0].experience = args[args.length - 1]
        let result = await origMethod.apply(this, args)
        console.log(`${property}() completed with success`)
        experience.complete()
        console.log(`${experience}`)
        return result
      } catch (error) {
        console.error(`${property}() completed with an error: ${error.value}`)
        return error
      }
    }
  }
}
