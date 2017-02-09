/*global module, require, __dirname*/

var path = require('path');

module.exports = {
  context: __dirname + '/src',
  entry: [
    'babel-polyfill',
    './index.js'
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [path.join(__dirname, 'src')]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      }
    ],
  },

  output: {
    path: __dirname + '/../app/assets/javascripts/pageflow/dist',
    filename: 'react.js',

    libraryTarget: 'assign',
    library: ['pageflow', 'react']
  },

  externals: {
    pageflow: 'pageflow',
    react: 'React',
    backbone: 'Backbone',
    'react-dom': 'ReactDOM'
  }
};
