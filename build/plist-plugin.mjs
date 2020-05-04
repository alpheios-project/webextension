import path from 'path'
import fs from 'fs'

// Files to update, path should be relative to the project root
const plistFiles = [
  'src/safari-app-extension/AlpheiosReadingTools/Info.plist',
  'src/safari-app-extension/AlpheiosSafari/Info.plist'
]

/**
 * This plugin injects a version and a build name into Safari plist files.
 */
export default class PlistPlugin {
  /**
   *
   * @param {object} buildInfo - An object that contains the following build information:
   * @param {string} buildInfo.branch - A name of a git branch that a code being built belongs to.
   * @param {string} buildInfo.number - An string in the format of YYYYMMDDCCC, where
   *         YYYY is a year, MM is a month, DD is a day, and CCC is a build timestamp.
   * @param {string} buildInfo.name - A build name in the branch-name.YYYYMMDDCCC format.
   */
  constructor ({ buildInfo } = {}) {
    this.buildInfo = buildInfo
  }

  apply (compiler) {
    // The code below will run bu the `done` webpack hook
    compiler.hooks.done.tapPromise('PlistPlugin', async (stats) => {
      const projectRoot = process.cwd()
      const pkgPath = path.join(projectRoot, 'package.json')
      let pkg
      try {
        pkg = fs.readFileSync(pkgPath, 'utf8')
      } catch (err) { console.error(`Cannot read ${pkgPath}: ${err.message}`); return }
      pkg = JSON.parse(pkg)
      plistFiles.forEach(plistFile => {
        const safariAppExtPlistPath = path.join(projectRoot, plistFile)
        let safariAppExtPlistContent
        try {
          safariAppExtPlistContent = fs.readFileSync(safariAppExtPlistPath, 'utf8')
        } catch (err) { console.error(`Cannot read ${safariAppExtPlistPath}: ${err.message}`); return }
        safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleShortVersionString<\/key>\s+<string>)(.*)(<\/string>)/, `$1${pkg.version}$3`)
        safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleVersion<\/key>\s+<string>)(.*)(<\/string>)/, `$1${this.buildInfo.name}$3`)
        try {
          console.info(`Updating ${safariAppExtPlistPath}`)
          fs.writeFileSync(safariAppExtPlistPath, safariAppExtPlistContent)
        } catch (err) { console.error(`Cannot write ${safariAppExtPlistPath}: ${err.message}`) }
      })
    })
  }
}
