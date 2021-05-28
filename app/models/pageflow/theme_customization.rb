module Pageflow
  # @api private
  class ThemeCustomization < ApplicationRecord
    belongs_to :account

    serialize :overrides, JSON
  end
end
