import VueLoaderPlugin from '../node_modules/vue-loader/lib/plugin.js'
import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    context: path.join(projectRoot, 'src/content'),
    entry: './content.js',
    resolve: {
      alias: {
        'alpheios-data-models$': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
        'alpheios-experience$': path.join(projectRoot, 'node_modules/alpheios-experience/dist/alpheios-experience.js'),
        'alpheios-client-adapters$': path.join(projectRoot, 'node_modules/alpheios-client-adapters/dist/alpheios-client-adapters.js'),
        'alpheios-res-client$': path.join(projectRoot, 'node_modules/alpheios-res-client/dist/alpheios-res-client.js'),
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
        'alpheios-inflection-tables$': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
        'alpheios-wordlist$': path.join(projectRoot, 'node_modules/alpheios-wordlist/dist/alpheios-wordlist.js'),
        '@': path.join(projectRoot, 'src')
      }
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  },

  production: {
    mode: 'production',
    output: { filename: 'content.js' }
  },

  development: {
    mode: 'development',
    output: { filename: 'content.js' }
  }
}

export { webpack }
