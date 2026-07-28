module Pageflow
  class FileUsage < ApplicationRecord # rubocop:todo Style/Documentation
    include SerializedConfiguration
    include RevisionComponent

    alias_attribute :perma_id, :file_perma_id

    belongs_to :file, polymorphic: true

    validate :display_name_extension_matches
    validate :folder_belongs_to_revision

    private

    def display_name_extension_matches
      return if display_name.blank? || file.blank?
      return if File.extname(display_name) == File.extname(file.file_name.to_s)

      errors.add(:display_name, 'extension mismatch')
    end

    def folder_belongs_to_revision
      return if folder_perma_id.blank? || revision.blank?
      return if FileFolder.all_for_revision(revision).exists?(perma_id: folder_perma_id)

      errors.add(:folder_perma_id, 'unknown folder')
    end
  end
end
