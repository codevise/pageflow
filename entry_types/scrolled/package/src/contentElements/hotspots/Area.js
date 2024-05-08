import React from 'react';

import styles from './Area.module.css';

export function Area({area}) {
  return (
    <div className={styles.area}>
      <button className={styles.clip}
              style={{clipPath: polygon(area.outline)}}/>
    </div>
  );
}

function polygon(points) {
  return `polygon(${(points || []).map(coords => coords.map(coord => `${coord}%`).join(' ')).join(', ')})`;
}
