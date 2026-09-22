require 'spec_helper'

module Pageflow
  describe CommentDigestWatermark do
    describe '.record!' do
      it 'creates the row when the entry has none' do
        entry = create(:entry)

        CommentDigestWatermark.record!(entry, Time.zone.parse('2026-03-10T12:00:00Z'))

        expect(CommentDigestWatermark.considered_up_to_by_entry_id)
          .to eq(entry.id => Time.zone.parse('2026-03-10T12:00:00Z'))
      end

      it 'moves the existing row forward instead of adding one' do
        entry = create(:entry)
        create(:comment_digest_watermark, entry:, considered_up_to: 2.days.ago)

        CommentDigestWatermark.record!(entry, Time.zone.parse('2026-03-10T12:00:00Z'))

        expect(CommentDigestWatermark.where(entry:).count).to eq(1)
        expect(CommentDigestWatermark.considered_up_to_by_entry_id[entry.id])
          .to eq(Time.zone.parse('2026-03-10T12:00:00Z'))
      end

      it 'leaves another entry alone' do
        entry = create(:entry)
        other = create(:comment_digest_watermark, considered_up_to: 2.days.ago)

        CommentDigestWatermark.record!(entry, Time.current)

        expect(other.reload.considered_up_to).to be_within(1.second).of(2.days.ago)
      end
    end

    describe '.considered_up_to_by_entry_id' do
      it 'is empty before any entry has been swept' do
        expect(CommentDigestWatermark.considered_up_to_by_entry_id).to be_empty
      end
    end

    it 'goes away with its entry' do
      entry = create(:entry)
      create(:comment_digest_watermark, entry:)

      entry.destroy

      expect(CommentDigestWatermark.count).to eq(0)
    end
  end
end
