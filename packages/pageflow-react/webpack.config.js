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
    entry: [
      'babel-polyfill',
      './index.js'
    ],

    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: [path.join(__dirname, 'src')]
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['babel-loader'],
        }
      ],
    },

    output: {
      path: __dirname + '/../../app/assets/javascripts/pageflow/dist',
      filename: 'react-' + target +'.js',

      libraryTarget: 'assign',
      library: ['pageflow', 'react']
    },

    externals: Object.assign({
      pageflow: 'pageflow',
      react: 'React',
    }, targetExternals[target])
  };
});
