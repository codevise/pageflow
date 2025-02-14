import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('#deleteContentElement', () => {
    useFakeXhr(() => testContext);

    describe('for all content elements', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {id: 5, permaId: 50, position: 0},
                {id: 6, permaId: 60, position: 1}
              ]
            })
          });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('sends item with delete flag to batch endpoint', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElement(5);

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 6},
            {id: 5, _delete: true}
          ]
        });

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, 6]);

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([6]);
        expect(entry.contentElements.pluck('id')).toEqual([6]);
      });
    });

    describe('for content element between mergable content elements', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithCustomMerge', {
          merge(configurationA, configurationB) {
            return {items: configurationA.items.concat(configurationB.items)}
          }
        })

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {
                  id: 4,
                  permaId: 40,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['a', 'b']
                  }
                },
                {
                  id: 5,
                  permaId: 50,
                  position: 1,
                },
                {
                  id: 6,
                  permaId: 60,
                  position: 2,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['c']
                  }
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('merges the two adjacent content elements ', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElement(5);

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b', 'c']}},
            {id: 5, _delete: true},
            {id: 6, _delete: true}
          ]
        });

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b']);

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4]);
        expect(entry.contentElements.pluck('id')).toEqual([4]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b', 'c']);
      });
    });

    describe('for content element between mergable content elements of different type', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithCustomMerge', {
          merge(configurationA, configurationB) {
            return {}
          }
        });

        editor.contentElementTypes.register('otherContentElementWithCustomMerge', {
          merge(configurationA, configurationB) {
            return {}
          }
        });

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {
                  id: 4,
                  permaId: 40,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                },
                {
                  id: 5,
                  permaId: 50,
                  position: 1,
                },
                {
                  id: 6,
                  permaId: 60,
                  position: 2,
                  typeName: 'otherContentElementWithCustomMerge',
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('leaves adjacent content elements unchanged', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElement(5);

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4},
            {id: 6},
            {id: 5, _delete: true}
          ]
        });
      });
    });

    describe('for content element without two adjacent siblings', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithCustomMerge', {
          merge(configurationA, configurationB) {
            return {}
          }
        });

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {
                  id: 4,
                  permaId: 40,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                },
                {
                  id: 5,
                  permaId: 50,
                  position: 1,
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('leaves adjacent content element unchanged', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElement(5);

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4},
            {id: 5, _delete: true}
          ]
        });
      });
    });
  });
});
