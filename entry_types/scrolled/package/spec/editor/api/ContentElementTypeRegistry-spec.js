import {ContentElementTypeRegistry} from 'editor/api/ContentElementTypeRegistry';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';

describe('ContentElementTypeRegistry', () => {
  describe('#getSupported', () => {
    it('returns array including type supporting position of sibling', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, configuration: {position: 'inline'}}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('supports endOfSection insert options', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'endOfSection', id: 1});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('includes inline only elements even if sibling does not have a position', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, configuration: {}}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('includes inline only elements even if sibling has position full', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', {supportedPositions: ['inline']});
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, configuration: {position: 'full'}}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('includes type without specified supported positions', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('inlineImage');
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, configuration: {position: 'inline'}}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).toContain('inlineImage');
    });

    it('excludes type which do not support position of given sibling', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('inlineImage', {supportedPositions: ['inline']});
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, configuration: {position: 'sticky'}}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'before', id: 1});

      expect(types.map(type => type.typeName)).not.toContain('inlineImage');
    });

    it('excludes types with merge function if sibling has same type', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', { merge() {} });
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, typeName: 'textBlock'}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).not.toContain('textBlock');
    });

    it('includes types with merge function if both siblings have different type', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', { merge() {} });
      registry.register('inlineImage');
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, typeName: 'inlineImage'},
            {id: 2, typeName: 'inlineImage'}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).toContain('textBlock');
    });

    it('excludes types with merge function if sibling not mentioned in insert options has same type', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', { merge() {} });
      registry.register('inlineImage');
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, typeName: 'inlineImage'},
            {id: 2, typeName: 'textBlock'}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'after', id: 1});

      expect(types.map(type => type.typeName)).not.toContain('textBlock');
    });

    it('excludes types with merge function for endOfSection position if last element has same type', () => {
      const registry = new ContentElementTypeRegistry();
      registry.register('textBlock', { merge() {} });
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10}
          ],
          contentElements: [
            {id: 1, sectionId: 10, typeName: 'textBlock'}
          ]
        })
      });

      const types = registry.getSupported(entry, {at: 'endOfSection', id: 10});

      expect(types.map(type => type.typeName)).not.toContain('textBlock');
    });
  });
});
