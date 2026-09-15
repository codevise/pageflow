require 'spec_helper'

module Pageflow
  fixture = JSON.parse(
    File.read(File.expand_path('../../fixtures/comment_notification_rules.json', __dir__))
  )

  describe 'comment notification rules' do
    fixture['cases'].each do |test_case|
      params = fixture['defaults'].merge(test_case)

      it(params['name']) do
        event = CommentThreadActivity::Event.new(kind: :reply,
                                                 creator_id: params['creatorId'],
                                                 created_at: time(params['createdAt']))
        user = instance_double(User,
                               id: params['currentUserId'],
                               unread_comments_since_at: time(params['unreadCommentsSinceAt']))

        expect(CommentThreadActivity.unread?(event, read_at: time(params['readAt']), user:))
          .to eq(params['unread'])
        expect(CommentNotificationLevel.notifies?(params['level'], params['participated']))
          .to eq(params['notifies'])
      end
    end

    def time(value)
      Time.zone.parse(value) if value
    end
  end
end
