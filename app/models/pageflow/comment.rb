module Pageflow
  # @api private
  class Comment < ApplicationRecord
    include NestedRevisionComponent

    belongs_to :comment_thread
    belongs_to :creator, class_name: 'User'

    validates :body, presence: true

    def entry_for_auto_generated_perma_id
      comment_thread.revision.entry
    end
  end
end
