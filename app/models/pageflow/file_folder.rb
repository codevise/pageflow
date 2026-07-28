module Pageflow
  # Groups the file usages of a revision. Folders refer to their parent
  # folder by perma id since row ids would not survive copying a
  # revision.
  #
  # @api private
  class FileFolder < ApplicationRecord
    include RevisionComponent

    validates :name, presence: true
    validate :parent_belongs_to_revision

    def parent
      return if parent_folder_perma_id.blank?

      folders_of_revision.find_by(perma_id: parent_folder_perma_id)
    end

    def children
      folders_of_revision.where(parent_folder_perma_id: perma_id)
    end

    def file_usages
      revision.file_usages.where(folder_perma_id: perma_id)
    end

    def empty?
      children.none? && file_usages.none?
    end

    private

    # A folder from another revision would leave this folder unreachable
    # in any folder tree.
    def parent_belongs_to_revision
      return if parent_folder_perma_id.blank? || revision.blank?
      return if folders_of_revision.exists?(perma_id: parent_folder_perma_id)

      errors.add(:parent_folder_perma_id, 'unknown folder')
    end

    def folders_of_revision
      FileFolder.all_for_revision(revision)
    end
  end
end
