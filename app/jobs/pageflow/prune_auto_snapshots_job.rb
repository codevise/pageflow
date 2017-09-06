module Pageflow
  class PruneAutoSnapshotsJob
    @queue = :prune

    def self.perform(entry_id, options)
      AutoSnapshotPruning.prune(Entry.find(entry_id), options.symbolize_keys)
    end
  end
end
