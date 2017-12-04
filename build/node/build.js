const webpackBuild = require('./tools/webpack')
const scssBuild = require('./tools/sass')
const imagemin = require('./tools/imagemin')

imagemin.run()
scssBuild.run()
webpackBuild.run()
