module Pageflow
  # @api private
  class CommentThread < ApplicationRecord
    include RevisionComponent

    belongs_to :creator, class_name: 'User'
    has_many :comments, dependent: :destroy

    nested_revision_components :comments

    validates :subject_type, :subject_id, presence: true
  end
end
