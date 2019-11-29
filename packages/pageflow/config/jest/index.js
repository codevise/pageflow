const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^jquery$': resolve('../../src/vendor/jquery'),
    '^jquery-ui$': resolve('../../src/vendor/jquery-ui'),
    '^jquery.minicolors$': resolve('../../src/vendor/jquery.minicolors'),
    '^backbone.marionette$': resolve('../../src/vendor/backbone.marionette'),
    '^backbone.babysitter$': resolve('../../src/vendor/backbone.babysitter'),
    '^backbone$': resolve('../../src/vendor/backbone'),
    '^underscore$': resolve('../../src/vendor/underscore'),
    '^cocktail$': resolve('../../src/vendor/cocktail'),
    '^i18n-js$': resolve('../../src/vendor/i18n'),
    '^iscroll$': resolve('../../src/vendor/iscroll'),
    '^wysihtml5': resolve('../../spec/support/wysihtmlStub'),
  },

  transform: {
    '^.+\\.jst$': resolve('./transformers/jst'),
    '^.+\\.jsx?$': resolve('./transformers/upwardBabel')
  }
}

function resolve(relativePath) {
  return path.resolve(__dirname, relativePath)
}
