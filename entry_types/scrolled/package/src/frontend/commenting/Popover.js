import React, {useEffect, useRef} from 'react';
import classNames from 'classnames';

import {ThreadsBadge, ThreadList} from 'pageflow-scrolled/review';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './Popover.module.css';

export function Popover({subjectType, subjectId, subjectRange, placement, narrow, suppressNewForm, hideNewTopicButton}) {
  const {isSelected, showNewForm, select, clearSelection} = useSelectedSubject(subjectType, subjectId, subjectRange);
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
      if (ref.current && !ref.current.contains(event.target) && !event.target.closest('[data-comment-highlight]')) {
        clearSelection();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        clearSelection();
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, clearSelection]);

  const onLeft = placement && placement.startsWith('left');
  const onBottom = placement && placement.startsWith('bottom');

  return (
    <div ref={ref}
         data-floating-raised={isSelected || undefined}
         className={classNames(styles.popover,
                               {[styles.reversed]: onLeft,
                                [styles.bottom]: onBottom,
                                [styles.narrow]: narrow})}>
      <ThreadsBadge subjectType={subjectType}
                    subjectId={subjectId}
                    subjectRange={subjectRange}
                    mode={isSelected ? 'active' : undefined}
                    onClick={handleBadgeClick} />
      <div className={styles.threadListContainer}>
        {isSelected &&
          <ThreadList subjectType={subjectType}
                      subjectId={subjectId}
                      subjectRange={subjectRange}
                      showNewForm={showNewForm && !suppressNewForm}
                      hideNewTopicButton={hideNewTopicButton}
                      reversed={onLeft}
                      onDismiss={clearSelection} />}
      </div>
    </div>
  );
}
