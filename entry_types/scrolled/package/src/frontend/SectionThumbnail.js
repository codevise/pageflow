import React, {useEffect} from 'react';
import Measure from 'react-measure';

import {RootProviders} from './RootProviders';
import {useEntryStateDispatch, useSectionStructure} from '../entryState';
import Section from './Section';
import {FullscreenHeightProvider} from './Fullscreen';
import {StaticPreview} from './useScrollPositionLifecycle';

import entryStyles from './Entry.module.css';
import styles from './SectionThumbnail.module.css';

export function SectionThumbnail({seed, ...props}) {
  return (
    <RootProviders seed={seed}>
      <Inner {...props} />
    </RootProviders>
  );
}

function Inner({sectionPermaId, subscribe}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => {
    return subscribe(dispatch);
  }, [subscribe, dispatch])

  const section = useSectionStructure({sectionPermaId});

  if (section) {
    return (
      <StaticPreview>
        <Measure client>
          {({measureRef, contentRect}) =>
            <FullscreenHeightProvider height={contentRect.client.height &&
                                              Math.ceil(contentRect.client.height) * 5}>
              <div ref={measureRef} className={styles.crop}>
                <div className={styles.scale}>
                  <div className={entryStyles.Entry}>
                    <Section state="active" {...section} transition="preview" />
                  </div>
                </div>
              </div>
            </FullscreenHeightProvider>
          }
        </Measure>
      </StaticPreview>
    );
  }
  else {
    return (
      <div className={styles.root}>
        Not found.
      </div>
    );
  }
}

Inner.defaultProps = {
  subscribe: () => {}
}
