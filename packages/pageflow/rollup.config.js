import alias from '@rollup/plugin-alias';
import jst from 'rollup-plugin-jst';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const globals = {
  'backbone': 'Backbone',
  'backbone.babysitter': 'Backbone.ChildViewContainer',
  'cocktail': 'Cocktail',
  'jquery': 'jQuery',
  'jquery-ui': 'jQuery',
  'jquery.minicolors': 'jQuery',
  'underscore': '_',
  'backbone.marionette': 'Backbone.Marionette',
  'i18n-js': 'I18n',
  'iscroll': 'IScroll',
  'wysihtml5': 'wysihtml5'
};

const external = Object.keys(globals);

const plugins = [
  alias({
    entries: {
      '$pageflow': __dirname + '/src',
      '$state': __dirname + '/src/editor/state.js',
    }
  }),
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
];

export default [
  {
    input: 'src/frontend/index.js',
    output: {
      file: '../../app/assets/javascripts/pageflow/dist/frontend.js',
      format: 'iife',
      name: 'pageflow',
      globals
    },
    external,
    plugins
  },
  {
    input: 'src/ui/index.js',
    output: {
      file: '../../app/assets/javascripts/pageflow/dist/ui.js',
      format: 'iife',
      name: 'pageflow._uiGlobalInterop',
      globals
    },
    external,
    plugins
  },
  {
    input: 'src/editor/index.js',
    output: {
      file: '../../app/assets/javascripts/pageflow/dist/editor.js',
      format: 'iife',
      name: 'pageflow._editorGlobalInterop',
      globals
    },
    external,
    plugins
  }
];
