import React from 'react';
import classNames from 'classnames';

import styles from './Indicator.module.css';

import {areaColor} from './Area';

export function Indicator({area, hidden, panZoomTransform, outerRef}) {
  return (
    <div className={styles.wrapper} ref={outerRef} style={{transform: panZoomTransform}}>
      <div className={classNames(styles.indicator, {[styles.hidden]: hidden})}
           style={{'--color': areaColor(area),
                   left: `${area.indicatorPosition[0]}%`,
                   top: `${area.indicatorPosition[1]}%`}} />
    </div>
  );
}
