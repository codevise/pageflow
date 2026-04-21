import React, {useCallback, useMemo} from 'react';
import classNames from 'classnames';

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
import {useCommentRangeRefs} from './useCommentRangeRefs';

// Bundles all commenting-related state and render helpers for the
// EditableText editor. Returns `enabled: false` when commenting is
// disabled for the current content element; consumers can then skip
// the commenting-specific decorate/BadgeColumn paths.
export function useCommenting(editor) {
  const {contentElementPermaId, inlineComments} = useContentElementAttributes();
  const enabled = features.isEnabled('commenting') && inlineComments;

  const threads = useCommentThreads(
    enabled ? {subjectType: 'ContentElement', subjectId: contentElementPermaId} : null,
    {resolved: false}
  );

  const {trackedThreads, resetRangeRefs} = useCommentRangeRefs(editor, threads);
  const {anchors, registerAnchor} = useRangeAnchors();
  const {isSelected: newThreadActive, range: newThreadRange} = useEditorSelection({
    type: 'newThread',
    id: contentElementPermaId
  });

  const highlights = useCommentHighlights(
    trackedThreads,
    newThreadActive ? newThreadRange : undefined
  );

  const decorate = useMemo(
    () => enabled ? decorateCommentHighlights(editor, highlights) : null,
    [editor, highlights, enabled]
  );

  const withCommentHighlightDecoration = useCallback(({attributes, children, leaf}) => {
    if (leaf.commentHighlight) {
      children = (
        <HighlightSpan rangeKey={leaf.rangeKey} contentElementPermaId={contentElementPermaId}>
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
  }, [registerAnchor, contentElementPermaId, threads, newThreadRange]);

  return {
    enabled,
    highlights,
    anchors,
    decorate,
    withCommentHighlightDecoration,
    resetRangeRefs
  };
}

function HighlightSpan({rangeKey, contentElementPermaId, children}) {
  const threadId = parseInt(rangeKey, 10);
  const {isSelected: threadSelected} = useEditorSelection({
    type: 'commentThread', id: threadId
  });
  const {isSelected: newThreadActive} = useEditorSelection({
    type: 'newThread', id: contentElementPermaId
  });
  const isSelected = threadSelected ||
                     (rangeKey === 'selection' && newThreadActive);

  return (
    <span className={classNames(highlightStyles.highlight,
                                {[highlightStyles.selected]: isSelected})}>
      {children}
    </span>
  );
}
