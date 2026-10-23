import {LinkableEntriesCollection} from 'editor/collections/LinkableEntriesCollection';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {SelectableEntryOutlineView} from 'editor/views/SelectableEntryOutlineView';

import {renderBackboneView, setupGlobals} from 'pageflow/testHelpers';
import {act} from '@testing-library/react';
import 'contentElements/heading/frontend';
import {factories, normalizeSeed, useFakeXhr} from 'support';

describe('LinkableEntry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  useFakeXhr(() => testContext);

  setupGlobals({
    entry: () => factories.entry(ScrolledEntry, {id: 1})
  });

  function fetchOutline(response, {entry} = {}) {
    entry = entry || factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    const linkableEntries = new LinkableEntriesCollection([{id: 5, title: 'Other'}]);

    const promise = linkableEntries.get(5).fetchOutline({entry});

    testContext.server.respondWith(
      'GET', /linkable_entries\/5/, [200, {'Content-Type': 'application/json'},
                                      JSON.stringify(response)]
    );
    testContext.server.respond();

    return promise;
  }

  function structure(collections) {
    return {
      id: 5,
      title: 'Other',
      url: '/other',
      chapters: [],
      sections: [],
      collections: {
        storylines: [{id: 1, permaId: 10, role: 'main'}],
        chapters: [],
        sections: [],
        contentElements: [],
        imageFiles: [],
        ...collections
      }
    };
  }

  it('updates title, urls, chapters and sections', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    const linkableEntries = new LinkableEntriesCollection([{id: 5, title: 'Old'}]);
    const linkableEntry = linkableEntries.get(5);

    const promise = linkableEntry.fetchOutline({entry});
    testContext.server.respondWith(
      'GET', /linkable_entries\/5/, [200, {'Content-Type': 'application/json'},
                                      JSON.stringify({
                                        ...structure(),
                                        title: 'Other',
                                        url: '/other',
                                        previewUrl: '/admin/entries/other/preview',
                                        publicationState: 'not_published',
                                        chapters: [{permaId: 20, slug: 'intro'}],
                                        sections: [{permaId: 30, state: 'not_published'}]
                                      })]
    );
    testContext.server.respond();
    await promise;

    expect(linkableEntry.pick('title', 'url', 'previewUrl', 'publicationState',
                              'chapters', 'sections')).toEqual({
      title: 'Other',
      url: '/other',
      previewUrl: '/admin/entries/other/preview',
      publicationState: 'not_published',
      chapters: [{permaId: 20, slug: 'intro'}],
      sections: [{permaId: 30, state: 'not_published'}]
    });
  });

  it('exposes signatures of chapters and sections', () => {
    const linkableEntries = new LinkableEntriesCollection([{
      id: 5,
      chapters: [{permaId: 20, signature: 'signed-20'}],
      sections: [{permaId: 30, signature: 'signed-30'}]
    }]);

    expect(linkableEntries.get(5).chapterLinkSignature(20)).toEqual('signed-20');
    expect(linkableEntries.get(5).sectionLinkSignature(30)).toEqual('signed-30');
  });

  it('rejects when outline can not be fetched', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    const linkableEntries = new LinkableEntriesCollection([{id: 5, title: 'Other'}]);

    const promise = linkableEntries.get(5).fetchOutline({entry});
    testContext.server.respondWith('GET', /linkable_entries\/5/, [404, {}, '']);
    testContext.server.respond();

    await expect(promise).rejects.toBeDefined();
  });

  it('builds chapters and sections of storylines', async () => {
    const outline = await fetchOutline(structure({
      chapters: [{id: 1, permaId: 20, storylineId: 1, configuration: {title: 'Intro'}}],
      sections: [{id: 2, permaId: 30, chapterId: 1}]
    }));

    const chapter = outline.storylines.main().chapters.first();

    expect(chapter.configuration.get('title')).toEqual('Intro');
    expect(chapter.sections.first().get('permaId')).toEqual(30);
  });

  it('merges collections into seed of current entry', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        themeOptions: {colors: {accent: '#f00'}},
        sections: [{id: 100, permaId: 1000}]
      })
    });

    const outline = await fetchOutline(structure({
      sections: [{id: 2, permaId: 30, chapterId: 1}]
    }), {entry});

    expect(outline.scrolledSeed.config.theme.options.colors.accent).toEqual('#f00');
    expect(outline.scrolledSeed.collections.sections).toEqual([
      {id: 2, permaId: 30, chapterId: 1}
    ]);
  });

  it('does not render widgets of current entry in thumbnails', async () => {
    const outline = await fetchOutline(structure());

    expect(outline.scrolledSeed.collections.widgets).toEqual([]);
  });

  it('is read only', async () => {
    const outline = await fetchOutline(structure());

    expect(outline.readOnly).toEqual(true);
    expect(outline.isCurrentSectionInExcursion()).toEqual(false);
  });

  it('can be rendered with section thumbnails in outline view', async () => {
    const outline = await fetchOutline(structure({
      chapters: [{id: 1, permaId: 20, storylineId: 1, configuration: {}}],
      sections: [{id: 2, permaId: 30, chapterId: 1, configuration: {}}],
      contentElements: [{
        id: 3, permaId: 40, sectionId: 2, typeName: 'heading',
        configuration: {children: 'Other heading'}
      }]
    }));
    jest.useFakeTimers();

    const view = new SelectableEntryOutlineView({
      entry: outline,
      onSelectChapter: jest.fn(),
      onSelectSection: jest.fn()
    });
    const {findByText} = renderBackboneView(view);
    act(() => jest.runAllTimers());
    jest.useRealTimers();

    expect(await findByText('Other heading')).not.toBeNull();
    view.close();
  });
});
