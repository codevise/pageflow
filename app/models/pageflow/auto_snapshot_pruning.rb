module Pageflow
  # @api private
  module AutoSnapshotPruning
    extend self

    def dirty_entry_ids(options)
      Revision
        .auto_snapshots
        .where('created_at < ?', options.fetch(:created_before))
        .select('COUNT(*) as revisions_count, entry_id')
        .group('entry_id')
        .having('revisions_count > ?', options.fetch(:keep_count))
        .map(&:entry_id)
    end

    def prune(entry, options)
      entry
        .revisions
        .auto_snapshots
        .where('created_at < ?', options[:created_before])
        .order('created_at DESC')
        .offset(options[:keep_count])
        .each(&:destroy)
    end
  end
end
