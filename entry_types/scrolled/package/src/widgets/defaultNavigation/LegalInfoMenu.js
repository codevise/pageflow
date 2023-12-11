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
         <p className={styles.section}
            dangerouslySetInnerHTML={{__html: credits}}></p>
        }

        {fileRights.length > 0 &&
         <div className={styles.section}>
           <strong>{t('pageflow_scrolled.public.media')}</strong> {renderFileRights(fileRights)}
         </div>
        }
      </div>

      <div className={classNames(styles.links, {[styles.separator]: credits || fileRights.length > 0})}>
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

function renderFileRights(items) {
  return (
    <ul className={styles.rights}>
      {items.map((item, index) =>
        <li key={index}>
          {index > 0 && <>&nbsp;| </>}{renderFileRightsText(item)}
        </li>
      )}
    </ul>
  );
}

function renderFileRightsText(item) {
  if (item.urls.length > 1) {
    return (
      <>{item.text} ({item.urls.flatMap(
          (url, index) => [
            index > 0 && ', ',
            <a href={url} target="_blank" rel="noopener noreferrer" key={index}>{index + 1}</a>
          ]
        )})
      </>
    );
  }
  else if (item.urls.length === 1) {
    return (
      <a href={item.urls[0]} target="_blank" rel="noopener noreferrer">
        {item.text}
      </a>
    );
  }
  else {
    return item.text
  }
}
