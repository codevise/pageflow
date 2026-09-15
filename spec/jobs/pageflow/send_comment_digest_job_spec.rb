require 'spec_helper'

module Pageflow
  describe SendCommentDigestJob do
    it 'mails the activity that notifies the user within the window' do
      user = create(:user, unread_comments_since_at: 2.days.ago)
      entry = create(:entry, with_previewer: user)
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user),
                       created_at: 1.hour.ago)

      SendCommentDigestJob.perform_now(user, entry, since: 1.day.ago, until_at: Time.current)

      expect(ActionMailer::Base.deliveries.flat_map(&:to)).to eq([user.email])
    end

    it 'mails nothing about activity in another entry' do
      user = create(:user, unread_comments_since_at: 2.days.ago)
      entry = create(:entry, with_previewer: user)
      other_entry = create(:entry, with_previewer: user)
      thread = create(:comment_thread, revision: other_entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user),
                       created_at: 1.hour.ago)

      SendCommentDigestJob.perform_now(user, entry, since: 1.day.ago, until_at: Time.current)

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it 'mails nothing when the window holds nothing for the user' do
      user = create(:user, unread_comments_since_at: 2.days.ago)
      entry = create(:entry, with_previewer: user)
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user),
                       created_at: 3.hours.ago)

      SendCommentDigestJob.perform_now(user, entry, since: 2.hours.ago, until_at: Time.current)

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it 'mails nothing about activity the user has read since the sweep' do
      user = create(:user, unread_comments_since_at: 2.days.ago)
      entry = create(:entry, with_previewer: user)
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user),
                       created_at: 1.hour.ago)
      CommentThreadRead.mark(entry:, user:, comment_thread_perma_ids: [thread.perma_id])

      SendCommentDigestJob.perform_now(user, entry, since: 1.day.ago, until_at: Time.current)

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it 'retries a delivery that failed for now' do
      user, entry = user_with_notifying_activity
      allow(UserMailer).to receive(:comment_digest).and_raise(Net::SMTPServerBusy, 'busy')

      expect {
        SendCommentDigestJob.perform_now(user, entry, since: 1.day.ago, until_at: Time.current)
      }.to have_enqueued_job(SendCommentDigestJob)
    end

    it 'gives up on a delivery the server rejected outright' do
      user, entry = user_with_notifying_activity
      allow(UserMailer).to receive(:comment_digest).and_raise(Net::SMTPFatalError, 'no such user')

      expect {
        SendCommentDigestJob.perform_now(user, entry, since: 1.day.ago, until_at: Time.current)
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
