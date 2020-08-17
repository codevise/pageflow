import {useShareProviders, useShareUrl, watchCollections} from 'entryState';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

import FacebookIcon from 'frontend/assets/images/navigation/icons/social/facebook_icon.svg';
import TwitterIcon from 'frontend/assets/images/navigation/icons/social/twitter_icon.svg';
import WhatsappIcon from 'frontend/assets/images/navigation/icons/social/whats_app_icon.svg';

describe('useShareProviders', () => {
  const expectedShareProviders = [{
    name: 'Facebook',
    url: 'http://www.facebook.com/sharer/sharer.php?u=%{url}',
    icon: FacebookIcon
  }];

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useShareProviders({isPhonePlatform: false}),
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
      () => useShareProviders({isPhonePlatform: false}), {
        setup: dispatch =>
          watchCollections(
            factories.entry(ScrolledEntry, {
              metadata: {
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

  it('filters share providers for desktop', () => {
    const expectedProviders = [
      {
        name: 'Facebook',
        url: 'http://www.facebook.com/sharer/sharer.php?u=%{url}',
        icon: FacebookIcon
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/intent/tweet?url=%{url}',
        icon: TwitterIcon
      }
    ];
    const {result} = renderHookInEntry(
      () => useShareProviders({isPhonePlatform: false}),
      {
        seed: {
          entry: {
            shareProviders: {
              facebook: true,
              twitter: true,
              whats_app: true
            }
          }
        }
      }
    );

    const shareProvidersConfig = result.current;
    expect(shareProvidersConfig).toMatchObject(expectedProviders);
  });

  it('returns all share providers for mobile', () => {
    const expectedProviders = [
      {
        name: 'Facebook',
        url: 'http://www.facebook.com/sharer/sharer.php?u=%{url}',
        icon: FacebookIcon
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/intent/tweet?url=%{url}',
        icon: TwitterIcon
      },
      {
        name: 'WhatsApp',
        url: 'WhatsApp://send?text=%{url}',
        icon: WhatsappIcon
      }
    ];
    const {result} = renderHookInEntry(
      () => useShareProviders({isPhonePlatform: true}),
      {
        seed: {
          entry: {
            shareProviders: {
              facebook: true,
              twitter: true,
              whats_app: true
            }
          }
        }
      }
    );

    const shareProvidersConfig = result.current;
    expect(shareProvidersConfig).toMatchObject(expectedProviders);
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
              metadata: {
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
