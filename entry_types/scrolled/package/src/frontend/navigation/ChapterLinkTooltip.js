import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ChapterLinkTooltip.module.css";
import ReactTooltip from "react-tooltip";
import {useI18n} from '../i18n';

export function ChapterLinkTooltip(props) {
  const {t} = useI18n();

  return(
    <ReactTooltip id={props.chapterLinkId}
                  type='light'
                  place='bottom'
                  effect='solid'
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.chapterLinkTooltip)}>
      <div>
        <h3 className={styles.tooltipHeadline}>
          {t('pageflow_scrolled.public.navigation.chapter')} {props.chapterIndex}
        </h3>
        <p dangerouslySetInnerHTML={{__html: props.summary}} />
      </div>
    </ReactTooltip>
  )
}