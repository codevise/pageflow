module Pageflow
  class PruneAutoSnapshotsJob < ApplicationJob
    queue_as :prune

    def perform(entry_id, options)
      AutoSnapshotPruning.prune(Entry.find(entry_id), options.symbolize_keys)
    end
  end
end
