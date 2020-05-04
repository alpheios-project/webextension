import VueLoaderPlugin from '../node_modules/vue-loader/lib/plugin.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import PlistPlugin from './plist-plugin.mjs'
const projectRoot = process.cwd()

const webpack = {
  custom: {
    // The plist plugin must run in both production and development modes
    common: {
      plugins: [
        PlistPlugin
      ]
    }
  },
  common: {
    context: path.join(projectRoot, 'src/content'),
    entry: './content-safari.js',
    plugins: [
      new VueLoaderPlugin()
    ]
  },

  production: {
    mode: 'production',
    output: { filename: 'content-safari.js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.min.js'),
        '@': path.join(projectRoot, 'src'),
        '@safari': path.join(projectRoot, 'src/content-safari')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style/style-safari.css'
      })
    ]
  },

  development: {
    mode: 'development',
    devtool: false, // Disable source map as it will not be loaded into a containing app
    output: { filename: 'content-safari.js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.js'),
        '@': path.join(projectRoot, 'src'),
        '@safari': path.join(projectRoot, 'src/content-safari')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style/style-safari.css'
      })
    ]
  }
}

export { webpack }
