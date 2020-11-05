import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from "../assets/images/navigation/icons/share_icon.svg";

import ReactTooltip from "react-tooltip";
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
      <PageflowTooltip hover={false} placement={'bottom'} arrowPos={'82%'} horizontalOffset={-80}
        content={<div style={{width: '200px'}}>{renderShareLinks(shareProviders)}</div>}>
        <div>
        <a className={classNames(headerStyles.contextIcon, styles.shareIcon)}>
          <ShareIcon/>
        </a>
      </div>
      </PageflowTooltip>
    )
  } else {
    return (null);
  }
}

