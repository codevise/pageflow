import React, {useEffect} from 'react';
import {
  useFloating, FloatingPortal,
  offset, flip, shift, autoUpdate
} from '@floating-ui/react';

import {ThreadsBadge, ThreadList} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './Popover.module.css';

export function Popover({
  subjectType, subjectId, subjectRange,
  placement = 'bottom-start', strategy = 'absolute', hideNewTopicButton
}) {
  const {isSelected, showNewForm, select, clearSelection} =
    useSelectedSubject(subjectType, subjectId, subjectRange);
  const portalRoot = useFloatingPortalRoot();

  const {refs, floatingStyles} = useFloating({
    open: isSelected,
    placement,
    strategy,
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: [placement.startsWith('top') ? 'bottom-start' : 'top-start'],
        rootBoundary: 'document'
      }),
      shift({padding: 8})
    ],
    whileElementsMounted: autoUpdate
  });

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
      if (refs.reference.current?.contains(event.target)) return;
      if (refs.floating.current?.contains(event.target)) return;
      if (event.target.closest('[data-comment-highlight]')) return;

      clearSelection();
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
  }, [isSelected, clearSelection, refs.reference, refs.floating]);

  return (
    <span ref={refs.setReference} className={styles.badge}>
      <ThreadsBadge subjectType={subjectType}
                    subjectId={subjectId}
                    subjectRange={subjectRange}
                    mode={isSelected ? 'active' : undefined}
                    onClick={handleBadgeClick} />
      {isSelected &&
        <FloatingPortal root={portalRoot}>
          <div ref={refs.setFloating}
               data-floating-raised
               className={styles.threadList}
               style={floatingStyles}>
            <ThreadList subjectType={subjectType}
                        subjectId={subjectId}
                        subjectRange={subjectRange}
                        showNewForm={showNewForm}
                        hideNewTopicButton={hideNewTopicButton} />
          </div>
        </FloatingPortal>}
    </span>
  );
}
