module Pageflow
  module RailsVersion
    extend self

    RAILS_VERSION_FILE = File.expand_path('../../../../.rails_version')

    def detect
      from_env || from_file || '5.2.0'
    end

    private

    def from_env
      ENV['PAGEFLOW_RAILS_VERSION']
    end

    def from_file
      if File.exists?(RAILS_VERSION_FILE)
        File.read(RAILS_VERSION_FILE).chomp.strip.presence
      end
    end
  end
end
