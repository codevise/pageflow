import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from "../assets/images/navigation/icons/share_icon.svg";
import {SharingTooltip} from "./SharingTooltip";
import ReactTooltip from "react-tooltip";
import {useShareProviders} from "../../entryState";

import {usePhonePlatform} from '../usePhonePlatform';

export function SharingMenu() {
  const isPhonePlatform = usePhonePlatform();
  const shareProviders = useShareProviders({isPhonePlatform : isPhonePlatform});

  if(shareProviders.length > 0) {
    return (
      <div>
        <a className={classNames(headerStyles.contextIcon, styles.shareIcon)}
           data-tip data-for={'sharingTooltip'}
           onMouseEnter={() => { ReactTooltip.hide()}}>
          <ShareIcon/>
        </a>
        <SharingTooltip />
      </div>
    )
  } else {
    return (null);
  }
}

