import {useLinkedEntry, useLinkedEntryUrl} from 'entryState';

import {renderHookInEntry} from 'support';

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
});
