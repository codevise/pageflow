require 'spec_helper'

module Pageflow
  describe AutoSnapshotPruning do
    describe '.dirty_entry_ids' do
      it 'includes entries with more than keep_count auto snapshots created before given time' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          5.times { entry.snapshot(creator: user) }
        end

        result = AutoSnapshotPruning.dirty_entry_ids(keep_count: 4, created_before: 1.month.ago)

        expect(result).to include(entry.id)
      end

      it 'does not includes entries with less than keep_count auto snapshots' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          2.times { entry.snapshot(creator: user) }
        end

        result = AutoSnapshotPruning.dirty_entry_ids(keep_count: 4, created_before: 1.month.ago)

        expect(result).not_to include(entry.id)
      end

      it 'does not includes entries with auto snapshots created after given date' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(1.day.ago) do
          3.times { entry.snapshot(creator: user) }
        end

        result = AutoSnapshotPruning.dirty_entry_ids(keep_count: 2, created_before: 1.month.ago)

        expect(result).not_to include(entry.id)
      end

      it 'does not includes entries with more than keep_count user snapshots' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          3.times { entry.snapshot(creator: user, type: 'user') }
        end

        result = AutoSnapshotPruning.dirty_entry_ids(keep_count: 2, created_before: 1.month.ago)

        expect(result).not_to include(entry.id)
      end

      it 'does not includes entries with more than keep_count publications' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          3.times { entry.publish(creator: user) }
        end

        result = AutoSnapshotPruning.dirty_entry_ids(keep_count: 2, created_before: 1.month.ago)

        expect(result).not_to include(entry.id)
      end
    end

    describe '.prune' do
      it 'destroy all but keep_count auto snapshots' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          3.times { entry.snapshot(creator: user) }
        end

        AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)

        expect(entry.revisions.auto_snapshots.count).to eq(2)
      end

      it 'triggers dependent destroys down to pages' do
        user = create(:user)
        entry = create(:entry)
        chapter = create(:chapter, storyline: entry.draft.storylines.first)
        create(:page, chapter:)

        Timecop.freeze(2.month.ago) do
          3.times { entry.snapshot(creator: user) }
        end

        expect {
          AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)
        }.to(change { Pageflow::Page.count })
      end

      it 'destroys oldest auto snapshots first' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(4.month.ago) { entry.snapshot(creator: user) }
        Timecop.freeze(3.month.ago) { entry.snapshot(creator: user) }
        Timecop.freeze(2.month.ago) { entry.snapshot(creator: user) }

        AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)
        timestamps = entry.revisions.auto_snapshots.map(&:created_at)

        expect(timestamps).to match_array([2.month.ago, 3.month.ago])
      end

      it 'ignores auto snapshots created after given data' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(4.month.ago) { entry.snapshot(creator: user) }
        Timecop.freeze(3.days.ago) { entry.snapshot(creator: user) }
        Timecop.freeze(2.days.ago) { entry.snapshot(creator: user) }

        AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)

        expect(entry.revisions.auto_snapshots.count).to eq(3)
      end

      it 'ignores user snapshots' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          3.times { entry.snapshot(creator: user, type: 'user') }
        end

        AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)

        expect(entry.revisions.user_snapshots.count).to eq(3)
      end

      it 'ignores publications' do
        user = create(:user)
        entry = create(:entry)

        Timecop.freeze(2.month.ago) do
          3.times { entry.publish(creator: user) }
        end

        AutoSnapshotPruning.prune(entry, keep_count: 2, created_before: 1.month.ago)

        expect(entry.revisions.publications.count).to eq(3)
      end
    end
  end
end
