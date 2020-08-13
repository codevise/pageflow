import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from "../assets/images/navigation/icons/share_icon.svg";
import {SharingTooltip} from "../navigation/SharingTooltip";
import ReactTooltip from "react-tooltip";
import {useShareProviders} from "../../entryState";

import PhonePlatformContext from './PhonePlatformContext';

export function SharingMenu() {
  const useIsPhonePlatform = React.useContext(PhonePlatformContext);
  const shareProviders = useShareProviders(useIsPhonePlatform);

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

