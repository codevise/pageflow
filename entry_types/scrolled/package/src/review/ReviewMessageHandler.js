import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage,
  postReviewStateDraftsChangeMessage,
  postReviewStateReadsChangeMessage
} from './postMessage';

export const ReviewMessageHandler = {
  create({session, targetWindow}) {
    function handleMessage(event) {
      if (window.location.href.indexOf(event.origin) !== 0) return;
      if (event.source !== targetWindow) return;

      const {type, payload} = event.data;

      if (type === 'CREATE_COMMENT_THREAD') {
        session.createThread(payload);
      }
      else if (type === 'CREATE_COMMENT') {
        session.createComment(payload);
      }
      else if (type === 'UPDATE_THREAD') {
        session.updateThread(payload);
      }
      else if (type === 'UPDATE_COMMENT') {
        session.updateComment(payload);
      }
      else if (type === 'SET_COMMENT_DRAFT') {
        session.setDraft(payload);
      }
      else if (type === 'MARK_THREADS_READ') {
        session.markThreadsRead(payload.permaIds);
      }
    }

    function handleReset(state) {
      postReviewStateResetMessage(targetWindow, state);
    }

    function handleThreadChange(thread) {
      postReviewStateThreadChangeMessage(targetWindow, thread);
    }

    function handleDraftsChange(drafts) {
      postReviewStateDraftsChangeMessage(targetWindow, drafts);
    }

    function handleReadsChange(reads) {
      postReviewStateReadsChangeMessage(targetWindow, reads);
    }

    window.addEventListener('message', handleMessage);
    session.on('reset', handleReset);
    session.on('change:thread', handleThreadChange);
    session.on('change:drafts', handleDraftsChange);
    session.on('change:reads', handleReadsChange);

    return {
      dispose() {
        window.removeEventListener('message', handleMessage);
        session.off('reset', handleReset);
        session.off('change:thread', handleThreadChange);
        session.off('change:drafts', handleDraftsChange);
        session.off('change:reads', handleReadsChange);
      }
    };
  }
};
