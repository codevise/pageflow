import React from 'react';

import {useContentElementAttributes} from './useContentElementAttributes';

import styles from './ContentElementBox.module.css';

/**
 * Wrap content element that render a visible box in this component to
 * apply theme specific styles like rounded corners.
 *
 * @param {Object} props
 * @param {string} props.children - Content of box.
 */
export function ContentElementBox({children}) {
  const {position} = useContentElementAttributes();

  if (position === 'backdrop') {
    return children;
  }

  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}
