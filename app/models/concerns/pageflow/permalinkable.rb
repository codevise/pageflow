module Pageflow
  # @api private
  module Permalinkable
    extend ActiveSupport::Concern

    included do
      belongs_to :permalink, optional: true
    end
  end
end
