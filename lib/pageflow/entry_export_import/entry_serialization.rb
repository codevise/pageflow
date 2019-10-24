module Pageflow
  module EntryExportImport
    module EntrySerialization
      extend self

      DEFAULT_REMOVAL_COLUMNS = %w[id updated_at].freeze

      # Turn entry into JSON compatible data structure.
      def dump(entry, publication = nil)
        {
          'page_type_versions' => PageTypeVersions.dump,
          # features_configuration is specifically excluded via `Entry#blacklist_for_serialization`
          # to prevent it from showing up in Active Admin JSON exports.
          # It is included separately as part of the entry export.
          'entry' => entry
            .as_json(except: [:folder_id, :password_digest, :users_count])
            .merge('features_configuration' => entry.features_configuration,
                   'draft' => RevisionSerialization.dump(entry.draft),
                   'last_publication' => dump_publication(publication))
        }
      end

      # Create entry from serialized JSON export
      def import(data, options)
        PageTypeVersions.verify_compatibility!(data['page_type_versions'])

        entry_data = data['entry']
        entry = create_entry(entry_data.except('draft', 'last_publication'), options)

        file_mappings = options.fetch(:file_mappings, FileMappings.new)

        import_draft(entry_data, options, entry, file_mappings)
        import_last_publication(entry_data, options, entry, file_mappings)

        entry
      end

      private

      def dump_publication(publication)
        publication && RevisionSerialization.dump(publication)
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
