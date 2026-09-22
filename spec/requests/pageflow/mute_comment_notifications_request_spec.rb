require 'spec_helper'

module Pageflow
  describe '/comment_notifications/mute', type: :request do
    it 'mutes the entry for the user the token names' do
      user = create(:user)
      entry = create(:entry)

      get(mute_comment_notifications_url(token: EntryCommentMuteToken.generate(user:, entry:)))

      expect(EntryCommentNotificationOverride.find_by(entry:, user:).level).to eq('muted')
    end

    it 'sends the user to the entry with a notice' do
      user = create(:user)
      entry = create(:entry)

      get(mute_comment_notifications_url(token: EntryCommentMuteToken.generate(user:, entry:)))

      expect(response).to redirect_to(admin_entry_path(entry))
      expect(flash[:notice]).to eq('Comment notifications for this story are now muted.')
    end

    it 'replaces a level the user had chosen for the entry before' do
      user = create(:user)
      entry = create(:entry)
      create(:entry_comment_notification_override, entry:, user:, level: 'all_activity')

      get(mute_comment_notifications_url(token: EntryCommentMuteToken.generate(user:, entry:)))

      expect(EntryCommentNotificationOverride.find_by(entry:, user:).level).to eq('muted')
    end

    it 'keeps a thread the user watches for when they unmute again' do
      user = create(:user)
      entry = create(:entry)
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment_thread_notification_override,
             entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'all_activity')

      get(mute_comment_notifications_url(token: EntryCommentMuteToken.generate(user:, entry:)))

      expect(CommentThreadNotificationOverride.where(entry:, user:)).not_to be_empty
    end

    it 'mutes nothing for a token that was not signed here' do
      expect {
        get(mute_comment_notifications_url(token: 'made-up'))
      }.not_to(change { EntryCommentNotificationOverride.count })
    end

    it 'sends a user whose token no longer works to the admin root with an alert' do
      get(mute_comment_notifications_url(token: 'made-up'))

      expect(response).to redirect_to(admin_root_path)
      expect(flash[:alert]).to eq(
        'This mute link is no longer valid. Open the story to change its comment notifications.'
      )
    end
  end
end
