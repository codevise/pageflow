const path = require('path');

module.exports = {
  addons: ['@storybook/addon-viewport/register'],
  stories: ['../src/**/*stories.js'],

  webpackFinal: async (config, {configType}) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...addModuleOptionToCssLoader(
            removeSvgFromFileLoader(
              includePageflowPackageInBabelRule(
                config.module.rules
              )
            )
          ),
          reactSvgLoader(),
        ]
      },
      resolve: {
        alias: {
          ...config.resolve.alias,
          'videojs': path.resolve(__dirname, '../../../../vendor/assets/javascripts/videojs'),
          'pageflow/frontend': path.resolve(__dirname, '../../../../package/src/frontend'),
          'pageflow-scrolled/frontend': path.resolve(__dirname, '../src/frontend'),
          'pageflow-scrolled/testHelpers': path.resolve(__dirname, '../src/testHelpers'),

          // css-loader (used by Storybook's Webpack setup) expects
          // imports from node modules to be prefixed with a tilde,
          // e.g. "~pageflow-scrolled/..."). This syntax is not
          // supported by our Rollup setup, though. Without the tilde,
          // css-loader interprets imports as relative. We use this
          // alias as a workaround to mimic the Rollup behavior.
          './pageflow-scrolled/values': path.resolve(__dirname, '../values'),
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
    if (!rule.test.toString().includes('svg|')) {
      return rule;
    }

    return {
      ...rule,
      test: new RegExp(rule.test.toString().replace('svg|', ''))
    };
  });
}

function addModuleOptionToCssLoader(rules) {
  return rules.map(rule => {
    if (rule.test.toString() !== '/\\.css$/') {
      return rule;
    }

    const use = rule.use.map(u => {
      const { loader } = u;

      if (!loader || !loader.includes('/css-loader/')) {
        return u;
      }

      const options = {
        ...u.options,
        modules: {
          localIdentName: '[name]_[local]__[hash:base64:5]'
        }
      };

      return {
        ...u,
        options
      };
    });

    return {
      ...rule,
      use
    };
  });
}

// Since resolve.alias above makes imports from pageflow/frontend
// point to the package's src directory, we need to make sure that
// files from the pageflow package are also transpiled.
function includePageflowPackageInBabelRule(rules) {
  return rules.map(rule => {
    if (rule.test.toString().includes('|jsx?)')) {
      return {
        ...rule,
        include: [
          ...rule.include,
          path.resolve(__dirname, '../../../../package')
        ]
      };
    }

    return rule;
  });
}
