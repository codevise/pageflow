module.exports = {
  "extends": [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:storybook/recommended"
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
