import React, {useCallback} from 'react';

import {Range, Transforms} from 'slate';
import {FloatingPortal} from '@floating-ui/react';
import {useSlate, ReactEditor} from 'slate-react';

import {Badge, useAnchoredFloating} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useContentElementCommentSelection} from '../useCommentSelection';
import {highlightOverlapsSelection} from './highlightOverlapsSelection';

import styles from './BadgeColumn.module.css';

export function BadgeColumn({highlights, anchors}) {
  const editor = useSlate();
  const {highlightedThreadId} = useContentElementCommentSelection();

  // Treat `editor.selection` as a live cursor only while the editor
  // is focused. After the user clicks away, slate-react's throttled
  // `selectionchange` listener can sync a clamped DOM cursor back
  // into `editor.selection`, which would otherwise flip badges back
  // to overlap mode without any actual selection.
  const editorSelection = ReactEditor.isFocused(editor) ? editor.selection : null;

  // When a thread is highlighted, fall back to its start point for the
  // overlap check so siblings in the same block stay in regular mode
  // even if focus has drifted away from the slate editor. Use just the
  // start point (not the full range) to stay consistent with
  // highlightOverlapsSelection, which anchors to highlight starts. The
  // overlap selection is the same for every badge, so resolve it once
  // here rather than per badge.
  const highlightedRange = highlightedThreadId ?
                           highlights.find(
                             h => h.thread?.id === highlightedThreadId
                           )?.range :
                           null;
  const fallbackPoint = highlightedRange && Range.start(highlightedRange);
  const overlapSelection = editorSelection ||
                           (fallbackPoint && {anchor: fallbackPoint, focus: fallbackPoint});

  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     editor={editor}
                     highlight={highlight}
                     overlapSelection={overlapSelection}
                     anchors={anchors} />
  ));
}

function PositionedBadge({editor, highlight, overlapSelection, anchors}) {
  const portalRoot = useFloatingPortalRoot();
  const {selected, highlightedThreadId, selectComments, selectThread} =
    useContentElementCommentSelection();

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(highlight.key, anchors, {placement: 'left-start'});

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
               highlightOverlapsSelection(highlight, overlapSelection) ? undefined :
               'dot';

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} className={styles.box} style={floatingStyles}>
        <Badge counter={1}
               mode={mode}
               resolved={!!highlight.thread?.resolvedAt}
               onClick={handleClick} />
      </div>
    </FloatingPortal>
  );
}
