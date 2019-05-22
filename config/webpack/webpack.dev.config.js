var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs-extra');

function createConfig(target) {
  return {
    entry: './index.ts',
    output: {
      path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
      filename: `help-client.${target}.js`,
      library: 'BBHelpClient',
      libraryTarget: target
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
          loaders: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: '/node_modules/'
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
};

module.exports = [
  createConfig('umd'),
  createConfig('amd')
];
