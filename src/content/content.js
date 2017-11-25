import ContentProcess from './content-process'
import {Monitor as ExperienceMonitor} from 'alpheios-experience'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import VueApp from './app.vue'
import VueJsModal from 'vue-js-modal'

let contentProcess = ExperienceMonitor.track(
  new ContentProcess(),
  [
    {
      monitoredFunction: 'getWordDataStatefully',
      experience: 'Get word data',
      asyncWrapper: ExperienceMonitor.recordExperience
    },
    {
      monitoredFunction: 'sendRequestToBgStatefully',
      asyncWrapper: ExperienceMonitor.attachToMessage
    }
  ]
)

// load options, then render
contentProcess.loadData().then(
  () => {
    console.log('Activated')
    contentProcess.status = ContentProcess.statuses.ACTIVE
    contentProcess.initialize().then(
      () => {
        console.log(`Content process has been initialized successfully`)

        Vue.use(VueJsModal, {
          dialog: true
        })

        let vue = new Vue({
          el: '#app',
          template: '<App/>',
          components: { App: VueApp },
          mounted: function () {
            console.log('mounted')
          }
        })
      },
      (error) => { console.log(`Content process has not been initialized due to the following error: ${error}`) }
    )
  },
  (error) => {
    console.error(`Cannot load content process data because of the following error: ${error}`)
  }
)
