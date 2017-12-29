import ContentProcess from './content-process'
import {Monitor as ExperienceMonitor} from 'alpheios-experience'

let contentProcess = ExperienceMonitor.track(
  new ContentProcess(),
  [
    {
      monitoredFunction: 'getWordDataStatefully',
      experience: 'Get word data',
      asyncWrapper: ExperienceMonitor.recordExperience
    }
  ]
)

contentProcess.initialize()
