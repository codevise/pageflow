import {useMemo} from 'react';

import {useEntryStateConfig} from "./EntryStateProvider";
import {useEntryMetadata} from "./metadata";

/**
 * Returns a list of attributes (iconName, name and url) of all configured share
 * providers of the entry. The url provides a %{url} placeholder where the link
 * can be inserted. iconName can be passed to ThemeIcon to render a theme
 * specific icon.
 *
 * @example
 *
 * const shareProviders = useShareProviders(options);
 * shareProviders // =>
 *   [
 *     {
 *       iconName: 'facebook',
 *       name: 'Facebook',
 *       url: http://www.facebook.com/sharer/sharer.php?u=%{url}
 *     },
 *     {
 *       iconName: 'twitter',
 *       name: 'Twitter',
 *       url: https://x.com/intent/post?url=%{url}
 *     }
 *   ]
 */
export function useShareProviders({isPhonePlatform}) {
  const config = useEntryStateConfig();
  const entryMetadata = useEntryMetadata();
  const shareProviders = entryMetadata?.shareProviders || {};
  const urlTemplates = config.shareUrlTemplates;

  return useMemo(() => {
    const sharing = {
      bluesky: {
        iconName: 'bluesky',
        name: 'Bluesky',
        url: urlTemplates.bluesky
      },
      email: {
        iconName: 'email',
        name: 'Mail',
        url: urlTemplates.email
      },
      facebook: {
        iconName: 'facebook',
        name: 'Facebook',
        url: urlTemplates.facebook
      },
      linked_in: {
        iconName: 'linkedIn',
        name: 'LinkedIn',
        url: urlTemplates.linked_in
      },
      telegram: {
        iconName: 'telegram',
        name: 'Telegram',
        url: urlTemplates.telegram
      },
      threads: {
        iconName: 'threads',
        name: 'threads',
        url: urlTemplates.threads
      },
      twitter: {
        iconName: 'twitter',
        name: 'X',
        url: urlTemplates.twitter
      },
      whats_app: {
        iconName: 'whatsApp',
        name: 'WhatsApp',
        url: urlTemplates.whats_app
      }
    };

    return activeShareProviders(shareProviders, isPhonePlatform).map((provider) => {
      const config = sharing[provider];
      return ({
        name: config.name,
        iconName: config.iconName,
        url: config.url
      })
    })
  }, [shareProviders, isPhonePlatform, urlTemplates]);
}

function activeShareProviders(shareProvidersConfig, isPhonePlatform) {
  const providers = filterShareProviders(shareProvidersConfig, isPhonePlatform);
  return providers.filter(function (provider) {
    return shareProvidersConfig[provider] !== false;
  });
}

function filterShareProviders(shareProvidersConfig, isPhonePlatform) {
  if (!isPhonePlatform) {
    return Object.keys(shareProvidersConfig).filter(function (provider) {
      return (provider !== 'telegram' && provider !== 'whats_app');
    });
  }

  return Object.keys(shareProvidersConfig);
}

/**
 * Returns the share url of the entry.
 *
 * @example
 *
 * const shareUrl = useShareUrl();
 * shareUrl // => "http://test.host/test"
 */
export function useShareUrl() {
  const entryMetadata = useEntryMetadata();
  const config = useEntryStateConfig();

  if (entryMetadata) {
    return entryMetadata.shareUrl ? entryMetadata.shareUrl : config.prettyUrl;
  } else {
    return config.shareUrl;
  }
}
