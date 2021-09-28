import React from 'react';
import classNames from 'classnames';
import headerStyles from "./DefaultNavigation.module.css";
import styles from "./LegalInfoMenu.module.css";
import InfoIcon from './icons/information.svg';

import {
  Tooltip,
  useFileRights,
  useLegalInfo,
  useCredits,
  useI18n
} from 'pageflow-scrolled/frontend';
import {LegalInfoLink} from "./LegalInfoLink";

export function LegalInfoMenu(props) {
  const fileRights = useFileRights();
  const legalInfo = useLegalInfo();
  const credits = useCredits();
  const {t} = useI18n();

  const content = (
    <div className={styles.legalInfoTooltip}>
      {credits &&
       <p dangerouslySetInnerHTML={{__html: credits}}></p>
      }

      {fileRights &&
       <p>{t('pageflow_scrolled.public.image_rights')}: {fileRights}</p>
      }

      <LegalInfoLink {...legalInfo.imprint}/>
      <LegalInfoLink {...legalInfo.copyright}/>
      <LegalInfoLink {...legalInfo.privacy}/>
    </div>
  );

  return (
    <Tooltip horizontalOffset={-30}
             arrowPos={120}
             content={content}>
      <button className={classNames(headerStyles.contextIcon, styles.infoIcon)}
              aria-haspopup="true"
              title={t('pageflow_scrolled.public.navigation.legal_info')}>
        <InfoIcon/>
      </button>
    </Tooltip>
  )
}
