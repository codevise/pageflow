module Pageflow
  # @api private
  module Permalinkable
    extend ActiveSupport::Concern

    included do
      belongs_to :permalink, optional: true
      has_many :permalink_redirects

      accepts_nested_attributes_for :permalink, update_only: true
    end
  end
end
