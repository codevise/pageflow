import React from 'react';
import classNames from 'classnames';

import InlineCaption from './InlineCaption';
import Image from './Image';

import styles from './InlineImage.module.css';

export default function InlineImage(props) {
  return (
    <div className={classNames(styles.root)}>
      <div className={styles.container}>
        <div className={styles.spacer}>
          <div className={styles.inner}>
            <Image {...props} />
          </div>
        </div>
      </div>
      <InlineCaption text={props.caption} />
    </div>
  )
}
