import fixture from '../../../../../spec/fixtures/comment_notification_rules.json';

import {isUnread} from 'review/unreadActivity';
import {notifies} from 'review/notifications';

describe('comment notification rules', () => {
  fixture.cases.forEach(testCase => {
    const params = {...fixture.defaults, ...testCase};

    it(params.name, () => {
      const unread = isUnread(
        {creatorId: params.creatorId, createdAt: params.createdAt},
        {
          currentUser: {
            id: params.currentUserId,
            unreadCommentsSinceAt: params.unreadCommentsSinceAt
          },
          readAt: params.readAt
        }
      );

      expect(unread).toEqual(params.unread);
      expect(notifies(params.level, params.participated)).toEqual(params.notifies);
    });
  });
});
