import {useEntryMetadata, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

const entrySeed = {
  id: 1,
  permaId: 1,
  shareProviders: {
    facebook: true,
    twitter: false
  },
  shareUrl: 'http://test.host/test'
};

describe('useEntryMetadata', () => {
  const expectedEntryMetadata = {
    id: 1,
    shareProviders: {
      facebook: true,
      twitter: false
    },
    shareUrl: 'http://test.host/test'
  };


  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryMetadata(),
      {
        seed: {
          entry: entrySeed
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
              configuration: {
                id: 1,
                share_providers: {
                  facebook: true,
                  twitter: false
                },
                share_url: 'http://test.host/test'
              }
            }, {
              entryTypeSeed: normalizeSeed({shareUrl: 'http://test.host/test'})
            }),
            {dispatch}
          )
      });
    const entryMetadata = result.current;

    expect(entryMetadata).toMatchObject(expectedEntryMetadata);
  });
});
