const path = require('path');

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '..', '..', 'src'), 'node_modules']
  },
  mode: 'production',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [path.resolve(__dirname, '..', '..', 'node_modules')],
        options: {
          emitErrors: true,
          failOnHint: true,
          resourcePath: 'src'
        }
      },
      {
        test: /\.ts$/,
        loaders: [
          'ts-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: '/node_modules/'
      },
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'source-map-inline-loader',
        include: path.resolve(__dirname, '..', '..', 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
          /index\.ts/
        ]
      }
    ]
  }
};
