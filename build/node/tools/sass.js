const sass = require('node-sass')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

let compileScss = function (options) {
  // write the result to file
  let destPath = path.dirname(options.cssFileName)

  // render the result
  sass.render({
    file: options.src,
    outputStyle: options.style,
    sourceMap: options.sourceMap,
    outFile: options.cssFileName
  }, (error, result) => {
    if (error) console.error(error)

    mkdirp(destPath, function (error) {
      if (error) console.error(error)

      fs.writeFile(options.cssFileName, result.css, (err) => {
        if (err) console.log(err)
        // log successful compilation to terminal
        console.log(' ' + options.cssFileName + ' has been written.')
      })

      fs.writeFile(options.cssMapFileName, result.map, (err) => {
        if (err) console.log(err)
        // log successful compilation to terminal
        console.log(' ' + options.cssMapFileName + ' has been written.')
      })
    })
  })
}

let build = function build () {
  // Build a minified version with a source map
  const sourceFileName = 'src/content/styles/style.scss'
  const destFileName = 'dist/styles/style.css'
  compileScss({
    src: sourceFileName,
    cssFileName: destFileName.replace(/\.css/, '.min.css'),
    cssMapFileName: destFileName.replace(/\.css/, '.min.css.map'),
    style: 'compressed',
    sourceMap: true
  })
}

module.exports = {
  run: build
}
