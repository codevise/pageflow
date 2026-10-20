import {useLinkedEntry, useLinkedEntryUrl, watchCollections} from 'entryState';

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
