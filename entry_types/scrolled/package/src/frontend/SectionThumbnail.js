import React, {useEffect} from 'react';

import {EntryStateProvider, useEntryStateDispatch, useSectionStructure} from '../entryState';
import Section from './Section';

import entryStyles from './Entry.module.css';
import styles from './SectionThumbnail.module.css';

export function SectionThumbnail({seed, ...props}) {
  return (
    <EntryStateProvider seed={seed}>
      <Inner {...props} />
    </EntryStateProvider>
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
      <div className={styles.crop}>
        <div className={styles.scale}>
          <div className={entryStyles.Entry}>
            <Section state="active" {...section} transition="preview" />
          </div>
        </div>
      </div>
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
