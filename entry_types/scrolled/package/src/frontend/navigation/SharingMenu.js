import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from "../assets/images/navigation/icons/share_icon.svg";

import {useShareProviders, useShareUrl} from "../../entryState";

import {PageflowTooltip} from '../PageflowTooltip';

import {usePhonePlatform} from '../usePhonePlatform';

export function SharingMenu() {
  const isPhonePlatform = usePhonePlatform();
  const shareProviders = useShareProviders({isPhonePlatform : isPhonePlatform});

  const shareUrl = useShareUrl();

  function renderShareLinks(shareProviders) {
    return shareProviders.map((shareProvider) => {
      const Icon = shareProvider.icon;
      return (
        <div key={shareProvider.name}
             className={styles.shareLinkContainer}>
          <a className={classNames('share', styles.shareLink)}
             href={shareProvider.url.replace('%{url}', shareUrl)}
             target={'_blank'}>
            <Icon className={styles.shareIcon}/>
            {shareProvider.name}
          </a>
        </div>
      )
    })
  };

  if(shareProviders.length > 0) {
    return (
      <PageflowTooltip hover={false} placement={'bottom'} arrowPos={'89%'}
        classWhenOpen={headerStyles.contextIconExpanded} horizontalOffset={-90}
        content={<div style={{width: '200px'}}>{renderShareLinks(shareProviders)}</div>}>
        <button className={classNames(headerStyles.contextIcon)}>
          <ShareIcon/>
        </button>
      </PageflowTooltip>
    )
  } else {
    return (null);
  }
}

