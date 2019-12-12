import React from 'react';
import styles from "./AppHeaderTooltip.module.css";
import ReactTooltip from "react-tooltip";

export default function AppHeaderTooltip(props) {
  return(
    <ReactTooltip id={props.chapterId}
                  type='light' effect='solid' className="navigationTooltip"
                  overridePosition={ ({ left, top }) => {
                    top = 48;
                    return { top, left };
                  }}>
      <div>
        <h3 className={styles.tooltipHeadline}>Kapitel-Überschrift</h3>
        <p>
          <b>Beliebiger HTML-Content</b><br />
          <i>To be styled....</i>
        </p>
      </div>
    </ReactTooltip>
  )
}