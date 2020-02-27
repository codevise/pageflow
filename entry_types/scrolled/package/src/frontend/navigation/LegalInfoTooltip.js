import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./LegalInfoTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useFileRights, useLegalInfo, useCredits} from '../../entryState';
import {LegalInfoLink} from "./LegalInfoLink";

export function LegalInfoTooltip() {
  const fileRights = useFileRights();
  const legalInfo = useLegalInfo();
  const credits = useCredits();

  return(
    <ReactTooltip id={'legalInfoTooltip'}
                  type={'light'}
                  place={'bottom'}
                  effect={'solid'}
                  event={'click'}
                  globalEventOff={'click'}
                  clickable={true}
                  offset={{right: -97}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.legalInfoTooltip)}>
      <div onMouseLeave={() => { ReactTooltip.hide() }}>
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
    </ReactTooltip>
  )
}