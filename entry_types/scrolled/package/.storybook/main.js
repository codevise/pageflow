import { dirname, join } from "path";
const path = require('path');

module.exports = {
  stories: ['../src/**/*stories.js'],
  staticDirs: ['./static'],

  addons: ['@storybook/addon-viewport'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  features: {
    // Required to make deprecated storiesOf API work
    storyStoreV7: false,
  },

  webpackFinal: async (config, {configType}) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...removeSvgFromFileLoader(
            config.module.rules
          ),
          reactSvgLoader(),
        ]
      },
      resolve: {
        alias: {
          ...config.resolve.alias,
          'pageflow/frontend': path.resolve(__dirname, '../../../../package/src/frontend'),
          'pageflow-scrolled/frontend': path.resolve(__dirname, '../src/frontend'),
          'pageflow-scrolled/testHelpers': path.resolve(__dirname, '../src/testHelpers')
        }
      }
    };
  }
};

function reactSvgLoader() {
  return {
    test: /\.svg$/,
    use: [
      {
        loader: "babel-loader"
      },
      {
        loader: "react-svg-loader",
        options: {
          jsx: false
        }
      }
    ]
  };
}

function removeSvgFromFileLoader(rules) {
  return rules.map(rule => {
    if (!rule.test || !rule.test.toString().includes('svg|')) {
      return rule;
    }

    return {
      ...rule,
      test: new RegExp(rule.test.toString().replace('svg|', ''))
    };
  });
}
