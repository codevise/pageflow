import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ImprintAndPrivacyTooltip.module.css";
import ReactTooltip from "react-tooltip";

export default function ImprintAndPrivacyTooltip(props) {
  return(
    <ReactTooltip id={'imprintAndPrivacyTooltip'}
                  type={'light'}
                  place={'bottom'}
                  effect={'solid'}
                  event={'click'}
                  globalEventOff={'click'}
                  clickable={true}
                  offset={{bottom: 8, right: -97}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.imprintAndPrivacyTooltip)}>
      <div>
        <p dangerouslySetInnerHTML={{__html: pageflowScrolledSeed.imprintAndPrivacy.credits}}></p>
        <div dangerouslySetInnerHTML={{__html: pageflowScrolledSeed.imprintAndPrivacy.fileRights}}></div>

        <div>
          <a target="_blank"
             href={pageflowScrolledSeed.imprintAndPrivacy.imprint.imprintLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {pageflowScrolledSeed.imprintAndPrivacy.imprint.imprintLinkLabel}
          </a>
        </div>

        <div>
          <a target="_blank"
             href={pageflowScrolledSeed.imprintAndPrivacy.copyright.copyrightLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}
             dangerouslySetInnerHTML={{__html: pageflowScrolledSeed.imprintAndPrivacy.copyright.copyrightLinkLabel}}>
          </a>
        </div>

        <div>
          <a target="_blank"
             href={pageflowScrolledSeed.imprintAndPrivacy.privacy.privacyLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {pageflowScrolledSeed.imprintAndPrivacy.privacy.privacyLinkLabel}
          </a>
        </div>
      </div>
    </ReactTooltip>
  )
}