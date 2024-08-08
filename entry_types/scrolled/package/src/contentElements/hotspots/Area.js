import React from 'react';
import classNames from 'classnames';

import {paletteColor} from 'pageflow-scrolled/frontend';

import styles from './Area.module.css';

export function Area({
  area, portraitMode, noPointerEvents,
  highlighted, outlined,
  className, children,
  onMouseEnter, onMouseLeave, onClick
}) {
  const outline = portraitMode ? area.portraitOutline : area.outline;

  return (
    <div className={classNames(styles.area,
                               className,
                               {[styles.highlighted]: highlighted,
                                [styles.noPointerEvents]: noPointerEvents})}>
      <div className={styles.clip}
           style={{clipPath: polygon(outline)}}
           tabIndex="-1"
           onClick={onClick}
           onMouseEnter={onMouseEnter}
           onMouseLeave={onMouseLeave} />
      {children}
      {outlined && <Outline points={outline}
                            color={areaColor(area, portraitMode)} />}
    </div>
  );
}

export function areaColor(area, portraitMode) {
  return paletteColor(portraitMode ? (area.portraitColor || area.color) : area.color);
}

function Outline({points, color}) {
  return (
    <svg className={styles.outline} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100"
         preserveAspectRatio="none">
      <polygon points={(points || []).map(coords => coords.map(coord => coord).join(',')).join(' ')}
               style={{stroke: color}} />
    </svg>
  );
}

function polygon(points) {
  return `polygon(${(points || []).map(coords => coords.map(coord => `${coord}%`).join(' ')).join(', ')})`;
}
