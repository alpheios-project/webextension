import { Options } from 'alpheios-components'
import SiteOptions from '@/lib/settings/site-options.json'

export default class BaseContentProcess {
  constructor (TabScriptClass) {
    this.state = new TabScriptClass()
    this.state.status = TabScriptClass.statuses.script.PENDING
    this.state.panelStatus = TabScriptClass.statuses.panel.CLOSED

    this.siteOptions = this.loadSiteOptions()
  }

  /**
   * Load site-specific settings
   */
  loadSiteOptions () {
    let allSiteOptions = []
    for (let site of SiteOptions) {
      for (let domain of site.options) {
        let siteOpts = new Options(domain, this.storageAreaClass)
        allSiteOptions.push({ uriMatch: site.uriMatch, resourceOptions: siteOpts })
      }
    }
    return allSiteOptions
  }
}
