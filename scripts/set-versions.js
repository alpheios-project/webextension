import process from 'process'
import fs from 'fs-extra'
import path from 'path'

const packageFileName = 'package.json'
const manifestFileName = 'manifest.json'
const manifestDir = 'dist'
const projectRoot = process.cwd()
const manifestPath = path.join(projectRoot, manifestDir, manifestFileName)

const getPackageInfo = () => {
  const packagePath = path.join(projectRoot, packageFileName)
  const packageObj = fs.readJsonSync(packagePath)
  return {
    version: packageObj.version,
    build: packageObj.build
  }
}

const getManifest = () => fs.readJsonSync(manifestPath)

const writeManifest = (manifestObj) => fs.writeJsonSync(manifestPath, manifestObj, {
  spaces: 2
})

const main = () => {
  const packageInfo = getPackageInfo()
  console.log(`Version is ${packageInfo.version}, build is ${packageInfo.build}`)
  let manifestObject = getManifest() // eslint-disable-line prefer-const
  manifestObject.version = `${packageInfo.version}.${packageInfo.build}`
  writeManifest(manifestObject)
}

main()
