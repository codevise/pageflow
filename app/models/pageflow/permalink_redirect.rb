module Pageflow
  # @api private
  class PermalinkRedirect < ApplicationRecord
    belongs_to :entry
    belongs_to :directory, class_name: 'PermalinkDirectory'
  end
end
