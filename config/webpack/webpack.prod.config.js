var path = require('path');

function createConfig(target, library, entry) {
  return {
    entry: `./${entry}`,
    output: {
      path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
      filename: `help-client.${target}.js`,
      library: library,
      libraryTarget: target
    },
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
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: '/node_modules/'
        },
      ]
    }
  }
};

module.exports = [
  createConfig('umd', 'BBHelpClient', 'index.ts'),
  createConfig('window', 'BBHELP', 'window-index.ts')
];
