import {ContentElementTypeRegistry} from 'editor/api/ContentElementTypeRegistry';
import {Features} from 'pageflow/frontend';

describe('ContentElementTypeRegistry', () => {
  describe('#toArray', () => {
    it('returns array of with options passed to register', () => {
      const registry = new ContentElementTypeRegistry({features: new Features()});
      registry.register('textBlock', {supportedPositions: ['inline']});

      const types = registry.toArray();

      expect(types).toMatchObject([{
        typeName: 'textBlock',
        supportedPositions: ['inline']
      }]);
    });

    it('filters out element types that reference disabled feature flag', () => {
      const features = new Features();
      const registry = new ContentElementTypeRegistry({features});
      registry.register('special', {
        supportedPositions: ['inline'],
        featureName: 'special_content_element'
      });

      const types = registry.toArray();

      expect(types).toEqual([]);
    });

    it('does not filter out element types that reference enabled feature flag', () => {
      const features = new Features();
      const registry = new ContentElementTypeRegistry({features});
      registry.register('special', {
        supportedPositions: ['inline'],
        featureName: 'special_content_element'
      });
      features.enable('editor', ['special_content_element'])

      const types = registry.toArray();

      expect(types).toMatchObject([{
        typeName: 'special'
      }]);
    });
  });
});
