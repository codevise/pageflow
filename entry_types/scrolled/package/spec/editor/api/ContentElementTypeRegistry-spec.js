import {ContentElementTypeRegistry} from 'editor/api/ContentElementTypeRegistry';

describe('ContentElementTypeRegistry', () => {
  describe('#toArray', () => {
    it('returns array of with options passed to register', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});

      const types = registry.toArray();

      expect(types).toMatchObject([{
        typeName: 'textBlock',
        supportedPositions: ['inline']
      }]);
    });
  });
});
