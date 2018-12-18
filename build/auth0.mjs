import process from 'process'
import fs from 'fs'
import path from 'path'
let params = {
  clean: 'clean', // Clean target directory
  copy: 'copy', // Copy files to the target directory
  update: 'update' // Clean target directory and then copy files
}

let cleanDir = (dirName) => {
  let count = 0
  const files = fs.readdirSync(dirName)
  for (const file of files) {
    fs.unlinkSync(path.join(dirName, file))
    count++
  }
  return count
}

let copyToTarget = (sourceDir, targetDir) => {
  let count = 0
  const files = fs.readdirSync(sourceDir)
  for (const file of files) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file))
    count++
  }
  return count
}

if (process.argv.length > 2 && params.hasOwnProperty(process.argv[2])) {
  let cleaned = 0
  let copied = 0
  const projectRoot = process.cwd()
  const sourcePath = path.join(projectRoot, '../auth0-chrome/dist')
  const targetPath = path.join(projectRoot, 'dist/support/auth0')

  switch (process.argv[2]) {
    case params.clean:
      cleaned = cleanDir(targetPath)
      console.log(`Removed ${cleaned} files from ${targetPath}`)
      break
    case params.copy:
      copied = copyToTarget(sourcePath, targetPath)
      console.log(`Copied ${copied} files into ${targetPath}`)
      break
    case params.update:
      cleaned = cleanDir(targetPath)
      copied = copyToTarget(sourcePath, targetPath)
      console.log(`Removed ${cleaned} and copied ${copied} files into ${targetPath}`)
      break
  }
} else {
  console.error(`Please run ${process.argv[1]} with one of the following parameters: ${Object.values(params)}`)
}
