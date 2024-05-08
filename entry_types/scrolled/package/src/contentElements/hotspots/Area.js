import React from 'react';

import {
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

import styles from './Area.module.css';

export function Area({area}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  return (
    <div className={styles.area}>
      <button className={styles.clip}
              style={{clipPath: polygon(area.outline)}}/>
      {isEditable && isSelected && <Outline points={area.outline} />}
    </div>
  );
}

function Outline({points}) {
  return (
    <svg className={styles.outline} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points={(points || []).map(coords => coords.map(coord => coord).join(',')).join(' ')} />
    </svg>
  );
}

function polygon(points) {
  return `polygon(${(points || []).map(coords => coords.map(coord => `${coord}%`).join(' ')).join(', ')})`;
}
