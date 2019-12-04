module Pageflow
  module TestEntryType
    def self.register(config, options = {})
      config.entry_types.register(EntryType.new(name: 'test',
                                                frontend_app: -> {},
                                                **options))
    end
  end
end
