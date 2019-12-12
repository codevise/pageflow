module.exports = {
  "extends": [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "settings": {
    "import/resolver": {
      "jest": {
        "jestConfigFile": "./jest.config.js"
      }
    }
  },
  "overrides": [
    {
      "files": ["spec/**/*.js"],
      "env": {
        'jest/globals': true,
      },
      "extends": ["plugin:jest/recommended"]
    }
  ]
};
