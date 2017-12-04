const path = require('path')
const klaw = require('klaw')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminOptipng = require('imagemin-optipng')
const imageminSvgo = require('imagemin-svgo')

let optimize = function () {
  'use strict'
  const sourcePath = './src/content/images/'
  const fileFilter = '/*.{jpg,png,svg}'
  const targetPath = './dist/images/'

  klaw(sourcePath)
    .on('readable', function () {
      let fsItem
      while ((fsItem = this.read())) {
        if (fsItem.stats.isDirectory()) {
          let subPath = path.relative(sourcePath, fsItem.path)
          imagemin([fsItem.path + fileFilter], path.join(targetPath, subPath), {
            plugins: [
              imageminJpegtran(),
              imageminOptipng(),
              imageminSvgo()
            ]
          }).then(files => {
            console.log(files.map(file => file.path))
          })
        }
      }
    })
    .on('end', function () {
      console.log(`Finished a directory scan`)
    })
}

module.exports = {
  run: optimize
}
