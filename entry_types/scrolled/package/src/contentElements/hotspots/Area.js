import React from 'react';
import classNames from 'classnames';

import {
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

import {Indicator} from './Indicator';

import styles from './Area.module.css';

export function Area({
  area, contentElementId, portraitMode, highlighted,
  onMouseEnter, onMouseLeave, onClick
}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  const outline = portraitMode ? area.portraitOutline : area.outline;

  return (
    <div className={classNames(styles.area, {[styles.highlighted]: highlighted})}>
      <button aria-labelledby={`hotspots-tooltip-title-${contentElementId}-${area.id}`}
              className={styles.clip}
              style={{clipPath: polygon(outline)}}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave} />
      <Indicator area={area} portraitMode={portraitMode} />
      {isEditable && isSelected && <Outline points={outline} />}
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
