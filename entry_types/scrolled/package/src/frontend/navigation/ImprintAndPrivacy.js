import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ImprintAndPrivacy.module.css";
import InfoIcon from "../assets/images/navigation/icons/information_icon.svg";
import {ImprintAndPrivacyTooltip} from "./ImprintAndPrivacyTooltip";

export default function ImprintAndPrivacy(props) {
  return (
    <div>
      <a className={classNames(headerStyles.menuIcon, styles.infoIcon)}
         data-tip data-for={'imprintAndPrivacyTooltip'} >
        <InfoIcon/>
      </a>
      <ImprintAndPrivacyTooltip />
    </div>
  )
}

