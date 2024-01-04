import React from 'react';
import Measure from 'react-measure';

import styles from './ContentElementScrollSpace.module.css';

export function ContentElementScrollSpace({children}) {
  return (
    <div className={styles.wrapper}>
      <Measure bounds>
        {({measureRef, contentRect}) =>
          <div ref={measureRef}
               className={styles.inner}
               style={{'--height': contentRect.bounds.height / 2}}>
            {children}
          </div>
        }
      </Measure>
    </div>
  );
}
