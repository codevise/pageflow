import {useEditorGlobals, useFakeXhr} from 'support';

describe('ScrolledEntry hasUnseenTrashItems', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  const {createEntry} = useEditorGlobals();

  useFakeXhr(() => testContext);

  beforeEach(() => {
    testContext.entry = createEntry({
      chapters: [{id: 1, permaId: 10}],
      sections: [{id: 10, permaId: 100, chapterId: 1}],
      contentElements: [{id: 5, permaId: 50, sectionId: 10, typeName: 'heading'}]
    });
  });

  it('is set once a chapter has been deleted', () => {
    const {entry, server} = testContext;

    entry.chapters.get(1).destroyWithDelay();
    expect(entry.get('hasUnseenTrashItems')).toBeFalsy();
    server.respond('DELETE', '/editor/entries/1/scrolled/chapters/1', [204, {}, '']);

    expect(entry.get('hasUnseenTrashItems')).toBe(true);
  });

  it('is set once a section has been deleted', () => {
    const {entry, server} = testContext;

    entry.sections.get(10).destroyWithDelay();
    server.respond('DELETE', '/editor/entries/1/scrolled/sections/10', [204, {}, '']);

    expect(entry.get('hasUnseenTrashItems')).toBe(true);
  });

  it('is set once a content element has been deleted', () => {
    const {entry, server} = testContext;

    entry.deleteContentElement(entry.contentElements.get(5));
    expect(entry.get('hasUnseenTrashItems')).toBeFalsy();
    server.respond(
      'PUT', '/editor/entries/1/scrolled/sections/10/content_elements/batch',
      [200, {'Content-Type': 'application/json'}, '[]']
    );

    expect(entry.get('hasUnseenTrashItems')).toBe(true);
  });

  it('is not set if deletion fails', () => {
    const {entry, server} = testContext;

    entry.sections.get(10).destroyWithDelay();
    server.respond('DELETE', '/editor/entries/1/scrolled/sections/10', [500, {}, '']);

    expect(entry.get('hasUnseenTrashItems')).toBeFalsy();
  });
});
