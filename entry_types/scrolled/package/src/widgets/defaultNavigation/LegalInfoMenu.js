import React from 'react';
import classNames from 'classnames';
import headerStyles from "./DefaultNavigation.module.css";
import styles from "./LegalInfoMenu.module.css";

import {
  ThemeIcon,
  Tooltip,
  Widget,
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
      <div className={styles.scroller}>
        {credits &&
         <p dangerouslySetInnerHTML={{__html: credits}}></p>
        }

        {fileRights &&
         <p>{t('pageflow_scrolled.public.image_rights')}: {fileRights}</p>
        }
      </div>

      <div className={styles.links}>
        <LegalInfoLink {...legalInfo.imprint}/>
        <LegalInfoLink {...legalInfo.copyright}/>
        <LegalInfoLink {...legalInfo.privacy}/>
      </div>

      <Widget role="creditsBoxFooter" />
    </div>
  );

  return (
    <Tooltip horizontalOffset={props.tooltipOffset - 30}
             arrowPos={120 - props.tooltipOffset}
             content={content}>
      <button className={classNames(headerStyles.contextIcon)}
              aria-haspopup="true"
              title={t('pageflow_scrolled.public.navigation.legal_info')}>
        <ThemeIcon name="information" />
      </button>
    </Tooltip>
  )
}
