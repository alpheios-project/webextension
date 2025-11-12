/* global browser */
export default class ContentMenuItem {
  constructor (id, title, actionFunc) {
    this.id = id
    this.title = title
    this.actionFunc = actionFunc
    this.isActive = false
  }

  enable () {
    if (!this.isActive) {
      const creation = browser.contextMenus.create({
        id: this.id,
        title: this.title
      })
      if (creation && typeof creation.catch === 'function') {
        creation.catch(error => {
          const isDuplicateError = error && error.message && error.message.includes('duplicate')
          if (!isDuplicateError) {
            console.error(`Unable to create context menu item "${this.id}": ${error && error.message ? error.message : error}`)
          }
        })
      }
      this.isActive = true
    }
  }

  disable () {
    if (this.isActive) {
      browser.contextMenus.remove(this.id)
      this.isActive = false
    }
  }
}
