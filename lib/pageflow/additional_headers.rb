module Pageflow
  # Register additional response headers for published entries.
  class AdditionalHeaders
    # @api private
    def initialize
      @headers = []
    end

    # Either a hash of name values pair or a callable taking a
    # {PublishedEntry} record and an {ActionDispatch::Request} object
    # and returns a hash.
    def register(headers)
      @headers << headers
    end

    # @api private
    def for(entry, request)
      @headers.map { |headers|
        if headers.respond_to?(:call)
          headers.call(entry, request)
        else
          headers
        end
      }.reduce({}, :merge)
    end
  end
end
