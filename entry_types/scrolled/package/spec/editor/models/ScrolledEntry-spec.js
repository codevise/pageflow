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
                                   {position: 'before', id: 6});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage'},
            {id: 6}
          ]
        });

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, undefined, 6]);
        expect(entry.sections.first().contentElements.pluck('position')).toEqual([0, 1, 2]);

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
                                   {position: 'after', id: 5});

        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'inlineImage'},
            {id: 6}
          ]
        });

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5, undefined, 6]);
        expect(entry.sections.first().contentElements.pluck('position')).toEqual([0, 1, 2]);

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
                                   {position: 'after', id: 5});


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
                                   {position: 'after', id: 5});

        expect(JSON.parse(requests[0].requestBody)).toMatchObject({
          content_elements: [
            {id: 5},
            {typeName: 'contentElementWithDefaults', configuration: {some: 'value'}},
          ]
        });

        expect(entry.contentElements.last().configuration.get('some')).toEqual('value');
      });
    });
  });
});
