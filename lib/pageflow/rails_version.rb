module Pageflow
  # @api private
  module RailsVersion
    extend self

    SUPPORTED = ['>= 7.2', '< 8.2'].freeze
    DEFAULT = '~> 7.2.0'.freeze

    def detect
      from_env || DEFAULT
    end

    def requirement
      experimental? ? [] : SUPPORTED
    end

    def experimental?
      !Gem::Requirement.new(SUPPORTED).satisfied_by?(requested_version)
    end

    private

    def requested_version
      Gem::Requirement.new(detect).requirements.first.last
    end

    def from_env
      ENV['PAGEFLOW_RAILS_VERSION'] if ENV['PAGEFLOW_RAILS_VERSION'] != ''
    end
  end
end
