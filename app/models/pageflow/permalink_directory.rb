module Pageflow
  # @api private
  class PermalinkDirectory < ApplicationRecord
    belongs_to :site

    validates(:path,
              format: %r{\A([0-9a-zA-Z-]+/)*\z},
              uniqueness: {scope: :site_id})

    has_many(:redirects,
             class_name: 'PermalinkRedirect',
             foreign_key: :directory_id)
  end
end
