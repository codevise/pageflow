import React, {useContext} from 'react';

import styles from "./ViewportDependentPillarBoxes.module.css";
import {HeightContext} from "./Fullscreen";

export function ViewportDependentPillarBoxes({file, children}) {
  const height = useContext(HeightContext);

  if(!file) return children;

  const videoAR = (file.height / file.width);
  const arPaddingTop = videoAR * 100;

  let maxWidthCSS = '100vh';
  if(height) {
    // thumbnail view/fixed size: calculate absolute width in px
    maxWidthCSS = (height / videoAR) + 'px';
  } else {
    // published view: set max width to specific aspect ratio depending on viewport height
    maxWidthCSS = ((file.width / file.height) * 100) + 'vh';
  }

  return (
    <div className={styles.container} style={{maxWidth: maxWidthCSS}}>
      <div style={{paddingTop: arPaddingTop + '%', outline: 'solid 1px red'}}>
        {arPaddingTop}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
