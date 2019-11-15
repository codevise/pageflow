import jst from 'rollup-plugin-jst';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/ui/index.js',
  output: {
    file: '../../app/assets/javascripts/pageflow/dist/ui.js',
    format: 'iife',
    name: 'pageflow.ui',

    globals: {
      'backbone': 'Backbone',
      'backbone.babysitter': 'Backbone.ChildViewContainer',
      'cocktail': 'Cocktail',
      'jquery': 'jQuery',
      'jquery.minicolors': 'jQuery',
      'underscore': '_',
      'backbone.marionette': 'Backbone.Marionette',
      'i18n-js': 'I18n',
      'iscroll': 'IScroll',
      'wysihtml5': 'wysihtml5'
    }
  },
  external: [
    'backbone',
    'backbone.babysitter',
    'cocktail',
    'jquery',
    'jquery.minicolors',
    'underscore',
    'backbone.marionette',
    'i18n-js',
    'iscroll',
    'wysihtml5'
  ],
  plugins: [
    jst(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',

      // By default rollup-plugin-babel deduplicates runtime helpers
      // inserted by Babel. babel-preset-react-app uses
      // @babel/plugin-transform-runtime which already takes care of
      // this.
      runtimeHelpers: true
    })
  ]
};
