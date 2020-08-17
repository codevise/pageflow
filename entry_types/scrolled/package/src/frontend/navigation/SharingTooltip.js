import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useShareProviders, useShareUrl} from '../../entryState';

import {usePhonePlatform} from '../usePhonePlatform';

export function SharingTooltip() {

  const isPhonePlatform = usePhonePlatform();

  const shareUrl = useShareUrl();
  const shareProviders = useShareProviders({isPhonePlatform: isPhonePlatform});

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
      <div onMouseLeave={() => { ReactTooltip.hide() }}>
        {renderShareLinks(shareProviders)}
      </div>
    </ReactTooltip>
  )
}
