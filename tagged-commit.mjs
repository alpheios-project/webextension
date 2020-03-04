import generateBuildNumber from './node_modules/alpheios-node-build/dist/support/build-number.mjs'
import { execFileSync, execSync } from 'child_process'

const build = generateBuildNumber()
console.info(`Starting a ${build} commit`)

// eslint-disable-next-line no-unused-vars
let output
console.info('Rebuilding a webextension. This may take a while')
try {
  output = execSync(`node --experimental-modules ./node_modules/alpheios-node-build/dist/build.mjs -m webpack -M production -p app -c config.mjs -b ${build} && node --experimental-modules ./node_modules/alpheios-node-build/dist/build.mjs -m all -M all -p vue -c config-content-safari.mjs -b ${build}`)
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
  output = execFileSync('git', ['commit', '-m', `"Build ${build}"`])
} catch (error) {
  console.log('Commit process failed:', error)
}

console.info(`Tagging with ${build}`)
try {
  output = execSync(`git tag ${build}"`)
} catch (error) {
  console.log('Tag process failed:', error)
}
console.info('Commit has been completed')
