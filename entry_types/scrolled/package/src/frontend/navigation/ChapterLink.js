import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";

import {Tooltip} from '../Tooltip';
import {useI18n} from '../i18n';
import {isBlank, presence} from '../utils/blank';

export function ChapterLink(props) {
  const {t} = useI18n();

  const item = (
    <div>
      <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
         href={`#chapter-${props.permaId}`}
         onClick={() => props.handleMenuClick(props.chapterLinkId)}>
        {presence(props.title) || t('pageflow_scrolled.public.navigation.chapter', {number: props.chapterIndex})}
      </a>
      {!isBlank(props.summary) && <p className={styles.summary}
                                     dangerouslySetInnerHTML={{__html: props.summary}} />}
    </div>
  );

  if (isBlank(props.summary)) {
    return item;
  }

  const content = (
    <>
      <h3 className={styles.tooltipHeadline}>
        {t('pageflow_scrolled.public.navigation.chapter', {number: props.chapterIndex})}
      </h3>
      <p dangerouslySetInnerHTML={{__html: props.summary}} />
    </>
  );

  return (
    <Tooltip content={content} openOnHover={true} highlight={true} bubbleClassName={styles.tooltipBubble}>
      {item}
    </Tooltip>
  )
}
