import React, {useContext} from 'react';
import classNames from 'classnames';

import styles from "./FitViewport.module.css";
import Fullscreen from "./Fullscreen";

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
 * @param {number} [props.scale] - Only take up fraction of the viewport height supplied as value between 0 and 1.
 * @param {Object} [props.opaque] - Render black background behind content.
 * @param {string} [props.fill] - Ignore aspect ration and fill viewport vertically.
 */
export function FitViewport({file, aspectRatio, opaque, children, fill, scale}) {
  if (!file && !aspectRatio) return children;

  if (typeof aspectRatio === 'string') {
    aspectRatio = `var(--theme-aspect-ratio-${aspectRatio})`;
  }

  aspectRatio = fill ? 'fill' : aspectRatio || (file.height / file.width);

  return (
    <div className={classNames(styles.container, {[styles.opaque]: opaque})}
         style={{'--fit-viewport-aspect-ratio': fill ? undefined : aspectRatio,
                 '--fit-viewport-scale': scale}}>
      <AspectRatioContext.Provider value={aspectRatio}>
        {children}
      </AspectRatioContext.Provider>
    </div>
  );
}

FitViewport.Content =
  function FitViewportContent({children}) {
    let aspectRatio = useContext(AspectRatioContext);

    if (aspectRatio === 'fill') {
      return (
        <Fullscreen children={children} />
      )
    }
    else if (!aspectRatio) {
      return children;
    }

    return (
      <div className={styles.content}>
        <div />
        <div className={styles.inner}>
          {children}
        </div>
      </div>
    );
  };
