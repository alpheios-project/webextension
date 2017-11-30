const webpackBuild = require('./tools/webpack')
const scssBuild = require('./tools/sass')

scssBuild.run()
webpackBuild.run()
