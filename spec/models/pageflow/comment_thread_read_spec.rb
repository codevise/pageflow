require 'spec_helper'

module Pageflow
  describe CommentThreadRead do
    describe '.mark' do
      it 'creates records for the given comment thread perma ids' do
        entry = create(:entry)
        user = create(:user)

        CommentThreadRead.mark(entry:, user:, comment_thread_perma_ids: [5, 6])

        expect(CommentThreadRead.where(entry:, user:).pluck(:comment_thread_perma_id))
          .to contain_exactly(5, 6)
      end

      it 'records the given read at timestamp' do
        entry = create(:entry)
        user = create(:user)
        read_at = 2.hours.ago

        CommentThreadRead.mark(entry:, user:, comment_thread_perma_ids: [5], read_at:)

        expect(CommentThreadRead.last.read_at).to eq(read_at)
      end

      it 'moves read at timestamp of existing record forward' do
        read = create(:comment_thread_read,
                      comment_thread_perma_id: 5,
                      read_at: 2.hours.ago)

        Timecop.freeze(1.hour.from_now) do
          CommentThreadRead.mark(entry: read.entry,
                                 user: read.user,
                                 comment_thread_perma_ids: [5])

          expect(read.reload.read_at).to eq(Time.current)
        end

        expect(CommentThreadRead.count).to eq(1)
      end

      it 'keeps records of other users separate' do
        entry = create(:entry)
        other_read = create(:comment_thread_read,
                            entry:,
                            comment_thread_perma_id: 5,
                            read_at: 2.hours.ago)

        CommentThreadRead.mark(entry:,
                               user: create(:user),
                               comment_thread_perma_ids: [5])

        expect(other_read.reload.read_at).to eq(2.hours.ago)
        expect(CommentThreadRead.count).to eq(2)
      end

      it 'keeps records of other entries separate' do
        user = create(:user)
        other_read = create(:comment_thread_read,
                            user:,
                            comment_thread_perma_id: 5,
                            read_at: 2.hours.ago)

        CommentThreadRead.mark(entry: create(:entry),
                               user:,
                               comment_thread_perma_ids: [5])

        expect(other_read.reload.read_at).to eq(2.hours.ago)
        expect(CommentThreadRead.count).to eq(2)
      end

      it 'does nothing for blank list of perma ids' do
        entry = create(:entry)
        user = create(:user)

        CommentThreadRead.mark(entry:, user:, comment_thread_perma_ids: [])

        expect(CommentThreadRead.count).to eq(0)
      end
    end

    describe '.read_at_by_perma_id' do
      it 'returns read timestamps of user in entry keyed by thread perma id' do
        read = create(:comment_thread_read, comment_thread_perma_id: 5)

        result = CommentThreadRead.read_at_by_perma_id(entry: read.entry, user: read.user)

        expect(result.keys).to eq([5])
        expect(result[5]).to eq(read.read_at)
      end

      it 'ignores records of other users and entries' do
        read = create(:comment_thread_read, comment_thread_perma_id: 5)
        create(:comment_thread_read, entry: read.entry, comment_thread_perma_id: 6)
        create(:comment_thread_read, user: read.user, comment_thread_perma_id: 7)

        result = CommentThreadRead.read_at_by_perma_id(entry: read.entry, user: read.user)

        expect(result.keys).to eq([5])
      end
    end

    it 'is destroyed together with entry' do
      read = create(:comment_thread_read)

      read.entry.destroy

      expect(CommentThreadRead.count).to eq(0)
    end

    it 'is destroyed together with user' do
      read = create(:comment_thread_read)

      read.user.destroy

      expect(CommentThreadRead.count).to eq(0)
    end
  end
end
