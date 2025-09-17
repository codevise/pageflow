# frozen_string_literal: true

require 'active_support/deprecation'
require 'pageflow/version'

module Pageflow
  # @api private
  module Deprecation
    module_function

    def warn(message, callstack = nil)
      deprecator.warn(message, callstack || caller_locations(2))
    end

    def deprecator
      @deprecator ||= ActiveSupport::Deprecation.new(Pageflow::VERSION, 'Pageflow')
    end
  end
end
