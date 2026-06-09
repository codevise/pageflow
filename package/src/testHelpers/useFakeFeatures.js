import {features} from 'pageflow/frontend';

/**
 * Enable feature flags for the surrounding describe block.
 *
 * Each `beforeEach` calls `features.enable(scope, names)`, which both
 * flips `features.isEnabled` to true for the given names and runs any
 * functions registered via `features.register` for them. Each
 * `afterEach` restores the set of enabled features to whatever was
 * enabled before the helper was invoked, so suites do not leak state
 * into each other.
 *
 * Multiple calls within the same describe block (or across nested
 * describes) compose: each call adds its own features on top of
 * whatever previous `useFakeFeatures` calls already enabled.
 *
 * @param {String} scope -
 *   Name of the scope to enable the features in (e.g. `'frontend'`,
 *   `'editor'`).
 * @param {String[]} names -
 *   Feature names to enable in the given scope.
 *
 * @example
 * import {useFakeFeatures} from 'pageflow/testHelpers';
 * import {features} from 'pageflow/frontend';
 *
 * describe('...', () => {
 *   useFakeFeatures('frontend', ['commenting']);
 *
 *   it('...', () => {
 *     expect(features.isEnabled('commenting')).toBe(true);
 *   });
 * });
 */
export function useFakeFeatures(scope, names) {
  let originalEnabledFeatureNames;

  beforeEach(() => {
    originalEnabledFeatureNames = features.enabledFeatureNames;

    features.enable(scope, names);
  });

  afterEach(() => {
    features.enabledFeatureNames = originalEnabledFeatureNames;
  });
}
