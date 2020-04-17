import _ from 'underscore';
import {log, debugMode} from '../base';
/**
 * Browser feature detection.
 *
 * @since 0.9
 */
export const browser = (function(){
  var tests = {},
      results = {};

  let ready;
  let readyPromise = new Promise(function(resolve) {
    ready = resolve;
  });


  return {
    off: {},
    on: {},
    unset: {},

    /**
     * Add a feature test.
     *
     * @param name [String] Name of the feature. Can contain whitespace.
     * @param test [Function] A function that either returns `true` or
     *   `false` or a promise that resolves to `true` or `false`.
     * @memberof pageflow.browser
     */
    feature: function(name, test) {
      var s = name.replace(/ /g, '_');

      this.off[s] = function() {
        window.localStorage['override ' + name] = 'off';
        log('Feature off: ' + name, {force: true});
      };

      this.on[s] = function() {
        window.localStorage['override ' + name] = 'on';
        log('Feature on: ' + name, {force: true});
      };

      this.unset[s] = function() {
        window.localStorage.removeItem('override ' + name);
        log('Feature unset: ' + name, {force: true});
      };

      tests[name] = test;
    },

    /**
     * Check whether the browser has a specific feature. This method
     * may only be called after the `#ready` promise is resolved.
     *
     * @param name [String] Name of the feature.
     * @return [Boolean]
     * @memberof pageflow.browser
     */
    has: function(name) {
      if (this.ready().state() != 'resolved') {
        throw 'Feature detection has not finished yet.';
      }

      if (results[name] === undefined) {
        throw 'Unknown feature "' + name +'".';
      }

      return results[name];
    },

    /**
     * A promise that is resolved once feature detection has finished.
     *
     * @return Promise
     * @memberof pageflow.browser
     */
    ready: function() {
      return readyPromise;
    },

    /** @api private */
    detectFeatures: function() {
      var promises = {};

      var asyncHas = function(name) {
        var runTest = function() {
          var value, underscoredName = name.replace(/ /g, '_');

          if (debugMode() && location.href.indexOf('&has=' + underscoredName) >= 0) {
            value = location.href.indexOf('&has=' + underscoredName + '_on') >= 0;
            log('FEATURE OVERRIDDEN ' + name + ': ' + value, {force: true});
            return value;
          }
          else if ((debugMode() || window.PAGEFLOW_ALLOW_FEATURE_OVERRIDES) &&
                   window.localStorage &&
                   typeof window.localStorage['override ' + name] !== 'undefined') {
            value = (window.localStorage['override ' + name] === 'on');
            log('FEATURE OVERRIDDEN ' + name + ': ' + value, {force: true});
            return value;
          }
          else {
            return tests[name](asyncHas);
          }
        };

        promises[name] = promises[name] || Promise.all([runTest(name)]);
        return promises[name];
      };

      asyncHas.not = function(name) {
        return asyncHas(name).pipe(function(result) {
          return !result;
        });
      };

      asyncHas.all = function(/* arguments */) {
        return Promise.resolve().apply(null, arguments).pipe(function(/* arguments */) {
          return _.all(arguments);
        });
      };

      Promise.resolve().apply(null, _.map(_.keys(tests), function(name) {
        return asyncHas(name).then(function(result) {
          var cssClassName = name.replace(/ /g, '_');

          // TODO: Replace $
          $('body').toggleClass('has_' + cssClassName, !!result);
          $('body').toggleClass('has_no_' + cssClassName, !result);

          results[name] = !!result;
        });
      })).then(ready());

      return this.ready();
    }
  };
}());
