module Pageflow
  module TestEntryType
    def self.register(config, options = {})
      config.entry_types.register(new(options))
    end

    def self.new(options = {})
      EntryType.new(name: options[:name] || 'test',
                    editor_fragment_renderer: nil,
                    frontend_app: -> {},
                    configuration: options[:configuration] ||
                    TestEntryTypeConfiguration,
                    **options)
    end

    class TestEntryTypeConfiguration
      include Configuration::EntryTypeConfiguration

      def initialize(config)
        super(config)
      end
    end
  end
end
