/*global require, module*/

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

webpackConfig.plugins = webpackConfig.plugins || [];
webpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  }
}));

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      build: {}
    },

    karma: {
      singleRun: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('build', ['webpack:build']);
  grunt.registerTask('test', ['karma:singleRun']);

  grunt.registerTask('default', ['build', 'test']);
};
