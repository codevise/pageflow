import React from 'react';
import classNames from 'classnames';

import {useContentElementAttributes} from './useContentElementAttributes';
import {contentElementBoxProps} from './contentElementBoxStyle';
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

  const {style} = contentElementBoxProps(configuration, {borderRadius});

  if (position === 'backdrop') {
    return children;
  }

  if (borderRadius === 'none' && !Object.keys(style).length) {
    return children;
  }

  return (
    <div className={classNames(
           styles.properties,
           styles.wrapper,
           {[styles.full]: width === widths.full,
            [styles.positioned]: positioned}
         )}
         style={style}>
      {children}
    </div>
  );
}
