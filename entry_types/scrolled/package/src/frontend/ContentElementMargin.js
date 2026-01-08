import React from 'react';
import classNames from 'classnames';

import {widths} from './layouts/widths';
import {useTrimMarginTop} from './TrimMarginTop';

import styles from './ContentElementMargin.module.css';

export function ContentElementMargin({width, first, top, bottom, children}) {
  const trimMarginTop = useTrimMarginTop();

  if (width === widths.full) {
    return children;
  }

  return (
    <div className={classNames(styles.wrapper,
                               {[styles.noTopMargin]: trimMarginTop && first})}
         style={{marginTop: scaleProperty(top),
                 marginBottom: scaleProperty(bottom)}}>
      {children}
    </div>
  );
}

function scaleProperty(value) {
  return value && `var(--theme-content-element-margin-${value})`;
}
