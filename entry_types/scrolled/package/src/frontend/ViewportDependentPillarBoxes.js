import React from 'react';
import classNames from 'classnames';

import styles from "./ViewportDependentPillarBoxes.module.css";

export function ViewportDependentPillarBoxes({file, position, children}) {
  const css = calculatePadding(file, position);

  return (
    <div className={classNames(styles.root)}>
      <div style={{paddingTop: css.paddingTop}}>
        <div className={styles.inner}
             style={{left: css.leftRight, right: css.leftRight}}>
          {children}
        </div>
      </div>
    </div>
  );
}

function calculatePadding(file, position) {
  const videoAR = (file.height / file.width);
  let baseCss = {
    paddingTop: (videoAR * 100) + '%',
    leftRight: 0
  }

  if (position === 'full') {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const viewPortAR = (viewportHeight / viewportWidth);
    if (viewPortAR < videoAR) {
      const leftRight = (viewportWidth - (viewportHeight / videoAR)) / 2;
      baseCss.paddingTop = (viewPortAR * 100) + '%';
      baseCss.leftRight = leftRight + 'px'
    }
  }

  return baseCss;
}