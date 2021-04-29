import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';

describe('ContentElement', () => {
  describe('getAvailablePositions', () => {
    beforeEach(() => {
      editor.contentElementTypes.register('inlineImage', {});
      editor.contentElementTypes.register('soundDisclaimer', {supportedPositions: ['inline']});
    })

    it('returns positions for left layout by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'sticky', 'wide', 'full']);
    });

    it('returns positions for center layout if parent section uses that', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'left', 'right', 'wide', 'full']);
    });

    it('filters by positions supported by content element type', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'soundDisclaimer'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline']);
    });
  })
});
