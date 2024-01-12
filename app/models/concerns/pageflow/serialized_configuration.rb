module Pageflow
  # Add a +configuration+ attribute.
  # This is a hash serialized as JSON.
  # It contains everything related to the object, which includes its text
  # content such as title and body.
  module SerializedConfiguration
    extend ActiveSupport::Concern

    included do
      serialize :configuration, coder: JSON
    end

    def configuration
      self[:configuration] || {}
    end
  end
end
