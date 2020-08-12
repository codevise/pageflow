module Pageflow
  module TestEntryType
    def self.register(config, options = {})
      entry_type = new(options)
      config.entry_types.register(entry_type)

      config.for_entry_type(entry_type) do |entry_type_config|
        # Revisions and entry templates use a theme named "default" by
        # default. We need to register such a theme to prevent
        # validation errors.
        entry_type_config.themes.register(:default)
      end

      entry_type
    end

    def self.new(options = {})
      EntryType.new(name: 'test',
                    editor_fragment_renderer: nil,
                    frontend_app: -> {},
                    configuration: TestEntryTypeConfiguration,
                    **options)
    end

    class TestEntryTypeConfiguration
      include EntryTypeConfiguration
    end
  end
end
