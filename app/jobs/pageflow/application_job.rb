module Pageflow
  # @api private
  class ApplicationJob < ActiveJob::Base
    # Most jobs are safe to ignore if the underlying records are no longer available
    discard_on ActiveJob::DeserializationError
  end
end
