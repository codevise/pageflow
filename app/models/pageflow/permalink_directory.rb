module Pageflow
  # @api private
  class PermalinkDirectory < ApplicationRecord
    belongs_to :site

    validates(:path,
              format: %r{\A([0-9a-zA-Z-]+/)*\z},
              uniqueness: {scope: :site_id})
  end
end
