import React from 'react';

import styles from './Indicator.module.css';

export function Indicator({area, portraitMode}) {
  const indicatorPosition = (
    portraitMode ?
    area.portraitIndicatorPosition :
    area.indicatorPosition
  ) || [50, 50];

  return (
    <div className={styles.indicator}
         style={{left: `${indicatorPosition[0]}%`,
                 top: `${indicatorPosition[1]}%`}} />
  );
}
