import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    context: path.join(projectRoot, 'src/lib/auth0-chrome/src/'),
    entry: ['@babel/polyfill', './ChromeClient.js'],
    resolve: {
      alias: {
        'alpheios-data-models$': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
        'alpheios-experience$': path.join(projectRoot, 'node_modules/alpheios-experience/dist/alpheios-experience.js'),
        'alpheios-lexicon-client$': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.js'),
        'alpheios-res-client$': path.join(projectRoot, 'node_modules/alpheios-res-client/dist/alpheios-res-client.js'),
        'alpheios-lemma-client$': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.js'),
        'alpheios-components$': path.join(projectRoot, 'node_modules/alpheios-components/dist/alpheios-components.js'),
        'alpheios-inflection-tables$': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
        'alpheios-morph-client$': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.js'),
        '@': path.join(projectRoot, 'src')
      }
    }
  },

  production: {
    mode: 'production',
    output: { filename: 'auth0.js' }
  },

  development: {
    mode: 'development',
    output: { filename: 'auth0.js' }
  }
}

export { webpack }
