module Pageflow
  # @api private
  module SerializationBlacklist
    def serializable_hash(options = nil)
      options = (options || {}).dup
      options[:except] = Array(options[:except]) + blacklist_for_serialization

      super
    end

    private

    def blacklist_for_serialization
      []
    end
  end
end
