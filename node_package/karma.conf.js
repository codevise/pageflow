/*global module, require*/

var webpackConfig = require('./webpack.karma.config.js');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: false,
    frameworks: ['mocha', 'chai', 'chai-sinon', 'phantomjs-shim'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'spec/index.js'
    ],
    exclude: [
      'flycheck_*.*',
      '**/flycheck_*.*',
      '*/**/flycheck_*.*',
    ],
    preprocessors: {
      'spec/index.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    plugins: [
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-mocha',
      'karma-chai',
      'karma-chai-sinon',
      require('karma-phantomjs-shim'),
      'karma-phantomjs-launcher'
    ],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  });
};
