import React from 'react';
import classNames from 'classnames';

import styles from './Indicator.module.css';

import {areaColor} from './Area';

export function Indicator({area, hidden, panZoomTransform, outerRef}) {
  const indicatorPosition = area.indicatorPosition || [50, 50];

  return (
    <div className={styles.wrapper} ref={outerRef} style={{transform: panZoomTransform}}>
      <div className={classNames(styles.indicator, {[styles.hidden]: hidden})}
           style={{'--color': areaColor(area),
                   left: `${indicatorPosition[0]}%`,
                   top: `${indicatorPosition[1]}%`}} />
    </div>
  );
}
