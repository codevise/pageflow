import React, {useCallback, useState} from 'react';

import {CommentBadge, ThreadList} from 'pageflow-scrolled/review';

import styles from './ContentElementDecorator.module.css';

export function ContentElementDecorator({permaId, children}) {
  const [open, setOpen] = useState(false);

  const handleBadgeClick = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <div className={styles.wrapper}>
      {children}
      <div className={styles.overlay}>
        <CommentBadge subjectType="ContentElement"
                      subjectId={permaId}
                      onClick={handleBadgeClick} />
        {open &&
          <div className={styles.bubble}>
            <ThreadList subjectType="ContentElement"
                        subjectId={permaId} />
          </div>}
      </div>
    </div>
  );
}
