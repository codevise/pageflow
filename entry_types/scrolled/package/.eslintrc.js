module.exports = {
  "extends": [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:storybook/recommended"
  ],
  "rules": {
    "no-trailing-spaces": "error"
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
      "files": ["spec/**/*.js"],
      "env": {
        'jest/globals': true,
      },
      "extends": ["plugin:jest/recommended"]
    },
    {
      // Content elements, widgets and the editor are bundled
      // separately and need to import from 'pageflow-scrolled/frontend'
      // and 'pageflow-scrolled/entryState' to keep that code external.
      // Stories are excluded because they legitimately import the
      // content element's sibling './frontend' aggregator via
      // '../frontend'.
      "files": ["src/contentElements/**/*.js", "src/widgets/**/*.js", "src/editor/**/*.js"],
      "excludedFiles": ["src/**/stories.js"],
      "rules": {
        "no-restricted-imports": ["error", {
          "patterns": ["**/frontend/**", "../**/frontend", "**/entryState/**"]
        }]
      }
    },
    {
      // The frontend is bundled separately from entryState and needs
      // to use 'pageflow-scrolled/entryState' to keep that code
      // external.
      "files": ["src/frontend/**/*.js"],
      "rules": {
        "no-restricted-imports": ["error", {
          "patterns": ["**/entryState/**", "../**/entryState"]
        }]
      }
    }
  ]
};
