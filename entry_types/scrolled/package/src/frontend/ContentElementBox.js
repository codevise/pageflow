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
 * @param {Object} [props.configuration] - Content element configuration. Used to read box shadow and outline styles.
 * @param {string} [props.borderRadius] - Border radius value from theme scale, or "none" to render no wrapper.
 */
export function ContentElementBox({children, configuration, borderRadius, positioned}) {
  const {position, width} = useContentElementAttributes();

  const boxShadow = configuration?.boxShadow;
  const outlineColor = configuration?.outlineColor;

  if (position === 'backdrop') {
    return children;
  }

  if (borderRadius === 'none' && !boxShadow && !outlineColor) {
    return children;
  }

  const style = {
    ...(borderRadius && borderRadius !== 'none' && {
      '--content-element-box-border-radius': `var(--theme-content-element-box-border-radius-${borderRadius})`
    }),
    ...(boxShadow && {
      '--content-element-box-shadow': `var(--theme-content-element-box-shadow-${boxShadow})`
    }),
    ...(outlineColor && {
      '--content-element-box-outline-color': outlineColor
    })
  };

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
