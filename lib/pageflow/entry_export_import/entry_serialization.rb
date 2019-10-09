module Pageflow
  module EntryExportImport
    # Turn entry into JSON compatible data structure.
    module EntrySerialization
      extend self

      DEFAULT_REMOVAL_COLUMNS = %w[id updated_at].freeze

      def dump(entry)
        {
          'page_type_versions' => PageTypeVersions.dump,
          # features_configuration is excluded via
          # `Entry#blacklist_for_serialization` to prevent it from
          # showing up in Active Admin JSON exports, but should be
          # part of export
          'entry' => entry
            .as_json(except: [:folder_id, :password_digest, :users_count])
            .merge('features_configuration' => entry.features_configuration,
                   'draft' => RevisionSerialization.dump(entry.draft),
                   'last_publication' => dump_most_recent_publication(entry))
        }
      end

      def import(data, options)
        PageTypeVersions.verify_compatibility!(data['page_type_versions'])

        entry_data = data['entry']
        entry = create_entry(entry_data.except('draft', 'last_publication'), options)

        file_mappings = {}

        import_draft(entry_data, options, entry, file_mappings)
        import_last_publication(entry_data, options, entry, file_mappings)

        entry
      end

      private

      def dump_most_recent_publication(entry)
        most_recent_publication = entry.revisions.publications.first
        most_recent_publication && RevisionSerialization.dump(most_recent_publication)
      end

      def create_entry(data, options)
        entry_data = data.except(*DEFAULT_REMOVAL_COLUMNS)
        entry_data['account_id'] = options[:account].id
        entry_data['theming_id'] = options[:account].default_theming.id
        Entry.create!(entry_data.merge(skip_draft_creation: true))
      end

      def import_draft(entry_data, options, entry, file_mappings)
        RevisionSerialization.import(entry_data['draft'],
                                     entry: entry,
                                     creator: options[:creator],
                                     file_mappings: file_mappings)
      end

      def import_last_publication(entry_data, options, entry, file_mappings)
        return unless entry_data['last_publication']

        RevisionSerialization.import(entry_data['last_publication'],
                                     entry: entry,
                                     creator: options[:creator],
                                     file_mappings: file_mappings)
      end
    end
  end
end
