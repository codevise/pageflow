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
  const highlights = useCommentHighlights(trackedThreads);

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
  }, [registerAnchor]);

  return {
    enabled,
    highlights,
    anchors,
    decorate,
    withCommentHighlightDecoration,
    editableRemountKey: `threads-${threads.length}`,
    resetRangeRefs
  };
}

function HighlightSpan({rangeKey, children}) {
  const threadId = parseInt(rangeKey, 10);
  const {isSelected} = useEditorSelection({type: 'commentThread', id: threadId});

  return (
    <span className={classNames(highlightStyles.highlight,
                                {[highlightStyles.selected]: isSelected})}>
      {children}
    </span>
  );
}
