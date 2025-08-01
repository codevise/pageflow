module Pageflow
  class FileUsage < ApplicationRecord # rubocop:todo Style/Documentation
    include SerializedConfiguration
    include RevisionComponent

    alias_attribute :perma_id, :file_perma_id

    belongs_to :file, polymorphic: true

    validate :display_name_extension_matches

    private

    def display_name_extension_matches
      return if display_name.blank? || file.blank?
      return if File.extname(display_name) == File.extname(file.file_name.to_s)

      errors.add(:display_name, 'extension mismatch')
    end
  end
end
