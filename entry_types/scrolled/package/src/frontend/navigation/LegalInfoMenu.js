import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./LegalInfoMenu.module.css";
import InfoIcon from "../assets/images/navigation/icons/information_icon.svg";

import {Tooltip} from '../Tooltip';
import {useFileRights, useLegalInfo, useCredits} from '../../entryState';
import {LegalInfoLink} from "./LegalInfoLink";


export function LegalInfoMenu(props) {
  const fileRights = useFileRights();
  const legalInfo = useLegalInfo();
  const credits = useCredits();

  return (
    <Tooltip padding={12} hover={false} placement={'bottom'} closeOther={true} fontSize={'13px'}
      horizontalOffset={-20} arrowPos={'60%'} classWhenOpen={headerStyles.contextIconExpanded}
      content={
              <div className={styles.legalInfoTooltip}>
                {credits &&
                <p dangerouslySetInnerHTML={{__html: credits}}></p>
                }

                {fileRights &&
                <p>{fileRights}</p>
                }

                <LegalInfoLink {...legalInfo.imprint}/>
                <LegalInfoLink {...legalInfo.copyright}/>
                <LegalInfoLink {...legalInfo.privacy}/>
              </div>
      }>
      <button className={classNames(headerStyles.contextIcon, styles.infoIcon)} aria-haspopup="true">
        <InfoIcon/>
      </button>
    </Tooltip>
  )
}

