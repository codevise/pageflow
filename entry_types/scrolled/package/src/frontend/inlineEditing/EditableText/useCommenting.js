import React, {useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {Range, Transforms} from 'slate';
import {ReactEditor} from 'slate-react';

import {features} from 'pageflow/frontend';
import {
  useCommentThreads,
  useCommentHighlights,
  decorateCommentHighlights,
  useRangeAnchors,
  RangeAnchor,
  commentHighlightStyles as highlightStyles
} from 'pageflow-scrolled/review';

import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useEditorSelection} from '../EditorState';
import {useSelectCommentThreadHandler} from '../useSelectCommentThreadHandler';
import {useCommentRangeRefs} from './useCommentRangeRefs';

// Bundles all commenting-related state and render helpers for the
// EditableText editor. Returns `enabled: false` when commenting is
// disabled for the current content element; consumers can then skip
// the commenting-specific decorate/BadgeColumn paths.
export function useCommenting(editor) {
  const {contentElementId, contentElementPermaId, inlineComments} =
    useContentElementAttributes();
  const enabled = features.isEnabled('commenting') && inlineComments;

  // Track ranges for resolved threads too, so their subject ranges keep
  // following live edits and stay correct once a thread is reopened.
  // Resolved threads are merely hidden from the highlight overlay until
  // they become the highlighted thread (see `visibleThreads`).
  const threads = useCommentThreads(
    enabled ? {subjectType: 'ContentElement', subjectId: contentElementPermaId} : null
  );

  const {trackedThreads, resetRangeRefs, getTrackedSubjectRanges} =
    useCommentRangeRefs(editor, threads);
  const {anchors, registerAnchor} = useRangeAnchors();
  const {isSelected: newThreadActive, range: newThreadRange} = useEditorSelection({
    type: 'newThread',
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId
  });

  const commentsSelectionOptions = useMemo(
    () => ({type: 'contentElementComments', id: contentElementId}),
    [contentElementId]
  );
  const {select: selectComments, selection: commentsSelection} =
    useEditorSelection(commentsSelectionOptions);
  const highlightedThreadId = commentsSelection?.highlightedThreadId;

  // Move the cursor into the thread's block before the handler selects
  // it, so `Selection`'s `cursorLeftHighlightedThreadBlock` does not
  // treat a pre-existing cursor as having left the comment and re-select
  // the content element, which would hide the highlight again. Routing
  // through the handler also reveals a resolved thread (via
  // `visibleThreads`) when it is selected.
  useSelectCommentThreadHandler({
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId,
    getScrollTarget: useCallback(threadId => {
      const range = getTrackedSubjectRanges()[threadId];
      return range ? domElementAtRangeStart(editor, range) : null;
    }, [editor, getTrackedSubjectRanges]),
    beforeSelect: useCallback(threadId => {
      const range = getTrackedSubjectRanges()[threadId];

      if (range) {
        Transforms.select(editor, Range.start(range));
      }
    }, [editor, getTrackedSubjectRanges]),
    selectThread: useCallback(threadId => selectComments({
      type: 'contentElementComments',
      id: contentElementId,
      highlightedThreadId: threadId
    }), [selectComments, contentElementId])
  });

  const visibleThreads =
    trackedThreads.filter(t => !t.resolvedAt || t.id === highlightedThreadId);

  const highlights = useCommentHighlights(
    visibleThreads,
    newThreadActive ? newThreadRange : undefined
  );

  const decorate = useMemo(
    () => enabled ? decorateCommentHighlights(editor, highlights) : null,
    [editor, highlights, enabled]
  );

  const withCommentHighlightDecoration = useCallback(({attributes, children, leaf}) => {
    if (leaf.commentHighlight) {
      children = (
        <HighlightSpan rangeKey={leaf.rangeKey}>
          {children}
        </HighlightSpan>
      );
    }

    if (leaf.firstInRange) {
      children = (
        <RangeAnchor rangeKey={leaf.rangeKey} onRegister={registerAnchor}>
          {children}
        </RangeAnchor>
      );
    }

    return {attributes, children, leaf};
  // `threads` and `newThreadRange` are included to invalidate this
  // callback (and the `renderLeaf` that wraps it) when decorations
  // change. Without that, slate-react's `MemoizedText` would skip
  // re-rendering leaves whose decorations changed because its memo
  // equality function does not compare `decorations`.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerAnchor, contentElementPermaId, threads, newThreadRange, highlightedThreadId]);

  return {
    enabled,
    highlights,
    anchors,
    decorate,
    withCommentHighlightDecoration,
    resetRangeRefs,
    getTrackedSubjectRanges
  };
}

// A resolved thread has no badge yet to scroll itself into view, so the
// commented text is scrolled directly. The leaf DOM already exists, so
// this resolves even before the highlight re-renders.
function domElementAtRangeStart(editor, range) {
  try {
    const start = Range.start(range);
    const domRange = ReactEditor.toDOMRange(editor, {anchor: start, focus: start});
    const {startContainer} = domRange;

    return startContainer.nodeType === Node.ELEMENT_NODE ?
           startContainer :
           startContainer.parentElement;
  }
  catch (e) {
    // toDOMRange throws when the range is not currently rendered.
    return null;
  }
}

function HighlightSpan({rangeKey, children}) {
  const {contentElementId, contentElementPermaId} = useContentElementAttributes();
  const threadId = parseInt(rangeKey, 10);
  const {isSelected: commentsSelected, selection: commentsSelection} = useEditorSelection({
    type: 'contentElementComments', id: contentElementId
  });
  const {isSelected: newThreadActive} = useEditorSelection({
    type: 'newThread', subjectType: 'ContentElement', subjectId: contentElementPermaId
  });
  const isSelected = (commentsSelected && commentsSelection?.highlightedThreadId === threadId) ||
                     (rangeKey === 'selection' && newThreadActive);

  return (
    <span className={classNames(highlightStyles.highlight,
                                {[highlightStyles.selected]: isSelected})}>
      {children}
    </span>
  );
}
