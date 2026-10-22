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

  describe('#restore of chapter', () => {
    beforeEach(() => {
      testContext.entry = createEntry({
        storylines: [
          {id: 1, permaId: 10, role: 'main'},
          {id: 2, permaId: 20, configuration: {}}
        ],
        chapters: [
          {id: 10, storylineId: 1, position: 0},
          {id: 12, storylineId: 1, position: 1}
        ]
      });
      testContext.entry.trashItems.add({
        id: 11, kind: 'chapter', originPermaId: 10, originPosition: 1, sections: []
      });
    });

    function respondWithRestoredChapter(server) {
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/11/restore', 200, {
        id: 11,
        permaId: 110,
        storylineId: 1,
        position: 1,
        configuration: {title: 'Intro'},
        sections: [
          {
            id: 101,
            permaId: 501,
            chapterId: 11,
            position: 0,
            configuration: {},
            contentElements: [{id: 1000, permaId: 601, sectionId: 101, typeName: 'heading'}]
          }
        ]
      });
    }

    it('posts to restore endpoint of trash item', () => {
      const {entry, requests} = testContext;

      entry.trashItems.get(11).restore();

      expect(requests[0].method).toBe('POST');
      expect(requests[0].url).toBe('/editor/entries/1/scrolled/trash_items/11/restore');
    });

    it('inserts restored chapter into origin storyline', async () => {
      const {entry, server} = testContext;
      const storyline = entry.storylines.get(1);

      const promise = entry.trashItems.get(11).restore();
      respondWithRestoredChapter(server);
      await promise;

      expect(storyline.chapters.pluck('id')).toEqual([10, 11, 12]);
      expect(storyline.chapters.pluck('position')).toEqual([0, 1, 2]);
      expect(entry.chapters.get(11).configuration.get('title')).toEqual('Intro');
    });

    it('adds sections and content elements of restored chapter', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(11).restore();
      respondWithRestoredChapter(server);
      await promise;

      expect(entry.chapters.get(11).sections.pluck('id')).toEqual([101]);
      expect(entry.sections.get(101).contentElements.pluck('id')).toEqual([1000]);
    });

    it('selects and scrolls to first section of restored chapter', async () => {
      const {entry, server} = testContext;
      const events = [];
      entry.on('selectSection scrollToSection', section => events.push(section.id));

      const promise = entry.trashItems.get(11).restore();
      respondWithRestoredChapter(server);
      await promise;

      expect(events).toEqual([101, 101]);
    });

    it('keeps resource url of restored chapter', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(11).restore();
      respondWithRestoredChapter(server);
      await promise;

      expect(entry.chapters.get(11).url())
        .toEqual('/editor/entries/1/scrolled/chapters/11');
    });

    it('rejects without request if origin storyline is missing', async () => {
      const {entry, requests} = testContext;
      entry.trashItems.add({id: 13, kind: 'chapter', originPermaId: 999, sections: []});

      await expect(entry.trashItems.get(13).restore()).rejects.toThrow();

      expect(requests).toHaveLength(0);
    });

    it('keeps positions of chapters if restore fails', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(11).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/11/restore', 422, {});
      await promise.catch(() => {});

      expect(entry.storylines.get(1).chapters.pluck('position')).toEqual([0, 1]);
    });

    it('removes trash item', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(11).restore();
      respondWithRestoredChapter(server);
      await promise;

      expect(entry.trashItems.get(11)).toBeUndefined();
    });
  });

  describe('#restore of content elements', () => {
    beforeEach(() => {
      testContext.entry = createEntry({
        sections: [{id: 10, permaId: 100}],
        contentElements: [
          {id: 1, sectionId: 10, position: 0},
          {id: 3, sectionId: 10, position: 1}
        ]
      });
      testContext.entry.trashItems.add({
        id: 20, kind: 'contentElements', originPermaId: 100, originPosition: 1, sections: []
      });
    });

    function respondWithRestoredContentElements(server) {
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/20/restore', 200, [
        {id: 2, permaId: 22, sectionId: 10, position: 1, typeName: 'heading',
         configuration: {}}
      ]);
    }

    it('posts to restore endpoint of trash item', () => {
      const {entry, requests} = testContext;

      entry.trashItems.get(20).restore();

      expect(requests[0].method).toBe('POST');
      expect(requests[0].url).toBe('/editor/entries/1/scrolled/trash_items/20/restore');
    });

    it('inserts restored content elements into origin section', async () => {
      const {entry, server} = testContext;
      const section = entry.sections.get(10);

      const promise = entry.trashItems.get(20).restore();
      respondWithRestoredContentElements(server);
      await promise;

      expect(section.contentElements.pluck('id')).toEqual([1, 2, 3]);
      expect(section.contentElements.pluck('position')).toEqual([0, 1, 2]);
    });

    it('removes trash item', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(20).restore();
      respondWithRestoredContentElements(server);
      await promise;

      expect(entry.trashItems.get(20)).toBeUndefined();
    });

    it('selects and scrolls to first restored content element', async () => {
      const {entry, server} = testContext;
      const events = [];
      entry.on('selectContentElement scrollToContentElement',
               contentElement => events.push(contentElement.id));

      const promise = entry.trashItems.get(20).restore();
      respondWithRestoredContentElements(server);
      await promise;

      expect(events).toEqual([2, 2]);
    });

    it('appends content elements to first section if origin section is missing', async () => {
      const {entry, server} = testContext;
      entry.trashItems.add({id: 21, kind: 'contentElements', originPermaId: 999,
                            originPosition: 0, sections: []});

      const promise = entry.trashItems.get(21).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/21/restore', 200, [
        {id: 4, permaId: 44, sectionId: 10, position: 2, typeName: 'heading', configuration: {}}
      ]);
      await promise;

      expect(entry.sections.get(10).contentElements.pluck('id')).toEqual([1, 3, 4]);
      expect(entry.sections.get(10).contentElements.pluck('position')).toEqual([0, 1, 2]);
    });

    it('rejects without request if no section exists', async () => {
      const {requests} = testContext;
      const entry = createEntry({});
      entry.trashItems.add({id: 21, kind: 'contentElements', originPermaId: 999, sections: []});

      await expect(entry.trashItems.get(21).restore()).rejects.toThrow();

      expect(requests).toHaveLength(0);
    });

    it('keeps trash item if restore fails', async () => {
      const {entry, server} = testContext;

      const promise = entry.trashItems.get(20).restore();
      respondWithJson(server, 'POST', '/editor/entries/1/scrolled/trash_items/20/restore', 422, {});
      await promise.catch(() => {});

      expect(entry.trashItems.pluck('id')).toEqual([20]);
    });
  });
});
