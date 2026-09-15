require 'spec_helper'

module Pageflow
  describe SendCommentDigestsJob do
    it 'enqueues a mail job for each user and entry the sweep yields' do
      user, entry = user_with_notifying_activity

      expect {
        SendCommentDigestsJob.perform_now
      }.to have_enqueued_job(SendCommentDigestJob)
        .with(user, entry, since: 24.hours.ago, until_at: Time.current)
    end

    it 'enqueues nothing when the sweep yields nothing' do
      create(:entry)

      expect {
        SendCommentDigestsJob.perform_now
      }.not_to have_enqueued_job(SendCommentDigestJob)
    end

    it 'sweeps as far back as the configured lookback' do
      pageflow_configure do |config|
        config.comment_digest_max_lookback = 30.minutes
      end
      user_with_notifying_activity

      expect {
        SendCommentDigestsJob.perform_now
      }.not_to have_enqueued_job(SendCommentDigestJob)
    end

    def user_with_notifying_activity
      user = create(:user, unread_comments_since_at: 2.days.ago)
      entry = create(:entry, with_previewer: user)
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user),
                       created_at: 1.hour.ago)
      [user, entry]
    end
  end
end
