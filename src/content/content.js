import * as Content from './process'
import {Monitor as ExperienceMonitor} from 'experience'

// monitoredProcess = track(what, how)
let monitoredContentProcess = ExperienceMonitor.track(
  new Content.Process(),
  [
    {
      name: 'requestWordDataStatefully',
      wrapper: ExperienceMonitor.asyncNewExperienceWrapper,
      experience: 'Get word data'
    },
    {
      name: 'sendRequestToBgStatefully',
      wrapper: ExperienceMonitor.asyncOutgoingMessageWrapper,
      experience: 'Send word data request to a background script'
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
