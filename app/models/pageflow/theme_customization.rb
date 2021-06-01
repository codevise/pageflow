module Pageflow
  # @api private
  class ThemeCustomization < ApplicationRecord
    belongs_to :account

    serialize :overrides, JSON
    serialize :selected_file_ids, JSON

    has_many :uploaded_files, class_name: 'ThemeCustomizationFile'

    def selected_file_ids
      super || {}
    end

    def selected_file_urls
      selected_files.map { |role, file| [role.to_sym, file.urls] }.to_h
    end

    def entry_type
      Pageflow.config.entry_types.find_by_name!(entry_type_name)
    end

    private

    def selected_files
      selected_file_ids.transform_values do |id|
        selected_files_by_id[id]
      end
    end

    def selected_files_by_id
      @selected_files_by_id ||= uploaded_files.where(id: selected_file_ids.values).index_by(&:id)
    end
  end
end
