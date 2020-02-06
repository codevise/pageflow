const path = require('path');

module.exports = {
  stories: ['../src/**/*stories.js'],

  webpackFinal: async (config, {configType}) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: addModuleOptionToCssLoader(config.module.rules),
      },
      resolve: {
        alias: {
          ...config.resolve.alias,
          'pageflow-scrolled/frontend': path.resolve(__dirname, '../src/frontend'),
        }
      }
    };
  }
};

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
    })

    return {
      ...rule,
      use
    };
  })
}
