import alias from '@rollup/plugin-alias';
import jst from 'rollup-plugin-jst';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const pageflowPackageRoot = 'packages/pageflow';
const pageflowPagedEngineRoot = 'entry_types/paged';
const pageflowPagedPackageRoot = pageflowPagedEngineRoot + '/packages/pageflow-paged';
const pageflowScrolledPackageRoot = 'entry_types/scrolled/package';

const frontendGlobals = {
  'backbone': 'Backbone',
  'jquery': 'jQuery',
  'jquery-ui': 'jQuery',
  'underscore': '_',
  'i18n-js': 'I18n',
  'iscroll': 'IScroll'
};

const editorGlobals = {
  ...frontendGlobals,
  'backbone.babysitter': 'Backbone.ChildViewContainer',
  'cocktail': 'Cocktail',
  'jquery.minicolors': 'jQuery',
  'backbone.marionette': 'Backbone.Marionette',
  'wysihtml5': 'wysihtml5'
};

const externalEditorGlobals = Object.keys(editorGlobals);
const externalEditorGlobalsAndCoreJs = function(id) {
  return externalEditorGlobals.indexOf(id) >= 0 ||
         id.match(/^core-js/);
}
const externalPageflowEditorGlobalsAndCoreJs = function(id) {
  return id.match(/^pageflow\//) || externalEditorGlobalsAndCoreJs(id);
}

const plugins = [
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

const pageflowPackagePlugins = [
  alias({
    entries: {
      '$pageflow': __dirname + '/' +  pageflowPackageRoot + '/src',
      '$state': __dirname + '/' + pageflowPackageRoot + '/src/editor/state.js',
    }
  }),
  ...plugins
];

export default [
  // pageflow

  {
    input: pageflowPackageRoot + '/src/ui/index.js',
    output: {
      file: pageflowPackageRoot + '/ui.js',
      format: 'esm'
    },
    external: externalEditorGlobalsAndCoreJs,
    plugins: pageflowPackagePlugins
  },
  {
    input: pageflowPackageRoot + '/src/editor/index.js',
    output: {
      file: pageflowPackageRoot + '/editor.js',
      format: 'esm'
    },
    external: externalEditorGlobalsAndCoreJs,
    plugins: pageflowPackagePlugins
  },

  {
    input: pageflowPackageRoot + '/src/frontend/index.js',
    output: {
      file: 'app/assets/javascripts/pageflow/dist/frontend.js',
      format: 'iife',
      name: 'pageflow',
      globals: frontendGlobals
    },
    external: Object.keys(frontendGlobals),
    plugins: pageflowPackagePlugins
  },
  {
    input: pageflowPackageRoot + '/src/ui/index.js',
    output: {
      file: 'app/assets/javascripts/pageflow/dist/ui.js',
      format: 'iife',
      name: 'pageflow._uiGlobalInterop',
      globals: editorGlobals
    },
    external: externalEditorGlobals,
    plugins: pageflowPackagePlugins
  },
  {
    input: pageflowPackageRoot + '/src/editor/index.js',
    output: {
      file: 'app/assets/javascripts/pageflow/dist/editor.js',
      format: 'iife',
      name: 'pageflow._editorGlobalInterop',
      globals
    },
    externalEditorGlobals,
    pageflowPackagePlugins
  },

  // pageflow-paged

  {
    input: pageflowPagedPackageRoot + '/src/editor/index.js',
    output: {
      file: pageflowPagedEngineRoot + '/app/assets/javascripts/pageflow_paged/dist/editor.js',
      format: 'iife',
      name: 'pageflow_paged',
      globals: editorGlobals
    },
    external: externalEditorGlobals,
    plugins
  },

  // pageflow-scrolled

  {
    input: pageflowScrolledPackageRoot + '/src/editor/index.js',
    output: {
      file: pageflowScrolledPackageRoot + '/editor.js',
      format: 'esm',
    },
    external: externalPageflowEditorGlobalsAndCoreJs,
    plugins
  }
];
