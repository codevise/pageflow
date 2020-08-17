import {useMemo} from 'react';

import {useEntryState} from "./EntryStateProvider";
import {useEntryMetadata} from "./metadata";

import EmailIcon from "../frontend/assets/images/navigation/icons/social/email_icon.svg";
import FacebookIcon from "../frontend/assets/images/navigation/icons/social/facebook_icon.svg";
import LinkedInIcon from "../frontend/assets/images/navigation/icons/social/linked_in_icon.svg";
import TelegramIcon from "../frontend/assets/images/navigation/icons/social/telegram_icon.svg";
import TwitterIcon from "../frontend/assets/images/navigation/icons/social/twitter_icon.svg";
import WhatsAppIcon from "../frontend/assets/images/navigation/icons/social/whats_app_icon.svg";

/**
 * Returns a list of attributes (icon, name and url) of all configured share providers of the entry.
 * The url provides a %{url} placeholder where the link can be inserted.
 *
 * @example
 *
 * const shareProviders = useShareProviders(options);
 * shareProviders // =>
 *   [
 *     {
 *       icon: <FacebookSVGIcon />,
 *       name: 'Facebook',
 *       url: http://www.facebook.com/sharer/sharer.php?u=%{url}
 *     },
 *     {
 *       icon: <TwitterSVGIcon />,
 *       name: 'Twitter',
 *       url: https://twitter.com/intent/tweet?url=%{url}
 *     }
 *   ]
 */
export function useShareProviders({isPhonePlatform}) {
  const entryState = useEntryState();
  const entryMetadata = useEntryMetadata();

  const shareProviders = entryMetadata ? entryMetadata.shareProviders : {};

  const urlTemplates = entryState.config.shareUrlTemplates;
  const sharing = {
    email: {
      icon: EmailIcon,
      name: 'Email',
      url: urlTemplates.email
    },
    facebook: {
      icon: FacebookIcon,
      name: 'Facebook',
      url: urlTemplates.facebook
    },
    linked_in: {
      icon: LinkedInIcon,
      name: 'LinkedIn',
      url: urlTemplates.linked_in
    },
    telegram: {
      icon: TelegramIcon,
      name: 'Telegram',
      url: urlTemplates.telegram
    },
    twitter: {
      icon: TwitterIcon,
      name: 'Twitter',
      url: urlTemplates.twitter
    },
    whats_app: {
      icon: WhatsAppIcon,
      name: 'WhatsApp',
      url: urlTemplates.whats_app
    }
  };

  return useMemo(() => {
    return activeShareProviders(shareProviders, isPhonePlatform).map((provider) => {
      const config = sharing[provider];
      return ({
        name: config.name,
        icon: config.icon,
        url: config.url
      })
    })
  }, [shareProviders, isPhonePlatform]);
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
  const entryState = useEntryState();

  if (entryMetadata) {
    return entryMetadata.shareUrl ? entryMetadata.shareUrl : entryState.config.prettyUrl;
  } else {
    return entryState.config.shareUrl;
  }
}