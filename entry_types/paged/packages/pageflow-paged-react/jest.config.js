const {moduleNameMapper, transform, globals} = require('pageflow/config/jest')

module.exports = {
  'testEnvironment': 'enzyme',
  'testEnvironmentOptions': {
    'enzymeAdapter': 'react14'
  },
  testMatch: ['<rootDir>/src/**/__spec__/*-spec.js?(x)'],
  globals,
  setupFiles: ['<rootDir>/spec/support/reactGlobal.js'],
  setupFilesAfterEnv: ['jest-enzyme', 'jest-sinon', '<rootDir>/spec/support/matchers/descendants.js'],
  modulePaths: ['<rootDir>/src', '<rootDir>/spec'],
  moduleNameMapper,
  transform
};
