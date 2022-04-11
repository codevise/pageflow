import {ContentElementTypeRegistry} from 'editor/api/ContentElementTypeRegistry';
import {Features} from 'pageflow/frontend';

import {useFakeTranslations} from 'pageflow/testHelpers';

describe('ContentElementTypeRegistry', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.content_element_categories.media.name': 'Media',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text block',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Inline image'
  });

  describe('groupedByCategory', () => {
    it('returns options passed to register grouped by category', () => {
      const registry = new ContentElementTypeRegistry({features: new Features()});
      registry.register('heading', {
        category: 'basic',
        supportedPositions: ['inline', 'wide']
      });
      registry.register('textBlock', {
        category: 'basic',
        supportedPositions: ['inline']
      });
      registry.register('inlineImage', {
        category: 'media',
        supportedPositions: ['inline', 'full']
      });

      const types = registry.groupedByCategory();

      expect(types).toMatchObject([
        {
          name: 'basic',
          contentElementTypes: [
            {
              typeName: 'heading',
              supportedPositions: ['inline', 'wide']
            },
            {
              typeName: 'textBlock',
              supportedPositions: ['inline']
            }
          ]
        },
        {
          name: 'media',
          contentElementTypes: [
            {
              typeName: 'inlineImage',
              supportedPositions: ['inline', 'full']
            }
          ]
        }
      ]);
    });

    it('defaults category to "basic"', () => {
      const registry = new ContentElementTypeRegistry({features: new Features()});
      registry.register('heading', {
        supportedPositions: ['inline', 'wide']
      });

      const types = registry.groupedByCategory();

      expect(types).toMatchObject([
        {
          name: 'basic',
          contentElementTypes: [
            {
              typeName: 'heading',
              supportedPositions: ['inline', 'wide']
            }
          ]
        }
      ]);
    });

    it('includes translated display names', () => {
      const registry = new ContentElementTypeRegistry({features: new Features()});
      registry.register('inlineImage', {
        category: 'media'
      });

      const types = registry.groupedByCategory();

      expect(types).toMatchObject([
        {
          displayName: 'Media',
          contentElementTypes: [
            {
              displayName: 'Inline image'
            }
          ]
        }
      ]);
    });

    it('filters out element types that reference disabled feature flag', () => {
      const features = new Features();
      const registry = new ContentElementTypeRegistry({features});
      registry.register('special', {
        supportedPositions: ['inline'],
        featureName: 'special_content_element'
      });

      const categories = registry.groupedByCategory();

      expect(categories).toEqual([]);
    });

    it('does not filter out element types that reference enabled feature flag', () => {
      const features = new Features();
      const registry = new ContentElementTypeRegistry({features});
      registry.register('special', {
        supportedPositions: ['inline'],
        featureName: 'special_content_element'
      });
      features.enable('editor', ['special_content_element'])

      const types = registry.groupedByCategory()[0].contentElementTypes;

      expect(types).toMatchObject([{
        typeName: 'special'
      }]);
    });
  });

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
