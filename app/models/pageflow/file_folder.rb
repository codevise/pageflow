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
    validate :parent_is_not_nested_inside_folder

    def parent
      return if parent_folder_perma_id.blank?

      folders_of_revision.find_by(perma_id: parent_folder_perma_id)
    end

    # Broken data with a folder nested inside one of its own descendants
    # would make walking up the tree loop forever.
    def ancestors
      result = []
      current = parent

      while current && result.exclude?(current)
        result.unshift(current)
        current = current.parent
      end

      result
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

    # Nesting a folder inside itself or inside one of its own subfolders
    # would detach the whole subtree from the folder tree.
    def parent_is_not_nested_inside_folder
      return if parent_folder_perma_id.blank? || revision.blank?

      parent_folder = parent

      return if parent_folder.blank?
      return if [parent_folder, *parent_folder.ancestors].exclude?(self)

      errors.add(:parent_folder_perma_id, 'nested inside folder')
    end

    def folders_of_revision
      FileFolder.all_for_revision(revision)
    end
  end
end
