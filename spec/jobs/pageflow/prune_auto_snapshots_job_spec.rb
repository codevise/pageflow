require 'spec_helper'

module Pageflow
  describe PruneAutoSnapshotsJob do
    it 'destroys old auto snapshots' do
      user = create(:user)
      entry = create(:entry)

      Timecop.freeze(2.month.ago) do
        3.times { entry.snapshot(creator: user) }
      end

      PruneAutoSnapshotsJob.perform_now(entry.id, keep_count: 2, created_before: 1.month.ago)

      expect(entry.reload.revisions.auto_snapshots.count).to eq(2)
    end
  end
end
