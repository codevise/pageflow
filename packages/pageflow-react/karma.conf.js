/*global module, require*/

var webpackConfig = require('./webpack.karma.config.js');

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        // Required for chrome to work in container based Travis
        // environment (see https://docs.travis-ci.com/user/chrome)
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    frameworks: ['mocha', 'chai', 'chai-sinon'],
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
      'karma-chrome-launcher'
    ],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  });
};
