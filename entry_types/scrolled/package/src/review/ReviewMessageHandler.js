import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage
} from './postMessage';

export const ReviewMessageHandler = {
  create({session, targetWindow}) {
    function handleMessage(event) {
      if (window.location.href.indexOf(event.origin) !== 0) return;

      const {type, payload} = event.data;

      if (type === 'CREATE_COMMENT_THREAD') {
        session.createThread(payload);
      }
    }

    function handleReset(state) {
      postReviewStateResetMessage(targetWindow, state);
    }

    function handleThreadChange(thread) {
      postReviewStateThreadChangeMessage(targetWindow, thread);
    }

    window.addEventListener('message', handleMessage);
    session.on('reset', handleReset);
    session.on('change:thread', handleThreadChange);

    return {
      dispose() {
        window.removeEventListener('message', handleMessage);
        session.off('reset', handleReset);
        session.off('change:thread', handleThreadChange);
      }
    };
  }
};
