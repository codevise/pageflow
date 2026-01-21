import React from 'react';
import classNames from 'classnames';

import {widths} from './layouts/widths';
import {useTrimDefaultMarginTop} from './TrimDefaultMarginTop';

import styles from './ContentElementMargin.module.css';

export function ContentElementMargin({width, first, defaultMarginTop, top, bottom, previousBottom, children}) {
  const trimDefaultMarginTop = useTrimDefaultMarginTop();

  if (width === widths.full) {
    return children;
  }

  return (
    <div className={classNames(styles.wrapper,
                               {[styles.noTopMargin]: trimDefaultMarginTop && first && !top})}
         style={{'--margin-top': scaleProperty(top) || defaultMarginTop,
                 '--margin-bottom': scaleProperty(bottom),
                 '--prev-margin-bottom': scaleProperty(previousBottom)}}>
      {children}
    </div>
  );
}

function scaleProperty(value) {
  return value && `var(--theme-content-element-margin-${value})`;
}
