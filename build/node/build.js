const webpack = require('./webpack')
const sass = require('./sass')
const imagemin = require('./imagemin')
const config = require('./config')
const zip = require('./zip')

const webpackTasks = config.webpack.tasks.map(task => Object.assign(task, config.webpack.common))

let taskName,extra
for (let [index, value] of process.argv.entries()) {
  if (index === 2) { taskName = value }
  if (index === 3) { extra = value }
}

if (!taskName || taskName === 'all') {
  // Run all build tasks in a sequence
  imagemin.run(config.image, config.pathToProjectRoot)
  sass.run(config.style)
  webpack.run(webpackTasks)
} else if (taskName === 'images') {
  imagemin.run(config.image, config.pathToProjectRoot)
} else if (taskName === 'styles') {
  sass.run(config.style)
} else if (taskName === 'webpack') {
  webpack.run(webpackTasks)
} else if (taskName === 'chrome') {
  zip.run(extra,config.zip.chrome_filename)
} else if (taskName === 'firefox') {
  zip.run(extra,config.zip.ff_filename)
}
