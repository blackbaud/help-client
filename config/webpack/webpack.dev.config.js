const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs-extra');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
    filename: 'help-client.umd.js',
    library: 'BBHelpClient',
    libraryTarget: 'umd'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
    ]
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    contentBase: '/dist/bundles',
    port: 9000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '..', 'cert', 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '..', 'cert', 'server.crt'))
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
      filename: 'index.html',
      devServer: 'http://localhost:9000'
    })
  ]
}
