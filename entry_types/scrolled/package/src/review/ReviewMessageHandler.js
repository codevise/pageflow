import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage
} from './postMessage';

export const ReviewMessageHandler = {
  create({session, targetWindow}) {
    function handleReset(state) {
      postReviewStateResetMessage(targetWindow, state);
    }

    function handleThreadChange(thread) {
      postReviewStateThreadChangeMessage(targetWindow, thread);
    }

    session.on('reset', handleReset);
    session.on('change:thread', handleThreadChange);

    return {
      dispose() {
        session.off('reset', handleReset);
        session.off('change:thread', handleThreadChange);
      }
    };
  }
};
