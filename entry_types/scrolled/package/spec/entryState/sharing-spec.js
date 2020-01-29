import {useShareProviders, useShareUrl, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

import FacebookIcon from 'frontend/assets/images/navigation/icons/social/facebook_icon.svg'

describe('useShareProviders', () => {
  const expectedShareProviders = [{
    name: 'Facebook',
    url: 'http://www.facebook.com/sharer/sharer.php?u=%{url}',
    icon: FacebookIcon
  }];

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useShareProviders(),
      {
        seed: {
          entry: {
            shareProviders: {
              facebook: true,
              twitter: false
            }
          }
        }
      }
    );

    const shareProvidersConfig = result.current;
    expect(shareProvidersConfig).toMatchObject(expectedShareProviders);
  });


  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(
      () => useShareProviders(), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              configuration: {
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
    const shareProviders = result.current;
    expect(shareProviders).toMatchObject(expectedShareProviders);
  });
});

describe('useShareUrl', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useShareUrl(),
      {
        seed: {
          entry: {
            shareUrl: 'http://test.host/share-url-from-seed'
          }
        }
      }
    );

    const shareUrl = result.current;
    expect(shareUrl).toBe('http://test.host/share-url-from-seed');
  });

  it('falls back to default share url if no share url is configured', () => {
    const {result} = renderHookInEntry(
      () => useShareUrl(),
      {
        seed: {
          prettyUrl: 'http://test.host/default-share-url',
          entry: {
            shareUrl: ''
          }
        }
      }
    );

    const shareUrl = result.current;
    expect(shareUrl).toBe('http://test.host/default-share-url');
  });

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(
      () => useShareUrl(), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              configuration: {
                share_url: 'http://test.host/share-url-from-collection'
              }
            }, {
              entryTypeSeed: normalizeSeed()
            }),
            {dispatch}
          )
      });
    const shareUrl = result.current;
    expect(shareUrl).toBe('http://test.host/share-url-from-collection');
  });
});
