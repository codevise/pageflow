import React, {useCallback, useRef} from 'react';
import Measure from 'react-measure';

import {ViewTimelinePinProvider} from './useContentElementViewTimelineProgress';

import styles from './ContentElementScrollSpace.module.css';

export function ContentElementScrollSpace({children}) {
  const ref = useRef();
  const innerRef = useRef();

  const getPinnedElements = useCallback(
    () => ({subject: ref.current, element: innerRef.current}),
    []
  );

  return (
    <div className={styles.wrapper} ref={ref}>
      <ViewTimelinePinProvider getPinnedElements={getPinnedElements}>
        <Measure bounds innerRef={innerRef}>
          {({measureRef, contentRect}) =>
            <div ref={measureRef}
                 className={styles.inner}
                 style={{'--height': contentRect.bounds.height / 2}}>
              {children}
            </div>
          }
        </Measure>
      </ViewTimelinePinProvider>
    </div>
  );
}
