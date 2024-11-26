import {useEntryMetadata, useDarkWidgets, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

describe('useEntryMetadata', () => {
  const expectedEntryMetadata = {
    locale: 'fr',
    shareProviders: {
      facebook: true,
      twitter: false
    },
    shareUrl: 'http://test.host/test',
    credits: 'Credits',
    configuration: {
      darkWidgets: true
    }
  };

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryMetadata(),
      {
        seed: {
          entry: {
            permaId: 1,
            locale: 'fr',
            shareProviders: {
              facebook: true,
              twitter: false
            },
            shareUrl: 'http://test.host/test',
            credits: 'Credits',
            configuration: {
              darkWidgets: true
            }
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
                locale: 'fr',
                share_providers: {
                  facebook: true,
                  twitter: false
                },
                share_url: 'http://test.host/test',
                credits: 'Credits',
                configuration: {
                  darkWidgets: true
                }
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

describe('useDarkWidgets', () => {
  it('is falsy by default', () => {
    const {result} = renderHookInEntry(
      () => useDarkWidgets()
    );

    const darkWidgets = result.current;

    expect(darkWidgets).toBeUndefined()
  });

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useDarkWidgets(),
      {
        seed: {
          entry: {
            configuration: {
              darkWidgets: true
            }
          }
        }
      }
    );

    const darkWidgets = result.current;

    expect(darkWidgets).toEqual(true);
  });

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(
      () => useDarkWidgets(), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              metadata: {
                configuration: {
                  darkWidgets: true
                }
              }
            }, {
              entryTypeSeed: normalizeSeed()
            }),
            {dispatch})
    });
    const darkWidgets = result.current;

    expect(darkWidgets).toEqual(true);
  });

  it('can be enabled via theme option', () => {
    const {result} = renderHookInEntry(
      () => useDarkWidgets(),
      {
        seed: {
          themeOptions: {
            darkWidgets: true
          }
        }
      }
    );

    const darkWidgets = result.current;

    expect(darkWidgets).toEqual(true);
  });
});
