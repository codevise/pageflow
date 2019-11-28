const {moduleNameMapper, transform} = require('pageflow/config/jest')

module.exports = {
  testMatch: ["<rootDir>/spec/**/*-spec.js"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper,
  transform
};
