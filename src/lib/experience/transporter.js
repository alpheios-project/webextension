/**
 * Responsible form transporting experiences from one storage to the other. Current implementation
 * sends a batch of experience objects to the remote server once a certain amount of them
 * is accumulated in a local storage.
 */
export default class Transporter {
  /**
   * Sets a transporter configuration.
   * @param {LocalStorageAdapter} localStorage - Represents local storage where experience objects are
   * accumulated before being sent to a remote server.
   * @param {RemoteStorageAdapter} remoteStorage - Represents a remote server that stores experience objects.
   * @param {number} qtyThreshold - A minimal number of experiences to be sent to a remote storage.
   * @param {number} interval - Interval, in milliseconds, of checking a local storage for changes
   */
  constructor (localStorage, remoteStorage, qtyThreshold, interval) {
    this.localStorage = localStorage
    this.remoteStorage = remoteStorage
    this.qtyThreshold = qtyThreshold
    window.setInterval(this.checkExperienceStorage.bind(this), interval)
  }

  /**
   * Runs at a specified interval and check if any new experience objects has been recorded to the local storage.
   * If number of experience records exceeds a threshold, sends all experiences to the remote server and
   * removes them from local storage.
   * @return {Promise.<void>}
   */
  async checkExperienceStorage () {
    console.log(`Experience storage check`)
    let records = await this.localStorage.readAll()
    let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0)
    if (keys.length > this.qtyThreshold) {
      await this.sendExperiencesToRemote()
    }
  }

  /**
   * If there are any experiences in the local storage, sends all of them to a remote server and, if succeeded,
   * removes them from a local storage.
   * @return {Promise.<*>}
   */
  async sendExperiencesToRemote () {
    try {
      let records = await this.localStorage.readAll()
      let values = Object.values(records)
      let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0)
      if (keys.length > 0) {
        // If there are any records in a local storage
        await this.remoteStorage.write(values)
        await this.localStorage.remove(keys)
      } else {
        console.log(`No data in local experience storage`)
      }
    } catch (error) {
      console.error(`Cannot send experiences to a remote server: ${error}`)
      return error
    }
  }
}
