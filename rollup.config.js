import alias from '@rollup/plugin-alias';
import jst from 'rollup-plugin-jst';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import reactSvg from "rollup-plugin-react-svg";

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
const externalCoreJs = function(id) {
  return id.match(/^core-js/);
};
const externalScrolledDependenciesAndCoreJs = function(id) {
  return id.match(/^pageflow-scrolled\//) || [
    'react', 'react-dom', 'react-tooltip'
  ].indexOf(id) >= 0 || externalCoreJs(id);
};
const externalEditorGlobalsAndCoreJs = function(id) {
  return externalEditorGlobals.indexOf(id) >= 0 ||
         externalCoreJs(id);
};
const externalPageflowEditorGlobalsAndCoreJs = function(id) {
  return id.match(/^pageflow\//) || externalEditorGlobalsAndCoreJs(id);
};
const externalPageflowUIEditorGlobalsAndCoreJs = function(id) {
  return id.match(/^pageflow\/ui/) || externalEditorGlobalsAndCoreJs(id);
};

const plugins = [
  postcss({
    modules: true
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['js', 'jsx', 'svg'],

    // By default rollup-plugin-babel deduplicates runtime helpers
    // inserted by Babel. babel-preset-react-app uses
    // @babel/plugin-transform-runtime which already takes care of
    // this.
    runtimeHelpers: true
  }),
  jst(),
  resolve(),
  commonjs(),
  reactSvg({
    svgo: {multipass: true}
  })
];

const pageflowPackagePlugins = [
  alias({
    entries: {
      '$state': __dirname + '/' + pageflowPackageRoot + '/src/editor/state.js',
    }
  }),
  ...plugins
];

const ignoreJSXWarning = {
  onwarn: function(warning, warn) {
    // Ignore noisy warning
    // https://github.com/babel/babel/issues/9149
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    warn(warning);
  }
};

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
    external: externalPageflowUIEditorGlobalsAndCoreJs,
    plugins: pageflowPackagePlugins
  },
  {
    input: pageflowPackageRoot + '/src/testHelpers/index.js',
    output: {
      file: pageflowPackageRoot + '/testHelpers.js',
      format: 'esm'
    },
    external: externalPageflowEditorGlobalsAndCoreJs,
    plugins
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
    external: id => externalPageflowEditorGlobalsAndCoreJs(id) ||
                  externalScrolledDependenciesAndCoreJs(id),
    plugins
  },
  {
    input: pageflowScrolledPackageRoot + '/src/frontend/index.js',
    output: {
      file: pageflowScrolledPackageRoot + '/frontend.js',
      format: 'esm',
    },
    external: externalScrolledDependenciesAndCoreJs,
    plugins,
    ...ignoreJSXWarning
  },

  {
    input: pageflowScrolledPackageRoot + '/src/contentElements/editor.js',
    output: {
      file: pageflowScrolledPackageRoot + '/contentElements-editor.js',
      format: 'esm',
    },
    external: id => externalPageflowEditorGlobalsAndCoreJs(id) ||
                  externalScrolledDependenciesAndCoreJs(id),
    plugins
  },
  {
    input: pageflowScrolledPackageRoot + '/src/contentElements/frontend.js',
    output: {
      file: pageflowScrolledPackageRoot + '/contentElements-frontend.js',
      format: 'esm',
    },
    external: externalScrolledDependenciesAndCoreJs,
    plugins,
    ...ignoreJSXWarning
  }
];
