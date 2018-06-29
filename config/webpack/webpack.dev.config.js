var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
    filename: 'help-client.umd.js',
    library: 'BBHelpClient',
    libraryTarget: 'umd'
  },
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
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?localIdentName=[hash:base64:10]', 'sass-loader'],
        exclude: '/node_modules/'
    },
    ]
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    contentBase: '/dist/bundles',
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      devServer: 'http://localhost:9000'
    })
  ]
};
