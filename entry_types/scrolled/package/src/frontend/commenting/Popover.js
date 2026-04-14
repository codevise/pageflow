import React, {useEffect, useRef} from 'react';
import classNames from 'classnames';

import {CommentBadge, ThreadList} from 'pageflow-scrolled/review';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './Popover.module.css';

export function Popover({subjectType, subjectId, placement}) {
  const {isSelected, showNewForm, subjectRange, select, clearSelection} = useSelectedSubject(subjectType, subjectId);
  const ref = useRef(null);

  function handleBadgeClick() {
    if (isSelected) {
      clearSelection();
    }
    else {
      select();
    }
  }

  useEffect(() => {
    if (!isSelected) return;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        clearSelection();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        clearSelection();
      }
    }

    document.addEventListener('pointerdown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, clearSelection]);

  const onLeft = placement && placement.startsWith('left');
  const onBottom = placement && placement.startsWith('bottom');

  return (
    <div ref={ref}
         className={classNames(styles.popover,
                               {[styles.reversed]: onLeft,
                                [styles.bottom]: onBottom})}>
      <CommentBadge subjectType={subjectType}
                    subjectId={subjectId}
                    mode={isSelected ? 'active' : undefined}
                    onClick={handleBadgeClick} />
      <div className={styles.threadListContainer}>
        {isSelected &&
          <ThreadList subjectType={subjectType}
                      subjectId={subjectId}
                      subjectRange={subjectRange}
                      showNewForm={showNewForm}
                      reversed={onLeft}
                      onDismiss={clearSelection} />}
      </div>
    </div>
  );
}
