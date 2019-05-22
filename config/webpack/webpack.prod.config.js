var path = require('path');

function createConfig(target) {
  return {
    entry: './index.ts',
    output: {
      path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
      filename: `help-client.${target}.js`,
      library: 'BBHelpClient',
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
  createConfig('umd'),
  createConfig('amd')
];
