module Pageflow
  # Override theme options and upload theme files for an entry type on
  # a per account basis.
  #
  # @since edge
  class ThemeCustomization < ApplicationRecord
    belongs_to :account

    serialize :overrides, JSON
    serialize :selected_file_ids, JSON

    has_many :uploaded_files, class_name: 'ThemeCustomizationFile'

    # Options that were passed to [ThemeCustomizations#update].
    #
    # @return [Hash<Symbol, Object>]
    def overrides
      super&.deep_symbolize_keys || {}
    end

    # Theme customization files that have been assigned a role via
    # [ThemeCustomizations#update].
    #
    # @return [Hash<Symbol, ThemeCustomizationFile>]
    def selected_files
      selected_file_ids.compact.transform_values do |id|
        selected_files_by_id[id]
      end
    end

    # @api private
    def entry_type
      Pageflow.config.entry_types.find_by_name!(entry_type_name)
    end

    private

    def selected_file_ids
      super&.deep_symbolize_keys || {}
    end

    def selected_files_by_id
      @selected_files_by_id ||= uploaded_files.where(id: selected_file_ids.values).index_by(&:id)
    end
  end
end
