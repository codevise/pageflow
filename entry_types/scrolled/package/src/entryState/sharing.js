import {useMemo} from 'react';

import {useEntryState} from "./EntryStateProvider";
import {useEntryMetadata} from "./metadata";

import EmailIcon from "../frontend/assets/images/navigation/icons/social/email_icon.svg";
import FacebookIcon from "../frontend/assets/images/navigation/icons/social/facebook_icon.svg";
import LinkedInIcon from "../frontend/assets/images/navigation/icons/social/linked_in_icon.svg";
import TelegramIcon from "../frontend/assets/images/navigation/icons/social/telegram_icon.svg";
import TwitterIcon from "../frontend/assets/images/navigation/icons/social/twitter_icon.svg";
import WhatsAppIcon from "../frontend/assets/images/navigation/icons/social/whats_app_icon.svg";

export function useShareProviders() {
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
    return activeShareProviders(shareProviders).map((provider) => {
      const config = sharing[provider];
      return ({
        name: config.name,
        icon: config.icon,
        url: config.url
      })
    })
  }, [shareProviders]);
}

function activeShareProviders(shareProvidersConfig) {
  return Object.keys(shareProvidersConfig).filter(function (provider) {
    return shareProvidersConfig[provider] !== false;
  });
}

export function useShareUrl() {
  const entryMetadata = useEntryMetadata();
  const entryState = useEntryState();

  if (entryMetadata) {
    return entryMetadata.shareUrl ? entryMetadata.shareUrl : entryState.config.prettyUrl;
  } else {
    return entryState.config.shareUrl;
  }
}