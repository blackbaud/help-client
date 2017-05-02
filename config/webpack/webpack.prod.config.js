var path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
    filename: 'help-client.umd.js',
    library: 'BBHelpClient',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts']
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
};
