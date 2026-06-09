import {useFakeFeatures} from 'testHelpers/useFakeFeatures';

import {features} from 'pageflow/frontend';

describe('useFakeFeatures', () => {
  describe('with one feature', () => {
    useFakeFeatures('frontend', ['commenting']);

    it('marks the feature as enabled', () => {
      expect(features.isEnabled('commenting')).toBe(true);
    });
  });

  describe('with multiple features', () => {
    useFakeFeatures('frontend', ['commenting', 'image_srcset']);

    it('enables all listed features', () => {
      expect(features.isEnabled('commenting')).toBe(true);
      expect(features.isEnabled('image_srcset')).toBe(true);
    });
  });

  describe('with registered functions', () => {
    const fn = jest.fn();
    features.register('frontend', 'with_callback', fn);

    useFakeFeatures('frontend', ['with_callback']);

    it('invokes scope-registered callbacks for enabled features', () => {
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('when called multiple times', () => {
    useFakeFeatures('frontend', ['commenting']);
    useFakeFeatures('editor', ['special_content_element']);

    it('enables features from all calls', () => {
      expect(features.isEnabled('commenting')).toBe(true);
      expect(features.isEnabled('special_content_element')).toBe(true);
    });
  });

  describe('cleanup', () => {
    describe('inner describe enabling a feature', () => {
      useFakeFeatures('frontend', ['scoped_feature']);

      it('enables the feature inside', () => {
        expect(features.isEnabled('scoped_feature')).toBe(true);
      });
    });

    it('does not leak enabled features to sibling tests', () => {
      expect(features.isEnabled('scoped_feature')).toBe(false);
    });
  });
});
