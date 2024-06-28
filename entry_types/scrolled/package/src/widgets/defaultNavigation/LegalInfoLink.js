import React from 'react';
import styles from "./LegalInfoMenu.module.css";

export function LegalInfoLink(props) {
  // eslint-disable-next-line no-script-url
  if (props.url === 'javascript:pageflowDisplayPrivacySettings()' && props.label) {
    return (
      <div>
        <a href="#privacySettings"
           onClick={event => {
             window.pageflowDisplayPrivacySettings();
             event.preventDefault();
           }}
           className={styles.legalInfoLink}
           dangerouslySetInnerHTML={{__html: props.label}}>
        </a>
      </div>
    )
  }

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
