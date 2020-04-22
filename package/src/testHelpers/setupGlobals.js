import _ from 'underscore';

import {state} from '$state';

/**
 * Setup global state for testing Backbone editro components.
 *
 * For some editor components like (some views or models) it's easier
 * to depend on the global mutable state (available via the `$state`
 * module alias) instead of injecting dependencies. This helper can be
 * used to test these components in isolation.
 *
 * @param {Object} mapping -
 *   Properties to set on the global state. Functions as values will
 *   be evaluated and the return value will be assigned instead.
 */
export const setupGlobals = function(mapping) {
  let globalsBackup;

  beforeEach(() => {
    if (globalsBackup) {
      throw new Error('There can only be one setupGlobals call per test.');
    }

    globalsBackup = {};

    _.each(mapping, function(value, key) {
      globalsBackup[key] = state[key];
      state[key] = typeof value === 'function' ? value.call(this) : value;
    });
  });

  afterEach(() => {
    _.each(mapping, function(_, key) {
      state[key] = globalsBackup[key];
    });

    globalsBackup = null;
  });
};
