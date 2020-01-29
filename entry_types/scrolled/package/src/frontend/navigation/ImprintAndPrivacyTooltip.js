import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ImprintAndPrivacyTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useFileRights, useLegalInfo, useCredits} from '../../entryState';

export function ImprintAndPrivacyTooltip() {
  const fileRights = useFileRights();
  const legalInfo = useLegalInfo();
  const credits = useCredits();

  return(
    <ReactTooltip id={'imprintAndPrivacyTooltip'}
                  type={'light'}
                  place={'bottom'}
                  effect={'solid'}
                  event={'click'}
                  globalEventOff={'click'}
                  clickable={true}
                  offset={{bottom: 5, right: -97}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.imprintAndPrivacyTooltip)}>
      <div>
        <p dangerouslySetInnerHTML={{__html: credits}}></p>
        <p>
          {fileRights}
        </p>

        <div>
          <a target="_blank"
             href={legalInfo.imprint.imprintLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {legalInfo.imprint.imprintLinkLabel}
          </a>
        </div>

        <div>
          <a target="_blank"
             href={legalInfo.copyright.copyrightLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}
             dangerouslySetInnerHTML={{__html: legalInfo.copyright.copyrightLinkLabel}}>
          </a>
        </div>

        <div>
          <a target="_blank"
             href={legalInfo.privacy.privacyLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {legalInfo.privacy.privacyLinkLabel}
          </a>
        </div>
      </div>
    </ReactTooltip>
  )
}