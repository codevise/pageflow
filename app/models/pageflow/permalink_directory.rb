module Pageflow
  # @api private
  class PermalinkDirectory < ApplicationRecord
    belongs_to :theming

    validates(:path,
              format: %r{\A([0-9a-zA-Z-]+/)*\z},
              uniqueness: {scope: :theming_id})
  end
end
