const path = require('path');

module.exports = {
  globals: {
    __webpack_public_path__: '',
    pageflow: {
      config: {
        availableFileLicenses: []
      }
    }
  },

  moduleNameMapper: {
    '^jquery$': resolve('../../vendor/jquery'),
    '^jquery-ui$': resolve('../../vendor/jquery-ui'),
    '^jquery.minicolors$': resolve('../../vendor/jquery.minicolors'),
    '^backbone.marionette$': resolve('../../vendor/backbone.marionette'),
    '^backbone.babysitter$': resolve('../../vendor/backbone.babysitter'),
    '^backbone$': resolve('../../vendor/backbone'),
    '^underscore$': resolve('../../vendor/underscore'),
    '^cocktail$': resolve('../../vendor/cocktail'),
    '^iscroll$': resolve('../../vendor/iscroll'),
    '^wysihtml5': resolve('../../spec/support/wysihtmlStub')
  },

  transform: {
    '^.+\\.jst$': resolve('./transformers/jst'),
    '^.+\\.jsx?$': ['babel-jest', {rootMode: "upward"}],
    '^.+\\.module.css$': 'jest-css-modules-processor'
  }
}

function resolve(relativePath) {
  return path.resolve(__dirname, relativePath)
}
