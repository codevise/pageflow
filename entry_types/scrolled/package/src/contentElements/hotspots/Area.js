import React from 'react';
import classNames from 'classnames';

import {
  Image,
  paletteColor,
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile
} from 'pageflow-scrolled/frontend';

import {Indicator} from './Indicator';

import styles from './Area.module.css';

export function Area({
  area, contentElementId, portraitMode, highlighted, activeImageVisible,
  onMouseEnter, onMouseLeave, onClick
}) {
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();

  const activeImageFile = useFile({
    collectionName: 'imageFiles', permaId: area.activeImage
  });
  const portraitActiveImageFile = useFile({
    collectionName: 'imageFiles', permaId: area.portraitActiveImage
  });

  const imageFile = portraitMode && portraitActiveImageFile ? portraitActiveImageFile : activeImageFile
  const outline = portraitMode ? area.portraitOutline : area.outline;

  return (
    <div className={classNames(styles.area, {[styles.highlighted]: highlighted,
                                             [styles.activeImageVisible]: activeImageVisible})}
         style={{'--color': areaColor(area, portraitMode)}}>
      <button aria-labelledby={`hotspots-tooltip-title-${contentElementId}-${area.id}`}
              className={styles.clip}
              style={{clipPath: polygon(outline)}}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave} />
      <Image imageFile={imageFile}
             load={shouldLoad}
             variant={'large'}
             preferSvg={true} />
      <Indicator area={area} portraitMode={portraitMode} />
      {isEditable && isSelected && <Outline points={outline} />}
    </div>
  );
}

export function areaColor(area, portraitMode) {
  return paletteColor(portraitMode ? (area.portraitColor || area.color) : area.color);
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
