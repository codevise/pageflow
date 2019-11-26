import React from 'react';
import classNames from 'classnames';
import styles from "./ChapterLink.module.css";

export default function ChapterLink(props) {
  return (
    <a className={classNames(styles.chapterLink, {[styles.chapterLinkActive]: props.active})}
       href={"#"+props.target} onClick={() => props.handleMenuClick(props.target)}>
      {props.title}
    </a>
  )
}