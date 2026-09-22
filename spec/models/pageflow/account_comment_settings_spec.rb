require 'spec_helper'

module Pageflow
  describe AccountCommentSettings do
    it 'accepts every level per bucket' do
      CommentNotificationLevel::STORABLE_PER_ACCOUNT.each do |level|
        expect(build(:account_comment_settings,
                     assigned_entries_notification_level: level,
                     other_entries_notification_level: level)).to be_valid
      end
    end

    it 'rejects an unknown level' do
      settings = build(:account_comment_settings, assigned_entries_notification_level: 'shouting')

      expect(settings).not_to be_valid
    end

    it 'leaves a bucket blank to fall through to the system default' do
      settings = build(:account_comment_settings,
                       assigned_entries_notification_level: nil,
                       other_entries_notification_level: 'muted')

      expect(settings).to be_valid
    end

    it 'accepts every digest interval' do
      CommentDigestInterval::STORABLE.each do |interval|
        expect(build(:account_comment_settings, digest_interval: interval)).to be_valid
      end
    end

    it 'rejects an unknown digest interval' do
      settings = build(:account_comment_settings, digest_interval: 'hourly')

      expect(settings).not_to be_valid
    end

    it 'leaves the digest interval blank to fall through to the system default' do
      settings = build(:account_comment_settings, digest_interval: nil)

      expect(settings).to be_valid
    end
  end
end
