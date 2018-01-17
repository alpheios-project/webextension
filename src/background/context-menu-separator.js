/* global browser */
export default class ContentMenuSeparator {
  constructor (id) {
    this.id = id
    this.type = 'separator'
    this.isActive = false
  }

  enable () {
    if (!this.isActive) {
      browser.contextMenus.create({
        id: this.id,
        type: this.type
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
