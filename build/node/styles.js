const copyfiles = require('copyfiles')

let run = function (config) {
  'use strict'
  copyfiles([config.source,config.target],{up:true}, (e) => {console.log("Styles Copied")})
}

module.exports = {
  run: run
}
