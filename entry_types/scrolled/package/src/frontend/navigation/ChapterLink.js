import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";

import {Tooltip} from '../Tooltip';
import {useI18n} from '../i18n';

export function ChapterLink(props) {
  const {t} = useI18n();

  const content = (
    <>
      <h3 className={styles.tooltipHeadline}>
        {t('pageflow_scrolled.public.navigation.chapter')} {props.chapterIndex}
      </h3>
      <p dangerouslySetInnerHTML={{__html: props.summary}} />
    </>
  );

  return (
    <Tooltip content={content} openOnHover={true} highlight={true} bubbleClassName={styles.tooltipBubble}>
      <div>
        <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
          href={`#chapter-${props.permaId}`}
          onClick={() => props.handleMenuClick(props.chapterLinkId)}>
          {props.title}
        </a>
        <p className={styles.summary}
          dangerouslySetInnerHTML={{__html: props.summary}} />
      </div>
    </Tooltip>
  )
}
