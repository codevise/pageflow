module Pageflow
  # @api private
  class Permalink < ApplicationRecord
    has_one :entry

    belongs_to :directory, class_name: 'PermalinkDirectory'

    validates(:slug,
              format: /\A[0-9a-zA-Z_-]+\z/,
              uniqueness: {scope: :directory})

    validate :belongs_to_same_theming_as_entry

    private

    def belongs_to_same_theming_as_entry
      return if !directory || !entry || entry.theming_id == directory.theming_id

      errors.add(:directory, :invalid)
    end
  end
end
