import VueLoaderPlugin from '../node_modules/vue-loader/lib/plugin.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    context: path.join(projectRoot, 'src/content-safari'),
    entry: './index.js',
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
        'alpheios-experience': path.join(projectRoot, 'node_modules/alpheios-experience/dist/alpheios-experience.js'),
        'alpheios-lexicon-client': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.js'),
        'alpheios-res-client': path.join(projectRoot, 'node_modules/alpheios-res-client/dist/alpheios-res-client.js'),
        'alpheios-lemma-client': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.js'),
        'alpheios-components': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
        'alpheios-inflection-tables': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
        'alpheios-morph-client': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.js'),
        '@safari': path.join(projectRoot, 'src/content-safari'),
        'alpheios-component-styles': path.join(projectRoot, 'node_modules/alpheios-components/dist/style/style.min.css')
      }
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  },

  production: {
    mode: 'production',
    output: {filename: 'safari/content-safari.js'},
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'safari/style.min.css'
      })
    ]
  },

  development: {
    mode: 'development',
    output: {filename: 'safari/content-safari.js'},
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'safari/style.css'
      })
    ]
  }
}

export { webpack }
