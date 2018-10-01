import ContentProcess from './content-process'
// import { Monitor as ExperienceMonitor } from 'alpheios-experience'
import ComponentStyles from '../../node_modules/alpheios-components/dist/style/style.min.css' // eslint-disable-line

// TODO: Might cause memory leaks on page reload
/* let contentProcess = ExperienceMonitor.track(
  new ContentProcess(),
  [
    {
      monitoredFunction: 'getWordDataStatefully',
      experience: 'Get word data',
      asyncWrapper: ExperienceMonitor.recordExperience
    }
  ]
) */

let contentProcess = new ContentProcess()
contentProcess.initialize()
