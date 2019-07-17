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
    ]
  },

  production: {
    mode: 'production',
    output: { filename: '[name].js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.min.js'),
        '@': path.join(projectRoot, 'src')
      }
    }
  },

  development: {
    mode: 'development',
    output: { filename: '[name].js' },
    resolve: {
      alias: {
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
        '@': path.join(projectRoot, 'src')
      }
    }
  }
}

export { webpack }