/**
 * A base object class for an Experience object.
 */
export default class Experience {
  constructor (description) {
    this.description = description
    this.startTime = new Date().getTime()
    this.endTime = undefined
    this.details = []
  }

  static readObject (jsonObject) {
    let experience = new Experience(jsonObject.description)
    if (jsonObject.startTime) { experience.startTime = jsonObject.startTime }
    if (jsonObject.endTime) { experience.endTime = jsonObject.endTime }
    for (let detailsItem of jsonObject.details) {
      experience.details.push(Experience.readObject(detailsItem))
    }
    return experience
  }

  attach (experience) {
    this.details.push(experience)
  }

  complete () {
    this.endTime = new Date().getTime()
  }

  get duration () {
    return this.endTime - this.startTime
  }

  toString () {
    return `"${this.description}" experience duration is ${this.duration} ms`
  }
}
