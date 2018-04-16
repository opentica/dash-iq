const path = require('path')
require('babel-core/register')
require('babel-polyfill')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['babel-polyfill', './src/server.js'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    node: '6.11.2',
                  },
                },
              ],
            ],
            plugins: [require('babel-plugin-transform-object-rest-spread')],
          },
        },
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()],
}
