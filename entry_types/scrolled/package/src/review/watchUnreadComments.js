import {unreadActivity} from './unreadActivity';

export function watchUnreadComments({entry, session}) {
  function update() {
    entry.set('hasUnreadComments', hasUnreadComments(session.state));
  }

  session.on('reset', update);
  session.on('change:thread', update);
  session.on('change:reads', update);

  update();
}

function hasUnreadComments(state) {
  if (!state) {
    return false;
  }

  const {currentUser, commentThreads, commentThreadReads = {}} = state;

  return commentThreads.some(
    thread => unreadActivity(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }).length > 0
  );
}
