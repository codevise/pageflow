import React from 'react';
import classNames from 'classnames';

import {Image, InlineCaption, useContentElementLifecycle} from 'pageflow-scrolled/frontend';

import styles from './InlineImage.module.css';

export function InlineImage({configuration}) {
  const {isPrepared} = useContentElementLifecycle();

  return (
    <div className={classNames(styles.root)}>
      <div className={styles.container}>
        <div className={styles.spacer}>
          <div className={styles.inner}>
            <Image {...configuration}
                   isPrepared={isPrepared}
                   variant={configuration.position === 'full' ?  'large' : 'medium'} />
          </div>
        </div>
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  )
}
