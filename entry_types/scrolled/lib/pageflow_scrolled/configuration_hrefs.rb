module PageflowScrolled
  # Find link targets in configurations, both in slate link nodes and
  # in link objects of content elements.
  #
  # @api private
  module ConfigurationHrefs
    class << self
      def each(value, path = [], &block)
        case value
        when Hash
          each_in_hash(value, path, &block)
        when Array
          value.each_with_index { |item, index| each(item, path + [index], &block) }
        end
      end

      private

      def each_in_hash(hash, path, &block)
        yield hash['href'], path if hash['href'].is_a?(Hash)
        hash.each { |key, item| each(item, path + [key], &block) }
      end
    end
  end
end
