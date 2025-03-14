import React from 'react';
import classNames from 'classnames';

import {paletteColor} from 'pageflow-scrolled/frontend';

import styles from './Area.module.css';

export function Area({
  area, noPointerEvents,
  highlighted, outlined, outlineHidden,
  className, children,
  onMouseEnter, onMouseLeave, onClick
}) {
  return (
    <div className={classNames(styles.area,
                               className,
                               {[styles.highlighted]: highlighted,
                                [styles.noPointerEvents]: noPointerEvents})}>
      <div className={styles.clip}
           style={{clipPath: polygon(area.outline)}}
           tabIndex="-1"
           onClick={onClick}
           onMouseEnter={onMouseEnter}
           onMouseLeave={onMouseLeave} />
      {children}
      {outlined && <Outline points={area.outline}
                            color={areaColor(area)}
                            hidden={outlineHidden} />}
    </div>
  );
}

export function areaColor(area) {
  return paletteColor(area.color);
}

function Outline({points, color, hidden}) {
  return (
    <svg className={classNames(styles.outline,
                               {[styles.hidden]: hidden})}
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100"
         preserveAspectRatio="none">
      <polygon points={(points).map(coords => coords.map(coord => coord).join(',')).join(' ')}
               style={{stroke: color}} />
    </svg>
  );
}

function polygon(points) {
  return `polygon(${(points).map(coords => coords.map(coord => `${coord}%`).join(' ')).join(', ')})`;
}
