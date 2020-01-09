import React from 'react';
import styles from "./AppHeaderTooltip.module.css";
import ReactTooltip from "react-tooltip";

export default function AppHeaderTooltip(props) {
  return(
    <ReactTooltip id={props.chapterLinkId}
                  type='light' effect='solid' className="navigationTooltip"
                  overridePosition={ ({ left, top }) => {
                    top = 48;
                    return { top, left };
                  }}>
      <div>
        <h3 className={styles.tooltipHeadline}>Kapitel {props.chapterIndex}</h3>
        <p>
          {props.summary}
        </p>
      </div>
    </ReactTooltip>
  )
}