import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";
import AppHeaderTooltip from "./AppHeaderTooltip";

export default function ChapterLink(props) {
  return (
    <div>
      <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
         href={`#chapter-${props.permaId}`}
         onClick={() => props.handleMenuClick(props.chapterLinkId)}
         data-tip data-for={props.chapterLinkId}>
        {props.title}
      </a>
      <AppHeaderTooltip chapterIndex={props.chapterIndex}
                        chapterLinkId={props.chapterLinkId}
                        {...props} />
    </div>

  )
}
