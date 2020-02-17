const {moduleNameMapper, transform} = require('pageflow/config/jest')

module.exports = {
  // Required to make eslint-import-resolver-jest work with absolute
  // paths in moduleNameMapper:
  // https://github.com/JoinColony/eslint-import-resolver-jest/issues/55
  rootDir: require('path').resolve(__dirname),

  testMatch: ["<rootDir>/spec/**/*-spec.js"],
  globals: {
    pageflow: {},
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/spec'],

  moduleNameMapper: {
    "^pageflow-scrolled/([^/]*)$": "<rootDir>/src/$1",

    // Make specs run even if ignored json file is not present
    ".*\\.storybook/seed\\.json$": "<rootDir>/spec/support/fakeSeed.json",
    ...moduleNameMapper
  },
  transform: {
    ...transform,
    '^.+\\.svg$': 'jest-svg-transformer'
  }
};
