require 'spec_helper'

module Pageflow
  describe CommentThreadNotificationOverride do
    it 'accepts all activity and muted' do
      expect(build(:comment_thread_notification_override, level: 'all_activity')).to be_valid
      expect(build(:comment_thread_notification_override, level: 'muted')).to be_valid
    end

    it 'rejects a level conditioned on thread participation' do
      override = build(:comment_thread_notification_override, level: 'participating_threads')

      expect(override).not_to be_valid
    end

    it 'rejects a level conditioned on entry participation' do
      override = build(:comment_thread_notification_override, level: 'participating_entries')

      expect(override).not_to be_valid
    end

    it 'requires a level' do
      expect(build(:comment_thread_notification_override, level: nil)).not_to be_valid
    end
  end
end
