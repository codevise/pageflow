import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage,
  postReviewStateDraftsChangeMessage
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

    window.addEventListener('message', handleMessage);
    session.on('reset', handleReset);
    session.on('change:thread', handleThreadChange);
    session.on('change:drafts', handleDraftsChange);

    return {
      dispose() {
        window.removeEventListener('message', handleMessage);
        session.off('reset', handleReset);
        session.off('change:thread', handleThreadChange);
        session.off('change:drafts', handleDraftsChange);
      }
    };
  }
};
