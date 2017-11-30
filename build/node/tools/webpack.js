const path = require('path')
const webpack = require('webpack')

const webpackContentConfig = {
  context: path.resolve(__dirname, '../../../src/content'),
  entry: './content.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../../../dist'),
    filename: 'content.js'
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: 'raw-loader'
      },
      {
        test: /\.json$/,
        use: 'raw-loader'
      },
      {
        test: /\.htmlf$/,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap' ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader' // <style lang="scss">
          }
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../../src/content'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {modules: false}]
            ]
          }
        }]
      }
    ]
  }
}

const webpackBackgroundConfig = {
  context: path.resolve(__dirname, '../../../src/background'),
  entry: './background.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../../../dist'),
    filename: 'background.js'
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: 'raw-loader'
      },
      {
        test: /\.json$/,
        use: 'raw-loader'
      },
      {
        test: /\.htmlf$/,
        use: 'raw-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../../../src/background'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {modules: false}]
            ]
          }
        }]
      }]
  }
}

let build = function build () {
  webpack([
    webpackBackgroundConfig,
    webpackContentConfig
  ], (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    console.log('Webpack build complete')
    console.log(stats.toString({
      chunks: true,
      assets: true,
      hash: true,
      colors: true
    }))
  })
}

module.exports = {
  run: build
}
