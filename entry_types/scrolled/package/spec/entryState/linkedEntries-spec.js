import {
  useLinkedEntry,
  useLinkedEntryDestination,
  useLinkedEntryUrl,
  watchCollections
} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

describe('useLinkedEntry', () => {
  it('returns linked entry by id', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntry(5), {
        seed: {
          linkedEntries: [{id: 5, title: 'Other', url: 'https://example.com/other'}]
        }
      }
    );

    expect(result.current).toMatchObject({title: 'Other'});
  });
});

describe('useLinkedEntryDestination', () => {
  function renderDestination(href, linkedEntry) {
    return renderHookInEntry(
      () => useLinkedEntryDestination(href), {
        seed: {
          linkedEntries: [{
            id: 5,
            url: 'https://example.com/other',
            previewUrl: '/admin/entries/other/preview',
            ...linkedEntry
          }]
        }
      }
    ).result.current;
  }

  it('returns undefined for unknown entry', () => {
    expect(renderDestination({entry: 6})).toBeUndefined();
  });

  it('returns urls of entry', () => {
    expect(renderDestination({entry: 5})).toMatchObject({
      url: 'https://example.com/other',
      previewUrl: '/admin/entries/other/preview'
    });
  });

  it('returns chapter with published and preview anchors', () => {
    const destination = renderDestination({entry: 5, chapter: 20}, {
      chapters: [{permaId: 20, title: 'Intro', slug: 'old', previewSlug: 'new'}]
    });

    expect(destination).toMatchObject({
      url: 'https://example.com/other#old',
      previewUrl: '/admin/entries/other/preview#new',
      chapter: {title: 'Intro'}
    });
  });

  it('returns urls without anchor for unknown chapters', () => {
    const destination = renderDestination({entry: 5, chapter: 20});

    expect(destination).toMatchObject({
      url: 'https://example.com/other',
      previewUrl: '/admin/entries/other/preview',
      chapter: undefined
    });
  });

  it('returns section anchors', () => {
    const destination = renderDestination({entry: 5, section: 30});

    expect(destination).toMatchObject({
      url: 'https://example.com/other#section-30',
      previewUrl: '/admin/entries/other/preview#section-30',
      section: true
    });
  });
});

describe('useLinkedEntryUrl', () => {
  it('returns url of linked entry', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntryUrl({entry: 5}), {
        seed: {
          linkedEntries: [{id: 5, url: 'https://example.com/other'}]
        }
      }
    );

    expect(result.current).toEqual('https://example.com/other');
  });

  it('returns url with slug of linked chapter', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntryUrl({entry: 5, chapter: 20}), {
        seed: {
          linkedEntries: [{
            id: 5,
            url: 'https://example.com/other',
            chapters: [{permaId: 20, slug: 'the-outro'}]
          }]
        }
      }
    );

    expect(result.current).toEqual('https://example.com/other#the-outro');
  });

  it('returns url without anchor for unknown chapter', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntryUrl({entry: 5, chapter: 30}), {
        seed: {
          linkedEntries: [{id: 5, url: 'https://example.com/other'}]
        }
      }
    );

    expect(result.current).toEqual('https://example.com/other');
  });

  it('returns url with section anchor', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntryUrl({entry: 5, section: 10}), {
        seed: {
          linkedEntries: [{id: 5, url: 'https://example.com/other'}]
        }
      }
    );

    expect(result.current).toEqual('https://example.com/other#section-10');
  });

  it('returns undefined for unknown entry', () => {
    const {result} = renderHookInEntry(
      () => useLinkedEntryUrl({entry: 6}), {
        seed: {
          linkedEntries: []
        }
      }
    );

    expect(result.current).toBeUndefined();
  });

  describe('with watched linked entries', () => {
    it('returns url of added entry', () => {
      const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
      entry.linkedEntries.add({id: 5, title: 'Other', url: 'http://example.com/other'});

      const {result} = renderHookInEntry(
        () => useLinkedEntryUrl({entry: 5}), {
          setup: dispatch => watchCollections(entry, {dispatch})
        }
      );

      expect(result.current).toEqual('http://example.com/other');
    });

    it('uses linked entries from seed', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          linkedEntries: [{id: 5, url: 'http://example.com/other'}]
        })
      });

      const {result} = renderHookInEntry(
        () => useLinkedEntryUrl({entry: 5}), {
          setup: dispatch => watchCollections(entry, {dispatch})
        }
      );

      expect(result.current).toEqual('http://example.com/other');
    });

    it('syncs linked chapters', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          linkedEntries: [{
            id: 5,
            url: 'http://example.com/other',
            chapters: [{permaId: 20, slug: 'intro'}]
          }]
        })
      });

      const {result} = renderHookInEntry(
        () => useLinkedEntry(5), {
          setup: dispatch => watchCollections(entry, {dispatch})
        }
      );

      expect(result.current).toMatchObject({
        chapters: [{permaId: 20, slug: 'intro'}]
      });
    });

    it('syncs preview url and publication state', () => {
      const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
      entry.linkedEntries.add({
        id: 5,
        title: 'Other',
        url: 'http://example.com/other',
        previewUrl: '/admin/entries/other/preview',
        publicationState: 'not_published'
      });

      const {result} = renderHookInEntry(
        () => useLinkedEntry(5), {
          setup: dispatch => watchCollections(entry, {dispatch})
        }
      );

      expect(result.current).toMatchObject({
        title: 'Other',
        previewUrl: '/admin/entries/other/preview',
        publicationState: 'not_published'
      });
    });
  });
});
