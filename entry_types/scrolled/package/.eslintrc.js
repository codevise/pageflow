module.exports = {
  "extends": [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:storybook/recommended"
  ],
  "rules": {
    "no-trailing-spaces": "error",
    // The import resolver predates package exports maps and thus
    // cannot resolve subpaths like
    // '@lottiefiles/dotlottie-web/dotlottie-player.wasm'.
    "import/no-unresolved": ["error", {"ignore": ["\\.wasm$"]}],
    // react-app enables no-unused-expressions, but ESLint 6 predates
    // ChainExpression and flags optional-chaining call statements like
    // `node?.focus()` as unused. The other packages do not enable the rule.
    "no-unused-expressions": "off"
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
      // Content elements, widgets, the editor and the review interface
      // are bundled separately and need to import from
      // 'pageflow-scrolled/frontend' and 'pageflow-scrolled/entryState'
      // to keep that code external. Importing relatively would inline a
      // second copy of the module, giving the bundle its own React
      // contexts.
      // Stories are excluded because they legitimately import the
      // content element's sibling './frontend' aggregator via
      // '../frontend'.
      "files": [
        "src/contentElements/**/*.js",
        "src/widgets/**/*.js",
        "src/editor/**/*.js",
        "src/review/**/*.js"
      ],
      "excludedFiles": ["src/**/stories.js"],
      "rules": {
        "no-restricted-imports": ["error", {
          "patterns": [
            "**/frontend/**", "../**/frontend",
            "**/entryState/**", "../**/entryState"
          ]
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
    },
    {
      // Directories passed to documentation.js in
      // .github/workflows/docs.yml.
      "files": ["src/**/*.js", "spec/support/**/*.js"],
      "rules": {
        "documented-in-toc": "error"
      }
    }
  ]
};
