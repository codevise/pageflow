import React, {useCallback, useMemo} from 'react';

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
  const highlights = useCommentHighlights(trackedThreads);

  const decorate = useMemo(
    () => enabled ? decorateCommentHighlights(editor, highlights) : null,
    [editor, highlights, enabled]
  );

  const withCommentHighlightDecoration = useCallback(({attributes, children, leaf}) => {
    if (leaf.commentHighlight) {
      children = <span className={highlightStyles.highlight}>{children}</span>;
    }

    if (leaf.firstInRange) {
      children = (
        <RangeAnchor rangeKey={leaf.rangeKey} onRegister={registerAnchor}>
          {children}
        </RangeAnchor>
      );
    }

    return {attributes, children, leaf};
  // `threads` is included to invalidate this callback (and the
  // `renderLeaf` that wraps it) when comment threads update. Without
  // that, slate-react's `MemoizedText` would skip re-rendering leaves
  // whose decorations changed because its memo equality function does
  // not compare `decorations`.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerAnchor, threads]);

  return {
    enabled,
    highlights,
    anchors,
    decorate,
    withCommentHighlightDecoration,
    resetRangeRefs
  };
}
