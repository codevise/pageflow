/*global module, require, __dirname*/

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      PAGEFLOW_EDITOR: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: require.resolve('react'),
        loader: 'expose?React'
      }
    ]
  },
  externals: {
    'pageflow': true,
    'jsdom': 'window',
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [path.join(__dirname, 'src'), path.join(__dirname, 'spec')]
  }
};
