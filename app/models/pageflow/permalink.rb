module Pageflow
  # @api private
  class Permalink < ApplicationRecord
    belongs_to :directory, class_name: 'PermalinkDirectory'
  end
end
