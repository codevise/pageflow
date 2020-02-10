import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";
import {ChapterLinkTooltip} from "./ChapterLinkTooltip";

export function ChapterLink(props) {
  return (
    <div>
      <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
         href={`#chapter-${props.permaId}`}
         onClick={() => props.handleMenuClick(props.chapterLinkId)}
         data-tip data-for={props.chapterLinkId} >
        {props.title}
      </a>
      <p className={styles.summary}
         dangerouslySetInnerHTML={{__html: props.summary}} />
      <ChapterLinkTooltip chapterIndex={props.chapterIndex}
                          chapterLinkId={props.chapterLinkId}
                          {...props} />
    </div>

  )
}

