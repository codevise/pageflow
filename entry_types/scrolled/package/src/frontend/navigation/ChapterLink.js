import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";

import {
  Tooltip,
  useI18n,
  utils
} from 'pageflow-scrolled/frontend'

const {isBlank, presence} = utils;

export function ChapterLink(props) {
  const {t} = useI18n();

  const item = (
    <div>
      <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
         href={`#${props.chapterSlug}`}
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
    <p dangerouslySetInnerHTML={{__html: props.summary}} />
  );

  return (
    <Tooltip content={content} openOnHover={true} highlight={true} bubbleClassName={styles.tooltipBubble}>
      {item}
    </Tooltip>
  )
}
