module Pageflow
  # @api private
  module SerializationBlacklist
    def serializable_hash(options = nil)
      options ||= {}

      options[:except] = Array(options[:except])
      options[:except].concat(blacklist_for_serialization)

      super
    end

    private

    def blacklist_for_serialization
      []
    end
  end
end
