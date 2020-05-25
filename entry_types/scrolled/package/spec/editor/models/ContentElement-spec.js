import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';

describe('ContentElement', () => {
  describe('getAvailablePositions', () => {
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
              {id: 5, sectionId: 1}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'sticky', 'full']);
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
              {id: 5, sectionId: 1}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'left', 'right', 'full']);
    });
  })
});
