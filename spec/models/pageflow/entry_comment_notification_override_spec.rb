require 'spec_helper'

module Pageflow
  describe EntryCommentNotificationOverride do
    it 'accepts all activity, thread participation and muted' do
      CommentNotificationLevel::STORABLE_PER_ENTRY.each do |level|
        expect(build(:entry_comment_notification_override, level:)).to be_valid
      end
    end

    it 'rejects a level it does not know' do
      override = build(:entry_comment_notification_override, level: 'everything')

      expect(override).not_to be_valid
    end

    it 'requires a level' do
      expect(build(:entry_comment_notification_override, level: nil)).not_to be_valid
    end

    describe '.set' do
      it 'stores the level for the entry' do
        entry = create(:entry)
        user = create(:user)

        described_class.set(entry:, user:, level: 'muted')

        expect(described_class.find_by(entry:, user:).level).to eq('muted')
      end

      it 'moves an existing override to the new level' do
        override = create(:entry_comment_notification_override, level: 'muted')

        described_class.set(entry: override.entry, user: override.user, level: 'all_activity')

        expect(override.reload.level).to eq('all_activity')
        expect(described_class.count).to eq(1)
      end

      it 'removes the override for a blank level' do
        override = create(:entry_comment_notification_override, level: 'muted')

        described_class.set(entry: override.entry, user: override.user, level: '')

        expect(described_class.count).to eq(0)
      end

      it 'refuses a level it does not know' do
        entry = create(:entry)
        user = create(:user)

        result = described_class.set(entry:, user:, level: 'everything')

        expect(result).to eq(false)
        expect(described_class.count).to eq(0)
      end
    end
  end
end
