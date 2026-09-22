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

    it 'requires a level' do
      expect(build(:comment_thread_notification_override, level: nil)).not_to be_valid
    end

    describe '.set' do
      it 'stores the level for the thread' do
        entry = create(:entry)
        user = create(:user)

        described_class.set(entry:, user:, comment_thread_perma_id: 5, level: 'muted')

        expect(described_class.find_by(entry:, user:).level).to eq('muted')
      end

      it 'moves an existing override to the new level' do
        override = create(:comment_thread_notification_override, level: 'muted')
        perma_id = override.comment_thread_perma_id

        described_class.set(entry: override.entry,
                            user: override.user,
                            comment_thread_perma_id: perma_id,
                            level: 'all_activity')

        expect(override.reload.level).to eq('all_activity')
        expect(described_class.count).to eq(1)
      end

      it 'removes the override for a blank level' do
        override = create(:comment_thread_notification_override, level: 'muted')
        perma_id = override.comment_thread_perma_id

        described_class.set(entry: override.entry,
                            user: override.user,
                            comment_thread_perma_id: perma_id,
                            level: '')

        expect(described_class.count).to eq(0)
      end

      it 'refuses a level the thread rung cannot store' do
        entry = create(:entry)
        user = create(:user)

        result = described_class.set(entry:, user:,
                                     comment_thread_perma_id: 5,
                                     level: 'participating_threads')

        expect(result).to eq(false)
        expect(described_class.count).to eq(0)
      end
    end
  end
end
