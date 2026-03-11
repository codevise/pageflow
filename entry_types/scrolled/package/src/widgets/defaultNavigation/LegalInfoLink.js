import React from 'react';

import styles from "./LegalInfoMenu.module.css";

const defaultProps = {target: '_blank', rel: 'noreferrer noopener'};

export function LegalInfoLink({label, url, props}) {
  return (
    <div>
      {label && url &&
       <a href={url}
          {...(props || defaultProps)}
          className={styles.legalInfoLink}>
         {label}
       </a>}
    </div>
  );
}
