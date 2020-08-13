import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import headerStyles from "../navigation/AppHeader.module.css";
import styles from "../navigation/SharingTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useShareProviders, useShareUrl} from '../../entryState';

export function SharingTooltip() {

  const [phoneEmulationMode, setPhoneEmulationMode] = useState(false);
  const shareUrl = useShareUrl();

  useEffect(() => {
    window.addEventListener('message', receive);

    function receive(event) {
      if (event.data.type === 'CHANGE') {
        if(event.data['payload'] === 'phone') {
          setPhoneEmulationMode(true);
        }
        else {
          setPhoneEmulationMode(false);
        }
      }
    }
    return () => document.removeEventListener('message', receive);
  });

  const shareProviders = useShareProviders(phoneEmulationMode);

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