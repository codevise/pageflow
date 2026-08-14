import React, {useCallback, useRef} from 'react';
import Measure from 'react-measure';

import {ViewTimelineSubjectContext} from './useContentElementViewTimelineProgress';

import styles from './ContentElementScrollSpace.module.css';

export function ContentElementScrollSpace({children}) {
  const ref = useRef();

  const getViewTimelineSubject = useCallback(() => ref.current, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <ViewTimelineSubjectContext.Provider value={getViewTimelineSubject}>
        <Measure bounds>
          {({measureRef, contentRect}) =>
            <div ref={measureRef}
                 className={styles.inner}
                 style={{'--height': contentRect.bounds.height / 2}}>
              {children}
            </div>
          }
        </Measure>
      </ViewTimelineSubjectContext.Provider>
    </div>
  );
}
