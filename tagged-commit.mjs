import generateBuildInfo from './node_modules/alpheios-node-build/dist/support/build-info.mjs'
import { execFileSync, execSync } from 'child_process'

const buildDT = Date.now()
const buildInfo = generateBuildInfo(buildDT)

// eslint-disable-next-line no-unused-vars
let output
try {
  if (buildInfo.branch !== 'master') {
    console.info('Installing alpheios-core')
    output = execSync(`npm install https://github.com/alpheios-project/alpheios-core#${buildInfo.branch}`)
  }
} catch (error) {
  console.error('Components install failed:', error)
  process.exit(1)
}

console.info(`Starting a ${buildInfo.name} commit`)

console.info('Rebuilding a webextension. This may take a while')
try {
  output = execSync(`node --experimental-modules ./node_modules/alpheios-node-build/dist/build.mjs -m webpack -M production -p app -c config.mjs -t ${buildDT} && node --experimental-modules ./node_modules/alpheios-node-build/dist/build.mjs -m all -M all -p vue -c config-content-safari.mjs -t ${buildDT} && npm run update-styles`)
} catch (error) {
  console.error('Build process failed:', error)
  process.exit(1)
}
console.info('Rebuilding of a webextension has been completed')

console.info('Committing distributables')
try {
  output = execFileSync('git', ['add', 'dist'])
} catch (error) {
  console.log('Cannot add files to git index:', error)
}
try {
  output = execFileSync('git', ['commit', '-m', `Build ${buildInfo.name}`])
} catch (error) {
  console.log('Commit process failed:', error)
}

console.info(`Tagging with ${buildInfo.name}`)
try {
  output = execSync(`git tag ${buildInfo.name}`)
} catch (error) {
  console.log('Tag process failed:', error)
}
console.info('Commit has been completed')
