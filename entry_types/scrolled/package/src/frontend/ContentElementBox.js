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
 * @param {string} props.borderRadius - Border radius value from theme scale, or "none" to render no wrapper.
 */
export function ContentElementBox({children, borderRadius, positioned}) {
  const {position, width} = useContentElementAttributes();

  if (position === 'backdrop' || borderRadius === 'none') {
    return children;
  }

  const style = borderRadius ? {
    '--content-element-box-border-radius': `var(--theme-content-element-box-border-radius-${borderRadius})`
  } : {};

  return (
    <div className={classNames(
           styles.wrapper,
           {[styles.full]: width === widths.full,
            [styles.positioned]: positioned}
         )}
         style={style}>
      {children}
    </div>
  );
}
