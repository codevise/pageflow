module Pageflow
  # Groups the file usages of a revision. Folders refer to their parent
  # folder by perma id since row ids would not survive copying a
  # revision.
  #
  # @api private
  class FileFolder < ApplicationRecord
    include RevisionComponent

    validates :name, presence: true

    def parent
      return if parent_folder_perma_id.blank?

      folders_of_revision.find_by(perma_id: parent_folder_perma_id)
    end

    def children
      folders_of_revision.where(parent_folder_perma_id: perma_id)
    end

    private

    def folders_of_revision
      FileFolder.all_for_revision(revision)
    end
  end
end
