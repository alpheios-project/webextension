const fs = require('fs')
const { zip } = require('zip-a-folder')

let run = function (version, zipfile) {
  'use strict'
  let filename = 'dist/manifest.json'
  let manifest
  fs.readFile(filename, (e, d) => {
    manifest = JSON.parse(d)
    manifest.version = version
    fs.writeFile(filename, JSON.stringify(manifest, null, 2), function (err) {
      if (err) return console.log(err)
      zip('dist', zipfile)
        .then(() => {
          console.log(`Successfully created ${zipfile}`)
        })
        .catch((e) => {
          console.log(`Error creating ${zipfile}`, e)
        })
    })
  })
}

let version = process.argv[2]
if (!version) {
  console.error('You must supply a version to the zip task')
  process.exit(1)
}
run(version, 'alpheios.zip')
