module.exports = {
  externals: {
    'backbone': 'Backbone',
    'backbone.babysitter': 'Backbone.ChildViewContainer',
    'cocktail': 'Cocktail',
    'jquery': 'jQuery',
    'jquery-ui': 'jQuery',
    'jquery.minicolors': 'jQuery',
    'underscore': '_',
    'backbone.marionette': 'Backbone.Marionette',
    'iscroll': 'IScroll',
    'wysihtml5': 'wysihtml5',
    'videojs': 'videojs',
  },
  // Webpack's chunk loading code references `window` by default -
  // which is not available in server side rendering context.
  //
  // https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/web/JsonpMainTemplatePlugin.js#L493
  output: {
    globalObject: 'this'
  }
};
