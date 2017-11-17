import RemoteStorageAdapter from './adapter'

/**
 * This is a test implementation of a remote experience store adapter. It does not send anything anywhere
 * and just records experiences that are passed to it.
 */
export default class TestAdapter extends RemoteStorageAdapter {
  /**
   * Imitates storing of one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    return new Promise((resolve, reject) => {
      if (!experiences) {
        reject(new Error(`experience cannot be empty`))
        return
      }
      if (!Array.isArray(experiences)) {
        reject(new Error(`experiences must be an array`))
        return
      }
      console.log('Experience sent to a remote server:')
      for (let experience of experiences) {
        console.log(experience)
      }
      resolve()
    })
  }
}
