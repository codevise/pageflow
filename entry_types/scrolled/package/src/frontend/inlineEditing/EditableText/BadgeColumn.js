import React, {useCallback, useMemo} from 'react';

import {Range, Transforms} from 'slate';
import {useSlate} from 'slate-react';

import {
  Badge, useAnchoredFloating, useCommentDisplayFilter, useUnreadActivityCount
} from 'pageflow-scrolled/review';
import {useContentElementCommentSelection} from '../useCommentSelection';
import {rangeOverlapsSelection} from './rangeOverlapsSelection';
import {useOverlapSelection} from './useOverlapSelection';

import styles from './BadgeColumn.module.css';

const noThreads = [];

export function BadgeColumn({highlights, highlightedRange, anchors}) {
  const editor = useSlate();

  // The same for every badge, so resolved once here rather than per badge.
  const overlapSelection = useOverlapSelection(highlightedRange);

  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     editor={editor}
                     highlight={highlight}
                     overlapSelection={overlapSelection}
                     anchors={anchors} />
  ));
}

function PositionedBadge({editor, highlight, overlapSelection, anchors}) {
  const {selected, highlightedThreadId, selectComments, selectThread} =
    useContentElementCommentSelection();
  const {alwaysShowComments} = useCommentDisplayFilter();

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(highlight.key, anchors, {placement: 'left-start'});

  const threads = useMemo(
    () => (highlight.thread ? [highlight.thread] : noThreads),
    [highlight.thread]
  );
  const unreadCount = useUnreadActivityCount(threads);

  const handleClick = useCallback(() => {
    if (highlight.key === 'selection') {
      selectComments();
      return;
    }

    // Don't try to also clear the DOM selection here: calling
    // removeAllRanges fires a selectionchange that slate-react's
    // listener picks up and uses to overwrite editor.selection back
    // to null — undoing this Transforms.select and dropping the
    // selection rect. The visible text selection therefore lingers
    // on screen until the user's next interaction with the editor;
    // slate's internal state (which downstream consumers depend on)
    // stays correct.
    Transforms.select(editor, Range.start(highlight.range));

    selectThread(highlight.thread?.id);
  }, [editor, highlight, selectComments, selectThread]);

  if (!hasAnchor) return null;

  const isHighlightedThread = !!highlight.thread &&
                              highlightedThreadId === highlight.thread.id;
  const isActive = isHighlightedThread ||
                   (highlight.key === 'selection' && selected === 'newThread');
  const mode = isActive ? 'active' :
               rangeOverlapsSelection(highlight.range, overlapSelection) ? undefined :
               alwaysShowComments ? 'dot' : 'none';

  return (
    <div ref={refs.setFloating} className={styles.box} style={floatingStyles}>
      <Badge counter={1}
             mode={mode}
             resolved={!!highlight.thread?.resolvedAt}
             unreadCount={unreadCount}
             onClick={handleClick} />
    </div>
  );
}
