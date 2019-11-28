module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["import", "jest"],
  "rules": {
    "no-unused-vars": [ "warn", {"vars": "all", "args": "none"} ],
  },
  "settings": {
    "import/resolver": {
      "jest": {
        "jestConfigFile": "./jest.config.js"
      }
    }
  },
  "overrides": [
    {
      "files": ["*.config.js", "spec/support/jest/*.js"],
      "env": {
        "node": true
      }
    },
    {
      "files": ["spec/**/*.js"],
      "env": {
        'jest/globals': true,
      },
      "rules": {
        'jest/expect-expect': 'warn',
        'jest/no-commented-out-tests': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-export': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-mocks-import': 'error',
        'jest/no-jasmine-globals': 'warn',
        'jest/no-standalone-expect': 'error',
        'jest/no-test-callback': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-try-expect': 'error',
        'jest/valid-describe': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error',
      },
    }
  ]
};
