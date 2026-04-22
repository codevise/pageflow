require 'spec_helper'

module Pageflow
  describe CommentThread do
    describe '.migrate_to_subject' do
      it 'updates subject_id of matching threads' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 10)

        CommentThread.migrate_to_subject(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 20,
          thread_ids: [thread.id]
        )

        expect(thread.reload.subject_id).to eq(20)
      end

      it 'does not touch threads of a different revision' do
        revision = create(:revision)
        other_revision = create(:revision)
        thread = create(:comment_thread,
                        revision: other_revision,
                        subject_type: 'ContentElement',
                        subject_id: 10)

        CommentThread.migrate_to_subject(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 20,
          thread_ids: [thread.id]
        )

        expect(thread.reload.subject_id).to eq(10)
      end

      it 'does not touch threads of a different subject_type' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'OtherType',
                        subject_id: 10)

        CommentThread.migrate_to_subject(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 20,
          thread_ids: [thread.id]
        )

        expect(thread.reload.subject_id).to eq(10)
      end

      it 'is a no-op when thread_ids is blank' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 10)

        expect {
          CommentThread.migrate_to_subject(
            revision:,
            subject_type: 'ContentElement',
            subject_id: 20,
            thread_ids: []
          )
        }.not_to(change { thread.reload.subject_id })
      end
    end

    describe '.update_subject_ranges_for' do
      let(:range) do
        {'anchor' => {'path' => [0, 0], 'offset' => 0},
         'focus' => {'path' => [0, 0], 'offset' => 5}}
      end
      let(:new_range) do
        {'anchor' => {'path' => [0, 0], 'offset' => 1},
         'focus' => {'path' => [0, 0], 'offset' => 6}}
      end

      it 'updates subject_range of matching threads' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 10,
                        subject_range: range)

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 10,
          ranges: {thread.id.to_s => new_range}
        )

        expect(thread.reload.subject_range).to eq(new_range)
      end

      it 'updates only threads whose id is in the ranges hash' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 10,
                        subject_range: range)
        other = create(:comment_thread,
                       revision:,
                       subject_type: 'ContentElement',
                       subject_id: 10,
                       subject_range: range)

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 10,
          ranges: {thread.id.to_s => new_range}
        )

        expect(other.reload.subject_range).to eq(range)
      end

      it 'does not touch threads of a different revision' do
        revision = create(:revision)
        other_revision = create(:revision)
        thread = create(:comment_thread,
                        revision: other_revision,
                        subject_type: 'ContentElement',
                        subject_id: 10,
                        subject_range: range)

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 10,
          ranges: {thread.id.to_s => new_range}
        )

        expect(thread.reload.subject_range).to eq(range)
      end

      it 'does not touch threads of a different subject_type/subject_id' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 99,
                        subject_range: range)

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 10,
          ranges: {thread.id.to_s => new_range}
        )

        expect(thread.reload.subject_range).to eq(range)
      end

      it 'is a no-op when ranges is blank' do
        revision = create(:revision)
        thread = create(:comment_thread,
                        revision:,
                        subject_type: 'ContentElement',
                        subject_id: 10,
                        subject_range: range)

        expect {
          CommentThread.update_subject_ranges_for(
            revision:,
            subject_type: 'ContentElement',
            subject_id: 10,
            ranges: {}
          )
        }.not_to(change { thread.reload.subject_range })
      end

      it 'accepts multiple thread ids in a single call' do
        revision = create(:revision)
        t1 = create(:comment_thread,
                    revision:,
                    subject_type: 'ContentElement',
                    subject_id: 10,
                    subject_range: range)
        t2 = create(:comment_thread,
                    revision:,
                    subject_type: 'ContentElement',
                    subject_id: 10,
                    subject_range: range)

        other_range = {'anchor' => {'path' => [1, 0], 'offset' => 0},
                       'focus' => {'path' => [1, 0], 'offset' => 3}}

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: 10,
          ranges: {t1.id.to_s => new_range, t2.id.to_s => other_range}
        )

        expect(t1.reload.subject_range).to eq(new_range)
        expect(t2.reload.subject_range).to eq(other_range)
      end

      it 'accepts an array of subject_ids' do
        revision = create(:revision)
        t1 = create(:comment_thread,
                    revision:,
                    subject_type: 'ContentElement',
                    subject_id: 10,
                    subject_range: range)
        t2 = create(:comment_thread,
                    revision:,
                    subject_type: 'ContentElement',
                    subject_id: 20,
                    subject_range: range)

        CommentThread.update_subject_ranges_for(
          revision:,
          subject_type: 'ContentElement',
          subject_id: [10, 20],
          ranges: {t1.id.to_s => new_range, t2.id.to_s => new_range}
        )

        expect(t1.reload.subject_range).to eq(new_range)
        expect(t2.reload.subject_range).to eq(new_range)
      end
    end
  end
end
