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
        editor.contentElementTypes.register('inlineImage', {
          supportedPositions: ['inline', 'wide', 'full', 'backdrop'],
          defaultConfig: {
            some: 'value'
          }
        });

        editor.contentElementTypes.register('panorama', {
          supportedPositions: ['inline', 'wide', 'full', 'backdrop'],
          defaultConfig: {
            position: 'wide'
          }
        });

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
                {id: 5, sectionId: 10, position: 0, configuration: {position: 'full'}},
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
            position: 2,
            configuration: {some: 'value'}
          }
        });
      });

      it('uses position from default config when adding content element at end', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'panorama'},
                                   {at: 'endOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_element: {
            typeName: 'panorama',
            position: 2,
            configuration: {position: 'wide'}
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

      it('supports adding content element in backdrop', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {typeName: 'inlineImage', configuration: {position: 'backdrop', some: 'value'}},
            {id: 5},
            {id: 6}
          ]
        });
      });

      it('sets backdropContentElement of section', () => {
        const {entry} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: section.id});

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 7, permaId: 70}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(section.configuration.get('backdropContentElement')).toEqual(70);
      });

      it('ignores position from default config when inserting content element in backdrop', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'panorama'},
                                   {at: 'backdropOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {typeName: 'panorama', configuration: {position: 'backdrop'}},
            {id: 5},
            {id: 6}
          ]
        });
      });

      it('ignores position of first element when inserting content element in backdrop', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {typeName: 'inlineImage', configuration: {position: 'backdrop'}},
            {id: 5},
            {id: 6}
          ]
        });
      });

      it('triggers event on entry to select new backdrop content element', () => {
        const {entry} = testContext;
        const listener = jest.fn();
        entry.on('selectContentElement', listener);

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: 10});

        expect(listener).not.toHaveBeenCalled();

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 7, permaId: 70}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(listener).toHaveBeenCalledWith(entry.contentElements.get(7), expect.anything());
      });
    });

    describe('for empty sections', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {
          supportedPositions: ['inline', 'wide', 'backdrop'],
          defaultConfig: {
            some: 'value'
          }
        });

        editor.contentElementTypes.register('panorama', {
          supportedPositions: ['inline', 'wide', 'backdrop'],
          defaultConfig: {
            position: 'wide'
          }
        });

        testContext.entry = factories.entry(
          ScrolledEntry,
          {
            id: 100
          },
          {
            entryTypeSeed: normalizeSeed({
              sections: [
                {id: 10}
              ]
            })
          });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('supports adding content element in backdrop', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_element: {
            typeName: 'inlineImage',
            position: 0,
            configuration: {position: 'backdrop'}
          }
        });
      });

      it('sets backdropContentElement of section', () => {
        const {entry} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: section.id});

        testContext.server.respond(
          'POST', '/editor/entries/100/scrolled/sections/10/content_elements',
          [200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 5, permaId: 50
          })]
        );

        expect(section.configuration.get('backdropContentElement')).toEqual(50);
      });

      it('ignores position from default config when inserting content element in backdrop', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'panorama'},
                                   {at: 'backdropOfSection', id: 10});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_element: {
            typeName: 'panorama',
            position: 0,
            configuration: {position: 'backdrop'}
          }
        });
      });

      it('triggers event on entry to select new backdrop content element', () => {
        const {entry} = testContext;
        const listener = jest.fn();
        entry.on('selectContentElement', listener);

        entry.insertContentElement({typeName: 'inlineImage'},
                                   {at: 'backdropOfSection', id: 10});

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
                {id: 5, permaId: 50, position: 0, typeName: 'inlineImage'},
                {id: 6, permaId: 60, position: 1, typeName: 'inlineImage'}
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

        expect(listener).toHaveBeenCalledWith(
          entry.contentElements.get(7), {range: undefined}
        );
      });
    });

    describe('for content element type with default configuration', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
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
                {id: 5, permaId: 50, position: 0, typeName: 'inlineImage'}
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

    describe('for sibling with inline position', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {});
        editor.contentElementTypes.register('heading', {
          defaultConfig: {position: 'wide'}
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
                  id: 5,
                  position: 0,
                  typeName: 'inlineImage',
                  configuration: {position: 'inline'}
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('uses position from default config', () => {
        const {entry, requests} = testContext;

        entry.insertContentElement({typeName: 'heading'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'heading', configuration: {position: 'wide'}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.get(6).configuration.get('position')).toEqual('wide');
      });
    });

    describe('for sibling with sticky position', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('inlineImage', {
          supportedPositions: ['inline', 'sticky']
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
                  id: 5,
                  position: 0,
                  typeName: 'inlineImage',
                  configuration: {position: 'sticky'}
                }
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      it('gives inserted content element the same position if supported', () => {
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

      it('falls back to default config position if sibiling position not supported', () => {
        const {entry, requests} = testContext;

        editor.contentElementTypes.register('heading', {
          supportedPositions: ['inline', 'wide'],
          defaultConfig: {position: 'wide'}
        });

        entry.insertContentElement({typeName: 'heading'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'heading', configuration: {position: 'wide'}},
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.get(6).configuration.get('position')).toEqual('wide');
      });

      it('falls back to inline position if sibiling position not supported', () => {
        const {entry, requests} = testContext;

        editor.contentElementTypes.register('heading', {
          supportedPositions: ['inline', 'wide']
        });

        entry.insertContentElement({typeName: 'heading'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {
              typeName: 'heading',
              configuration: expect.not.objectContaining({position: 'sticky'}),
            }
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(entry.contentElements.get(6).configuration.get('position')).not.toBeDefined();
      });

      it('ignores position from default config', () => {
        const {entry, requests} = testContext;

        editor.contentElementTypes.register('panorama', {
          supportedPositions: ['inline', 'wide', 'sticky'],
          defaultConfig: {position: 'wide'}
        });

        entry.insertContentElement({typeName: 'panorama'},
                                   {at: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'panorama', configuration: {position: 'sticky'}},
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

    describe('for content elements with custom merge function', () => {
      beforeEach(() => {
        editor.contentElementTypes.register('contentElementWithCustomMerge', {
          defaultConfig: {
            items: ['new']
          },

          merge(configurationA, configurationB) {
            return {items: configurationA.items.concat(configurationB.items)}
          },

          getLength(configuration) {
            return configuration.items?.length || 0
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
                  id: 5,
                  permaId: 50,
                  position: 1,
                  typeName: 'contentElementWithCustomMerge',
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

      it('updates mergable sibling instead of inserting', () => {
        const {entry, requests} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'contentElementWithCustomMerge'},
                                   {at: 'after', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5, configuration: {items: ['a', 'b', 'c', 'new']}},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50},
            {id: 6, permaId: 60}
          ])]
        );

        expect(section.contentElements.pluck('id')).toEqual([5, 6]);
        expect(section.contentElements.pluck('permaId')).toEqual([50, 60]);
      });

      it('updates mergable adjacent element instead of inserting', () => {
        const {entry, requests} = testContext;
        const section = entry.sections.first();

        entry.insertContentElement({typeName: 'contentElementWithCustomMerge'},
                                   {at: 'before', id: 6});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5, configuration: {items: ['a', 'b', 'c', 'new']}},
            {id: 6}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50},
            {id: 6, permaId: 60}
          ])]
        );

        expect(section.contentElements.pluck('id')).toEqual([5, 6]);
        expect(section.contentElements.pluck('permaId')).toEqual([50, 60]);
      });

      it('triggers selectContentElement for target content element with range', () => {
        const {entry, server} = testContext;
        const listener = jest.fn();

        entry.on('selectContentElement', listener);
        entry.insertContentElement({typeName: 'contentElementWithCustomMerge'},
                                   {at: 'after', id: 5});

        server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}, {id: 6, permaId: 60}
          ])]
        );

        expect(listener).toHaveBeenCalledWith(
          entry.contentElements.get(5),
          {range: [3, 4]}
        );
      });
    });
  });
});
