import {useFakeXhr, useEditorGlobals} from 'support';

describe('TrashItemsCollection', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  const {createEntry} = useEditorGlobals();

  useFakeXhr(() => testContext);

  function respondWithJson(server, method, url, status, body) {
    server.respond(method, url, [status, {'Content-Type': 'application/json'},
                                 JSON.stringify(body)]);
  }

  it('fetches trash items of entry', () => {
    testContext.entry = createEntry({});
    const {entry, server} = testContext;

    entry.trashItems.fetch();
    respondWithJson(server, 'GET', '/editor/entries/1/scrolled/trash_items', 200, [
      {id: 5, kind: 'section', sections: []}
    ]);

    expect(entry.trashItems.pluck('id')).toEqual([5]);
  });

  it('provides seed with sections and content elements of trash item', () => {
    testContext.entry = createEntry({});
    const {entry} = testContext;
    entry.trashItems.add({
      id: 5,
      sections: [
        {id: 50, permaId: 500, contentElements: [{id: 60, permaId: 600, sectionId: 50}]}
      ]
    });

    const seed = entry.trashItems.get(5).seed({config: {}, collections: {chapters: []}});

    expect(seed.config).toEqual({});
    expect(seed.collections.chapters).toEqual([]);
    expect(seed.collections.sections).toEqual([{id: 50, permaId: 500}]);
    expect(seed.collections.contentElements)
      .toEqual([{id: 60, permaId: 600, sectionId: 50}]);
  });

  describe('#restore', () => {
    beforeEach(() => {
      testContext.entry = createEntry({
        chapters: [{id: 10, permaId: 1000}],
        sections: [
          {id: 100, chapterId: 10, position: 0},
          {id: 102, chapterId: 10, position: 1}
        ]
      });
      testContext.entry.trashItems.add({
        id: 5, kind: 'section', originPermaId: 1000, originPosition: 1, sections: []
      });
    });

    function respondWithRestoredSection(server) {
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/5/restore', 200, {
        id: 101,
        permaId: 501,
        chapterId: 10,
        position: 1,
        configuration: {transition: 'fade'},
        contentElements: [{id: 1000, permaId: 601, sectionId: 101, typeName: 'heading'}]
      });
    }

    it('posts to restore endpoint of trash item', () => {
      const {entry, requests} = testContext;

      entry.trashItems.get(5).restore();

      expect(requests[0].method).toBe('POST');
      expect(requests[0].url).toBe('/editor/entries/1/scrolled/trash_items/5/restore');
    });

    it('inserts restored section into origin chapter', async () => {
      const {entry, server} = testContext;
      const chapter = entry.chapters.get(10);

      const promise = entry.trashItems.get(5).restore();
      respondWithRestoredSection(server);
      await promise;

      expect(chapter.sections.pluck('id')).toEqual([100, 101, 102]);
      expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
      expect(chapter.sections.get(101).configuration.get('transition')).toEqual('fade');
    });

    it('adds content elements of restored section', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(5).restore();
      respondWithRestoredSection(server);
      await promise;

      expect(entry.sections.get(101).contentElements.pluck('id')).toEqual([1000]);
    });

    it('does not add section before restore succeeds', () => {
      const {entry} = testContext;

      entry.trashItems.get(5).restore();

      expect(entry.chapters.get(10).sections.pluck('id')).toEqual([100, 102]);
    });

    it('appends section to first chapter if origin chapter is missing', async () => {
      const {entry, server} = testContext;
      entry.trashItems.add({id: 6, kind: 'section', originPermaId: 999, originPosition: 0,
                            sections: []});

      const promise = entry.trashItems.get(6).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/6/restore', 200, {
        id: 103, permaId: 503, chapterId: 10, position: 2, configuration: {},
        contentElements: []
      });
      await promise;

      expect(entry.chapters.get(10).sections.pluck('id')).toEqual([100, 102, 103]);
      expect(entry.chapters.get(10).sections.pluck('position')).toEqual([0, 1, 2]);
    });

    it('rejects without request if no chapter exists', async () => {
      const {requests} = testContext;
      const entry = createEntry({});
      entry.trashItems.add({id: 6, kind: 'section', originPermaId: 999, sections: []});

      await expect(entry.trashItems.get(6).restore()).rejects.toThrow();

      expect(requests).toHaveLength(0);
    });

    it('removes trash item', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(5).restore();
      respondWithRestoredSection(server);
      await promise;

      expect(entry.trashItems.length).toEqual(0);
    });

    it('keeps trash item if restore fails', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(5).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/5/restore', 422, {});
      await promise.catch(() => {});

      expect(entry.trashItems.pluck('id')).toEqual([5]);
    });

    it('keeps positions of sections if restore fails', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(5).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/5/restore', 422, {});
      await promise.catch(() => {});

      expect(entry.chapters.get(10).sections.pluck('position')).toEqual([0, 1]);
    });
  });
});
