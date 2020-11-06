import cwp from 'clean-webpack-plugin'
import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    entry: {
      background: './background/background.js',
      content: './content/content.js'
    },
    plugins: [
      new cwp.CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['background*.js*', 'content*.js*']
      })
    ],
    resolve: {
      /*
      Starting from version 5, webpack stopped to automatically include polyfills for
      native node.js modules. The fallback object specify an in-browser replacements
      for those modules.
       */
      fallback: {
        crypto: path.resolve('crypto-browserify'),
        stream: path.resolve('stream-browserify')
      }
    }
  },

  production: {
    mode: 'production',
    output: { filename: '[name].js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.min.js'),
        '@': path.join(projectRoot, 'src')
      }
    }
  },

  development: {
    mode: 'development',
    output: { filename: '[name].js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-core/packages/components/dist/alpheios-components.js'),
        '@': path.join(projectRoot, 'src')
      }
    }
  }
}

export { webpack }
