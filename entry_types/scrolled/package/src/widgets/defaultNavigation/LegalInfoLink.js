import React from 'react';
import styles from "./LegalInfoMenu.module.css";

export function LegalInfoLink(props) {
  return (
    <div>
      {props.label && props.url &&
       <a target="_blank"
          rel="noreferrer noopener"
          href={props.url}
          className={styles.legalInfoLink}
          dangerouslySetInnerHTML={{__html: props.label}}>
       </a>
      }
    </div>
  )
}
