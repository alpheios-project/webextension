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
      browser.contextMenus.create({
        id: this.id,
        title: this.title.get()
      })
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
