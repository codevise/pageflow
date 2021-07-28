const {moduleNameMapper, transform, globals} = require('pageflow/config/jest')

module.exports = {
  // Required to make eslint-import-resolver-jest work with absolute
  // paths in moduleNameMapper:
  // https://github.com/JoinColony/eslint-import-resolver-jest/issues/55
  rootDir: require('path').resolve(__dirname),

  testEnvironment: 'jsdom',
  testMatch: ["<rootDir>/spec/**/*-spec.js"],
  globals,
  setupFiles: ['<rootDir>/spec/support/matchMediaStub.js'],
  setupFilesAfterEnv: ['<rootDir>/spec/support/fakeBrowserFeatures.js'],
  modulePaths: ['<rootDir>/src', '<rootDir>/spec'],

  testURL: 'https://story.example.com',

  moduleNameMapper: {
    '^pageflow-scrolled/contentElements-frontend$': '<rootDir>/src/contentElements/frontend',
    "^pageflow-scrolled/([^/]*)$": "<rootDir>/src/$1",

    // Make specs run even if ignored json file is not present
    ".*\\.storybook/seed\\.json$": "<rootDir>/spec/support/fakeSeed.json",
    ...moduleNameMapper
  },
  transform: {
    ...transform,
    '^.+\\.svg$': '<rootDir>/spec/support/jest/svg-transform'
  }
};
