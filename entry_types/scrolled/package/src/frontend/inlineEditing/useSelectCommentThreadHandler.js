import {useCallback} from 'react';

import {useCommentThreads} from 'pageflow-scrolled/review';
import {usePostMessageListener} from '../../shared/usePostMessageListener';

// Handles the SELECT_COMMENT_THREAD message the editor posts when a
// thread is clicked in the comments sidebar. Fetches the subject's
// threads itself - including resolved ones, so a resolved thread can be
// revealed when clicked - ignores threads of other subjects, scrolls
// the relevant element into view and calls `selectThread` to make the
// matching editor selection. `beforeSelect` runs right before that, for
// callers that need to prepare for it (e.g. move the editor cursor into
// the thread's block). Shared by the content element and section
// decorators and the EditableText editor so the handling lives in one
// place instead of inside each badge.
export function useSelectCommentThreadHandler({
  subjectType, subjectId, getScrollTarget, beforeSelect, selectThread
}) {
  const threads = useCommentThreads({subjectType, subjectId});

  usePostMessageListener(useCallback(data => {
    if (data.type !== 'SELECT_COMMENT_THREAD') return;

    const {threadId} = data.payload;

    if (!threads.some(thread => thread.id === threadId)) return;

    const scrollTarget = getScrollTarget && getScrollTarget(threadId);

    if (scrollTarget) {
      scrollTarget.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }

    if (beforeSelect) beforeSelect(threadId);

    selectThread(threadId);
  }, [threads, getScrollTarget, beforeSelect, selectThread]));
}
