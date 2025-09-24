module Pageflow
  # @api private
  module RailsVersion
    extend self

    def detect
      from_env || '~> 7.2.0'
    end

    def experimental?
      detect != '~> 7.2.0'
    end

    private

    def from_env
      ENV['PAGEFLOW_RAILS_VERSION'] if ENV['PAGEFLOW_RAILS_VERSION'] != ''
    end
  end
end
