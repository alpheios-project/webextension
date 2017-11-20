import ContentProcess from './content-process'
import {Monitor as ExperienceMonitor} from 'alpheios-experience'

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
      () => { console.log(`Content process has been initialized successfully`) },
      (error) => { console.log(`Content process has not been initialized due to the following error: ${error}`) }
    )
  },
  (error) => {
    console.error(`Cannot load content process data because of the following error: ${error}`)
  }
)
