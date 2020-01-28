import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useEntryMetadata, useEntryState} from '../../entryState';

import EmailIcon from "../assets/images/navigation/icons/social/email_icon.svg";
import FacebookIcon from "../assets/images/navigation/icons/social/facebook_icon.svg";
import LinkedInIcon from "../assets/images/navigation/icons/social/linked_in_icon.svg";
import TelegramIcon from "../assets/images/navigation/icons/social/telegram_icon.svg";
import TwitterIcon from "../assets/images/navigation/icons/social/twitter_icon.svg";
import WhatsAppIcon from "../assets/images/navigation/icons/social/whats_app_icon.svg";

export function SharingTooltip() {
  const entryMetadata = useEntryMetadata();
  const entryState = useEntryState();

  let shareProviders = [];
  let shareUrl = '';
  if(entryMetadata) {
    shareUrl = entryMetadata.shareUrl ? entryMetadata.shareUrl : entryState.config.shareUrl;
    shareProviders = Object.entries(entryMetadata.shareProviders)
      .map(function (providerConfig) {
        return {
          provider: providerConfig[0],
          active: providerConfig[1]
        };
      });
  }

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

  function renderShareLinks(shareProviders) {
    return shareProviders.map((shareProvider, _index) => {
      if(!shareProvider.active) {return};
      const config = sharing[shareProvider.provider];
      const Icon = config.icon;
      return (
        <div key={shareProvider.provider}
             className={styles.shareLinkContainer}>
          <a className={classNames('share', styles.shareLink)}
             href={config.url.replace('%{url}', shareUrl)}
             target={'_blank'}>
            <Icon className={styles.shareIcon}/>
            {config.name}
          </a>
        </div>
      )
    })
  };

  return (
    <ReactTooltip id={'sharingTooltip'}
                  type={'light'}
                  place={'bottom'}
                  effect={'solid'}
                  event={'click'}
                  globalEventOff={'click'}
                  clickable={true}
                  offset={{right: -64}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.sharingTooltip)}>
      <div>
        {renderShareLinks(shareProviders)}
      </div>
    </ReactTooltip>
  )
}