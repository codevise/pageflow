import {browser} from './browser';

/**
 * Let plugins register functions which extend the editor or
 * slideshow with certain functionality when a named feature is
 * enabled.
 *
 * @alias pageflow.features
 * @since 0.9
 */
export class Features {
  /** @lends pageflow.features */

  /** @api private */
  constructor() {
    this.registry = {};
    this.enabledFeatureNames = [];
  }

  /**
   * `pageflow.features` has been renamed to `pageflow.browser`.
   * @deprecated
   */
  has(/* arguments */) {
    return browser.has.apply(browser, arguments);
  }

  /**
   * Register a function to configure a feature when it is active.
   *
   * @param {String} scope - Name of the scope the passed function
   *   shall be called in.
   * @param name [String] Name of the feature
   * @param fn [Function] Function to call when the given feature
   *   is activate.
   */
  register(scope, name, fn) {
    this.registry[scope] = this.registry[scope] || {};
    this.registry[scope][name] = this.registry[scope][name] || [];
    this.registry[scope][name].push(fn);
  }

  /**
   * Check if a feature as been enabled.
   *
   * @param name [String]
   * @return [Boolean]
   */
  isEnabled(name) {
    return this.enabledFeatureNames.includes(name);
  }

  /** @api private */
  enable(scope, names) {
    var fns = this.registry[scope] || {};
    this.enabledFeatureNames = this.enabledFeatureNames.concat(names);

    names.forEach(function(name) {
      (fns[name] || []).forEach(function(fn) {
        fn();
      });
    });
  }
}

export const features = new Features();
