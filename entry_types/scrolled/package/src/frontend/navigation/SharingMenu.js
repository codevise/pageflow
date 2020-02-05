import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./SharingMenu.module.css";
import ShareIcon from "../assets/images/navigation/icons/share_icon.svg";
import {SharingTooltip} from "./SharingTooltip";
import ReactTooltip from "react-tooltip";

export function SharingMenu() {
  return (
    <div>
      <a className={classNames(headerStyles.menuIcon, styles.shareIcon)}
         data-tip data-for={'sharingTooltip'}
         onMouseEnter={() => { ReactTooltip.hide()}}>
        <ShareIcon/>
      </a>
      <SharingTooltip />
    </div>
  )
}

