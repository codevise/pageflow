module Pageflow
  # A merged view of an entry and its draft revision
  class DraftEntry < EntryAtRevision
    class InvalidForeignKeyCustomAttributeError < StandardError; end

    def initialize(entry, draft = nil)
      super(entry, draft || entry.draft)
    end

    alias draft revision

    # So we can always get to the original Entry title.
    def entry_title
      entry.title
    end

    def translations(scope = -> { self }, **)
      return [] unless entry.translation_group

      PublishedEntry.wrap_all_drafts(
        entry.translation_group.entries.instance_exec(&scope)
      )
    end

    def cutoff_mode_enabled_for?(_request)
      false
    end

    def create_file!(file_type, attributes)
      check_foreign_key_custom_attributes(file_type.custom_attributes, attributes)

      file = file_type.model.create!(attributes.except(:configuration)) do |f|
        f.entry = entry
      end

      usage = revision.file_usages.create!(file:,
                                           configuration: attributes[:configuration])
      UsedFile.new(file, usage)
    end

    def remove_file(file) # rubocop:todo Metrics/AbcSize
      draft.file_usages.where(file:).destroy_all

      file.file_type.nested_file_types.each do |nested_file_type|
        nested_file_ids = file.nested_files(nested_file_type.model).map(&:id)

        draft
          .file_usages
          .where(file_type: nested_file_type.model.name,
                 file_id: nested_file_ids)
          .destroy_all
      end

      file.destroy if file.usages.reload.empty?
    end

    def use_file(file)
      draft.file_usages.create!(file: file.to_model,
                                configuration: file.configuration)
    end

    def save!
      draft.save!
    end

    def update_meta_data!(attributes)
      draft.update!(attributes)
    end

    def self.find(id)
      new(Entry.find(id))
    end

    def self.for_file_usage(usage)
      new(usage.revision.entry)
    end

    def self.accessible_by(ability, action)
      Entry.includes(:draft).accessible_by(ability, action).map do |entry|
        DraftEntry.new(entry)
      end
    end

    def stylesheet_model
      draft
    end

    def stylesheet_cache_key
      draft.cache_key
    end

    def published_revision?
      false
    end

    private

    def check_foreign_key_custom_attributes(custom_attributes, attributes)
      custom_attributes
        .each do |attribute_name, options|
          file_type = options[:model]
          file_id = attributes[attribute_name]

          next if !file_type || file_is_used(file_type, file_id)

          raise(InvalidForeignKeyCustomAttributeError,
                "Custom attribute #{attribute_name} references #{file_type} #{file_id} " \
                'which is not used in this revsion')
        end
    end

    def file_is_used(file_type, file_id)
      draft.file_usages.where(file_type:, file_id:).exists?
    end
  end
end
