import React from 'react';
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./ChapterLinkTooltip.module.css";
import ReactTooltip from "react-tooltip";

export default function ChapterLinkTooltip(props) {
  return(
    <ReactTooltip id={props.chapterLinkId}
                  type='light'
                  place='bottom'
                  effect='solid'
                  offset={{bottom: -1}}
                  className={classNames(headerStyles.navigationTooltip,
                                        styles.chapterLinkTooltip)}>
      <div>
        <h3 className={styles.tooltipHeadline}>Kapitel {props.chapterIndex}</h3>
        <p>
          {props.summary}
        </p>
      </div>
    </ReactTooltip>
  )
}