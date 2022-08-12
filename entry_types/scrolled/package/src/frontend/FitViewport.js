import React, {useContext} from 'react';
import classNames from 'classnames';

import styles from "./FitViewport.module.css";
import {HeightContext} from "./Fullscreen";

const AspectRatioContext = React.createContext();

/**
 * Render a div with the given aspect ratio which does not
 * exceed the heigth of the viewport by setting an appropriate
 * `max-width` on the container.
 *
 * Wrap content in `FitViewport.Content` element:
 *
 *    <FitViewport aspectRatio={0.5625}>
 *      <FitViewport.Content>
 *         <div style={{height: '100%'}}>
 *            This div will have the specified aspec ratio
 *            while not exceeding the height of the viewport
 *         </div>
 *      </FitViewport.Content>
 *      <div>
 *        This div will have the same width as the content.
 *      </div>
 *    </FitViewport>
 *
 * @param {Object} props
 * @param {number} [props.aspectRatio] - Aspect ratio of div.
 * @param {Object} [props.file] - Use width/height of file to calculate aspect ratio.
 * @param {Object} [props.opaque] - Render black background behind content.
 */
export function FitViewport({file, aspectRatio, opaque, children}) {
  const height = useContext(HeightContext);

  if (!file && !aspectRatio) return children;

  aspectRatio = aspectRatio || (file.height / file.width);

  let maxWidthCSS;

  if (height) {
    // thumbnail view/fixed size: calculate absolute width in px
    maxWidthCSS = (height / aspectRatio) + 'px';
  } else {
    // published view: set max width to specific aspect ratio depending on viewport height
    maxWidthCSS = (100 / aspectRatio) + 'vh';
  }

  return (
    <div className={classNames(styles.container, {[styles.opaque]: opaque})}
         style={{maxWidth: maxWidthCSS}}>
      <AspectRatioContext.Provider value={aspectRatio}>
        {children}
      </AspectRatioContext.Provider>
    </div>
  );
}

FitViewport.Content =
  function FitViewportContent({children}) {
    const arPaddingTop = useContext(AspectRatioContext) * 100;

    if (!arPaddingTop) {
      return children;
    }

    return (
      <div className={styles.content}>
        <div style={{paddingTop: arPaddingTop + '%'}}>
        </div>
        <div className={styles.inner}>
          {children}
        </div>
      </div>
    );
  };
