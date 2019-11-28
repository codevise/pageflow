const {moduleNameMapper, transform} = require('./config/jest')

module.exports = {
  testMatch: ["<rootDir>/spec/**/*spec.js"],
  globals: {
    pageflow: {},
  },
  setupFiles: ["<rootDir>/spec/support/videojsStub"],
  setupFilesAfterEnv: ["jest-sinon", "<rootDir>/spec/support/jest/jquery-matchers"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^\\$support(.*)$": "<rootDir>/spec/support$1",
    "^\\$pageflow(.*)$": "<rootDir>/src$1",
    "^\\$state$": "<rootDir>/spec/support/state.js",

    ...moduleNameMapper
  },
  transform
};
