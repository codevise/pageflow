import Backbone from 'backbone';

import {editor} from 'pageflow-scrolled/editor';

import {useEditorGlobals, useFakeXhr} from 'support';

describe('ScrolledEntry#insertContentElementFragment', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};

    editor.contentElementTypes.register('heading', {});
    editor.contentElementTypes.register('mergeable', {
      split(configuration, at) {
        return [
          {items: configuration.items.slice(0, at)},
          {items: configuration.items.slice(at)}
        ];
      },

      merge(configurationA, configurationB) {
        return {items: configurationA.items.concat(configurationB.items)};
      },

      getLength(configuration) {
        return configuration.items?.length || 0;
      }
    });
  });

  const {createEntry} = useEditorGlobals();

  useFakeXhr(() => testContext);

  const fragment = new Backbone.Model({
    libraryId: 3,
    chapterPermaId: 700,
    collections: {linkedEntries: [{id: 5, title: 'Linked'}]}
  });

  function createEntryWithContentElements(contentElements) {
    return createEntry({
      sections: [{id: 10, permaId: 100}, {id: 11, permaId: 110}],
      contentElements
    });
  }

  async function respondWithPreparation(server, contentElements) {
    server.respond(
      'POST', '/editor/entries/1/scrolled/content_element_fragment_preparations',
      [201, {'Content-Type': 'application/json'}, JSON.stringify(contentElements)]
    );
    await flushPromises();
    server.respond(
      'GET', '/editor/entries/1',
      [200, {'Content-Type': 'application/json'}, JSON.stringify({image_files: []})]
    );
    await flushPromises();
  }

  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve));
  }

  function batchItems(request) {
    return JSON.parse(request.requestBody).content_elements;
  }

  it('posts library entry id and chapter perma id', () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    entry.insertContentElementFragment(fragment, {at: 'after', id: 1});

    const {requests} = testContext;
    expect(requests[0].method).toBe('POST');
    expect(requests[0].url)
      .toBe('/editor/entries/1/scrolled/content_element_fragment_preparations');
    expect(new URLSearchParams(requests[0].requestBody).get('fragment[entry_id]'))
      .toEqual('3');
    expect(new URLSearchParams(requests[0].requestBody).get('fragment[chapter_perma_id]'))
      .toEqual('700');
  });

  it('inserts prepared content elements after sibling', async () => {
    const entry = createEntryWithContentElements([
      {id: 1, sectionId: 10, position: 0},
      {id: 2, sectionId: 10, position: 1}
    ]);

    entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {children: 'A'}},
      {typeName: 'heading', configuration: {children: 'B'}}
    ]);

    expect(testContext.requests[2].url)
      .toBe('/editor/entries/1/scrolled/sections/10/content_elements/batch');
    expect(batchItems(testContext.requests[2])).toEqual([
      {id: 1},
      {typeName: 'heading', configuration: {children: 'A'}},
      {typeName: 'heading', configuration: {children: 'B'}},
      {id: 2}
    ]);
  });

  it('inserts prepared content elements before sibling', async () => {
    const entry = createEntryWithContentElements([
      {id: 1, sectionId: 10, position: 0},
      {id: 2, sectionId: 10, position: 1}
    ]);

    entry.insertContentElementFragment(fragment, {at: 'before', id: 2});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {children: 'A'}},
      {typeName: 'heading', configuration: {children: 'B'}}
    ]);

    expect(batchItems(testContext.requests[2])).toEqual([
      {id: 1},
      {typeName: 'heading', configuration: {children: 'A'}},
      {typeName: 'heading', configuration: {children: 'B'}},
      {id: 2}
    ]);
  });

  it('inserts prepared content elements into empty section', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    entry.insertContentElementFragment(fragment, {at: 'endOfSection', id: 11});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {children: 'A'}}
    ]);

    expect(testContext.requests[2].url)
      .toBe('/editor/entries/1/scrolled/sections/11/content_elements/batch');
    expect(batchItems(testContext.requests[2])).toEqual([
      {typeName: 'heading', configuration: {children: 'A'}}
    ]);
  });

  it('appends prepared content elements at end of section', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    entry.insertContentElementFragment(fragment, {at: 'endOfSection', id: 10});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {children: 'A'}}
    ]);

    expect(batchItems(testContext.requests[2])).toEqual([
      {id: 1},
      {typeName: 'heading', configuration: {children: 'A'}}
    ]);
  });

  it('splits sibling and merges adjacent content elements of same type', async () => {
    const entry = createEntryWithContentElements([
      {id: 1, sectionId: 10, typeName: 'mergeable', configuration: {items: ['a', 'b']}}
    ]);

    entry.insertContentElementFragment(fragment, {at: 'split', id: 1, splitPoint: 1});
    await respondWithPreparation(testContext.server, [
      {typeName: 'mergeable', configuration: {items: ['x']}},
      {typeName: 'heading', configuration: {}},
      {typeName: 'mergeable', configuration: {items: ['y']}}
    ]);

    expect(batchItems(testContext.requests[2])).toEqual([
      {id: 1, configuration: {items: ['a', 'x']}},
      {typeName: 'heading', configuration: {}},
      {typeName: 'mergeable', configuration: {items: ['y', 'b']}}
    ]);
  });

  it('adds inserted content elements to section once batch succeeds', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10, position: 0}]);

    entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {children: 'A'}}
    ]);
    testContext.server.respond(
      'PUT', '/editor/entries/1/scrolled/sections/10/content_elements/batch',
      [200, {'Content-Type': 'application/json'}, JSON.stringify([
        {id: 1, permaId: 10},
        {id: 7, permaId: 70}
      ])]
    );

    expect(entry.sections.get(10).contentElements.pluck('id')).toEqual([1, 7]);
    expect(entry.contentElements.get(7).configuration.get('children')).toEqual('A');
  });

  it('selects first inserted content element once batch succeeds', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10, position: 0}]);
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    await respondWithPreparation(testContext.server, [
      {typeName: 'heading', configuration: {}},
      {typeName: 'heading', configuration: {}}
    ]);
    testContext.server.respond(
      'PUT', '/editor/entries/1/scrolled/sections/10/content_elements/batch',
      [200, {'Content-Type': 'application/json'}, JSON.stringify([
        {id: 1, permaId: 10},
        {id: 7, permaId: 70},
        {id: 8, permaId: 80}
      ])]
    );

    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(7));
  });

  it('rejects when preparation fails', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    const insertion = entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    testContext.server.respond(
      'POST', '/editor/entries/1/scrolled/content_element_fragment_preparations',
      [404, {}, '']
    );

    await expect(insertion).rejects.toBeDefined();
  });

  it('rejects when batch fails', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    const insertion = entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    await respondWithPreparation(testContext.server, [{typeName: 'heading', configuration: {}}]);
    testContext.server.respond(
      'PUT', '/editor/entries/1/scrolled/sections/10/content_elements/batch',
      [422, {}, '']
    );

    await expect(insertion).rejects.toBeDefined();
  });

  it('adds entries linked from fragment to linked entries', async () => {
    const entry = createEntryWithContentElements([{id: 1, sectionId: 10}]);

    entry.insertContentElementFragment(fragment, {at: 'after', id: 1});
    await respondWithPreparation(testContext.server, []);

    expect(entry.linkedEntries.get(5).get('title')).toEqual('Linked');
  });
});
