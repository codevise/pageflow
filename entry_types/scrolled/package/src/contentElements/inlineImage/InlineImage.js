import React from 'react';
import classNames from 'classnames';

import {Image, InlineCaption} from 'pageflow-scrolled/frontend';

import styles from './InlineImage.module.css';

export function InlineImage({configuration}) {
  return (
    <div className={classNames(styles.root)}>
      <div className={styles.container}>
        <div className={styles.spacer}>
          <div className={styles.inner}>
            <Image {...configuration} />
          </div>
        </div>
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  )
}
