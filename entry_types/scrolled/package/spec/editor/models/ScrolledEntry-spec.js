import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals, useFakeTranslations} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';
import {Model} from 'backbone';

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

        entry.moveContentElement({id: 7}, {at: 'before', id: 5});

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

        entry.moveContentElement({id: 6}, {at: 'after', id: 7});

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

        entry.moveContentElement({id: 4},
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

        entry.moveContentElement({id: 3},
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

        entry.moveContentElement({id: 4},
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

        entry.moveContentElement({id: 5}, {at: 'after', id: 6});

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

        entry.moveContentElement({id: 5}, {at: 'after', id: 4});

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

        entry.moveContentElement({id: 15}, {at: 'after', id: 25});

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

        entry.moveContentElement({id: 25}, {at: 'before', id: 14});

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

        entry.moveContentElement({id: 5}, {at: 'before', id: 4});

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

        entry.moveContentElement({id: 5}, {at: 'before', id: 4});

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

        entry.moveContentElement({id: 5}, {at: 'split', id: 4, splitPoint: 1});

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

        entry.moveContentElement({id: 5}, {at: 'split', id: 6, splitPoint: 1});

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

    describe('for part of content element in range', () => {
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
                  id: 4,
                  permaId: 40,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['a', 'b', 'c', 'd']
                  }
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

      describe('when moving suffix after other content element', () => {
        it('updates source element and creates new element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [2, 4]},
                                   {at: 'after', id: 5});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'b']}},
              {id: 5},
              {typeName: 'contentElementWithCustomMerge', configuration: {items: ['c', 'd']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['c', 'd']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [2, 4]},
                                   {at: 'after', id: 5});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(6),
            {range: [0, 2]}
          );
        });
      });

      describe('when moving prefix after other content element', () => {
        it('updates source element and creates new element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [0, 2]},
                                   {at: 'after', id: 5});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['c', 'd']}},
              {id: 5},
              {typeName: 'contentElementWithCustomMerge', configuration: {items: ['a', 'b']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['c', 'd']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['a', 'b']);
        });
      });

      describe('when moving infix after other content element', () => {
        it('updates source element and creates new element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'after', id: 5});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'c', 'd']}},
              {id: 5},
              {typeName: 'contentElementWithCustomMerge', configuration: {items: ['b']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'c', 'd']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['b']);
        });
      });

      describe('when moving prefix inside content element', () => {
        it('updates element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [0, 1]},
                                   {at: 'split', id: 4, splitPoint: 2});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['b', 'a', 'c', 'd']}},
              {id: 5},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['b', 'a', 'c', 'd']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [0, 1]},
                                   {at: 'split', id: 4, splitPoint: 2});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(4),
            {range: [1, 2]}
          );
        });
      });

      describe('when moving suffix inside content element', () => {
        it('updates element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [2, 4]},
                                   {at: 'split', id: 4, splitPoint: 1});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'c', 'd', 'b']}},
              {id: 5},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'c', 'd', 'b']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [2, 4]},
                                   {at: 'split', id: 4, splitPoint: 1});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(4),
            {range: [1, 3]}
          );
        });
      });

      describe('when moving infix to beginning of content element', () => {
        it('updates element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'before', id: 4});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['b', 'a', 'c', 'd']}},
              {id: 5},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['b', 'a', 'c', 'd']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'before', id: 4});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(4),
            {range: [0, 1]}
          );
        });
      });

      describe('when moving infix to end of content element', () => {
        it('updates element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'after', id: 4});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'c', 'd', 'b']}},
              {id: 5},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'c', 'd', 'b']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'after', id: 4});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(4),
            {range: [3, 4]}
          );
        });
      });

      describe('when moving infix inside content element', () => {
        it('updates element', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'split', id: 4, splitPoint: 3});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'c', 'b', 'd']}},
              {id: 5},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'c', 'b', 'd']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'split', id: 4, splitPoint: 3});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(4),
            {range: [2, 3]}
          );
        });
      });
    });

    describe('for multiple mergable content elements', () => {
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
                  id: 4,
                  permaId: 40,
                  position: 0,
                  typeName: 'contentElementWithCustomMerge',
                  configuration: {
                    items: ['a', 'b', 'c']
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
                    items: ['x', 'y', 'z']
                  }
                },
              ]
            })
          }
        );
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      describe('moving part before other content element', () => {
        it('updates both elements', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'after', id: 5});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'c']}},
              {id: 5},
              {id: 6, configuration: {items: ['b', 'x', 'y', 'z']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'c']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['b', 'x', 'y', 'z']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [1, 2]},
                                   {at: 'after', id: 5});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(6),
            {range: [0, 1]}
          );
        });
      });

      describe('moving part after other content element', () => {
        it('updates both elements', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [2, 3]},
                                   {at: 'after', id: 6});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['a', 'b']}},
              {id: 5},
              {id: 6, configuration: {items: ['x', 'y', 'z', 'c']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['x', 'y', 'z', 'c']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [2, 3]},
                                   {at: 'after', id: 6});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(6),
            {range: [3, 4]}
          );
        });
      });

      describe('moving part inside other content element', () => {
        it('updates both elements', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [0, 2]},
                                   {at: 'split', id: 6, splitPoint: 1});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 4, configuration: {items: ['c']}},
              {id: 5},
              {id: 6, configuration: {items: ['x', 'a', 'b', 'y', 'z']}},
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([4, 5, 6]);
          expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['c']);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['x', 'a', 'b', 'y', 'z']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4, range: [0, 2]},
                                   {at: 'split', id: 6, splitPoint: 1});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 4, permaId: 40}, {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(6),
            {range: [1, 3]}
          );
        });
      });

      describe('moving whole content element inside other content element', () => {
        it('deletes moved element and updates target', () => {
          const {entry, requests} = testContext;

          entry.moveContentElement({id: 4, range: [0, 3]},
                                   {at: 'split', id: 6, splitPoint: 1});

          expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
          expect(JSON.parse(requests[0].requestBody)).toEqual({
            content_elements: [
              {id: 5},
              {id: 6, configuration: {items: ['x', 'a', 'b', 'c', 'y', 'z']}},
              {id: 4, _delete: true}
            ]
          });

          testContext.server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, 6]);
          expect(entry.contentElements.get(6).configuration.get('items')).toEqual(['x', 'a', 'b', 'c', 'y', 'z']);
        });

        it('triggers selectContentElement for target content element with range', () => {
          const {entry, server} = testContext;
          const listener = jest.fn();

          entry.on('selectContentElement', listener);
          entry.moveContentElement({id: 4},
                                   {at: 'split', id: 6, splitPoint: 1});

          server.respond(
            'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
            [200, {'Content-Type': 'application/json'}, JSON.stringify([
              {id: 5, permaId: 50}, {id: 6, permaId: 60}
            ])]
          );

          expect(listener).toHaveBeenCalledWith(
            entry.contentElements.get(6),
            {range: [1, 4]}
          );
        });
      });
    });
  });

  describe('getTypographyVariants', () => {
    it('returns empty arrays by default', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values, translationKeys] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual([]);
      expect(translationKeys).toEqual([]);
    });

    it('selects typography rules based on content element type name', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-large': {
                  fontSize: '3rem'
                },
                'someElement-small': {
                  fontSize: '2rem'
                }
              }
            },
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual(['large', 'small']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'

      useFakeTranslations({
        [`${commonPrefix}.someElement-large`]: 'Large',
        [`${commonPrefix}.someElement-small`]: 'Small'
      });

      it('returns translated display names', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-small': {
                    fontSize: '2rem'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getTypographyVariants({contentElement});

        expect(texts).toEqual([
          'Large',
          'Small'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.someElement-large`]: 'Large',
        [`${commonPrefix}.someElement-small`]: 'Small',
        [`${themePrefix}.typography_variants.someElement-large`]: 'Custom Large',
        [`${themePrefix}.typography_variants.someElement-small`]: 'Custom Small'
      });

      it('prefers theme specific translations', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-small': {
                    fontSize: '2rem'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getTypographyVariants({contentElement});

        expect(texts).toEqual([
          'Custom Large',
          'Custom Small'
        ]);
      });
    });

    it('supports filtering by additional prefix', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-heading-large': {
                  fontSize: '3rem'
                },
                'someElement-heading-small': {
                  fontSize: '2rem'
                },
                'someElement-body-highlight': {
                  fontSize: '1rem'
                }
              }
            },
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement, prefix: 'heading'});

      expect(values).toEqual(['large', 'small']);
    });

    it('filters out legacy variants', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            ...normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-largeAccent': {
                    fontSize: '2rem',
                    color: 'var(--theme-accent-color)'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            }),
            legacyTypographyVariants: {
              largeAccent: {
                variant: 'large',
                paletteColor: 'accent'
              }
            }
          }
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual(['large']);
    });
  });

  describe('createLegacyTypographyVariantDelegator', () => {
    it('delegates model methods', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {},
            ...normalizeSeed()
          }
        }
      );
      const model = new Model();
      const listener = jest.fn();

      const delegator = entry.createLegacyTypographyVariantDelegator({model});
      delegator.on('change', listener);
      delegator.set('some', 'value');

      expect(delegator.get('some')).toEqual('value');
      expect(listener).toHaveBeenCalled();
    });

    it('leaves properties unchanged for non-legacy typographyVariant', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'sm',
        paletteColor: 'primary'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });

      expect(delegator.get('typographyVariant')).toEqual('sm');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('rewrites legacy typographyVariant to paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('accent');
    });

    it('supports rewriting to default variant', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              accent: {
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'accent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor',
      });

      expect(delegator.get('typographyVariant')).toBeUndefined();
      expect(delegator.get('paletteColor')).toEqual('accent');
    });

    it('allows overriding legacy typographyVariant paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('paletteColor', 'primary')

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('primary');
    });

    it('allows overriding legacy typographyVariant paletteColor with auto value', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent'
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });
      delegator.set('paletteColor', undefined)

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toBeUndefined();
    });

    it('ignores blank paletteColor', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            legacyTypographyVariants: {
              lgAccent: {
                variant: 'lg',
                paletteColor: 'accent'
              }
            },
            ...normalizeSeed()
          }
        }
      );
      const model = new Model({
        typographyVariant: 'lgAccent',
        paletteColor: ''
      });

      const delegator = entry.createLegacyTypographyVariantDelegator({
        model,
        paletteColorPropertyName: 'paletteColor'
      });

      expect(delegator.get('typographyVariant')).toEqual('lg');
      expect(delegator.get('paletteColor')).toEqual('accent');
    });
  });

  describe('getContentElementVariants', () => {
    it('returns empty arrays by default', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values, translationKeys] = entry.getContentElementVariants({contentElement});

      expect(values).toEqual([]);
      expect(translationKeys).toEqual([]);
    });

    it('selects typography rules based on content element type name', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                'someElement-blue': {
                  surface_color: 'blue'
                },
                'someElement-green': {
                  surface_color: 'green'
                }
              }
            },
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getContentElementVariants({contentElement});

      expect(values).toEqual(['blue', 'green']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.content_element_variants'

      useFakeTranslations({
        [`${commonPrefix}.someElement-blue`]: 'Blue',
        [`${commonPrefix}.someElement-green`]: 'Green'
      });

      it('returns translated display names', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  'someElement-blue': {
                    surface_color: 'blue'
                  },
                  'someElement-green': {
                    surface_color: 'green'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getContentElementVariants({contentElement});

        expect(texts).toEqual([
          'Blue',
          'Green'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.content_element_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.someElement-blue`]: 'Blue',
        [`${commonPrefix}.someElement-green`]: 'Green',
        [`${themePrefix}.content_element_variants.someElement-blue`]: 'Custom Blue',
        [`${themePrefix}.content_element_variants.someElement-green`]: 'Custom Green'
      });

      it('prefers theme specific translations', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  'someElement-blue': {
                    surface_color: 'blue'
                  },
                  'someElement-green': {
                    surface_color: 'green'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getContentElementVariants({contentElement});

        expect(texts).toEqual([
          'Custom Blue',
          'Custom Green'
        ]);
      });
    });
  });

  describe('supportsSectionWidths', () => {
    it('returns false by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {entryTypeSeed: normalizeSeed()}
      );

      expect(entry.supportsSectionWidths()).toEqual(false);
    });

    it('returns true if theme has narrow section properties', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  narrowSectionTwoColumnInlineContentMaxWidth: '400px'
                }
              }
            }
          })
      });

      expect(entry.supportsSectionWidths()).toEqual(true);
    });
  });

  describe('getPaletteColors', () => {
    it('returns empty arrays by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {entryTypeSeed: normalizeSeed()}
      );

      const [values, translationKeys] = entry.getPaletteColors();

      expect(values).toEqual([]);
      expect(translationKeys).toEqual([]);
    });

    it('extracts palette colors names from theme properties', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors();

      expect(values).toEqual(['brand-blue', 'brand-green']);
    });

    it('supports named palettes', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0',
                  paletteColorAccentColor: '#123)'
                }
              },
              palettes: {
                brandColors: ['brandBlue', 'brand_green']
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors({name: 'brandColors'});

      expect(values).toEqual(['brand-blue', 'brand-green']);
    });

    it('returns empty array if named palette is missing', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0',
                  paletteColorAccentColor: '#123)'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors({name: 'brandColors'});

      expect(values).toEqual([]);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.palette_colors'

      useFakeTranslations({
        [`${commonPrefix}.dark_content_text`]: 'Dark Text Color',
        [`${commonPrefix}.light_content_text`]: 'Light Text Color'
      });

      it('returns translated display names', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    paletteColorDarkContentText: '#00f',
                    paletteColorLightContentText: '#fff'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getPaletteColors();

        expect(texts).toEqual([
          'Dark Text Color',
          'Light Text Color'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.palette_colors';
      const themePrefix = `pageflow_scrolled.editor.themes.custom.palette_colors`;

      useFakeTranslations({
        [`${commonPrefix}.accent`]: 'Accent',
        [`${themePrefix}.accent`]: 'Highlight'
      });

      it('prefers theme specific translations', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    paletteColorAccent: '#00f'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getPaletteColors();

        expect(texts).toEqual([
          'Highlight'
        ]);
      });
    });
  });
});
