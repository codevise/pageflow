import React from 'react';
import classNames from 'classnames';
import headerStyles from "./DefaultNavigation.module.css";
import styles from "./SharingMenu.module.css";

import {
  ThemeIcon,
  useShareUrl,
  useI18n,
  Tooltip
} from 'pageflow-scrolled/frontend';

export function SharingMenu({shareProviders}) {
  const shareUrl = useShareUrl();
  const {t} = useI18n();

  function renderShareLinks(shareProviders) {
    return shareProviders.map((shareProvider) => {
      return (
        <div key={shareProvider.name}
             className={styles.shareLinkContainer}>
          <a className={classNames('share', styles.shareLink)}
             href={shareProvider.url.replace('%{url}', shareUrl)}
             target={'_blank'}
             rel="noopener noreferrer">
            <ThemeIcon name={shareProvider.iconName} />
            {shareProvider.name}
          </a>
        </div>
      )
    })
  };

  return (
    <Tooltip horizontalOffset={-70}
             arrowPos={160}
             content={renderShareLinks(shareProviders)}>
      <button className={classNames(headerStyles.contextIcon)}
              title={t('pageflow_scrolled.public.navigation.share')}>
        <ThemeIcon name="share" />
      </button>
    </Tooltip>
  );
}
