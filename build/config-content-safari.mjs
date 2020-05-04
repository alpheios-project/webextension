import VueLoaderPlugin from '../node_modules/vue-loader/lib/plugin.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import fs from 'fs'
const projectRoot = process.cwd()

/**
 * This plugin injects a version and a build name into Safari plist files.
 */
class plistPlugin {
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
      let safariAppExtPlistPath = path.join(projectRoot, 'src/safari-app-extension/AlpheiosReadingTools/Info.plist')
      let safariAppExtPlistContent
      try {
        safariAppExtPlistContent = fs.readFileSync(safariAppExtPlistPath, 'utf8')
      } catch (err) { console.error(`Cannot read ${safariAppExtPlistPath}: ${err.message}`); return }
      safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleShortVersionString<\/key>\s+<string>)(\.*)(<\/string>)/, `$1${pkg.version}$3`)
      safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleVersion<\/key>\s+<string>)(\.*)(<\/string>)/, `$1${this.buildInfo.name}$3`)
      try {
        fs.writeFileSync(safariAppExtPlistPath, safariAppExtPlistContent)
      } catch (err) { console.error(`Cannot write ${safariAppExtPlistPath}: ${err.message}`); return }

      safariAppExtPlistPath = path.join(projectRoot, 'src/safari-app-extension/AlpheiosSafari/Info.plist')
      try {
        safariAppExtPlistContent = fs.readFileSync(safariAppExtPlistPath, 'utf8')
      } catch (err) { console.error(`Cannot read ${safariAppExtPlistPath}: ${err.message}`); return }
      safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleShortVersionString<\/key>\s+<string>)(\.*)(<\/string>)/, `$1${pkg.version}$3`)
      safariAppExtPlistContent = safariAppExtPlistContent.replace(/(<key>CFBundleVersion<\/key>\s+<string>)(\.*)(<\/string>)/, `$1${this.buildInfo.name}$3`)
      try {
        fs.writeFileSync(safariAppExtPlistPath, safariAppExtPlistContent)
      } catch (err) { console.error(`Cannot write ${safariAppExtPlistPath}: ${err.message}`) }
    })
  }
}

const webpack = {
  custom: {
    // The plist plugin must run in both production and development modes
    common: {
      plugins: [
        plistPlugin
      ]
    }
  },
  common: {
    context: path.join(projectRoot, 'src/content'),
    entry: './content-safari.js',
    plugins: [
      new VueLoaderPlugin()
    ]
  },

  production: {
    mode: 'production',
    output: { filename: 'content-safari.js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.min.js'),
        '@': path.join(projectRoot, 'src'),
        '@safari': path.join(projectRoot, 'src/content-safari')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style/style-safari.css'
      })
    ]
  },

  development: {
    mode: 'development',
    devtool: false, // Disable source map as it will not be loaded into a containing app
    output: { filename: 'content-safari.js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.js'),
        '@': path.join(projectRoot, 'src'),
        '@safari': path.join(projectRoot, 'src/content-safari')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style/style-safari.css'
      })
    ]
  }
}

export { webpack }
