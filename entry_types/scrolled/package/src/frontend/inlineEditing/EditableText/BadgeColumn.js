import React from 'react';

import {Range} from 'slate';
import {FloatingPortal} from '@floating-ui/react';
import {useSlate, ReactEditor} from 'slate-react';

import {Badge, useAnchoredFloating} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useEditorSelection} from '../EditorState';
import {highlightOverlapsSelection} from './highlightOverlapsSelection';

import styles from './BadgeColumn.module.css';

export function BadgeColumn({highlights, anchors}) {
  const editor = useSlate();
  // Treat `editor.selection` as a live cursor only while the editor
  // is focused. After the user clicks away, slate-react's throttled
  // `selectionchange` listener can sync a clamped DOM cursor back
  // into `editor.selection`, which would otherwise flip badges back
  // to overlap mode without any actual selection.
  const editorSelection = ReactEditor.isFocused(editor) ? editor.selection : null;

  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     highlight={highlight}
                     highlights={highlights}
                     editorSelection={editorSelection}
                     anchors={anchors} />
  ));
}

function PositionedBadge({highlight, highlights, editorSelection, anchors}) {
  const portalRoot = useFloatingPortalRoot();
  const {contentElementId, contentElementPermaId} = useContentElementAttributes();
  const {select: selectComments, selection: commentsSelection} = useEditorSelection({
    type: 'contentElementComments', id: contentElementId
  });
  const {isSelected: newThreadActive} = useEditorSelection({
    type: 'newThread', id: contentElementPermaId
  });

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(highlight.key, anchors, {placement: 'left-start'});

  if (!hasAnchor) return null;

  const isHighlightedThread = !!highlight.thread &&
                              commentsSelection?.highlightedThreadId === highlight.thread.id;
  const isActive = isHighlightedThread ||
                   (highlight.key === 'selection' && newThreadActive);
  // When a thread is highlighted, fall back to its start point for the
  // overlap check so siblings in the same block stay in regular mode
  // even if focus has drifted away from the slate editor. Use just the
  // start point (not the full range) to stay consistent with
  // highlightOverlapsSelection, which anchors to highlight starts.
  const highlightedRange = commentsSelection?.highlightedThreadId ?
                           highlights.find(
                             h => h.thread?.id === commentsSelection.highlightedThreadId
                           )?.range :
                           null;
  const fallbackPoint = highlightedRange && Range.start(highlightedRange);
  const overlapSelection = editorSelection ||
                           (fallbackPoint && {anchor: fallbackPoint, focus: fallbackPoint});
  const mode = isActive ? 'active' :
               highlightOverlapsSelection(highlight, overlapSelection) ? undefined :
               'dot';

  function handleClick() {
    if (highlight.key === 'selection') {
      selectComments();
      return;
    }

    const highlightStart = Range.start(highlight.range);
    const threadIds = highlights
      .filter(h => h.thread && highlightOverlapsSelection(
        h, {anchor: highlightStart, focus: highlightStart}
      ))
      .map(h => h.thread.id);

    selectComments({
      type: 'contentElementComments',
      id: contentElementId,
      highlightedThreadId: highlight.thread?.id,
      threadIds
    });
  }

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} className={styles.box} style={floatingStyles}>
        <Badge counter={1} mode={mode} onClick={handleClick} />
      </div>
    </FloatingPortal>
  );
}
