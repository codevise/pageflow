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
      "files": ["*.config.js", "spec/support/jest/*.js", "config/**/*.js"],
      "env": {
        "node": true
      }
    },
    {
      "files": ["src/frontend/**/*.js", "spec/frontend/**/*.js"],
      "globals": {
        "pageflow": true,
        "videojs": true,
        "Audio5js": true,
        "PAGEFLOW_EDITOR": true
      }
    },
    {
      "files": ["spec/**/*.js", "src/testHelpers/**/*.js"],
      "extends": ["plugin:jest/recommended"]
    }
  ]
};
