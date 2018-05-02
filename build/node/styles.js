const copyfiles = require('copyfiles')

let run = function (config) {
  'use strict'
  console.log(config.source)
  console.log(config.target)
  copyfiles([config.source,config.target],{up:true}, (e) => {console.log("Styles Copied")})
}

module.exports = {
  run: run
}
