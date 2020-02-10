import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./LegalInfoMenu.module.css";
import InfoIcon from "../assets/images/navigation/icons/information_icon.svg";
import {LegalInfoTooltip} from "./LegalInfoTooltip";
import ReactTooltip from "react-tooltip";

export function LegalInfoMenu(props) {
  return (
    <div>
      <a className={classNames(headerStyles.contextIcon, styles.infoIcon)}
         data-tip data-for={'legalInfoTooltip'}
         onMouseEnter={() => { ReactTooltip.hide()}}>
        <InfoIcon/>
      </a>
      <LegalInfoTooltip />
    </div>
  )
}

