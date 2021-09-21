import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from './icons/share.svg';

import {
  useShareProviders,
  useShareUrl,
  useI18n,
  Tooltip,
  usePhonePlatform
} from 'pageflow-scrolled/frontend';

export function SharingMenu() {
  const isPhonePlatform = usePhonePlatform();
  const shareProviders = useShareProviders({isPhonePlatform : isPhonePlatform});

  const shareUrl = useShareUrl();
  const {t} = useI18n();

  function renderShareLinks(shareProviders) {
    return shareProviders.map((shareProvider) => {
      const Icon = shareProvider.icon;
      return (
        <div key={shareProvider.name}
             className={styles.shareLinkContainer}>
          <a className={classNames('share', styles.shareLink)}
             href={shareProvider.url.replace('%{url}', shareUrl)}
             target={'_blank'}
             rel="noopener noreferrer">
            <Icon className={styles.shareIcon}/>
            {shareProvider.name}
          </a>
        </div>
      )
    })
  };

  if(shareProviders.length > 0) {
    return (
      <Tooltip horizontalOffset={-70}
               arrowPos={160}
               content={renderShareLinks(shareProviders)}>
        <button className={classNames(headerStyles.contextIcon)}
                title={t('pageflow_scrolled.public.navigation.share')}>
          <ShareIcon/>
        </button>
      </Tooltip>
    )
  } else {
    return (null);
  }
}
