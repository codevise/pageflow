import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ImprintAndPrivacyTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useEntryState, useEntryMetadata} from '../../entryState';
import {getItems} from "../../collections";

export function ImprintAndPrivacyTooltip() {
  const entryState = useEntryState();
  const config = entryState.config.imprintAndPrivacy;

  const defaultFileRights = entryState.config.defaultFileRights;
  const imageFiles = getItems(entryState.collections, 'imageFiles');
  const imageFileRights = imageFiles.map(function (imageConfig) {
    return imageConfig.rights ? imageConfig.rights.trim() : undefined;
  }).filter(Boolean).join(', ');
  const fileRights = !!imageFileRights ? imageFileRights : defaultFileRights.trim();
  const fileRightsString = !!fileRights ? ('Bildrechte: ' + fileRights) : '';

  const entryMetadata = useEntryMetadata();
  let credits = '';
  if(entryMetadata) {
    credits = entryMetadata.credits;
  }

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
                                        styles.imprintAndPrivacyTooltip,
                                        'imprintAndPrivacyTooltip')}>
      <div>
        <p dangerouslySetInnerHTML={{__html: credits}}></p>
        <p>
          {fileRightsString}
        </p>

        <div>
          <a target="_blank"
             href={config.imprint.imprintLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {config.imprint.imprintLinkLabel}
          </a>
        </div>

        <div>
          <a target="_blank"
             href={config.copyright.copyrightLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}
             dangerouslySetInnerHTML={{__html: config.copyright.copyrightLinkLabel}}>
          </a>
        </div>

        <div>
          <a target="_blank"
             href={config.privacy.privacyLinkUrl}
             className={classNames(styles.imprintAndPrivacyLink)}>
            {config.privacy.privacyLinkLabel}
          </a>
        </div>
      </div>
    </ReactTooltip>
  )
}