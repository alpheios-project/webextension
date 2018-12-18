import process from 'process'
import fs from 'fs'
import path from 'path'
let params = {
  clean: 'clean', // Clean target directory
  copy: 'copy', // Copy files to the target directory
  update: 'update', // Clean target directory and then copy files
  upload: 'upload' // Upload a file changed in a target directory to the source dir
}

let cleanFiles = (dirName, fileNames) => {
  let count = 0
  for (const file of fileNames) {
    fs.unlinkSync(path.join(dirName, file))
    count++
  }
  return count
}

let copyToDir = (sourceDir, targetDir, fileNames) => {
  let count = 0
  for (const file of fileNames) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file))
    count++
  }
  return count
}

if (process.argv.length > 2 && params.hasOwnProperty(process.argv[2])) {
  let cleaned = 0
  let copied = 0
  const projectRoot = process.cwd()
  const sourcePath = path.join(projectRoot, '../protected-config/auth0')
  const targetPath = path.join(projectRoot, 'dist')
  const fileNames = ['env.js']

  switch (process.argv[2]) {
    case params.clean:
      cleaned = cleanFiles(targetPath, fileNames)
      console.log(`Removed ${cleaned} files from ${targetPath}`)
      break
    case params.copy:
      copied = copyToDir(sourcePath, targetPath, fileNames)
      console.log(`Copied ${copied} files into ${targetPath}`)
      break
    case params.update:
      cleaned = cleanFiles(targetPath, fileNames)
      copied = copyToDir(sourcePath, targetPath, fileNames)
      console.log(`Copied ${copied} file(s) into ${targetPath}`)
      break
    case params.upload:
      cleaned = cleanFiles(sourcePath, fileNames)
      copied = copyToDir(targetPath, sourcePath, fileNames)
      console.log(`Uploaded ${copied} file(s) into ${targetPath}`)
      break
  }
} else {
  console.error(`Please run ${process.argv[1]} with one of the following parameters: ${Object.values(params)}`)
}
