import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('#duplicateContentElement', () => {
    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {id: 1}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 10}],
          sections: [{id: 100, chapterId: 10}],
          contentElements: [
            {id: 1000, permaId: 1, sectionId: 100, position: 0, typeName: 'textBlock',
             configuration: {value: 'Some text'}},
            {id: 1001, permaId: 2, sectionId: 100, position: 1, typeName: 'inlineImage'}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    useFakeXhr(() => testContext);

    it('creates content element with same type and configuration', () => {
      const {entry} = testContext;
      const contentElement = entry.contentElements.first();

      const newContentElement = entry.duplicateContentElement(contentElement);

      expect(newContentElement.get('typeName')).toBe('textBlock');
      expect(newContentElement.configuration.get('value')).toBe('Some text');
    });

    it('posts to batch endpoint', () => {
      const {entry, requests} = testContext;
      const contentElement = entry.contentElements.first();

      entry.duplicateContentElement(contentElement);

      expect(requests[0].url).toBe('/editor/entries/1/scrolled/sections/100/content_elements/batch');
    });

    it('adds duplicated content element after original on server response', () => {
      const {entry, server} = testContext;
      const section = entry.sections.first();
      const contentElement = entry.contentElements.first();

      entry.duplicateContentElement(contentElement);

      server.respondWith(
        'PUT',
        /content_elements\/batch/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify([
          {id: 1000},
          {id: 1002, permaId: 3},
          {id: 1001}
        ])]
      );
      server.respond();

      expect(section.contentElements.pluck('position')).toEqual([0, 1, 2]);
      expect(section.contentElements.pluck('id')).toEqual([1000, 1002, 1001]);
    });

    it('selects duplicated content element after sync', () => {
      const {entry, server} = testContext;
      const contentElement = entry.contentElements.first();
      const listener = jest.fn();
      entry.on('selectContentElement', listener);

      const newContentElement = entry.duplicateContentElement(contentElement);

      server.respondWith(
        'PUT',
        /content_elements\/batch/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify([
          {id: 1000},
          {id: 1002, permaId: 3},
          {id: 1001}
        ])]
      );
      server.respond();

      expect(listener).toHaveBeenCalledWith(newContentElement);
    });
  });
});
