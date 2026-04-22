module Pageflow
  # @api private
  class CommentThread < ApplicationRecord
    include RevisionComponent

    serialize :subject_range, coder: JSON

    belongs_to :creator, class_name: 'User'
    belongs_to :resolver, class_name: 'User', foreign_key: :resolved_by_id, optional: true
    has_many :comments, dependent: :destroy

    nested_revision_components :comments

    validates :subject_type, :subject_id, presence: true

    def resolve(user)
      update!(resolved_at: Time.current, resolver: user) unless resolved_at
    end

    def unresolve
      update!(resolved_at: nil, resolver: nil)
    end
  end
end
