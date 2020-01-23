import {useEntryMetadata, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

const entriesSeed = [
  {
    id: 1,
    shareProviders: {
        facebook: true,
        twitter: false
      }
  },
];

describe('useEntryMetadata', () => {
  const expectedEntryMetadata = {
    id: 1,
    shareProviders: {
        facebook: true,
        twitter: false
      }
  };


  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryMetadata(),
      {
        seed: {
          entries: entriesSeed
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
                }
              }
            }, {
              entryTypeSeed: normalizeSeed()
            }),
            {dispatch}
          )
      });
    const entryMetadata = result.current;

    expect(entryMetadata).toMatchObject(expectedEntryMetadata);
  });
});
