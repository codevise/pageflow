import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('#insertContentElement', () => {
    useFakeXhr(() => testContext);

    describe('for sections', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              sections: [
                {id: 10}
              ],
              contentElements: [
                {id: 5, sectionId: 10, position: 0},
                {id: 6, sectionId: 10, position: 1}
              ]
            })
          });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('supports adding content element at end', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'endOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_element: {
            typeName: 'inlineImage',
            position: 2
          }
        });
      });

      it('triggers event on entry to select new content element', () => {
        const {entry} = testContext;
        const listener = jest.fn();
        entry.on('selectContentElement', listener);

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'endOfSection', id: 10});


        expect(listener).not.toHaveBeenCalled();

        testContext.server.respond(
          'POST', '/editor/entries/100/scrolled/sections/10/content_elements',
          [200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 5, permaId: 50
          })]
        );

        expect(listener).toHaveBeenCalledWith(entry.contentElements.get(5));
      });
    });

    describe('for all content elements', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});

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

      it('supports inserting before content element', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'before', id: 6});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage'},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 7, permaId: 70}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, 7, 6]);
        expect(entry.sections.first().contentElements.pluck('permaId')).toEqual([50, 70, 60]);
      });

      it('supports inserting after content element', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'after', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage'},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 7, permaId: 70}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, 7, 6]);
        expect(entry.sections.first().contentElements.pluck('permaId')).toEqual([50, 70, 60]);
      });

      it('triggers event on entry to select new content element', () => {
        const {entry} = testContext;
        const listener = jest.fn();
        entry.on('selectContentElement', listener);

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'after', id: 5});


        expect(listener).not.toHaveBeenCalled();

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 7, permaId: 70}, {id: 6, permaId: 60}
          ])]
        );

        expect(listener).toHaveBeenCalledWith(entry.contentElements.get(7));
      });
    });

    describe('for content element type with default configuration', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithDefaults', {
          defaultConfig: {
            some: 'value'
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
                {id: 5, permaId: 50, position: 0}
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('copies defaults to configuration', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'contentElementWithDefaults'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'contentElementWithDefaults', configuration: {some: 'value'}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.get(6).configuration.get('some')).toEqual('value');
      });
    });

    describe('for sibling with sticky position', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {id: 5, position: 0, configuration: {position: 'sticky'}}
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('gives inserted content element the same position', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage', configuration: {position: 'sticky'}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.get(6).configuration.get('position')).toEqual('sticky');
      });
    });

    describe('for sibling with full position', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {id: 5, position: 0, configuration: {position: 'full'}}
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('gives inserted content element inline position', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage', configuration: {position: 'inline'}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.last().configuration.get('position')).toEqual('inline');
      });
    });

    describe('for content elements with custom split function', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithCustomSplit', {
          split(configuration, at) {
            return [
              {items: configuration.items.slice(0, at)},
              {items: configuration.items.slice(at)}
            ]
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
                  position: 0
                },
                {
                  id: 5,
                  permaId: 50,
                  position: 1,
                  typeName: 'contentElementWithCustomSplit',
                  configuration: {
                    items: ['a', 'b', 'c']
                  }
                },
                {
                  id: 6,
                  permaId: 60,
                  position: 2
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('supports splitting content element', () => {
        const {entry, requests} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'split', id: 5, splitPoint: 2});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 4},
            {id: 5, configuration: {items: ['a', 'b']}},
            {typeName: 'inlineImage'},
            {typeName: 'contentElementWithCustomSplit', configuration: {items: ['c']}},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40},
            {id: 5, permaId: 50},
            {id: 7, permaId: 70},
            {id: 8, permaId: 80},
            {id: 6, permaId: 60}
          ])]
        );

        expect(section.contentElements.pluck('id')).toEqual([4, 5, 7, 8, 6]);
        expect(section.contentElements.pluck('permaId')).toEqual([40, 50, 70, 80, 60]);
      });

      it('updates configuration of split element only after request succeeds', () => {
        const {entry} = testContext;
        const splitContentElement = entry.contentElements.get(5);

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'split', id: 5, splitPoint: 2});

        expect(splitContentElement.configuration.get('items')).toEqual(['a', 'b', 'c']);

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40},
            {id: 5, permaId: 50},
            {id: 7, permaId: 70},
            {id: 8, permaId: 80},
            {id: 6, permaId: 60}
          ])]
        );

        expect(splitContentElement.configuration.get('items')).toEqual(['a', 'b']);
      });

      it('does not add content elements if request fails', () => {
        const {entry, requests} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'split', id: 5, splitPoint: 2});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [404, {}, '']
        );

        expect(section.contentElements.pluck('id')).toEqual([4, 5, 6]);
        expect(entry.contentElements.pluck('id')).toEqual([4, 5, 6]);
      });
    });
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

  describe('#moveContentElement', () => {
    useFakeXhr(() => testContext);

    describe('for all content elements', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {id: 5, permaId: 50, position: 0, typeName: 'inlineImage'},
                {id: 6, permaId: 60, position: 1, typeName: 'inlineImage'},
                {id: 7, permaId: 70, position: 2, typeName: 'inlineImage'}
              ]
            })
          });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('supports moving before other content element', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(7, {at: 'before', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 7},
            {id: 5},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 7, permaId: 70}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([7, 5, 6]);
        expect(entry.sections.first().contentElements.pluck('position')).toEqual([0, 1, 2]);
      });

      it('supports moving after other content element', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(6, {at: 'after', id: 7});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 5},
            {id: 7},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 7, permaId: 70}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, 7, 6]);
        expect(entry.sections.first().contentElements.pluck('position')).toEqual([0, 1, 2]);
      });
    });

    describe('when moved next to sibling with sticky position', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
        editor.contentElementTypes.register('soundDisclaimer', {supportedPositions: ['inline']});

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100,
          },
          {
            entryTypeSeed: normalizeSeed({
              contentElements: [
                {id: 3, position: 0, typeName: 'soundDisclaimer'},
                {id: 4, position: 0, typeName: 'inlineImage'},
                {id: 5, position: 1, typeName: 'inlineImage', configuration: {position: 'sticky'}}
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('gives moved content element the same position', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(4,
                                 {at: 'before', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 3},
            {id: 4, configuration: {position: 'sticky'}},
            {id: 5},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 3, permaId: 30}, {id: 4, permaId: 40}, {id: 5, permaId: 50}
          ])]
        );

        expect(entry.contentElements.map(c => c.configuration.get('position')))
          .toEqual([undefined, 'sticky', 'sticky']);
      });

      it('does not change position if sticky position is not supported', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(3,
                                 {at: 'before', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4},
            {id: 3},
            {id: 5},
          ]
        });
      });
    });

    describe('when moved inside content element with custom split function', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
        editor.contentElementTypes.register('contentElementWithCustomSplit', {
          split(configuration, at) {
            return [
              {items: configuration.items.slice(0, at)},
              {items: configuration.items.slice(at)}
            ]
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
                  typeName: 'inlineImage'
                },
                {
                  id: 5,
                  permaId: 50,
                  position: 0,
                  typeName: 'inlineImage'
                },
                {
                  id: 6,
                  permaId: 60,
                  position: 1,
                  typeName: 'contentElementWithCustomSplit',
                  configuration: {
                    items: ['a', 'b', 'c']
                  }
                },
                {
                  id: 7,
                  permaId: 70,
                  position: 2,
                  typeName: 'inlineImage'
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('supports splitting content element', () => {
        const {entry, requests} = testContext;
        const section = entry.sections.first();

        entry.moveContentElement(4,
                                 {at: 'split', id: 6, splitPoint: 2});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 5},
            {id: 6, configuration: {items: ['a', 'b']}},
            {id: 4},
            {typeName: 'contentElementWithCustomSplit', configuration: {items: ['c']}},
            {id: 7}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50},
            {id: 6, permaId: 60},
            {id: 4, permaId: 40},
            {id: 8, permaId: 80},
            {id: 7, permaId: 70},
          ])]
        );

        expect(section.contentElements.pluck('id')).toEqual([5, 6, 4, 8, 7]);
        expect(section.contentElements.pluck('permaId')).toEqual([50, 60, 40, 80, 70]);
        expect(section.contentElements.pluck('position')).toEqual([0, 1, 2, 3, 4]);
      });
    });

    describe('for content element between mergable content elements', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
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
                  typeName: 'inlineImage'
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

      it('merges the two adjacent content elements when element is moved away', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(5, {at: 'after', id: 6});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b', 'c']}},
            {id: 5},
            {id: 6, _delete: true}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40}, {id: 5, permaId: 50}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b', 'c']);
      });

      it('does not merge the two adjacent content elements when element is moved to same position', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(5, {at: 'after', id: 4});

        expect(requests.length).toEqual(0);

        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b']);
        expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['c']);
      });
    });

    describe('when moving content elements between sections', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
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
              sections: [
                {id: 10},
                {id: 20}
              ],
              contentElements: [
                {
                  id: 14,
                  sectionId: 10,
                  permaId: 140,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['a', 'b']
                  }
                },
                {
                  id: 15,
                  sectionId: 10,
                  permaId: 150,
                  position: 1,
                  typeName: 'inlineImage'
                },
                {
                  id: 16,
                  sectionId: 10,
                  permaId: 160,
                  position: 2,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['c']
                  }
                },
                {
                  id: 25,
                  sectionId: 20,
                  permaId: 250,
                  position: 0,
                  typeName: 'inlineImage'
                },
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('merges mergable siblings in source section in a separate request', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(15, {at: 'after', id: 25});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/20/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 25},
            {id: 15},
          ]
        });
        expect(requests[1].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[1].requestBody)).toEqual({
          content_elements: [
            {id: 14, configuration: {items: ['a', 'b', 'c']}},
            {id: 16, _delete: true}
          ]
        });

        testContext.server.respondWith(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 14, permaId: 140}
          ])]
        );
        testContext.server.respondWith(
          'PUT', '/editor/entries/100/scrolled/sections/20/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 25, permaId: 250}, {id: 15, permaId: 150}
          ])]
        );
        testContext.server.respond();

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([14]);
        expect(entry.sections.last().contentElements.pluck('id')).toEqual([25, 15]);
        expect(entry.contentElements.get(14).configuration.get('items')).toEqual(['a', 'b', 'c']);
      });

      it('makes no request for source section if no merge is required', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(25, {at: 'before', id: 14});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(requests.length).toBe(1);
      });
    });

    describe('for content element between mergable content elements of different type', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
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
                  typeName: 'inlineImage'
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

        entry.moveContentElement(5, {at: 'before', id: 4});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 5},
            {id: 4},
            {id: 6}
          ]
        });
      });
    });

    describe('for content element without two adjacent siblings', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
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
                  typeName: 'inlineImage'
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

        entry.moveContentElement(5, {at: 'before', id: 4});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 5},
            {id: 4}
          ]
        });
      });
    });

    describe('when moved from between elements with custom merge and split function into sibling', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
        editor.contentElementTypes.register('contentElementWithCustomMerge', {
          merge(configurationA, configurationB) {
            return {items: configurationA.items.concat(configurationB.items)}
          },

          split(configuration, at) {
            return [
              {items: configuration.items.slice(0, at)},
              {items: configuration.items.slice(at)}
            ]
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
                  typeName: 'inlineImage'
                },
                {
                  id: 6,
                  permaId: 60,
                  position: 2,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['c', 'd']
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

      it('updates both siblings when moved into previous sibling', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(5, {at: 'split', id: 4, splitPoint: 1});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a']}},
            {id: 5},
            {id: 6, configuration: {items: ['b', 'c', 'd']}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a']);
        expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['b', 'c', 'd']);
      });

      it('updates both siblings when moved into next sibling', () => {
        const {entry, requests} = testContext;

        entry.moveContentElement(5, {at: 'split', id: 6, splitPoint: 1});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b', 'c']}},
            {id: 5},
            {id: 6, configuration: {items: ['d']}}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b', 'c']);
        expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['d']);
      });
    });
  });
});
