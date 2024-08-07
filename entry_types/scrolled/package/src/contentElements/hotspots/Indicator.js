import React from 'react';
import classNames from 'classnames';

import styles from './Indicator.module.css';

import {areaColor} from './Area';

export function Indicator({area, portraitMode, hidden, outerRef}) {
  const indicatorPosition = (
    portraitMode ?
    area.portraitIndicatorPosition :
    area.indicatorPosition
  ) || [50, 50];

  return (
    <div className={styles.wrapper} ref={outerRef}>
      <div className={classNames(styles.indicator, {[styles.hidden]: hidden})}
           style={{'--color': areaColor(area, portraitMode),
                   left: `${indicatorPosition[0]}%`,
                   top: `${indicatorPosition[1]}%`}} />
    </div>
  );
}
