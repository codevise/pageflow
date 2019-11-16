module.exports = {
  testMatch: ["<rootDir>/spec/**/*-spec.js"],
  globals: {
    pageflow: {},
  },
  setupFilesAfterEnv: ["jest-sinon", "<rootDir>/spec/support/jest-jquery-matchers"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^\\$support(.*)$": "<rootDir>/spec/support$1",
    "^\\$pageflow(.*)$": "<rootDir>/src$1",

    "^jquery$": "<rootDir>/src/vendor/jquery",
    "^jquery.minicolors$": "<rootDir>/src/vendor/jquery.minicolors",
    "^backbone.marionette$": "<rootDir>/src/vendor/backbone.marionette",
    "^backbone.babysitter$": "<rootDir>/src/vendor/backbone.babysitter",
    "^backbone$": "<rootDir>/src/vendor/backbone",
    "^underscore$": "<rootDir>/src/vendor/underscore",
    "^cocktail$": "<rootDir>/src/vendor/cocktail",
    "^i18n-js$": "<rootDir>/src/vendor/i18n",
    "^iscroll$": "<rootDir>/src/vendor/iscroll",
    "^wysihtml5": "<rootDir>/src/vendor/iscroll",
  },
  transform: {
    "^.+\\.jst$": "<rootDir>/spec/support/jest-jst-transform",
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};
