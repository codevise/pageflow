require 'spec_helper'

module Pageflow
  describe EntryCommentNotificationOverride do
    it 'accepts all activity, thread participation and muted' do
      CommentNotificationLevel::STORABLE_PER_ENTRY.each do |level|
        expect(build(:entry_comment_notification_override, level:)).to be_valid
      end
    end

    it 'rejects a level conditioned on entry participation' do
      override = build(:entry_comment_notification_override, level: 'participating_entries')

      expect(override).not_to be_valid
    end

    it 'requires a level' do
      expect(build(:entry_comment_notification_override, level: nil)).not_to be_valid
    end
  end
end
