module Pageflow
  class BuiltInPageTypesPlugin < Plugin
    def configure(config)
      config.for_entry_type(PageflowPaged.entry_type) do |entry_type_config|
        entry_type_config.page_types.register(BuiltInPageType.plain)
        entry_type_config.page_types.register(BuiltInPageType.video)
        entry_type_config.page_types.register(BuiltInPageType.audio)
      end
    end
  end
end
