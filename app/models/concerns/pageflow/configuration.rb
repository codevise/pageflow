module Pageflow
  # Add a +configuration+ attribute.
  # This is a hash serialized as JSON.
  # It contains everything related to the object, which includes its text
  # content such as title and body.
  module Configuration
    extend ActiveSupport::Concern

    included do
      serialize :configuration, JSON
    end

    def configuration
      super || {}
    end
  end
end
