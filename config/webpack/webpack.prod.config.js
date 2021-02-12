var path = require('path');

function createConfig(target, library, entry, name = '') {
  return {
    entry: `./${entry}`,
    output: {
      path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
      filename: `help-client.${name || target}.js`,
      library: library,
      libraryTarget: target
    },
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false
            }
          }
        }
      ]
    }
  }
};

module.exports = [
  createConfig('umd', 'BBHelpClient', 'index.ts'),
  createConfig('window', 'BBHELP', 'global-index.ts', 'global')
];
