import {ContentElementTypeRegistry} from 'editor/api/ContentElementTypeRegistry';

describe('ContentElementTypeRegistry', () => {
  describe('#getSupported', () => {
    it('returns array including type supporting given position', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});

      const types = registry.getSupported({position: 'inline'});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('includes type without specified supported positions', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('inlineImage');

      const types = registry.getSupported({position: 'inline'});

      expect(types.map(type => type.typeName)).toContain('inlineImage');
    });

    it('excludes type which do not support given position', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('inlineImage', {supportedPositions: ['inline']});

      const types = registry.getSupported({position: 'sticky'});

      expect(types.map(type => type.typeName)).not.toContain('inlineImage');
    });
  });
});
