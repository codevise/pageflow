const {moduleNameMapper, transform} = require('./config/jest')

module.exports = {
  // Required to make eslint-import-resolver-jest work with absolute
  // paths in moduleNameMapper:
  // https://github.com/JoinColony/eslint-import-resolver-jest/issues/55
  rootDir: require('path').resolve(__dirname),

  testMatch: ["<rootDir>/spec/**/*spec.js"],
  globals: {
    pageflow: {}
  },
  setupFilesAfterEnv: ["jest-sinon", "<rootDir>/spec/support/jest/jquery-matchers"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^\\$support(.*)$": "<rootDir>/spec/support$1",
    "^\\pageflow/(.*)$": "<rootDir>/src/$1",
    "^\\$state$": "<rootDir>/spec/support/state.js",

    ...moduleNameMapper
  },
  transform
};
