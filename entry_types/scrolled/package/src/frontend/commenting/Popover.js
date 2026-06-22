import React, {useEffect, useState} from 'react';
import {
  useFloating, FloatingPortal,
  offset, flip, shift, autoUpdate
} from '@floating-ui/react';

import {ThreadsBadge, ThreadList} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
import {useCommentDisplayFilter} from './CommentDisplayFilterProvider';
import {useSelectedSubject} from './SelectedSubjectProvider';

import styles from './Popover.module.css';

export function Popover({
  subjectType, subjectId, subjectRange,
  placement = 'bottom-start', strategy = 'absolute', hideNewTopicButton
}) {
  const {isSelected, showNewForm, select, clearSelection, highlightedThreadId} =
    useSelectedSubject(subjectType, subjectId, subjectRange);
  const {resolution} = useCommentDisplayFilter();
  const [reference, setReference] = useState(null);

  // Scroll into view when navigation lands on this subject. Only
  // navigation sets a highlighted thread (clicking a badge does not), so
  // this never fires on plain selection. Re-firing while stepping
  // between a subject's threads targets the same badge, so it is a
  // no-op; a popover mounting late (after its excursion is activated)
  // scrolls once its reference becomes available.
  useEffect(() => {
    if (isSelected && highlightedThreadId != null) {
      reference?.scrollIntoView({block: 'center', behavior: 'smooth'});
    }
  }, [isSelected, highlightedThreadId, reference]);

  function handleBadgeClick() {
    if (isSelected) {
      clearSelection();
    }
    else {
      select();
    }
  }

  return (
    <span ref={setReference} className={styles.badge}>
      <ThreadsBadge subjectType={subjectType}
                    subjectId={subjectId}
                    subjectRange={subjectRange}
                    resolution={resolution}
                    mode={isSelected ? 'active' : undefined}
                    onClick={handleBadgeClick} />
      {isSelected &&
        <OpenThreadList reference={reference}
                        subjectType={subjectType}
                        subjectId={subjectId}
                        subjectRange={subjectRange}
                        placement={placement}
                        strategy={strategy}
                        showNewForm={showNewForm}
                        hideNewTopicButton={hideNewTopicButton}
                        highlightedThreadId={highlightedThreadId}
                        expandResolved={resolution === 'all'}
                        onDismiss={clearSelection} />}
    </span>
  );
}

function OpenThreadList({
  reference, subjectType, subjectId, subjectRange,
  placement, strategy, showNewForm, hideNewTopicButton, highlightedThreadId, expandResolved, onDismiss
}) {
  const portalRoot = useFloatingPortalRoot();

  const {refs, floatingStyles} = useFloating({
    open: true,
    elements: {reference},
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

  useEffect(() => {
    function handleClick(event) {
      if (reference?.contains(event.target)) return;
      if (refs.floating.current?.contains(event.target)) return;
      if (event.target.closest('[data-comment-highlight]')) return;
      if (event.target.closest('[data-comment-toolbar]')) return;

      onDismiss();
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onDismiss();
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [reference, refs.floating, onDismiss]);

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating}
           data-floating-raised
           className={styles.threadList}
           style={floatingStyles}>
        <ThreadList subjectType={subjectType}
                    subjectId={subjectId}
                    subjectRange={subjectRange}
                    highlightedThreadId={highlightedThreadId}
                    expandResolved={expandResolved}
                    showNewForm={showNewForm}
                    hideNewTopicButton={hideNewTopicButton} />
      </div>
    </FloatingPortal>
  );
}
