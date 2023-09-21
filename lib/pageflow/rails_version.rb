module Pageflow
  module RailsVersion
    extend self

    def detect
      from_env || '5.2.0'
    end

    def experimental?
      detect != '5.2.0'
    end

    private

    def from_env
      ENV['PAGEFLOW_RAILS_VERSION'] if ENV['PAGEFLOW_RAILS_VERSION'] != ''
    end
  end
end
