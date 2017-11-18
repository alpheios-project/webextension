import * as Content from './process'
import {Monitor as ExperienceMonitor} from 'alpheios-experience'

let monitoredContentProcess = ExperienceMonitor.track(
  new Content.Process(),
  [
    {
      monitoredFunction: 'requestWordDataStatefully',
      experience: 'Get word data',
      asyncWrapper: ExperienceMonitor.recordExperience
    },
    {
      monitoredFunction: 'sendRequestToBgStatefully',
      experience: 'Send word data request to a background script',
      asyncWrapper: ExperienceMonitor.attachToMessage
    }
  ]
  )

// load options, then render
monitoredContentProcess.loadData().then(
  () => {
    console.log('Activated')
    monitoredContentProcess.status = Content.Process.statuses.ACTIVE
    monitoredContentProcess.render()
  },
  (error) => {
    console.error(`Cannot load content process data because of the following error: ${error}`)
  }
)
