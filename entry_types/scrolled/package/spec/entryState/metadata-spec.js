import {useEntryMetadata, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

describe('useEntryMetadata', () => {
  const expectedEntryMetadata = {
    shareProviders: {
      facebook: true,
      twitter: false
    },
    shareUrl: 'http://test.host/test',
    credits: 'Credits'
  };

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryMetadata(),
      {
        seed: {
          entry: {
            permaId: 1,
            shareProviders: {
              facebook: true,
              twitter: false
            },
            shareUrl: 'http://test.host/test',
            credits: 'Credits'
          }
        }
      }
    );

    const entryMetadata = result.current;

    expect(entryMetadata).toMatchObject(expectedEntryMetadata);
  });

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(
      () => useEntryMetadata(), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              metadata: {
                share_providers: {
                  facebook: true,
                  twitter: false
                },
                share_url: 'http://test.host/test',
                credits: 'Credits'
              }
            }, {
              entryTypeSeed: normalizeSeed()
            }),
            {dispatch})
      });
    const entryMetadata = result.current;

    expect(entryMetadata).toMatchObject(expectedEntryMetadata);
  });
});
