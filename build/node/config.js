const path = require('path')

module.exports = {
  pathToProjectRoot: '../..',
  style: [
    { source: 'src/content/styles/style.scss', target: 'dist/styles/style.css', style: 'compressed', sourceMap: true }
  ],
  image: [
    { source: 'src/content/images', target: 'dist/images', extensions: ['jpg', 'png', 'svg'], excludedDirs: ['inline-icons'] }
  ],
  webpack: {
    common: {
      resolve: {
        alias: {
          // Below will force all imported modules with unresolved dependencies to use a single instance of that dependency
          'alpheios-data-models': path.resolve(__dirname, '../../node_modules/alpheios-data-models/dist/alpheios-data-models.js')
        },
        mainFields: ['moduleExternal', 'module', 'main']
      },
      devtool: 'source-map'
    },
    tasks: [
      {
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
      },
      {
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
              test: /\.svg$/,
              loader: 'vue-svg-loader',
              options: {
                // optional [svgo](https://github.com/svg/svgo) options
                svgo: {
                  plugins: [
                    {removeDoctype: true},
                    {removeComments: true},
                    {removeDimensions: true},
                    {removeUselessStrokeAndFill: false}
                  ]
                }
              }
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
      }
    ]
  },
  zip: {
      ff_filename: 'alpheios.xpi',
      chrome_filename: 'alpheios.zip'
  }
}
