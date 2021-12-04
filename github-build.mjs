import Builder from 'alpheios-node-build'
import generateBuildInfo from './node_modules/alpheios-node-build/dist/support/build-info.mjs'
import { execFileSync, execSync } from 'child_process'
import * as core from '@actions/core'


(async function () {
  const buildDT = Date.now()
  const buildInfo = generateBuildInfo(buildDT)

  // eslint-disable-next-line no-unused-vars
  let output

  try {
    if (buildInfo.branch === 'qa' || buildInfo.branch === 'production') {
      console.info('Installing alpheios-core')
      output = execSync(`npm install https://github.com/alpheios-project/alpheios-core#${buildInfo.branch}`)
    }
  } catch (error) {
    console.error('Components install failed:', error)
    process.exit(1)
  }

  console.info('Rebuilding a webextension. This may take a while')
  try {
    let builder = new Builder({
      module: 'webpack',
      mode: 'production',
      preset: 'app',
      codeAnalysis: false,
      outputLevel: Builder.outputLevels.MIN,
      buildTime: buildDT
    })
    await builder.importConfig('config.mjs', 'build')
    await builder.runModules()

    builder = new Builder({
      module: 'all',
      mode: 'all',
      preset: 'vue',
      codeAnalysis: false,
      outputLevel: Builder.outputLevels.MIN,
      buildTime: buildDT
    })
    await builder.importConfig('config-content-safari.mjs', 'build')
    await builder.runModules()

    output = execSync('npm run update-styles')
  } catch (error) {
    console.error('Build process failed:', error)
    process.exit(1)
  }
  console.info('Rebuilding of a webextension has been completed')

  try {
    let buildName = buildInfo.name.replace(' ', '_')
    console.info('buildInfo - ', buildName)
    console.info(core)
    core.default.setOutput('buildName', buildName)
  } catch (error) {
    console.error('Failed to set output variable:', error)
    process.exit(1)
  }
})()
