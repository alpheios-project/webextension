const path = require('path')
let projectRoot = process.cwd()

module.exports = {
  pathToProjectRoot: '../..',
  styles: { source: 'node_modules/alpheios-components/dist/style/*', target: 'dist/styles' },
  webpack: {
    common: {
      resolve: {
        mainFields: ['moduleExternal', 'module', 'main']
      }
    },
    tasks: [
      {
        mode: 'development',
        devtool: 'source-map',
        context: path.resolve(__dirname, '../../src/background'),
        entry: './background.js',
        output: {
          path: path.resolve(__dirname, '../../dist'),
          filename: 'background.js'
        },
        resolve: {
          alias: {
            'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
            'alpheios-experience': path.join(projectRoot, 'node_modules/alpheios-experience/dist/alpheios-experience.js'),
            'alpheios-lexicon-client': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.js'),
            'alpheios-res-client': path.join(projectRoot, 'node_modules/alpheios-res-client/dist/alpheios-res-client.js'),
            'alpheios-lemma-client': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.js'),
            'alpheios-components': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
            'alpheios-inflection-tables': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
            'alpheios-morph-client': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.js')
          }
        },
        module: {
          rules: [
            {
              test: /\.csv$/,
              use: 'raw-loader'
            },
            {
              test: /\.json$/,
              use: 'raw-loader',
              type: 'javascript/auto' // To prevent running Webpack's default JSON parser on the output of raw-loader
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
        mode: 'development',
        context: path.resolve(__dirname, '../../src/content'),
        entry: './content.js',
        devtool: 'source-map',
        output: {
          path: path.resolve(__dirname, '../../dist'),
          filename: 'content.js'
        },
        resolve: {
          alias: {
            'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
            'alpheios-experience': path.join(projectRoot, 'node_modules/alpheios-experience/dist/alpheios-experience.js'),
            'alpheios-lexicon-client': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.js'),
            'alpheios-res-client': path.join(projectRoot, 'node_modules/alpheios-res-client/dist/alpheios-res-client.js'),
            'alpheios-lemma-client': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.js'),
            'alpheios-components': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
            'alpheios-inflection-tables': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
            'alpheios-morph-client': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.js')
          }
        },
        module: {
          rules: [
            {
              test: /\.csv$/,
              use: 'raw-loader'
            },
            {
              test: /\.json$/,
              use: 'raw-loader',
              type: 'javascript/auto' // To prevent running Webpack's default JSON parser on the output of raw-loader
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
      ff_filename: 'alpheios.zip',
      chrome_filename: 'alpheios.zip'
  }
}
