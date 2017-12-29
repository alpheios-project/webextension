const path = require('path')
const webpack = require('./webpack')
const sass = require('./sass')
const imagemin = require('./imagemin')
let pathToProjectRoot = '../..'

// region Style tasks config
const styleTasks = [
  { source: 'src/content/styles/style.scss', target: 'dist/styles/style.css', style: 'compressed', sourceMap: true }
]
// endregion Style tasks config

// region Image tasks config
const imageTasks = [
  { source: 'src/content/images', target: 'dist/images', extensions: ['jpg', 'png', 'svg'] }
]
// endregion Image tasks config

// region Webpack tasks config
const webpackCommonConfig = {
  resolve: {
    alias: {
      // Below will force all imported modules with unresolved dependencies to use a single instance of that dependency
      'alpheios-data-models': path.resolve(__dirname, '../../node_modules/alpheios-data-models/dist/alpheios-data-models.js')
    },
    mainFields: ['moduleExternal', 'module', 'main']
  },
  devtool: 'source-map'
}

const webpackTasks = [
  Object.assign({
    context: path.resolve(__dirname, '../../src/background'),
    entry: './background.js',
    output: {
      path: path.resolve(__dirname, '../../dist'),
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
          include: path.resolve(__dirname, '../src/background'),
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
  }, webpackCommonConfig),
  Object.assign({
    context: path.resolve(__dirname, '../../src/content'),
    entry: './content.js',
    output: {
      path: path.resolve(__dirname, '../../dist'),
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
          test: /\.(jpg|png)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 25000
            }
          }]
        },
        {
          test: /\.(htmlf)$/,
          use: {
            loader: 'html-loader'
          }
        },
        {
          test: /\.scss$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }]
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
          include: path.resolve(__dirname, '../src/content'),
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
  }, webpackCommonConfig)
]
// endregion Webpack tasks config

let taskName
for (let [index, value] of process.argv.entries()) {
  if (index === 2) { taskName = value }
}

if (!taskName || taskName === 'all') {
  // Run all build tasks in a sequence
  imagemin.run(imageTasks, pathToProjectRoot)
  sass.run(styleTasks)
  webpack.run(webpackTasks)
} else if (taskName === 'images') {
  imagemin.run(imageTasks, pathToProjectRoot)
} else if (taskName === 'styles') {
  sass.run(styleTasks)
} else if (taskName === 'webpack') {
  webpack.run(webpackTasks)
}
