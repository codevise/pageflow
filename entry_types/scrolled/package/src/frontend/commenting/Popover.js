import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';

import {CommentBadge, ThreadList} from 'pageflow-scrolled/review';

import styles from './Popover.module.css';

export function Popover({subjectType, subjectId, placement}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleBadgeClick = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const onLeft = placement && placement.startsWith('left');
  const onBottom = placement && placement.startsWith('bottom');

  return (
    <div ref={ref}
         className={classNames(styles.popover,
                               {[styles.reversed]: onLeft,
                                [styles.bottom]: onBottom})}>
      <CommentBadge subjectType={subjectType}
                    subjectId={subjectId}
                    active={open}
                    onClick={handleBadgeClick} />
      <div className={styles.threadListContainer}>
        {open &&
          <ThreadList subjectType={subjectType}
                      subjectId={subjectId} />}
      </div>
    </div>
  );
}
