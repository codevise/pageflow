import {useCallback, useMemo} from 'react';

import {useContentElementAttributes} from '../useContentElementAttributes';
import {useEditorSelection} from './EditorState';

// Bundles an element's two comment-related editor selections - the
// highlighted comment thread and the pending new thread - which are
// mutually exclusive since the editor has a single selection at a time.
// Returns the active state plus actions to select the comments, a
// specific thread or a new thread. `type` is the comments selection type
// ('contentElementComments' or 'sectionComments'); `subjectType` and
// `subjectId` identify the new-thread subject.
export function useCommentSelection({type, id, subjectType, subjectId}) {
  const {
    isSelected: commentsSelected,
    selection: commentsSelection,
    select: selectComments
  } = useEditorSelection(useMemo(() => ({type, id}), [type, id]));

  const {
    isSelected: newThreadActive,
    range: newThreadRange,
    select: selectNewThreadSelection
  } = useEditorSelection(useMemo(
    () => ({type: 'newThread', subjectType, subjectId}),
    [subjectType, subjectId]
  ));

  const selectThread = useCallback(
    threadId => selectComments({type, id, highlightedThreadId: threadId}),
    [selectComments, type, id]
  );

  const selectNewThread = useCallback(
    range => range ?
             selectNewThreadSelection({type: 'newThread', subjectType, subjectId, range}) :
             selectNewThreadSelection(),
    [selectNewThreadSelection, subjectType, subjectId]
  );

  return {
    selected: commentsSelected ? 'comments' : newThreadActive ? 'newThread' : null,
    highlightedThreadId: commentsSelection?.highlightedThreadId,
    newThreadRange: newThreadActive ? newThreadRange : undefined,
    selectComments,
    selectThread,
    selectNewThread
  };
}

export function useContentElementCommentSelection() {
  const {contentElementId, contentElementPermaId} = useContentElementAttributes();

  return useCommentSelection({
    type: 'contentElementComments',
    id: contentElementId,
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId
  });
}
