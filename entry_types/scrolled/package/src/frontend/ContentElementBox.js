import React from 'react';
import classNames from 'classnames';

import {useContentElementAttributes} from './useContentElementAttributes';
import {widths} from './layouts/widths';

import styles from './ContentElementBox.module.css';

/**
 * Wrap content element that render a visible box in this component to
 * apply theme specific styles like rounded corners.
 *
 * @param {Object} props
 * @param {string} props.children - Content of box.
 */
export function ContentElementBox({children}) {
  const {position, width} = useContentElementAttributes();

  if (position === 'backdrop') {
    return children;
  }

  return (
    <div className={classNames(styles.wrapper, {[styles.full]: width === widths.full})}>
      {children}
    </div>
  );
}
