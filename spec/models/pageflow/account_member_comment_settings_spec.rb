require 'spec_helper'

module Pageflow
  describe AccountMemberCommentSettings do
    it 'accepts every level per bucket' do
      CommentNotificationLevel::STORABLE_PER_ACCOUNT.each do |level|
        expect(build(:account_member_comment_settings,
                     assigned_entries_notification_level: level,
                     other_entries_notification_level: level)).to be_valid
      end
    end

    it 'rejects an unknown level' do
      settings = build(:account_member_comment_settings,
                       other_entries_notification_level: 'shouting')

      expect(settings).not_to be_valid
    end

    it 'leaves a bucket blank to fall through to the account' do
      settings = build(:account_member_comment_settings,
                       assigned_entries_notification_level: 'muted',
                       other_entries_notification_level: nil)

      expect(settings).to be_valid
    end
  end
end
