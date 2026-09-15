module Pageflow
  # A user's explicit notification level for one subject.
  #
  # @api private
  class CommentNotificationOverride < ApplicationRecord
    self.abstract_class = true

    belongs_to :entry
    belongs_to :user

    # A blank level removes the override rather than storing one, so
    # that the subject goes back to following the rungs below it.
    def self.set(level:, **scope)
      override = find_or_initialize_by(**scope)

      return !!override.destroy if level.blank?

      override.update(level:)
    end
  end
end
