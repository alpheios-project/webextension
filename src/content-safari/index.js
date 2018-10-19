/* eslint-disable no-unused-vars */
/* global safari */
import ContentProcess from '@safari/content/content-process'
import ComponentStyles from 'alpheios-component-styles' // eslint-disable-line

document.addEventListener('DOMContentLoaded', (event) => {
  console.info('************DOMContentLoaded', event.currentTarget, event.currentTarget ? event.currentTarget.URL : null)
  let contentProcess = new ContentProcess()
  contentProcess.initialize()
})
