import React, {useContext} from 'react';
import classNames from 'classnames';

import styles from "./ViewportDependentPillarBoxes.module.css";
import {HeightContext} from "./Fullscreen";

/**
 * Render a spanning div with the given aspect ratio which does not
 * exceed the heigth of the viewport. Render pillar boxes instead to
 * make it fit otherwise.
 *
 * @param {Object} props
 * @param {string} props.position -
 * Position setting of parent content element to automatically
 *   determine whether to use opaque background.
 * @param {boolean} [props.opaque] - Force using opaque background.
 * @param {number} [props.aspectRatio] - Aspect ratio of div.
 * @param {Object} [props.file] - Use width/height of file to calculate aspect ratio.
 */
export function ViewportDependentPillarBoxes({file, aspectRatio, position, opaque, children}) {
  const height = useContext(HeightContext);

  if (!file && !aspectRatio) return children;

  aspectRatio = aspectRatio || (file.height / file.width);
  const arPaddingTop = aspectRatio * 100;

  let maxWidthCSS;

  if (height) {
    // thumbnail view/fixed size: calculate absolute width in px
    maxWidthCSS = (height / aspectRatio) + 'px';
  } else {
    // published view: set max width to specific aspect ratio depending on viewport height
    maxWidthCSS = (100 / aspectRatio) + 'vh';
  }

  return (
    <div className={classNames({[styles.opaque]: position === 'full' || opaque})}>
      <div className={styles.container} style={{maxWidth: maxWidthCSS}}>
        <div style={{paddingTop: arPaddingTop + '%'}}>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
