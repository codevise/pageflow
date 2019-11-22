var path = require('path');

// Allow excluding packages from one of the builds. On the client,
// there are some packages which are required via Sprockets and are
// thus available via globals. If a package depends on the browser
// environment and cannot be loaded in the server side rendering
// context, we replace it with an empty object.
var targetExternals = {
  client: {
    'backbone': 'Backbone',
    'react-dom': 'ReactDOM'
  },
  server: {
    'backbone': '{}',
    'react-dom': '{}',
    'react-wavesurfer': '{}'
  }
};

module.exports = ['client', 'server'].map(function(target) {
  return {
    context: __dirname + '/src',
    entry: './index.js',

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ]
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ],
    },

    output: {
      path: __dirname + '/../../app/assets/javascripts/pageflow/dist',
      filename: 'react-' + target +'.js',

      libraryTarget: 'assign',
      libraryExport: 'default',
      library: ['pageflow', 'react']
    },

    externals: Object.assign({
      pageflow: 'pageflow',
      react: 'React',
    }, targetExternals[target])
  };
});
