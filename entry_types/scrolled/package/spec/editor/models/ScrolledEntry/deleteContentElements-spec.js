import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  function entryWithContentElements(contentElements) {
    return factories.entry(ScrolledEntry, {id: 100}, {
      entryTypeSeed: normalizeSeed({contentElements})
    });
  }

  describe('#deleteContentElements', () => {
    useFakeXhr(() => testContext);

    beforeEach(() => {
      editor.contentElementTypes.register('inlineImage', {});
      editor.contentElementTypes.register('mergeable', {
        getLength(configuration) {
          return configuration.items.length;
        },

        merge(configurationA, configurationB) {
          return {items: configurationA.items.concat(configurationB.items)};
        }
      });
      editor.contentElementTypes.register('otherMergeable', {
        merge(configurationA, configurationB) {
          return {items: configurationA.items.concat(configurationB.items)};
        }
      });
    });

    describe('within a single section', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(ScrolledEntry, {id: 100}, {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 4, permaId: 40, position: 0, typeName: 'inlineImage'},
              {id: 5, permaId: 50, position: 1, typeName: 'inlineImage'},
              {id: 6, permaId: 60, position: 2, typeName: 'inlineImage'}
            ]
          })
        });
      });

      setupGlobals({entry: () => testContext.entry});

      it('sends items with delete and trash flags to batch endpoint in a single request', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 4}, {id: 6}]);

        expect(requests).toHaveLength(1);
        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 5},
            {id: 4, _delete: true, _trash: true},
            {id: 6, _delete: true, _trash: true}
          ]
        });
      });

      it('removes content elements once the request succeeded', () => {
        const {entry} = testContext;

        entry.deleteContentElements([{id: 4}, {id: 6}]);

        expect(entry.contentElements.pluck('id')).toEqual([4, 5, 6]);

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50}
          ])]
        );

        expect(entry.contentElements.pluck('id')).toEqual([5]);
        expect(entry.sections.first().contentElements.pluck('id')).toEqual([5]);
      });

      it('marks unseen trash items once the request succeeded', () => {
        const {entry} = testContext;

        entry.deleteContentElements([{id: 4}]);

        expect(entry.get('hasUnseenTrashItems')).toBeFalsy();

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 5, permaId: 50},
            {id: 6, permaId: 60}
          ])]
        );

        expect(entry.get('hasUnseenTrashItems')).toBe(true);
      });

      it('deletes all content elements of a section', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 4}, {id: 5}, {id: 6}]);

        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, _delete: true, _trash: true},
            {id: 5, _delete: true, _trash: true},
            {id: 6, _delete: true, _trash: true}
          ]
        });

        testContext.server.respond(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([])]
        );

        expect(entry.contentElements.length).toBe(0);
        expect(entry.sections.first().contentElements.length).toBe(0);
      });

      it('sends no request for content elements that do not exist', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 999}]);

        expect(requests).toHaveLength(0);
      });

      it('sends no request without items', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([]);

        expect(requests).toHaveLength(0);
      });
    });

    describe('with mergeable content elements around a run of deleted ones', () => {
      beforeEach(() => {
        testContext.entry = entryWithContentElements([
          {id: 4, permaId: 40, position: 0, typeName: 'mergeable',
           configuration: {items: ['a']}},
          {id: 5, permaId: 50, position: 1, typeName: 'inlineImage'},
          {id: 6, permaId: 60, position: 2, typeName: 'inlineImage'},
          {id: 7, permaId: 70, position: 3, typeName: 'mergeable',
           configuration: {items: ['b']}}
        ]);
      });

      setupGlobals({entry: () => testContext.entry});

      it('merges content elements that become adjacent', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 5}, {id: 6}]);

        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b']}},
            {id: 5, _delete: true, _trash: true},
            {id: 6, _delete: true, _trash: true},
            {id: 7, _delete: true}
          ]
        });
      });
    });

    describe('with mergeable content elements separated by several deleted ones', () => {
      beforeEach(() => {
        testContext.entry = entryWithContentElements([
          {id: 4, permaId: 40, position: 0, typeName: 'mergeable',
           configuration: {items: ['a']}},
          {id: 5, permaId: 50, position: 1, typeName: 'inlineImage'},
          {id: 6, permaId: 60, position: 2, typeName: 'mergeable',
           configuration: {items: ['b']}},
          {id: 7, permaId: 70, position: 3, typeName: 'inlineImage'},
          {id: 8, permaId: 80, position: 4, typeName: 'mergeable',
           configuration: {items: ['c']}}
        ]);
      });

      setupGlobals({entry: () => testContext.entry});

      it('merges content elements that become adjacent multiple times', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 5}, {id: 7}]);

        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b', 'c']}},
            {id: 5, _delete: true, _trash: true},
            {id: 6, _delete: true},
            {id: 7, _delete: true, _trash: true},
            {id: 8, _delete: true}
          ]
        });
      });
    });

    describe('with mergeable content elements that were adjacent before', () => {
      beforeEach(() => {
        testContext.entry = entryWithContentElements([
          {id: 4, permaId: 40, position: 0, typeName: 'mergeable',
           configuration: {items: ['a']}},
          {id: 5, permaId: 50, position: 1, typeName: 'mergeable',
           configuration: {items: ['b']}},
          {id: 6, permaId: 60, position: 2, typeName: 'inlineImage'}
        ]);
      });

      setupGlobals({entry: () => testContext.entry});

      it('leaves them unchanged', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 6}]);

        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4},
            {id: 5},
            {id: 6, _delete: true, _trash: true}
          ]
        });
      });
    });

    describe('with content elements of different type becoming adjacent', () => {
      beforeEach(() => {
        testContext.entry = entryWithContentElements([
          {id: 4, permaId: 40, position: 0, typeName: 'mergeable',
           configuration: {items: ['a']}},
          {id: 5, permaId: 50, position: 1, typeName: 'inlineImage'},
          {id: 6, permaId: 60, position: 2, typeName: 'otherMergeable',
           configuration: {items: ['b']}}
        ]);
      });

      setupGlobals({entry: () => testContext.entry});

      it('leaves them unchanged', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 5}]);

        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4},
            {id: 6},
            {id: 5, _delete: true, _trash: true}
          ]
        });
      });
    });

    describe('across sections', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(ScrolledEntry, {id: 100}, {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 10},
              {id: 20}
            ],
            contentElements: [
              {id: 4, sectionId: 10, permaId: 40, position: 0, typeName: 'mergeable',
               configuration: {items: ['a']}},
              {id: 5, sectionId: 10, permaId: 50, position: 1, typeName: 'inlineImage'},
              {id: 6, sectionId: 10, permaId: 60, position: 2, typeName: 'mergeable',
               configuration: {items: ['b']}},
              {id: 14, sectionId: 20, permaId: 140, position: 0, typeName: 'inlineImage'},
              {id: 15, sectionId: 20, permaId: 150, position: 1, typeName: 'inlineImage'}
            ]
          })
        });
      });

      setupGlobals({entry: () => testContext.entry});

      it('sends one request per section', () => {
        const {entry, requests} = testContext;

        entry.deleteContentElements([{id: 14}, {id: 5}]);

        expect(requests).toHaveLength(2);
        expect(requests[0].url).toBe('/editor/entries/100/scrolled/sections/10/content_elements/batch');
        expect(JSON.parse(requests[0].requestBody)).toEqual({
          content_elements: [
            {id: 4, configuration: {items: ['a', 'b']}},
            {id: 5, _delete: true, _trash: true},
            {id: 6, _delete: true}
          ]
        });
        expect(requests[1].url).toBe('/editor/entries/100/scrolled/sections/20/content_elements/batch');
        expect(JSON.parse(requests[1].requestBody)).toEqual({
          content_elements: [
            {id: 15},
            {id: 14, _delete: true, _trash: true}
          ]
        });
      });

      it('applies the responses of all requests', () => {
        const {entry} = testContext;

        entry.deleteContentElements([{id: 14}, {id: 5}]);

        testContext.server.respondWith(
          'PUT', '/editor/entries/100/scrolled/sections/10/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 4, permaId: 40}
          ])]
        );
        testContext.server.respondWith(
          'PUT', '/editor/entries/100/scrolled/sections/20/content_elements/batch',
          [200, {'Content-Type': 'application/json'}, JSON.stringify([
            {id: 15, permaId: 150}
          ])]
        );
        testContext.server.respond();

        expect(entry.sections.first().contentElements.pluck('id')).toEqual([4]);
        expect(entry.sections.last().contentElements.pluck('id')).toEqual([15]);
        expect(entry.contentElements.get(4).configuration.get('items')).toEqual(['a', 'b']);
      });
    });
  });
});
